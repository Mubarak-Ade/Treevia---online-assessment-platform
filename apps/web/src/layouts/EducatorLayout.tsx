import * as React from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router';
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Plus,
    GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';
import { useLogout } from '@/features/auth/useAuthMutations';
import { useAuth } from '@/features/auth/auth.hook';

export function EducatorLayout() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const location = useLocation();
    const { mutate: logout } = useLogout();
    const { user } = useAuth();

    // Close mobile menu on navigate
    React.useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Assessments', href: '/assessments', icon: FileText },
        { label: 'Settings', href: '/settings', icon: Settings },
    ];

    const initials = (user?.name || 'Jane Doe')
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('');

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex text-[#0F172A]">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-white border-r border-slate-200">
                {/* Brand */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200/80">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            Treevia
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Educator
                        </span>
                    </Link>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
                    <div>
                        <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Workspace
                        </div>
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.href}
                                        to={item.href}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                                isActive
                                                    ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-2xs'
                                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                            }`
                                        }
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/60">
                        <h4 className="text-xs font-bold text-emerald-950">Quick Assessment</h4>
                        <p className="mt-1 text-xs text-emerald-800/80 leading-relaxed">
                            Create a timed test with questions and join code in minutes.
                        </p>
                        <Link to="/assessments/new">
                            <Button
                                size="sm"
                                className="mt-3 w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 font-medium shadow-xs"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>New Assessment</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {initials}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-slate-900 truncate">
                                {user?.name || 'Dr. Jane Doe'}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                                {user?.email || 'educator@school.edu'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Sign out"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </aside>

            {/* Main Area with Top Header */}
            <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Treevia Cloud Platform</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/join" target="_blank" className="hidden sm:inline-flex">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs text-slate-600 border-slate-200"
                            >
                                Student Portal
                            </Button>
                        </Link>
                        <Link to="/assessments/new">
                            <Button
                                size="sm"
                                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 shadow-xs"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Create</span>
                            </Button>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Drawer Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative w-64 bg-white flex flex-col h-full z-10 shadow-2xl">
                        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                                    <GraduationCap className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-slate-900">Treevia</span>
                            </div>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex-1 p-4 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.href}
                                        to={item.href}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                                                isActive
                                                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                            }`
                                        }
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>
                        <div className="p-4 border-t border-slate-200">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm text-slate-600 hover:text-rose-600 w-full"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

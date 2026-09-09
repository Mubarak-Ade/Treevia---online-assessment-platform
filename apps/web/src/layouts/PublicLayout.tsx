import { Outlet, Link } from 'react-router';

export function PublicLayout() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 text-left group">
                        <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-emerald-800">
                            Treevia
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-emerald-700 transition-colors">
                            Features
                        </a>
                        <a href="#solutions" className="hover:text-emerald-700 transition-colors">
                            Solutions
                        </a>
                        <a href="#pricing" className="hover:text-emerald-700 transition-colors">
                            Pricing
                        </a>
                        <a href="#resources" className="hover:text-emerald-700 transition-colors">
                            Resources
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md shadow-xs transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="bg-slate-50 border-t border-slate-200 py-10 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-800 text-sm">Treevia</span>
                        <div className="flex items-center gap-4 ml-6 text-slate-600 font-medium">
                            <a href="#privacy" className="hover:text-slate-900">Privacy Policy</a>
                            <a href="#terms" className="hover:text-slate-900">Terms of Service</a>
                            <a href="#security" className="hover:text-slate-900">Security</a>
                            <a href="#contact" className="hover:text-slate-900">Contact Support</a>
                        </div>
                    </div>
                    <div>
                        © {new Date().getFullYear()} Treevia Academic. Empowering educators worldwide.
                    </div>
                </div>
            </footer>
        </div>
    );
}

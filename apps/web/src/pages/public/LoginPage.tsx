import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginFormValues } from '@/lib/validation/auth.schemas';
import { useLogin } from '@/features/auth/useAuthMutations';

export function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate()

    const { mutate: login, isPending, error } = useLogin();

    const onSubmit = (data: LoginFormValues) => {
        login(data);
        navigate("dashboard")
    };


    return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10">
                {/* Icon in soft green rounded square */}
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shadow-xs">
                        <GraduationCap className="w-6 h-6 text-emerald-700" />
                    </div>
                </div>

                {/* Title & Subtitle */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">Sign in to your Treevia account</p>
                </div>

                {/* API-level error */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700">
                        {error.message || 'Something went wrong. Please try again.'}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-800 block">
                            Email address
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                            <Input
                                {...register('email')}
                                type="email"
                                placeholder="educator@school.edu"
                                aria-invalid={!!errors.email}
                                className="pl-9.5 h-11 text-sm bg-white border-slate-200 text-slate-800 rounded-lg focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20 aria-invalid:border-red-400 aria-invalid:ring-red-200"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-800 block">
                                Password
                            </label>
                            <a
                                href="#forgot"
                                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative flex items-center">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                            <Input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                aria-invalid={!!errors.password}
                                className="pl-9.5 h-11 text-sm bg-white border-slate-200 text-slate-800 rounded-lg focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20 aria-invalid:border-red-400 aria-invalid:ring-red-200"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs gap-2 transition-all mt-2"
                    >
                        <span>{isPending ? 'Signing in...' : 'Sign In'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </form>

                {/* Footer link */}
                <div className="mt-8 text-center text-xs text-slate-500">
                    New to Treevia?{' '}
                    <Link
                        to="/register"
                        className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}

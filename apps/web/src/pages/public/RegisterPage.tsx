import * as React from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerSchema, type RegisterFormValues } from '@/lib/validation/auth.schemas';
import { useRegister } from '@/features/auth/useAuthMutations';

export function RegisterPage() {
    const [showPassword, setShowPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    });

    const { mutate: registerUser, isPending, error } = useRegister();

    // Watch password value to power the live requirements checklist
    const password = watch('password', '');
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    const onSubmit = (data: RegisterFormValues) => {
        registerUser(data);
    };

    return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center px-4 py-12">
            {/* Tree Logo Brand */}
            <div className="flex items-center gap-2 mb-6">
                <svg
                    className="w-6 h-6 text-emerald-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2L6 9h3v6H5l7 7 7-7h-4V9h3L12 2z" />
                </svg>
                <span className="text-xl font-bold tracking-tight text-emerald-800">Treevia</span>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        Create your Educator Account
                    </h1>
                    <p className="mt-2 text-xs text-slate-500">
                        Join the intelligent workspace for educators.
                    </p>
                </div>

                {/* API-level error */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700">
                        {error.message || 'Something went wrong. Please try again.'}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-800 block">
                            Full Name
                        </label>
                        <div className="relative flex items-center">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                            <Input
                                {...register('name')}
                                type="text"
                                placeholder="Dr. Jane Doe"
                                aria-invalid={!!errors.name}
                                className="pl-9.5 h-11 text-sm bg-white border-slate-200 text-slate-800 rounded-lg focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20 aria-invalid:border-red-400 aria-invalid:ring-red-200"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    {/* School Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-800 block">
                            School Email Address
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                            <Input
                                {...register('email')}
                                type="email"
                                placeholder="jane.doe@university.edu"
                                aria-invalid={!!errors.email}
                                className="pl-9.5 h-11 text-sm bg-white border-slate-200 text-slate-800 rounded-lg focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20 aria-invalid:border-red-400 aria-invalid:ring-red-200"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-800 block">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                            <Input
                                {...register('password')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                aria-invalid={!!errors.password}
                                className="pl-9.5 pr-10 h-11 text-sm bg-white border-slate-200 text-slate-800 rounded-lg focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20 aria-invalid:border-red-400 aria-invalid:ring-red-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Password requirements checklist — driven by watch('password') */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2 text-xs">
                        <span className="font-semibold text-slate-800 block text-[11px]">
                            Password must contain:
                        </span>
                        <div className="space-y-1.5 text-slate-600 text-[11px]">
                            {[
                                { met: hasMinLength, label: 'At least 8 characters' },
                                { met: hasUppercase, label: 'One uppercase letter' },
                                { met: hasLowercase, label: 'One lowercase letter' },
                                { met: hasNumber, label: 'One number' },
                            ].map(({ met, label }) => (
                                <div key={label} className="flex items-center gap-2">
                                    {met ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                        <Circle className="w-3.5 h-3.5 text-slate-300" />
                                    )}
                                    <span className={met ? 'text-emerald-800 font-medium' : ''}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-800 block">
                            Confirm Password
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                            <Input
                                {...register('confirmPassword')}
                                type="password"
                                placeholder="••••••••"
                                aria-invalid={!!errors.confirmPassword}
                                className="pl-9.5 h-11 text-sm bg-white border-slate-200 text-slate-800 rounded-lg focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20 aria-invalid:border-red-400 aria-invalid:ring-red-200"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-700/60 text-white font-semibold rounded-lg shadow-xs gap-2 transition-all mt-4"
                    >
                        <span>{isPending ? 'Creating Account...' : 'Create Account'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </form>

                {/* Footer link */}
                <div className="mt-6 text-center text-xs text-slate-500">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

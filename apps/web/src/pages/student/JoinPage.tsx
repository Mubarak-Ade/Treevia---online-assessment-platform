import * as React from 'react';
import { useNavigate } from 'react-router';
import { TreeviaLogo } from '@/components/shared/TreeviaLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { assessmentApi } from '@/features/assessments/assessment.api';
import { Loader2 } from 'lucide-react';

export function JoinPage() {
    const [code, setCode] = React.useState('');
    const [validating, setValidating] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
        setCode(cleaned);
        setError(null);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
        setCode(pasted);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length < 4) return;

        setValidating(true);
        setError(null);

        try {
            await assessmentApi.lookupByJoinCode(code);
            navigate(`/join/${code}`);
        } catch {
            setError('Assessment not found. Check the code and try again.');
            setValidating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex justify-center">
                    <TreeviaLogo size="lg" />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 text-center mb-6">
                        Join an Assessment
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="text"
                                required
                                value={code}
                                onChange={handleChange}
                                onPaste={handlePaste}
                                placeholder="A7K2P9"
                                maxLength={6}
                                autoFocus
                                autoComplete="off"
                                autoCapitalize="characters"
                                spellCheck={false}
                                className="h-14 text-center text-2xl font-mono font-bold tracking-[0.3em] bg-white border-slate-200 focus-visible:border-emerald-700 uppercase"
                                disabled={validating}
                            />
                            {error && (
                                <p className="text-sm text-red-600 text-center">{error}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={code.length < 4 || validating}
                            className="w-full h-12 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs transition-all"
                        >
                            {validating ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Continue'
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-slate-400 mt-6">
                        Don't have an assessment code? Ask your instructor.
                    </p>
                </div>
            </div>
        </div>
    );
}

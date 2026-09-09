import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { KeyRound, ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function JoinPage() {
    const [code, setCode] = React.useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const clean = code.trim().toUpperCase();
        if (clean) {
            navigate(`/join/${clean}`);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shadow-xs">
                <KeyRound className="w-6 h-6 text-emerald-700" />
            </div>

            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Join an Assessment
                </h1>
                <p className="text-xs text-slate-500">
                    Enter the access code provided by your educator or course instructor.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-slate-800 block">
                        Assessment Access Code
                    </label>
                    <Input
                        type="text"
                        required
                        maxLength={10}
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="e.g. DBX-4821"
                        className="h-12 text-center text-lg font-mono font-bold tracking-widest bg-white border-slate-200 uppercase focus-visible:border-emerald-700"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={!code.trim()}
                    className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs gap-2 transition-all"
                >
                    <span>Proceed to Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}

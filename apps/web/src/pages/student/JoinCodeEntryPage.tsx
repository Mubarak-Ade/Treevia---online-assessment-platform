import * as React from 'react';
import { useParams, useNavigate } from 'react-router';
import { User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function JoinCodeEntryPage() {
    const { joinCode = 'DBX-4821' } = useParams();
    const navigate = useNavigate();

    const [name, setName] = React.useState('');
    const [studentId, setStudentId] = React.useState('');
    const [email, setEmail] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Generate simulated attempt ID
        const attemptId = `att-${Date.now()}`;
        navigate(`/attempt/${attemptId}/instructions`);
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 space-y-6">
            <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Code: {joinCode}</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Database Systems Midterm
                </h1>
                <p className="text-xs text-slate-500">
                    CS301 · 20 Questions · 45 Minutes
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800 block">
                        Full Name
                    </label>
                    <Input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="h-10 text-sm bg-white border-slate-200 focus-visible:border-emerald-700"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800 block">
                        Student ID / Matric Number
                    </label>
                    <Input
                        type="text"
                        required
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="ST-9021"
                        className="h-10 text-sm bg-white border-slate-200 focus-visible:border-emerald-700"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800 block">
                        Student Email
                    </label>
                    <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="arivera@student.edu"
                        className="h-10 text-sm bg-white border-slate-200 focus-visible:border-emerald-700"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={!name.trim() || !studentId.trim()}
                    className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs gap-2 transition-all mt-2"
                >
                    <span>Continue to Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}

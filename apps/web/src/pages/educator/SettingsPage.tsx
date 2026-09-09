import * as React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormField } from '@/components/shared/FormField';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, User, Bell, Shield } from 'lucide-react';

export function SettingsPage() {
    const [saved, setSaved] = React.useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl space-y-6">
            <PageHeader
                title="Account Settings"
                description="Manage your educator profile, institution details, and system preferences."
            />

            <form onSubmit={handleSave} className="space-y-6">
                <Card className="bg-white border-slate-200/80 shadow-2xs">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <User className="w-4 h-4 text-emerald-700" />
                            <h3 className="text-sm font-bold text-slate-900">
                                Personal Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="Full Name">
                                <Input defaultValue="Dr. Jane Doe" className="h-9 text-xs border-slate-200" />
                            </FormField>
                            <FormField label="Academic Email">
                                <Input defaultValue="jane.doe@university.edu" disabled className="h-9 text-xs border-slate-200 bg-slate-50 text-slate-500" />
                            </FormField>
                            <FormField label="Department / Faculty">
                                <Input defaultValue="Computer Science & Engineering" className="h-9 text-xs border-slate-200" />
                            </FormField>
                            <FormField label="Institution">
                                <Input defaultValue="State Polytechnic & University" className="h-9 text-xs border-slate-200" />
                            </FormField>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200/80 shadow-2xs">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Bell className="w-4 h-4 text-emerald-700" />
                            <h3 className="text-sm font-bold text-slate-900">
                                Notification Preferences
                            </h3>
                        </div>

                        <div className="space-y-3 text-xs text-slate-700">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                                <span>Email me when all students have submitted an assessment</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                                <span>Weekly psychometric performance summary of active cohorts</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 shadow-xs font-semibold">
                        <Save className="w-3.5 h-3.5" />
                        <span>{saved ? 'Saved Successfully!' : 'Save Preferences'}</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}

'use client';

import * as React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

const data = [
    { day: 'M', completions: 45 },
    { day: 'T', completions: 62 },
    { day: 'W', completions: 89 },
    { day: 'T', completions: 71 },
    { day: 'F', completions: 58 },
    { day: 'S', completions: 34 },
    { day: 'S', completions: 22 },
];

export function SubmissionPacingChart() {
    return (
        <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '12px',
                        }}
                    />
                    <Bar dataKey="completions" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.day === 'W' ? '#15803d' : '#86efac'}
                                opacity={entry.day === 'W' ? 1 : 0.6}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
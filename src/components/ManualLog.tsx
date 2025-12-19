'use client';

import { useState } from 'react';
import { db } from '@/lib/db';
import { ReadingType } from '@/types';
import { Card } from './Card';
import { Check, X, ClipboardEdit } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ManualLog({ onComplete }: { onComplete: () => void }) {
    const [value, setValue] = useState<string>('');
    const [type, setType] = useState<ReadingType>('fasting');
    const [submitting, setSubmitting] = useState(false);

    const handleSave = async () => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) return;

        setSubmitting(true);
        try {
            await db.logs.add({
                value: numValue,
                type,
                timestamp: new Date(),
                source: 'manual'
            });
            onComplete();
        } catch (error) {
            console.error('Failed to save log:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-6 text-primary">
                <ClipboardEdit className="w-5 h-5 font-black" />
                <h2 className="text-xl font-black">Manual Entry</h2>
            </div>

            <div className="flex flex-col gap-6">
                <div>
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">
                        Glucose Level (mg/dL)
                    </label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="000"
                        className="w-full text-5xl font-black text-primary bg-transparent border-none focus:ring-0 placeholder:text-primary/10 p-0"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-3 block">
                        Reading Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['fasting', 'post-prandial', 'random'] as ReadingType[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={cn(
                                    "py-3 px-2 text-sm font-bold rounded-xl border transition-all capitalize",
                                    type === t
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                        : "bg-white text-gray-600 border-gray-100 hover:border-primary/20"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onComplete}
                        className="flex-1 py-4 px-4 rounded-2xl border border-gray-100 font-bold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                        <X className="w-5 h-5" /> Cancel
                    </button>
                    <button
                        disabled={!value || submitting}
                        onClick={handleSave}
                        className="flex-[2] py-4 px-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        <Check className="w-5 h-5" /> Save Reading
                    </button>
                </div>
            </div>
        </Card>
    );
}

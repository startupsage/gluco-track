'use client';

import { useState, useRef } from 'react';
import { Camera, RefreshCw, Check, X } from 'lucide-react';
import { scanGlucoseMeter } from '@/lib/ocr';
import { Card } from './Card';
import { cn } from '@/lib/utils';
import { db } from '@/lib/db';
import { ReadingType } from '@/types';

export function Scanner({ onComplete }: { onComplete: () => void }) {
    const [image, setImage] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [type, setType] = useState<ReadingType>('fasting');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => setImage(event.target?.result as string);
        reader.readAsDataURL(file);

        setScanning(true);
        const value = await scanGlucoseMeter(file);
        setResult(value);
        setScanning(false);
    };

    const saveReading = async () => {
        if (result === null) return;

        await db.logs.add({
            value: result,
            type,
            timestamp: new Date(),
            source: 'scan'
        });

        reset();
        onComplete();
    };

    const reset = () => {
        setImage(null);
        setResult(null);
        setScanning(false);
    };

    return (
        <Card className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-full flex items-center justify-between mb-2">
                <h2 className="text-xl font-black text-primary flex items-center gap-2">
                    <Camera className="w-6 h-6" />
                </h2>
                <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
                    {(['fasting', 'post-prandial', 'random'] as ReadingType[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={cn(
                                "py-1.5 px-3 text-xs font-black rounded-lg transition-all uppercase tracking-wider",
                                type === t ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {t === 'post-prandial' ? 'PP' : t}
                        </button>
                    ))}
                </div>
            </div>

            {!image ? (
                <div className="w-full space-y-4">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-video border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-primary/5 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Camera className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-black text-foreground">Awaiting Capture</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Focus on meter screen</div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleCapture}
                        />
                    </button>
                    <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em] py-2">
                        AI will automatically extract the value
                    </div>
                </div>
            ) : (
                <div className="w-full flex flex-col gap-4">
                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary/20 bg-black">
                        <img src={image} alt="Captured scan" className="w-full h-full object-contain" />
                        {scanning && (
                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                                <RefreshCw className="w-10 h-10 text-white animate-spin" />
                                <span className="text-white text-xs font-black uppercase tracking-widest bg-primary px-3 py-1 rounded-full">Analyzing...</span>
                            </div>
                        )}
                    </div>

                    {result !== null ? (
                        <div className="animate-in zoom-in-95 duration-300">
                            <div className="flex flex-col items-center gap-1 mb-6 py-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <span className="text-xs text-primary uppercase tracking-[0.3em] font-black">Success</span>
                                <div className="text-6xl font-black text-primary tracking-tighter tabular-nums">{result}</div>
                                <span className="text-sm font-bold text-primary/60">mg/dL • <span className="capitalize">{type}</span></span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={reset}
                                    className="flex-1 py-4 px-4 rounded-2xl border border-gray-100 font-bold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50"
                                >
                                    <X className="w-5 h-5" /> Retake
                                </button>
                                <button
                                    onClick={saveReading}
                                    className="flex-[2] py-4 px-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <Check className="w-5 h-5" /> Confirm & Save
                                </button>
                            </div>
                        </div>
                    ) : scanning ? (
                        null
                    ) : (
                        <div className="text-center py-6 px-4 bg-destructive/5 rounded-2xl border border-destructive/10 animate-in shake duration-500">
                            <div className="text-destructive font-black text-sm mb-1 uppercase tracking-wider">Detection Failed</div>
                            <p className="text-sm text-destructive/60 font-medium mb-4">Could not find a clear glucose value in the image.</p>
                            <button
                                onClick={reset}
                                className="w-full py-4 bg-destructive text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-destructive/90 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

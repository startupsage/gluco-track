'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Card } from './Card';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Droplets, TrendingUp, History, PlusCircle, User, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function Dashboard({ onAddManual, onScan, onViewHistory }: { onAddManual: () => void; onScan: () => void; onViewHistory: () => void }) {
    const logs = useLiveQuery(() => db.logs.orderBy('timestamp').reverse().toArray());
    const profile = useLiveQuery(() => db.profile.toCollection().first());

    const getLatestByType = (type: string) => {
        return logs?.find(log => log.type === type);
    };

    const chartData = logs?.slice().reverse().reduce((acc: any[], log) => {
        const time = format(log.timestamp, 'MM/dd HH:mm');
        acc.push({
            time,
            [log.type]: log.value,
            fullTime: format(log.timestamp, 'MMM dd, HH:mm')
        });
        return acc;
    }, []).slice(-20);

    const getStatus = (value: number, type: string) => {
        if (!profile) return { label: 'Normal', color: 'bg-green-100 text-green-600' };

        let min = 0, max = 0;
        if (type === 'fasting') {
            min = profile.targetFastingMin;
            max = profile.targetFastingMax;
        } else if (type === 'post-prandial') {
            min = profile.targetPostPrandialMin;
            max = profile.targetPostPrandialMax;
        } else {
            return null;
        }

        if (value < min) return { label: 'Low', color: 'bg-blue-100 text-blue-600' };
        if (value > max) return { label: 'High', color: 'bg-red-100 text-red-600' };
        return { label: 'Normal', color: 'bg-green-100 text-green-600' };
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onScan}
                    className="p-4 rounded-2xl bg-primary text-white flex flex-col gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Droplets className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-black">Scan Meter</div>
                        <div className="text-[11px] font-bold uppercase opacity-80 tracking-widest">AI Scanner</div>
                    </div>
                </button>

                <button
                    onClick={onAddManual}
                    className="p-4 rounded-2xl bg-white border border-primary/10 flex flex-col gap-3 hover:bg-primary/5 hover:border-primary/20 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <PlusCircle className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-black text-foreground">Add Manual</div>
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Quick Log</div>
                    </div>
                </button>
            </div>

            {/* Reading Summaries (3 Lines) */}
            <div className="flex flex-col gap-3">
                {[
                    { type: 'fasting', color: 'text-orange-600', bg: 'bg-orange-50' },
                    { type: 'post-prandial', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { type: 'random', color: 'text-gray-600', bg: 'bg-gray-50' }
                ].map((item) => {
                    const latest = getLatestByType(item.type);
                    const status = latest ? getStatus(latest.value, latest.type) : null;
                    return (
                        <Card key={item.type} className={cn("p-4 flex items-center justify-between border-none shadow-sm", item.bg)}>
                            <div className="flex items-center gap-4">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-white/20 shadow-sm", "bg-white/50 backdrop-blur-sm")}>
                                    <img src="/icon.png" alt="GlockTrack AI" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-black text-gray-400 uppercase tracking-tighter mb-0.5">Latest {item.type === 'post-prandial' ? 'PP' : item.type}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl font-black text-foreground flex items-baseline gap-1">
                                            {latest ? latest.value : '--'}
                                            <span className="text-xs font-bold opacity-40">mg/dL</span>
                                        </div>
                                        {status && (
                                            <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest", status.color)}>
                                                {status.label}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {latest && (
                                <div className="text-right">
                                    <div className="text-xs font-black text-gray-400 uppercase tracking-tight">Logged At</div>
                                    <div className="text-xs font-bold text-foreground opacity-60">
                                        {format(latest.timestamp, 'MMM dd • HH:mm')}
                                    </div>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>

            {/* Chart Section */}
            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-border bg-gray-50/50 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-foreground flex items-center gap-1">
                            <TrendingUp className="w-5 h-5 text-primary" /> AI Trends
                        </h3>
                        <button
                            onClick={onViewHistory}
                            className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-1 hover:underline underline-offset-4"
                        >
                            History <History className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex gap-3 justify-center border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-200"></div>
                            <span className="text-xs font-black uppercase text-gray-400 tracking-tight">Fasting</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></div>
                            <span className="text-xs font-black uppercase text-gray-400 tracking-tight">PP</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shadow-sm shadow-gray-200"></div>
                            <span className="text-xs font-black uppercase text-gray-400 tracking-tight">Random</span>
                        </div>
                    </div>
                </div>
                <div className="h-[200px] w-full p-4">
                    {chartData && chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="time"
                                    fontSize={8}
                                    fontWeight="bold"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8' }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    fontSize={10}
                                    fontWeight="bold"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8' }}
                                    domain={['dataMin - 10', 'dataMax + 10']}
                                />
                                <Tooltip
                                    labelFormatter={(label, payload) => payload[0]?.payload.fullTime || label}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                        fontWeight: 'bold',
                                        fontSize: '11px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="fasting"
                                    stroke="#F97316"
                                    strokeWidth={3}
                                    dot={{ r: 3, fill: '#F97316', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 5 }}
                                    connectNulls
                                />
                                <Line
                                    type="monotone"
                                    dataKey="post-prandial"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    dot={{ r: 3, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 5 }}
                                    connectNulls
                                />
                                <Line
                                    type="monotone"
                                    dataKey="random"
                                    stroke="#94A3B8"
                                    strokeWidth={3}
                                    dot={{ r: 3, fill: '#94A3B8', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 5 }}
                                    connectNulls
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 font-medium italic">
                            No data for trends
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

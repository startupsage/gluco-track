'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Card } from './Card';
import { History, Calendar, Filter } from 'lucide-react';
import { format, subMonths, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export function LogsView() {
    const [startDate, setStartDate] = useState<string>(format(subMonths(new Date(), 1), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    const allLogs = useLiveQuery(() => db.logs.orderBy('timestamp').reverse().toArray());

    const filteredLogs = allLogs?.filter(log => {
        try {
            return isWithinInterval(log.timestamp, {
                start: startOfDay(new Date(startDate)),
                end: endOfDay(new Date(endDate))
            });
        } catch (e) {
            return true;
        }
    });

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Date Filter Card */}
            <Card className="p-4 bg-primary/5 border-primary/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary">
                        <Filter className="w-4 h-4 font-black" />
                        <span className="text-xs font-black uppercase tracking-widest">Filter by Date</span>
                    </div>
                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        Default: Last month
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-end">
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-tight px-1">From</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white border border-primary/10 text-sm font-bold outline-none focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-tight px-1">To</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white border border-primary/10 text-sm font-bold outline-none focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                </div>
            </Card>

            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-border bg-gray-50/50 flex items-center justify-between">
                    <h3 className="font-black text-foreground flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" /> Result Logs
                    </h3>
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        {filteredLogs?.length || 0} Entries
                    </div>
                </div>
                <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                    {filteredLogs?.map((log) => (
                        <div key={log.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black ${log.type === 'fasting' ? 'bg-orange-100 text-orange-600' :
                                    log.type === 'post-prandial' ? 'bg-blue-100 text-blue-600' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                    <span className="text-lg leading-none">{log.value}</span>
                                    <span className="text-[10px] uppercase tracking-tighter opacity-70">mg/dL</span>
                                </div>
                                <div>
                                    <div className="text-sm font-black text-foreground capitalize flex items-center gap-2">
                                        {log.type}
                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${log.source === 'scan' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {log.source}
                                        </span>
                                    </div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-tight flex items-center gap-1 mt-0.5">
                                        <Calendar className="w-3 h-3" />
                                        {format(log.timestamp, 'MMM dd, yyyy • HH:mm')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!filteredLogs || filteredLogs.length === 0) && (
                        <div className="p-12 text-center text-gray-400 font-medium italic">
                            No logs found for selected range.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

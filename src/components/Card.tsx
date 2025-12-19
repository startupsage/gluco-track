import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("bg-card rounded-2xl shadow-sm border border-border p-4", className)}>
            {children}
        </div>
    );
}

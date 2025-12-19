'use client';

import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { Scanner } from '@/components/Scanner';
import { ManualLog } from '@/components/ManualLog';
import { Profile } from '@/components/Profile';
import { LogsView } from '@/components/LogsView';
import { Plus, LayoutDashboard, Activity, UserCircle } from 'lucide-react';
import { cn, getAssetPath } from '@/lib/utils';

import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function Home() {
  const [view, setView] = useState<'dashboard' | 'scan' | 'manual' | 'profile' | 'history'>('dashboard');
  const profile = useLiveQuery(() => db.profile.toCollection().first());

  const firstName = profile?.name ? profile.name.split(' ')[0] : '';

  return (
    <main className="min-h-screen bg-background pb-10">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-border px-6 py-4 mb-6">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            {view !== 'dashboard' ? (
              <button
                onClick={() => setView('dashboard')}
                className="p-2 -ml-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
                title="Back to Dashboard"
              >
                <LayoutDashboard className="w-6 h-6" />
              </button>
            ) : (
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-white/20 shadow-sm", "bg-white/50 backdrop-blur-sm")}>
                <img src={getAssetPath("/icon.png")} alt="GlockTrack AI" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tight leading-none">
                {view === 'dashboard' ? 'GlockTrack AI' :
                  view === 'scan' ? 'Scanner' :
                    view === 'manual' ? 'Manual Log' :
                      view === 'history' ? 'History' : 'Profile'}
              </h1>
              {view === 'dashboard' && firstName && (
                <span className="text-xs font-black text-primary uppercase tracking-widest mt-0.5 block">
                  Hello, {firstName}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('profile')}
              className={cn(
                "p-1 rounded-full transition-all border-2",
                view === 'profile' ? "border-primary" : "border-transparent hover:border-primary/20"
              )}
            >
              {profile?.photo ? (
                <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm">
                  <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={cn(
                  "p-1 rounded-full",
                  view === 'profile' ? "text-primary bg-primary/10" : "text-gray-400"
                )}>
                  <UserCircle className="w-7 h-7" />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6">
        {view === 'dashboard' && (
          <Dashboard
            onAddManual={() => setView('manual')}
            onScan={() => setView('scan')}
            onViewHistory={() => setView('history')}
          />
        )}
        {view === 'scan' && <Scanner onComplete={() => setView('dashboard')} />}
        {view === 'manual' && <ManualLog onComplete={() => setView('dashboard')} />}
        {view === 'profile' && <Profile onComplete={() => setView('dashboard')} />}
        {view === 'history' && <LogsView />}
      </div>
    </main>
  );
}

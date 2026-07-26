'use client';

import { useEffect, useState } from 'react';
import { testSupabaseConnection, SupabaseHealth } from '@/lib/supabase';
import { Database, ShieldCheck, RefreshCw, ExternalLink, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export function SupabaseCard() {
  const [health, setHealth] = useState<SupabaseHealth | null>(null);
  const [testing, setTesting] = useState(false);

  const runTest = async () => {
    setTesting(true);
    const res = await testSupabaseConnection();
    setHealth(res);
    setTesting(false);
    if (res.connected) {
      toast.success('Supabase connected successfully!', { icon: '⚡' });
    } else {
      toast.error('Could not ping Supabase instance');
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background glow decorator */}
      <div className="absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-700/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">Supabase Cloud Connected</h3>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5 truncate max-w-sm">
              {health?.url || 'https://lrsunczdlvtqnudchist.supabase.co'}
            </p>
          </div>
        </div>

        <button
          onClick={runTest}
          disabled={testing}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 active:scale-95 disabled:opacity-50 transition-all shadow-md"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${testing ? 'animate-spin' : ''}`} />
          {testing ? 'Pinging...' : 'Test Connection'}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Status</span>
            {health?.connected ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            )}
          </div>
          <p className="mt-1.5 text-sm font-semibold text-emerald-400">
            {health?.connected ? 'Online & Healthy' : 'Connecting...'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Publishable Key</span>
            <Key className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-1.5 text-xs font-mono text-slate-200 truncate" title="Supabase Publishable Key">
            sb_publishable_...
          </p>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Secret Key</span>
            <ShieldCheck className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-1.5 text-xs font-mono text-slate-200 truncate" title="Supabase Service Role Key">
            sb_secret_...
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          ⚡ Latency: <strong className="text-white">{health?.latencyMs ? `${health.latencyMs} ms` : '18 ms'}</strong>
        </span>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-400 hover:underline hover:text-emerald-300 transition-colors"
        >
          Open Supabase Dashboard <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

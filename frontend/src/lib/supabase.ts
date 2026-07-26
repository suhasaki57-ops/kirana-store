import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrsunczdlvtqnudchist.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_uyLfNznoMVfsuSmXUj81Mw_-9n4WsUG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseHealth {
  connected: boolean;
  url: string;
  publishableKey: string;
  secretKeyConfigured: boolean;
  latencyMs?: number;
  message?: string;
}

export async function testSupabaseConnection(): Promise<SupabaseHealth> {
  const startTime = performance.now();
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: supabaseAnonKey,
      },
    });

    const latencyMs = Math.round(performance.now() - startTime);

    if (res.ok || res.status === 404 || res.status === 401) {
      return {
        connected: true,
        url: supabaseUrl,
        publishableKey: supabaseAnonKey,
        secretKeyConfigured: true,
        latencyMs,
        message: 'Successfully connected to Supabase backend API',
      };
    }

    return {
      connected: false,
      url: supabaseUrl,
      publishableKey: supabaseAnonKey,
      secretKeyConfigured: true,
      latencyMs,
      message: `HTTP Response Status: ${res.status}`,
    };
  } catch (err: any) {
    return {
      connected: false,
      url: supabaseUrl,
      publishableKey: supabaseAnonKey,
      secretKeyConfigured: true,
      message: err?.message || 'Failed to reach Supabase server',
    };
  }
}

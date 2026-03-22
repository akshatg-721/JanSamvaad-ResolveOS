'use client';

import useSWR from 'swr';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api-client';
import { useEffect, useCallback } from 'react';
import io from 'socket.io-client';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface TicketStats {
  open: number;
  closed: number;
  breach_risk: number;
  slaHitRate: string;
}

export interface Ticket {
  id: number;
  ref: string;
  category: string;
  ward_id: number | null;
  ward_name?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: string;
  sla_deadline: string | null;
  created_at: string;
  phone?: string;
}

export interface ActivityItem {
  id: string;
  type: 'voice' | 'escalation' | 'verify' | 'system';
  message: string;
  isAlert: boolean;
  phone?: string;
  time: string;
}

// ── SWR fetcher ───────────────────────────────────────────────────────────────
const fetcher = (path: string) => apiFetch(path);

// ── useDashboardStats ─────────────────────────────────────────────────────────
export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<TicketStats>('/api/stats', fetcher, {
    refreshInterval: 30000,
    onError: (err) => {
      toast.error(`Stats failed to load: ${err.message}`);
    }
  });
  return { stats: data, isLoading, error, refresh: mutate };
}

// ── useTickets ────────────────────────────────────────────────────────────────
export function useTickets(params?: { status?: string; severity?: string; limit?: number }) {
  const queryString = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v).map(([k, v]) => [k, String(v)])).toString()
    : '';

  const { data, error, isLoading, mutate } = useSWR<Ticket[]>(
    `/api/tickets${queryString}`,
    fetcher,
    {
      refreshInterval: 60000,
      onError: (err) => {
        toast.error(`Tickets failed to load: ${err.message}`);
      }
    }
  );
  return { tickets: data ?? [], isLoading, error, refresh: mutate };
}

// ── useActivity ───────────────────────────────────────────────────────────────
export function useActivity() {
  const { data, error, isLoading, mutate } = useSWR<ActivityItem[]>(
    '/api/activity',
    fetcher,
    {
      refreshInterval: 30000,
      onError: (err) => {
        toast.error(`Activity feed failed to load: ${err.message}`);
      }
    }
  );
  return { activity: data ?? [], isLoading, error, refresh: mutate };
}

// ── useRealtimeSocket ─────────────────────────────────────────────────────────
// Subscribes to Socket.io events and runs callbacks on ticket changes.
export function useRealtimeSocket(callbacks: {
  onTicketCreated?: (ticket: Ticket) => void;
  onTicketResolved?: (ticket: Ticket) => void;
  onStatsUpdate?: () => void;
}) {
  const { onTicketCreated, onTicketResolved, onStatsUpdate } = callbacks;

  const stableOnCreated = useCallback(onTicketCreated || (() => {}), []);
  const stableOnResolved = useCallback(onTicketResolved || (() => {}), []);
  const stableOnStats = useCallback(onStatsUpdate || (() => {}), []);

  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      console.log('[Socket.io] Connected');
    });

    socket.on('ticket_created', (ticket: Ticket) => {
      toast.success(`New ticket ${ticket.ref} received (${ticket.category})`, { duration: 5000 });
      stableOnCreated(ticket);
      stableOnStats();
    });

    socket.on('ticket_resolved', (ticket: Ticket) => {
      toast.success(`Ticket ${ticket.ref} resolved`, { duration: 4000 });
      stableOnResolved(ticket);
      stableOnStats();
    });

    socket.on('duplicate_ticket', ({ existingTicketId, category }: { existingTicketId: number; category: string }) => {
      toast.warning(`Duplicate ${category} ticket detected — linked to #${existingTicketId}`, { duration: 5000 });
    });

    socket.on('disconnect', () => {
      console.warn('[Socket.io] Disconnected');
    });

    return () => { socket.disconnect(); };
  }, [stableOnCreated, stableOnResolved, stableOnStats]);
}

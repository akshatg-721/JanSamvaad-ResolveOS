'use client';

import useSWR from 'swr';
import { toast } from 'sonner';
import { useEffect, useCallback } from 'react';
import io from 'socket.io-client';

import { API_CONFIG } from '@/lib/api/config';
import { getComplaints } from '@/lib/api/complaints';
import { getDashboardActivity, getDashboardStats } from '@/lib/api/dashboard';
import { mapComplaint } from '@/lib/mappers/complaint.mapper';
import type { DashboardActivityDTO } from '@/lib/contracts/dashboard';

export interface TicketStats {
  open: number;
  closed: number;
  breach_risk: number;
  slaHitRate: string;
}

export interface Ticket {
  id: string;
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

function toTitleSeverity(value: string): Ticket['severity'] {
  const normalized = value.toUpperCase();
  if (normalized === 'CRITICAL') return 'Critical';
  if (normalized === 'HIGH') return 'High';
  if (normalized === 'MEDIUM') return 'Medium';
  return 'Low';
}

function toDashboardTicket(item: any): Ticket {
  const complaint = mapComplaint(item);
  return {
    id: complaint.id,
    ref: complaint.ref,
    category: complaint.category,
    ward_id: complaint.wardId,
    ward_name: complaint.wardName || undefined,
    severity: toTitleSeverity(String(complaint.severity)),
    status: String(complaint.status || '').toLowerCase(),
    sla_deadline: (complaint.raw?.sla_deadline as string | undefined) || (complaint.raw?.slaDeadline as string | undefined) || null,
    created_at: complaint.createdAt,
    phone: complaint.citizenPhone || undefined,
  };
}

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR('dashboard:stats', getDashboardStats, {
    refreshInterval: 30000,
    onError: (err) => {
      toast.error(`Stats failed to load: ${err.message}`);
    },
  });

  const mappedStats = data
    ? {
        open: data.open,
        closed: data.closed,
        breach_risk: data.breachRisk,
        slaHitRate: data.slaHitRate,
      }
    : undefined;

  return { stats: mappedStats as TicketStats | undefined, isLoading, error, refresh: mutate };
}

export function useTickets(params?: { status?: string; severity?: string; limit?: number }) {
  const queryParams = {
    status: params?.status && params.status !== 'all' ? params.status : undefined,
    severity: params?.severity && params.severity !== 'all' ? params.severity : undefined,
    limit: params?.limit,
  };

  const { data, error, isLoading, mutate } = useSWR(
    ['dashboard:tickets', queryParams.status, queryParams.severity, queryParams.limit],
    async () => {
      const page = await getComplaints(queryParams);
      return page.items.map(toDashboardTicket);
    },
    {
      refreshInterval: 60000,
      onError: (err) => {
        toast.error(`Tickets failed to load: ${err.message}`);
      },
    }
  );

  return { tickets: (data || []) as Ticket[], isLoading, error, refresh: mutate };
}

function mapActivityItem(item: DashboardActivityDTO): ActivityItem {
  return {
    id: item.id,
    type: item.type,
    message: item.message,
    time: item.time,
    isAlert: Boolean(item.isAlert),
    phone: item.phone,
  };
}

export function useActivity() {
  const { data, error, isLoading, mutate } = useSWR('dashboard:activity', getDashboardActivity, {
    refreshInterval: 30000,
  });

  return {
    activity: (data || []).map(mapActivityItem) as ActivityItem[],
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useRealtimeSocket(callbacks: {
  onTicketCreated?: (ticket: Ticket) => void;
  onTicketResolved?: (ticket: Ticket) => void;
  onStatsUpdate?: () => void;
}) {
  const { onTicketCreated, onTicketResolved, onStatsUpdate } = callbacks;

  const stableOnCreated = useCallback((ticket: Ticket) => onTicketCreated?.(ticket), [onTicketCreated]);
  const stableOnResolved = useCallback((ticket: Ticket) => onTicketResolved?.(ticket), [onTicketResolved]);
  const stableOnStats = useCallback(() => onStatsUpdate?.(), [onStatsUpdate]);

  useEffect(() => {
    const socketTarget = API_CONFIG.socketUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const socket = io(socketTarget, { transports: ['websocket', 'polling'] });

    const handleCreated = (raw: unknown) => {
      const ticket = toDashboardTicket(raw);
      toast.success(`New ticket ${ticket.ref} received (${ticket.category})`, { duration: 5000 });
      stableOnCreated(ticket);
      stableOnStats();
    };

    const handleResolved = (raw: unknown) => {
      const ticket = toDashboardTicket(raw);
      toast.success(`Ticket ${ticket.ref} resolved`, { duration: 4000 });
      stableOnResolved(ticket);
      stableOnStats();
    };

    socket.on('ticket_created', handleCreated);
    socket.on('new_ticket', handleCreated);
    socket.on('ticket_resolved', handleResolved);

    socket.on('duplicate_ticket', ({ existingTicketId, category }: { existingTicketId: number; category: string }) => {
      toast.warning(`Duplicate ${category} ticket detected - linked to #${existingTicketId}`, { duration: 5000 });
    });

    return () => {
      socket.off('ticket_created', handleCreated);
      socket.off('new_ticket', handleCreated);
      socket.off('ticket_resolved', handleResolved);
      socket.disconnect();
    };
  }, [stableOnCreated, stableOnResolved, stableOnStats]);
}


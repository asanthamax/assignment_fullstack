"use client";

import { useCallback, useEffect, useState } from "react";
import { Ticket, fetchTicketCount, fetchTickets } from "../lib/api";

export function useTickets(page: number, pageSize: number) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, count] = await Promise.all([fetchTickets(page, pageSize), fetchTicketCount()]);
      setTickets(list.tickets);
      setTotal(count.total_tickets);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  return { tickets, setTickets, total, loading, error, reload: load };
}

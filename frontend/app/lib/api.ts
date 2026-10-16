export type Ticket = {
  id: number;
  title: string;
  description: string;
  priority: string;
  tags: string;
  assigned_user: string | null;
};

export type TicketPage = { tickets: Ticket[]; current_page_no: number; page_size: number };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, init);
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") detail = body.detail;
    } catch {}
    throw new Error(detail);
  }
  return res.json();
}

// NOTE: the backend declares its page params as query params on a literal ":current_page/:page_size" path.
export const fetchTickets = (page: number, pageSize: number) =>
  request<TicketPage>(`/v1/tickets?current_page=${page}&page_size=${pageSize}`);

export const fetchTicketCount = () => request<{ total_tickets: number }>("/v1/tickets/row_count");

export const claimTicket = (ticket: number, user_email: string) =>
  request<{ msg: string }>("/v1/tickets/assign_user", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticket, user_email }),
  });

export type NewTicket = {
  title: string;
  description: string;
  priority: string;
  tags: string;
  assigned_user: string | null;
};

export const createTicket = (ticket: NewTicket) =>
  request<Ticket>("/v1/tickets/init_ticket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  });

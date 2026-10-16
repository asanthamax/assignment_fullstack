"use client";

import { useEffect, useRef, useState } from "react";
import CreateTicketModal from "./components/CreateTicketModal";
import Pagination from "./components/Pagination";
import TicketDetail from "./components/TicketDetail";
import TicketList from "./components/TicketList";
import { useTickets } from "./hooks/useTickets";
import { Ticket } from "./lib/api";

export default function Home() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const { tickets, setTickets, total, loading, error, reload } = useTickets(page, pageSize);

  const [creating, setCreating] = useState(false);
  const pendingSelect = useRef<number | null>(null);
  const totalPages = total === null ? null : Math.max(1, Math.ceil(total / pageSize));
  const hasNext = totalPages === null ? tickets.length === pageSize : page < totalPages;

  // After creating, jump to the last page (tickets are ordered by id) and select the new one.
  function handleCreated(created: Ticket) {
    setCreating(false);
    pendingSelect.current = created.id;
    const lastPage = Math.max(1, Math.ceil(((total ?? 0) + 1) / pageSize));
    if (lastPage === page) reload();
    else setPage(lastPage);
  }

  useEffect(() => {
    if (pendingSelect.current === null) return;
    const match = tickets.find((t) => t.id === pendingSelect.current);
    if (match) {
      setSelected(match);
      pendingSelect.current = null;
    }
  }, [tickets]);

  function handleClaimed(email: string) {
    if (!selected) return;
    const updated = { ...selected, assigned_user: email };
    setSelected(updated);
    setTickets((ts) => ts.map((t) => (t.id === updated.id ? updated : t)));
  }

  return (
    <main>
      <header>
        <div className="head-left">
          <h1>Tickets</h1>
          <span className="muted">{total === null ? "" : `${total.toLocaleString()} total`}</span>
        </div>
        <button className="primary" onClick={() => setCreating(true)}>+ New ticket</button>
      </header>

      {error && (
        <div className="error">
          {error} <button onClick={reload}>Retry</button>
        </div>
      )}

      <div className="layout">
        <section className="list" aria-busy={loading}>
          <TicketList tickets={tickets} selectedId={selected?.id} loading={loading} error={error} onSelect={setSelected} />
          <Pagination
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            hasNext={hasNext}
            loading={loading}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </section>

        <aside className="detail">
          {selected ? (
            <TicketDetail key={selected.id} ticket={selected} onClaimed={handleClaimed} />
          ) : (
            <p className="muted">Select a ticket to see its details.</p>
          )}
        </aside>
      </div>
      {creating && <CreateTicketModal onClose={() => setCreating(false)} onCreated={handleCreated} />}
    </main>
  );
}

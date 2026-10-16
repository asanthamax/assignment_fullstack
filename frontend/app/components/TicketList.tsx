import { Ticket } from "../lib/api";
import TicketRow from "./TicketRow";

type Props = {
  tickets: Ticket[];
  selectedId?: number;
  loading: boolean;
  error: string | null;
  onSelect: (t: Ticket) => void;
};

export default function TicketList({ tickets, selectedId, loading, error, onSelect }: Props) {
  return (
    <>
      <ul>
        {tickets.map((t) => (
          <TicketRow key={t.id} ticket={t} active={selectedId === t.id} onSelect={onSelect} />
        ))}
        {!loading && !error && tickets.length === 0 && <li className="empty">No tickets on this page.</li>}
      </ul>
      {loading && <div className="muted pad">Loading…</div>}
    </>
  );
}

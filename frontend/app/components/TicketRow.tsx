import { Ticket } from "../lib/api";

type Props = { ticket: Ticket; active: boolean; onSelect: (t: Ticket) => void };

export default function TicketRow({ ticket, active, onSelect }: Props) {
  return (
    <li>
      <button className={active ? "row active" : "row"} onClick={() => onSelect(ticket)}>
        <span className="id">#{ticket.id}</span>
        <span className="title">{ticket.title}</span>
        <span className={`badge p-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
        <span className={ticket.assigned_user ? "status taken" : "status open"}>
          {ticket.assigned_user ? "Assigned" : "Unassigned"}
        </span>
      </button>
    </li>
  );
}

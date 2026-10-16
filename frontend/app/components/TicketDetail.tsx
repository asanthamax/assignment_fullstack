import { Ticket } from "../lib/api";
import ClaimForm from "./ClaimForm";

type Props = { ticket: Ticket; onClaimed: (email: string) => void };

export default function TicketDetail({ ticket, onClaimed }: Props) {
  const tags = ticket.tags.split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <div>
      <h2>
        <span className="id">#{ticket.id}</span> {ticket.title}
      </h2>
      <p>
        <span className={`badge p-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
      </p>
      <h3>Description</h3>
      <p className="desc">{ticket.description}</p>
      <h3>Tags</h3>
      <p>
        {tags.length ? tags.map((t) => <span key={t} className="tag">{t}</span>) : <span className="muted">None</span>}
      </p>
      <h3>Assignee</h3>
      {ticket.assigned_user ? <p>{ticket.assigned_user}</p> : <ClaimForm ticketId={ticket.id} onClaimed={onClaimed} />}
    </div>
  );
}

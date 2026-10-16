"use client";

import { useState } from "react";
import { Ticket, createTicket } from "../lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = { onClose: () => void; onCreated: (t: Ticket) => void };

export default function CreateTicketModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tags, setTags] = useState("");
  const [assignee, setAssignee] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const email = assignee.trim();
    if (email && !EMAIL_RE.test(email)) return setError("Enter a valid assignee email or leave it empty.");
    setBusy(true);
    setError(null);
    try {
      const created = await createTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean).join(", "),
        assigned_user: email || null,
      });
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create ticket");
      setBusy(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <h2>New ticket</h2>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} required autoFocus />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={255} rows={4} required />
        </label>
        <label>
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>
        <label>
          Tags <span className="muted">(comma separated)</span>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="bug, ui" />
        </label>
        <label>
          Assignee email <span className="muted">(optional)</span>
          <input type="email" value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="you@example.com" />
        </label>
        {error && <p className="err">{error}</p>}
        <div className="actions">
          <button type="button" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" className="primary" disabled={busy}>{busy ? "Creating…" : "Create ticket"}</button>
        </div>
      </form>
    </div>
  );
}

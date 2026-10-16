"use client";

import { useState } from "react";
import { claimTicket } from "../lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = { ticketId: number; onClaimed: (email: string) => void };

export default function ClaimForm({ ticketId, onClaimed }: Props) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) return setMsg({ ok: false, text: "Enter a valid email address." });
    setBusy(true);
    setMsg(null);
    try {
      await claimTicket(ticketId, value);
      onClaimed(value);
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Could not claim ticket" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} className="claim">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          required
        />
        <button type="submit" disabled={busy}>{busy ? "Claiming…" : "Claim ticket"}</button>
      </form>
      {msg && <p className={msg.ok ? "ok" : "err"}>{msg.text}</p>}
    </>
  );
}

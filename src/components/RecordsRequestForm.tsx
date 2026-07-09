"use client";

import { useState } from "react";

const REQUEST_TYPES = [
  "Financial Statements",
  "Meeting Minutes",
  "Current Reserve Study",
  "Contractor Bids",
  "Volumes II–XII (Form LRA-905)",
  "Other",
];

export default function RecordsRequestForm() {
  const [type, setType] = useState(REQUEST_TYPES[0]);
  const [note, setNote] = useState("");
  const [ticket, setTicket] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = Math.floor(10000 + Math.random() * 89999);
    setTicket(`LRA-514-${id}`);
  }

  if (ticket) {
    return (
      <div className="registration-success">
        <h3>Request Submitted</h3>
        <p>
          Ticket number <strong>{ticket}</strong> assigned. Per §15.4,
          requests are processed in the order received, with an estimated
          response time of 1–3 lunar cycles. &ldquo;In the order
          received&rdquo; describes a queueing methodology only and
          should not be read as a guarantee regarding when this request
          will actually be resolved.
        </p>
        <p style={{ marginBottom: 0 }}>Status: Under Review.</p>
      </div>
    );
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <label className="registration-field">
        <span>Request Type</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="lot-picker-search"
        >
          {REQUEST_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="registration-field">
        <span>Details (optional)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          placeholder="e.g. Q3 financials for Lot MOON-0472-1188"
        />
      </label>

      <button type="submit" className="registration-submit">
        Submit Request
      </button>
    </form>
  );
}

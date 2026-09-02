"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { NoticeBar, confirmDelete, type Notice } from "./shared";

type MessageRow = {
  id: string;
  name: string;
  email: string;
  topic: string | null;
  message: string;
  created_at: string;
};

export function MessagesPanel() {
  const supabase = getSupabaseBrowser()!;
  const [rows, setRows] = useState<MessageRow[]>([]);
  const [notice, setNotice] = useState<Notice>(null);
  const [open, setOpen] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setNotice({ kind: "err", text: error.message });
    else setRows((data as MessageRow[]) ?? []);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(row: MessageRow) {
    if (!confirmDelete(`message from ${row.name}`)) return;
    await supabase.from("messages").delete().eq("id", row.id);
    await load();
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1>Contact messages</h1>
        <span className="badge badge-purple">{rows.length} total</span>
      </div>
      <NoticeBar notice={notice} />
      <table className="admin-table">
        <thead>
          <tr>
            <th>From</th>
            <th>Topic</th>
            <th>Received</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} style={{ color: "var(--text-faint)" }}>
                No messages yet. Submissions from the contact form appear here.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <>
              <tr key={row.id}>
                <td>
                  <strong>{row.name}</strong>
                  <br />
                  <a href={`mailto:${row.email}`} style={{ color: "var(--accent-2)", fontSize: 13 }}>
                    {row.email}
                  </a>
                </td>
                <td>{row.topic ?? "-"}</td>
                <td>{new Date(row.created_at).toLocaleString()}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setOpen(open === row.id ? null : row.id)}
                  >
                    {open === row.id ? "Hide" : "Read"}
                  </button>{" "}
                  <button className="btn btn-danger btn-sm" onClick={() => remove(row)}>
                    Delete
                  </button>
                </td>
              </tr>
              {open === row.id && (
                <tr key={`${row.id}-body`}>
                  <td colSpan={4} style={{ whiteSpace: "pre-wrap", color: "var(--text-muted)" }}>
                    {row.message}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

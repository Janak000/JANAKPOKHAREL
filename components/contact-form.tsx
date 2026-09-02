"use client";

import { useState } from "react";
import { Icon } from "./icon";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-success" role="status">
        <Icon name="check" size={28} />
        <h3>Message received!</h3>
        <p>Thanks for reaching out, I&apos;ll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="form-row">
        <label>
          <span>Your name</span>
          <input name="name" type="text" required maxLength={120} placeholder="Full name" />
        </label>
        <label>
          <span>Email address</span>
          <input name="email" type="email" required maxLength={200} placeholder="you@company.com" />
        </label>
      </div>
      <label>
        <span>What do you need help with?</span>
        <select name="topic" defaultValue="SEO">
          <option>SEO</option>
          <option>Meta Ads</option>
          <option>Google Ads / PPC</option>
          <option>Technical SEO</option>
          <option>CRO &amp; Analytics</option>
          <option>Something else</option>
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={4000}
          placeholder="Tell me about your business and goals…"
        />
      </label>
      {/* Honeypot field, bots fill it, humans never see it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hp-field"
        aria-hidden="true"
      />
      {status === "error" && <p className="form-error">{error}</p>}
      <button type="submit" className="btn btn-primary btn-lg" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Message"}
        <Icon name="send" size={18} />
      </button>
    </form>
  );
}

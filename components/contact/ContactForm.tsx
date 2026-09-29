"use client";

import { useState, type FormEvent } from "react";
import { type ContactErrors, type ContactResponse, limits } from "@/lib/contact";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type Status =
  | { state: "idle" | "sending" | "sent" }
  | { state: "error"; message: string; errors?: ContactErrors };

const failureMessages = {
  not_configured: `The form isn’t connected to an inbox yet, so nothing was sent. Please email ${site.email} directly.`,
  rate_limited: "Too many messages in a short time. Please try again in a few minutes.",
  failed: `Your message couldn’t be delivered. Please try again, or email ${site.email}.`,
};

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", maxLength: limits.name },
  { name: "email", label: "Email", type: "email", autoComplete: "email", maxLength: limits.email },
] as const;

function Label({ id, index, children }: { id: string; index: number; children: string }) {
  return (
    <label htmlFor={id} className="label flex items-baseline gap-3 text-muted transition-colors duration-200 group-focus-within:text-ink">
      <span>{String(index).padStart(2, "0")}</span>
      {children}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="swap-in mt-3 flex items-baseline gap-2 text-[0.875rem]">
      <span aria-hidden className="label">!</span>
      {message}
    </p>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  // Used server side to discard submissions made faster than a person could fill the form.
  const [mountedAt] = useState(() => Date.now());
  const errors = status.state === "error" ? status.errors : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ state: "sending" });

    const payload = {
      ...Object.fromEntries(new FormData(form)),
      elapsed: Date.now() - mountedAt,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: ContactResponse = await response.json();

      if (result.ok) {
        form.reset();
        setStatus({ state: "sent" });
      } else if (result.reason === "invalid") {
        setStatus({ state: "error", message: "Please check the highlighted fields.", errors: result.errors });
      } else {
        setStatus({ state: "error", message: failureMessages[result.reason] });
      }
    } catch {
      setStatus({ state: "error", message: failureMessages.failed });
    }
  }

  // Only reached after the server confirms delivery (result.ok), never on a timer.
  if (status.state === "sent") {
    return (
      <div role="status" className="swap-in border-t border-ink pt-6">
        <p className="label text-muted">Message delivered</p>
        <p className="mt-6 max-w-[24ch] text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.1] font-medium tracking-[-0.025em]">
          Thanks, your message is on its way. I’ll reply by email.
        </p>
        <button
          type="button"
          className="caps link-line hit mt-8"
          onClick={() => setStatus({ state: "idle" })}
        >
          Send another
        </button>
      </div>
    );
  }

  const sending = status.state === "sending";
  const fieldClass =
    "mt-3 block w-full rounded-none border-0 border-b border-field bg-transparent py-3 text-lg outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted/60 focus:border-ink focus:shadow-[inset_0_-1px_0_var(--color-ink)] aria-[invalid=true]:border-ink aria-[invalid=true]:shadow-[inset_0_-1px_0_var(--color-ink)]";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-10"
      aria-busy={sending}
      aria-describedby={status.state === "error" ? "form-status" : undefined}
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-x-[var(--gutter)]">
        {fields.map((field, index) => (
          <div key={field.name} className="group">
            <Label id={field.name} index={index + 1}>
              {field.label}
            </Label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              maxLength={field.maxLength}
              required
              aria-invalid={Boolean(errors?.[field.name])}
              aria-describedby={errors?.[field.name] ? `${field.name}-error` : undefined}
              className={fieldClass}
            />
            <FieldError id={`${field.name}-error`} message={errors?.[field.name]} />
          </div>
        ))}
      </div>

      <div className="group">
        <Label id="message" index={3}>
          Project / Message
        </Label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={limits.message}
          aria-invalid={Boolean(errors?.message)}
          aria-describedby={errors?.message ? "message-error" : undefined}
          className={cn(fieldClass, "resize-y")}
        />
        <FieldError id="message-error" message={errors?.message} />
      </div>

      {/* Hidden from people; bots tend to fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-ink pt-5">
        <p
          id="form-status"
          aria-live="polite"
          className={cn("max-w-[44ch] text-[0.875rem] leading-normal", status.state === "error" ? "text-ink" : "text-muted")}
        >
          {status.state === "error" ? status.message : sending ? "Sending your message…" : `Or email ${site.email}`}
        </p>
        <button
          type="submit"
          disabled={sending}
          className="caps group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-6 text-paper transition-[background-color,transform] duration-200 hover:bg-[#2a2a28] active:scale-[0.98] disabled:cursor-progress disabled:opacity-60"
        >
          {sending ? "Sending" : "Send message"}
          <span aria-hidden className={cn("arrow", sending && "opacity-0")}>
            →
          </span>
        </button>
      </div>
    </form>
  );
}

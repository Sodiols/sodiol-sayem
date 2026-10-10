"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { BrutalSelect, type SelectOption } from "@/components/ui/brutal-select";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();

const MESSAGE_MAX = 3000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const projectTypes: SelectOption[] = [
  { value: "Website / portfolio", label: "Website / portfolio", hint: "Landing pages, portfolios" },
  { value: "Web application", label: "Web application", hint: "Dashboards, tools, SaaS" },
  { value: "E-commerce", label: "E-commerce", hint: "Storefronts, catalogues" },
  { value: "Desktop app", label: "Desktop app", hint: "Windows and macOS tools" },
  { value: "Something else", label: "Something else", hint: "Tell me in the message" },
];

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent"; name: string; email: string }
  | { state: "failed"; message: string };

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (!values.name) errors.name = "Tell me what to call you.";
  if (!values.email) errors.email = "I need an email address to reply to.";
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "That email address doesn't look right.";
  if (!values.message) errors.message = "Add a few lines about your idea.";
  else if (values.message.length < 10) errors.message = "A little more detail, please (10 characters minimum).";
  return errors;
}

export function ContactForm() {
  const statusRef = useRef<HTMLDivElement>(null);
  const [projectType, setProjectType] = useState(projectTypes[0].value);
  const [messageLength, setMessageLength] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });

  // Move focus to the result so keyboard and screen reader users hear the outcome.
  useEffect(() => {
    if (status.state === "sent" || status.state === "failed") statusRef.current?.focus();
  }, [status.state]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.state === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);

    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as Field[])[0];
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // Honeypot: real visitors never see or tick this box.
    if (data.get("botcheck")) {
      setStatus({ state: "sent", name: values.name, email: values.email });
      return;
    }

    if (!accessKey) {
      setStatus({
        state: "failed",
        message: "The contact form isn't connected yet. Please try again later.",
      });
      return;
    }

    setStatus({ state: "sending" });
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New project inquiry: ${projectType} from ${values.name}`,
          from_name: "Sodiol Portfolio",
          name: values.name,
          email: values.email,
          project_type: projectType,
          message: values.message,
          botcheck: false,
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; body?: { message?: string } }
        | null;

      if (response.ok && result?.success) {
        setStatus({ state: "sent", name: values.name, email: values.email });
        form.reset();
        setProjectType(projectTypes[0].value);
        setMessageLength(0);
        return;
      }
      const reason =
        response.status === 429
          ? "Too many messages in a short time. Wait a minute and try again."
          : result?.body?.message ?? result?.message ?? "The message couldn't be delivered.";
      setStatus({ state: "failed", message: reason });
    } catch {
      setStatus({
        state: "failed",
        message: "Couldn't reach the mail service. Check your connection and try again.",
      });
    }
  }

  const clearError = (field: Field) => {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  if (status.state === "sent") {
    return (
      <div className="form-status form-status-sent" ref={statusRef} tabIndex={-1} role="status">
        <span className="eyebrow">MESSAGE DELIVERED</span>
        <p className="form-status-title">
          THANKS, <span>{status.name.split(" ")[0].toUpperCase()}.</span>
        </p>
        <p>
          Your note is in my inbox. I&apos;ll reply to <strong>{status.email}</strong> as soon as I can.
        </p>
        <button type="button" className="plain-button" onClick={() => setStatus({ state: "idle" })}>
          SEND ANOTHER MESSAGE ↗
        </button>
      </div>
    );
  }

  const sending = status.state === "sending";

  return (
    <form id="contact-form" onSubmit={handleSubmit} noValidate aria-busy={sending}>
      <div className="form-row">
        <div className="field" data-invalid={errors.name ? true : undefined}>
          <label htmlFor="contact-name">
            YOUR NAME <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="What should I call you?"
            required
            maxLength={100}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            onChange={() => clearError("name")}
          />
          {errors.name && (
            <p className="field-error" id="contact-name-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="field" data-invalid={errors.email ? true : undefined}>
          <label htmlFor="contact-email">
            YOUR EMAIL <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            maxLength={200}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            onChange={() => clearError("email")}
          />
          {errors.email && (
            <p className="field-error" id="contact-email-error">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <label id="contact-type-label" htmlFor="contact-type">
          WHAT ARE YOU THINKING?
        </label>
        <BrutalSelect
          id="contact-type"
          name="project_type"
          labelId="contact-type-label"
          options={projectTypes}
          value={projectType}
          onChange={setProjectType}
        />
      </div>

      <div className="field" data-invalid={errors.message ? true : undefined}>
        <label htmlFor="contact-message">
          A LITTLE ABOUT YOUR IDEA <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="The idea, a rough scope, or just a starting point..."
          rows={6}
          required
          maxLength={MESSAGE_MAX}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={`contact-message-help${errors.message ? " contact-message-error" : ""}`}
          onChange={(event) => {
            setMessageLength(event.currentTarget.value.length);
            clearError("message");
          }}
        />
        <div className="field-meta">
          <p id="contact-message-help">Scope, timeline, links. Whatever helps.</p>
          <span className="field-count" aria-hidden="true">
            {messageLength} / {MESSAGE_MAX}
          </span>
        </div>
        {errors.message && (
          <p className="field-error" id="contact-message-error">
            {errors.message}
          </p>
        )}
      </div>

      {/* Spam honeypot for Web3Forms. Hidden from people and assistive tech. */}
      <input type="checkbox" name="botcheck" className="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <button className="primary-button submit-button" type="submit" disabled={sending} data-sending={sending || undefined}>
        {sending ? "SENDING MESSAGE" : "SEND MESSAGE"} <span aria-hidden="true">{sending ? "…" : "↗"}</span>
      </button>

      <div aria-live="polite">
        {status.state === "failed" && (
          <div className="form-status form-status-failed" ref={statusRef} tabIndex={-1} role="alert">
            <span className="eyebrow">NOT SENT</span>
            <p>{status.message}</p>
          </div>
        )}
      </div>
    </form>
  );
}

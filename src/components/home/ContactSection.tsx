"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Captcha, type CaptchaHandle } from "@/components/contact/Captcha";
import { markSubmissionReceived } from "@/lib/submission-receipt";
import { trackEvent } from "@/lib/analytics";
import { socialProfiles } from "@/data/navigation";
import styles from "./ContactSection.module.css";

const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
const projectTypes = ["Website development", "Web application", "Collaboration", "Something else"];
type Field = "name" | "email" | "project_type" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = { kind: "idle" | "sending" | "success" | "error"; message?: string };

export function ContactSection() {
  const router = useRouter();
  const captcha = useRef<CaptchaHandle>(null);
  const [captchaActive,setCaptchaActive] = useState(false);
  const [captchaToken,setCaptchaToken] = useState("");
  const [captchaError,setCaptchaError] = useState(false);
  const root = useRef<HTMLElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const statusElement = useRef<HTMLDivElement>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const busy = useRef(false);
  const mounted = useRef(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const sending = status.kind === "sending";
  const sent = status.kind === "success";

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      activeRequest.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (status.kind !== "success" && status.kind !== "error") return;
    if (document.querySelector("dialog[open]")) return;
    const bounds = root.current!.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
    statusElement.current?.focus({ preventScroll: true });
    statusElement.current?.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [status.kind]);

  function validateField(field: Field): string | undefined {
    const control = form.current!.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const value = control.value.trim();
    if (field === "name") return !value ? "Please enter your name." : value.length > 100 ? "Keep your name under 100 characters." : undefined;
    if (field === "email") return !value ? "Please enter your email address." : !control.validity.valid || value.length > 254 ? "Enter a valid email address." : undefined;
    if (field === "message") return !value ? "Please add a message." : value.length > 5000 ? "Keep your message under 5,000 characters." : undefined;
    return value && !projectTypes.includes(value) ? "Please choose one of these options." : undefined;
  }
  function clearError(field: Field) {
    if (errors[field]) setErrors(current => ({ ...current, [field]: undefined }));
  }
  function checkField(field: Field) {
    setErrors(current => ({ ...current, [field]: validateField(field) }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const currentForm = event.currentTarget;
    const invalid: Errors = {};
    const fields: Field[] = ["name", "email", "project_type", "message"];
    fields.forEach(field => { const error = validateField(field); if (error) invalid[field] = error; });
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      setStatus({ kind: "idle" });
      (currentForm.elements.namedItem(fields.find(field => invalid[field])!) as HTMLElement).focus();
      return;
    }
    if (!accessKey) {
      setStatus({ kind: "error", message: "The form isn’t available right now. Please try again later or use the LinkedIn link in this section." });
      return;
    }
    const data = new FormData(currentForm);
    if (data.has("botcheck")) {
      setStatus({ kind: "error", message: "Couldn’t send your message. Please refresh the page and try again." });
      return;
    }
    if (!captchaToken) {
      setCaptchaActive(true);
      setCaptchaError(true);
      captcha.current?.focus();
      return;
    }
    setCaptchaError(false);
    const projectType = String(data.get("project_type") || "").trim();
    const payload = {
      access_key: accessKey,
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      message: String(data.get("message") || "").trim(),
      ...(projectType ? { project_type: projectType } : {}),
      subject: "New Portfolio Inquiry | Sodiol Sayem",
      from_name: "Sodiol Portfolio",
      botcheck: false,
      "h-captcha-response": captchaToken,
    };
    busy.current = true;
    setStatus({ kind: "sending" });
    const controller = new AbortController();
    activeRequest.current = controller;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 20000);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload), signal: controller.signal,
      });
      if (!mounted.current) return;
      if (response.status === 429) {
        setStatus({ kind: "error", message: "Too many attempts. Please wait a moment and try again." });
        return;
      }
      const result: unknown = await response.json();
      if (!mounted.current) return;
      if (response.ok && typeof result === "object" && result !== null && "success" in result && result.success === true) {
        currentForm.reset();
        setErrors({});
        setStatus({ kind: "success" });
        markSubmissionReceived();
        trackEvent("contact_form_success");
        // Let the button confirm the send before moving on to the thank-you page.
        setTimeout(() => { if (mounted.current) router.push("/thank-you"); }, 1400);
      } else setStatus({ kind: "error", message: "Couldn’t send your message. Please try again." });
    } catch {
      if (mounted.current) setStatus({ kind: "error", message: timedOut ? "The request took too long. Please try again." : "Couldn’t send your message. Please check your connection and try again." });
    } finally {
      clearTimeout(timeout);
      busy.current = false;
      if (activeRequest.current === controller) activeRequest.current = null;
      if (mounted.current) captcha.current?.reset();
    }
  }

  const describe = (field: Field, extra?: string) => [extra, errors[field] ? `contact-${field === "project_type" ? "project-type" : field}-error` : ""].filter(Boolean).join(" ") || undefined;

  return <section ref={root} id="contact" className={styles.section} aria-labelledby="contact-title" data-contact data-scene="1">
    <div className={styles.layout}>
      <div className={styles.introduction}>
        <h2 id="contact-title">Let’s talk.</h2>
        <p className={styles.description}>Tell me what you’re building or what you’d like to improve. A few lines are enough to start.</p>
        <dl className={styles.facts}>
          <div><dt>Elsewhere</dt><dd className={styles.socials}>{Object.values(socialProfiles).filter(profile => profile.url).map(profile =>
            <a key={profile.label} href={profile.url!} target="_blank" rel="noopener noreferrer">{profile.label}<span className="sr-only"> (opens in a new tab)</span></a>)}</dd></div>
        </dl>
      </div>
      <form ref={form} onSubmit={submit} noValidate action="https://api.web3forms.com/submit" method="POST"
        onFocusCapture={() => setCaptchaActive(true)}
        className={styles.form} aria-labelledby="contact-form-title" aria-busy={sending} data-contact-form>
        <h3 id="contact-form-title" className={styles.formTitle}>Send an inquiry</h3>
        <input type="hidden" name="access_key" value={accessKey || ""} />
        <input type="hidden" name="subject" value="New Portfolio Inquiry | Sodiol Sayem" />
        <input type="hidden" name="from_name" value="Sodiol Portfolio" />
        <div className={styles.honeypot} aria-hidden="true"><input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-label="Leave this field empty" /></div>
        <fieldset disabled={sending || sent}>
          <legend className="sr-only">Your contact details and message</legend>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor="contact-name">Your name</label>
              <input id="contact-name" name="name" autoComplete="name" required maxLength={100}
                aria-invalid={Boolean(errors.name)} aria-describedby={describe("name")}
                onInput={() => clearError("name")} onBlur={() => checkField("name")} />
              <p id="contact-name-error" className={styles.fieldError} aria-live="polite">{errors.name}</p>
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-email">Email address</label>
              <input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254}
                aria-invalid={Boolean(errors.email)} aria-describedby={describe("email")}
                onInput={() => clearError("email")} onBlur={() => checkField("email")} />
              <p id="contact-email-error" className={styles.fieldError} aria-live="polite">{errors.email}</p>
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-project-type">Project type <span>(optional)</span></label>
              <select id="contact-project-type" name="project_type" defaultValue=""
                aria-invalid={Boolean(errors.project_type)} aria-describedby={describe("project_type")}
                onChange={() => clearError("project_type")}>
                <option value="">Choose a project type</option>
                {projectTypes.map(type => <option key={type}>{type}</option>)}
              </select>
              <p id="contact-project-type-error" className={styles.fieldError}>{errors.project_type}</p>
            </div>
          </div>
          <div className={styles.messageField}>
            <label htmlFor="contact-message">Your message</label>
            <textarea id="contact-message" name="message" rows={5} placeholder="What does it need to do, and where are you with it?" required maxLength={5000}
              aria-invalid={Boolean(errors.message)} aria-describedby={describe("message", "contact-message-help")}
              onInput={() => clearError("message")} onBlur={() => checkField("message")} />
            <p id="contact-message-error" className={styles.fieldError}>{errors.message}</p>
            <p id="contact-message-help" className={styles.messageHelp}>Please leave out passwords and other sensitive information.</p>
          </div>
          <div className={styles.sendRow}>
            <div className={styles.verification}>
              <Captcha ref={captcha} active={captchaActive} onToken={setCaptchaToken} />
              <p className={styles.fieldError} aria-live="polite">{captchaError && !captchaToken ? "Please complete the anti-spam verification." : ""}</p>
              <p>Messages are processed by Web3Forms. <Link href="/privacy-policy">Privacy Policy</Link></p>
            </div>
            <button className={styles.submit} type="submit" disabled={sending || sent} data-state={status.kind}>
              {sent ? "Message sent" : sending ? "Sending…" : "Send message"}
              <span aria-hidden="true">{sent
                ? <svg className={styles.check} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                : sending ? <i className={styles.spinner} /> : "↗"}</span>
            </button>
          </div>
        </fieldset>
        <div ref={statusElement} className={styles.status} role="status" aria-live="polite" aria-atomic="true" tabIndex={-1} data-state={status.kind}>
          {status.kind === "sending" && <p>Sending your message…</p>}
          {status.kind === "success" && <><div className={styles.successMask}><h3>Message sent.</h3></div><p>Thanks for reaching out. I’ll get back to you as soon as I can.</p></>}
          {status.kind === "error" && <p>{status.message}</p>}
        </div>
      </form>
    </div>
  </section>;
}

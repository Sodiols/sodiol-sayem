"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./ContactSection.module.css";

const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
const projectTypes = ["Website development", "Web application", "Collaboration", "Something else"];
type Field = "name" | "email" | "project_type" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = { kind: "idle" | "sending" | "success" | "error"; message?: string };

export function ContactSection() {
  const root = useRef<HTMLElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const statusElement = useRef<HTMLDivElement>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const busy = useRef(false);
  const mounted = useRef(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const sending = status.kind === "sending";

  useEffect(() => {
    mounted.current = true;
    const section = root.current!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    let ready = section.closest<HTMLElement>("[data-intro]")?.dataset.intro === "complete";
    let visible = false;
    let played = false;
    const reveal = () => {
      if (!ready || !visible || played) return;
      played = true; observer.disconnect();
      if (motion.matches) return;
      section.querySelectorAll<HTMLElement>("[data-contact-line]").forEach((line, index) => {
        animations.push(line.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0)" }],
          { duration: 750, delay: index * 80, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }));
      });
      section.querySelectorAll<HTMLElement>("[data-contact-field]").forEach((field, index) => {
        animations.push(field.animate([{ transform: "translateY(14px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
          { duration: 550, delay: 100 + index * 55, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }));
      });
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; reveal(); }, { threshold: 0.1 });
    const onIntro = () => { ready = true; reveal(); };
    const onMotion = () => { if (motion.matches) animations.forEach(animation => animation.finish()); };
    observer.observe(section);
    window.addEventListener("sodiol:intro-complete", onIntro);
    motion.addEventListener("change", onMotion);
    return () => {
      mounted.current = false;
      activeRequest.current?.abort();
      observer.disconnect();
      window.removeEventListener("sodiol:intro-complete", onIntro);
      motion.removeEventListener("change", onMotion);
      animations.forEach(animation => animation.cancel());
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
      setStatus({ kind: "error", message: "The form isn’t available right now. Please try again later or use a social link below." });
      return;
    }
    const data = new FormData(currentForm);
    if (data.has("botcheck")) {
      setStatus({ kind: "error", message: "Couldn’t send your message. Please refresh the page and try again." });
      return;
    }
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
      } else setStatus({ kind: "error", message: "Couldn’t send your message. Please try again." });
    } catch {
      if (mounted.current) setStatus({ kind: "error", message: timedOut ? "The request took too long. Please try again." : "Couldn’t send your message. Please check your connection and try again." });
    } finally {
      clearTimeout(timeout);
      busy.current = false;
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  }

  return <section ref={root} id="contact" className={styles.section} aria-labelledby="contact-title" data-contact>
    <div className={styles.layout}>
      <div className={styles.introduction}>
        <p className={styles.eyebrow}><span>05 /</span> CONTACT</p>
        <h2 id="contact-title"><span className={styles.mask}><span data-contact-line>Have something</span></span>{" "}<span className={styles.mask}><span data-contact-line>in mind?</span></span></h2>
        <p className={styles.description}>An idea, a project, or just a question. I’d love to hear about it.</p>
        <p className={styles.location}>Based in Sylhet, Bangladesh.</p>
      </div>
      <form ref={form} onSubmit={submit} noValidate action="https://api.web3forms.com/submit" method="POST"
        className={styles.form} aria-labelledby="contact-form-title" aria-busy={sending} data-contact-form>
        <h3 id="contact-form-title" className="sr-only">Send a message</h3>
        <input type="hidden" name="access_key" value={accessKey || ""} />
        <input type="hidden" name="subject" value="New Portfolio Inquiry | Sodiol Sayem" />
        <input type="hidden" name="from_name" value="Sodiol Portfolio" />
        <div className={styles.honeypot} aria-hidden="true"><input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-label="Leave this field empty" /></div>
        <fieldset disabled={sending}>
          <legend className="sr-only">Your contact details and message</legend>
          <div className={styles.field} data-contact-field>
            <label htmlFor="contact-name">Your name</label>
            <div className={styles.control}><input id="contact-name" name="name" type="text" placeholder="What should I call you?" autoComplete="name" required maxLength={100}
              aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined}
              onInput={() => clearError("name")} onBlur={() => checkField("name")} /></div>
            <p id="contact-name-error" className={styles.fieldError}>{errors.name}</p>
          </div>
          <div className={styles.field} data-contact-field>
            <label htmlFor="contact-email">Email address</label>
            <div className={styles.control}><input id="contact-email" name="email" type="email" inputMode="email" placeholder="you@example.com" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254}
              aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined}
              onInput={() => clearError("email")} onBlur={() => checkField("email")} /></div>
            <p id="contact-email-error" className={styles.fieldError}>{errors.email}</p>
          </div>
          <div className={styles.field} data-contact-field>
            <label htmlFor="contact-project-type">What’s this about? <span>(optional)</span></label>
            <div className={styles.control}><select id="contact-project-type" name="project_type" defaultValue=""
              aria-invalid={Boolean(errors.project_type)} aria-describedby={errors.project_type ? "contact-project-type-error" : undefined}
              onChange={() => clearError("project_type")}><option value="">Select an option</option>{projectTypes.map(type => <option key={type} value={type}>{type}</option>)}</select></div>
            <p id="contact-project-type-error" className={styles.fieldError}>{errors.project_type}</p>
          </div>
          <div className={styles.field} data-contact-field>
            <label htmlFor="contact-message">Your message</label>
            <div className={styles.control}><textarea id="contact-message" name="message" rows={4} placeholder="Tell me a little about what you have in mind…" required maxLength={5000}
              aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined}
              onInput={() => clearError("message")} onBlur={() => checkField("message")} /></div>
            <p id="contact-message-error" className={styles.fieldError}>{errors.message}</p>
          </div>
          <button className={styles.submit} type="submit" disabled={sending}>{sending ? "Sending…" : "Send message"}<span aria-hidden="true">{sending ? "" : "↗"}</span></button>
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

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type Status = "Sending" | "Delivered" | "Read";
type Message = { id: number; from: "you" | "them"; text: string; status?: Status };

const replies = [
  "Got it. This reply is simulated in your browser.",
  "Nothing here reaches a server; the states are timers.",
  "Sending, delivered, read: each state is designed on its own.",
];

/**
 * A local simulation of message states. Timers only start when a message is sent and are cleared on
 * unmount. There is no network or realtime connection.
 */
export function MessageStudy() {
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: "them", text: "Hi! Send a message to see its states." }]);
  const [typing, setTyping] = useState(false);
  const nextId = useRef(1);
  const replyIndex = useRef(0);
  const timers = useRef<number[]>([]);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [messages, typing]);

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function setStatus(id: number, status: Status) {
    setMessages((current) => current.map((message) => (message.id === id ? { ...message, status } : message)));
  }

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const text = String(new FormData(form).get("message") ?? "").trim();
    if (!text) return;
    form.reset();

    const id = nextId.current++;
    setMessages((current) => [...current, { id, from: "you", text, status: "Sending" }]);
    later(() => setStatus(id, "Delivered"), 600);
    later(() => {
      setStatus(id, "Read");
      setTyping(true);
    }, 1400);
    later(() => {
      setTyping(false);
      const reply = replies[replyIndex.current++ % replies.length];
      setMessages((current) => [...current, { id: nextId.current++, from: "them", text: reply }]);
    }, 2600);
  }

  return (
    <div className="flex h-full flex-col border border-line bg-white/60">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="text-sm font-medium">Demo contact</span>
        <span className="label text-muted">Simulated</span>
      </div>
      <ol ref={list} aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <li key={message.id} className={cn("swap-in max-w-[80%]", message.from === "you" && "self-end text-right")}>
            <p className={cn("inline-block px-3.5 py-2 text-[0.9375rem] leading-snug", message.from === "you" ? "bg-ink text-paper" : "bg-well")}>
              {message.text}
            </p>
            {message.status && <p className="label mt-1 text-muted">{message.status}</p>}
          </li>
        ))}
        {typing && (
          <li className="swap-in label text-muted" aria-label="Demo contact is typing">
            typing…
          </li>
        )}
      </ol>
      <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
        <label htmlFor="lab-message" className="sr-only">
          Message
        </label>
        <input
          id="lab-message"
          name="message"
          autoComplete="off"
          maxLength={140}
          placeholder="Write a message"
          className="min-h-11 flex-1 border-b border-field bg-transparent px-1 outline-none focus:border-ink"
        />
        <button type="submit" className="caps min-h-11 rounded-full bg-ink px-5 text-paper">
          Send
        </button>
      </form>
    </div>
  );
}

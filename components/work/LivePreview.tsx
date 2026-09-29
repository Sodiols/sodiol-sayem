"use client";

import { useRef, useState, type ReactNode } from "react";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

type LivePreviewProps = {
  title: string;
  url: string;
  embeddable: boolean;
  className?: string;
  children: ReactNode;
};

const LOAD_TIMEOUT_MS = 12000;

/**
 * Opens a project's live site in a near full screen dialog. Sites that refuse
 * to be framed get a plain link to a new tab instead, so an empty iframe never shows.
 */
export function LivePreview({ title, url, embeddable, className, children }: LivePreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);
  const [status, setStatus] = useState<"closed" | "loading" | "ready" | "failed">("closed");
  const host = new URL(url).host;

  if (!embeddable) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  function open() {
    setStatus("loading");
    lockScroll();
    dialogRef.current?.showModal();
    timeoutRef.current = window.setTimeout(() => setStatus("failed"), LOAD_TIMEOUT_MS);
  }

  function handleClose() {
    window.clearTimeout(timeoutRef.current);
    unlockScroll();
    setStatus("closed");
  }

  function handleLoad() {
    window.clearTimeout(timeoutRef.current);
    setStatus("ready");
  }

  return (
    <>
      <button type="button" onClick={open} className={className} aria-haspopup="dialog">
        {children}
      </button>

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        aria-label={`${title} live preview`}
        className="preview-dialog m-auto h-[calc(100dvh-2*var(--margin))] max-h-none w-[calc(100vw-2*var(--margin))] max-w-none flex-col border border-ink bg-paper p-0 text-ink backdrop:bg-ink/55 open:flex"
      >
        <header className="flex items-center gap-4 border-b border-line px-4 py-3 md:px-5">
          <p className="caps shrink-0">{title}</p>
          <p className="label min-w-0 truncate text-muted">{host}</p>
          <div className="ml-auto flex shrink-0 items-center gap-5">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="caps group hidden items-baseline gap-[0.4em] sm:inline-flex"
            >
              <span className="link-line">Open website</span>
              <span aria-hidden className="arrow arrow-up">
                ↗
              </span>
            </a>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="caps group -m-3.5 flex items-center gap-2 p-3.5"
            >
              Close
              <span aria-hidden className="text-base leading-none transition-transform duration-300 group-hover:rotate-90">
                ×
              </span>
            </button>
          </div>
        </header>

        <div className="relative flex-1 bg-well">
          {status !== "closed" && status !== "failed" && (
            <iframe
              src={url}
              title={`${title} website`}
              onLoad={handleLoad}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="strict-origin-when-cross-origin"
              className={`absolute inset-0 h-full w-full bg-white transition-opacity duration-300 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
            />
          )}
          {status === "loading" && (
            <p className="label absolute inset-0 flex items-center justify-center text-ink/75" role="status">
              Loading {host}…
            </p>
          )}
          {status === "failed" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center" role="status">
              <p className="max-w-[32ch] text-lg">The preview didn’t load here. The site works best in its own tab.</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="caps group inline-flex gap-[0.4em]">
                <span className="link-line">Open website</span>
                <span aria-hidden className="arrow arrow-up">
                  ↗
                </span>
              </a>
            </div>
          )}
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="caps flex items-center justify-center gap-[0.4em] border-t border-line py-4 sm:hidden"
        >
          Open website <span aria-hidden>↗</span>
        </a>
      </dialog>
    </>
  );
}

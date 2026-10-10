"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type SelectOption = { value: string; label: string; hint?: string };

type BrutalSelectProps = {
  id: string;
  name: string;
  /** id of the visible <label> element. */
  labelId: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  describedBy?: string;
};

/**
 * Single-select dropdown following the WAI-ARIA "select-only combobox" pattern.
 * A hidden input carries the value, so it posts with the form like a native <select>.
 */
export function BrutalSelect({ id, name, labelId, options, value, onChange, describedBy }: BrutalSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const typeahead = useRef({ text: "", timer: undefined as ReturnType<typeof setTimeout> | undefined });

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(selectedIndex);
  const selected = options[selectedIndex];

  const optionId = (index: number) => `${listId}-option-${index}`;

  const openList = useCallback(
    (index = selectedIndex) => {
      setActive(index);
      setOpen(true);
    },
    [selectedIndex],
  );

  const commit = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Close when clicking or tapping outside.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted option in view inside the panel.
  useEffect(() => {
    if (!open) return;
    document.getElementById(`${listId}-option-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);

  useEffect(() => () => clearTimeout(typeahead.current.timer), []);

  const matchTypeahead = (key: string) => {
    const state = typeahead.current;
    clearTimeout(state.timer);
    state.text += key.toLowerCase();
    state.timer = setTimeout(() => (state.text = ""), 600);
    const start = open ? active : selectedIndex;
    const ordered = [...options.slice(start + 1), ...options.slice(0, start + 1)];
    const match = ordered.find((option) => option.label.toLowerCase().startsWith(state.text));
    return match ? options.indexOf(match) : -1;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList();
        else setActive((index) => Math.min(last, index + 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList();
        else setActive((index) => Math.max(0, index - 1));
        return;
      case "Home":
        event.preventDefault();
        openList(0);
        return;
      case "End":
        event.preventDefault();
        openList(last);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) commit(active);
        else openList();
        return;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      case "Tab":
        if (open) setOpen(false);
        return;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const index = matchTypeahead(event.key);
          if (index < 0) return;
          if (open) setActive(index);
          else onChange(options[index].value);
        }
    }
  };

  return (
    <div className="select" ref={rootRef} data-open={open || undefined}>
      <input type="hidden" name={name} value={selected.value} />
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className="select-trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${id}`}
        aria-describedby={describedBy}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className="select-index" aria-hidden="true">
          {String(selectedIndex + 1).padStart(2, "0")}
        </span>
        <span className="select-value">{selected.label}</span>
        <span className="select-arrow" aria-hidden="true">
          ↓
        </span>
      </button>
      <ul id={listId} className="select-panel" role="listbox" aria-labelledby={labelId} tabIndex={-1}>
        {options.map((option, index) => (
          <li
            key={option.value}
            id={optionId(index)}
            role="option"
            aria-selected={index === selectedIndex}
            data-active={index === active || undefined}
            className="select-option"
            onPointerMove={() => setActive(index)}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => commit(index)}
          >
            <span className="select-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="select-option-label">{option.label}</span>
            {option.hint && <span className="select-hint">{option.hint}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

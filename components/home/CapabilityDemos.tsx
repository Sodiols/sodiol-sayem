"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { CapabilityId } from "@/data/technologies";
import { validateContact } from "@/lib/contact";
import { cn } from "@/lib/utils";

// Small local demonstrations. Nothing here talks to a network or loops forever:
// each one animates once on mount or in response to a click.

const vars = (values: Record<string, string | number>) => values as CSSProperties;

function DemoButton({ children, onClick, pressed, disabled }: { children: ReactNode; onClick: () => void; pressed?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={cn(
        "label min-h-9 border px-3 transition-colors duration-200",
        pressed ? "border-ink bg-ink text-paper" : "border-ink/25 hover:border-ink",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function Stage({ children, caption, controls }: { children: ReactNode; caption?: string; controls?: ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden border border-line bg-white/60 p-5">{children}</div>
      <div className="mt-3 flex min-h-9 flex-wrap items-center justify-between gap-3">
        {caption && <p className="label text-muted">{caption}</p>}
        {controls && <div className="flex flex-wrap gap-2">{controls}</div>}
      </div>
    </div>
  );
}

/** Timers started by a demo, cleared when it unmounts. */
function useTimers() {
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);
  return {
    later(fn: () => void, ms: number) {
      timers.current.push(window.setTimeout(fn, ms));
    },
    clear() {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    },
  };
}

function FrontendDemo() {
  const [run, setRun] = useState(0);
  const pieces = [
    { area: "col-span-6 h-3", dx: "-40px", dy: "-20px" },
    { area: "col-span-4 h-8 mt-4", dx: "30px", dy: "-30px" },
    { area: "col-span-2 row-span-3 mt-4", dx: "60px", dy: "10px", well: true },
    { area: "col-span-3 h-2", dx: "-50px", dy: "30px", soft: true },
    { area: "col-span-4 h-2", dx: "-20px", dy: "50px", soft: true },
    { area: "col-span-2 h-7 mt-3", dx: "40px", dy: "40px" },
  ];
  return (
    <Stage caption="Pieces settle into one grid" controls={<DemoButton onClick={() => setRun((value) => value + 1)}>Assemble again</DemoButton>}>
      <div key={run} className="grid h-full grid-cols-6 content-start gap-2">
        {pieces.map((piece, index) => (
          <span
            key={index}
            className={cn(
              "assemble rounded-[2px]",
              piece.area,
              piece.well ? "min-h-24 bg-well" : piece.soft ? "bg-ink/20" : "bg-ink",
            )}
            style={vars({ "--dx": piece.dx, "--dy": piece.dy, "--delay": `${index * 70}ms` })}
          />
        ))}
      </div>
    </Stage>
  );
}

function FullStackDemo() {
  const layers = ["Interface", "Application", "Database"];
  const log = ["Form submitted", "Validated on the server", "Row saved", "Confirmation shown"];
  const [step, setStep] = useState(-1);
  const timers = useTimers();

  function send() {
    timers.clear();
    setStep(0);
    [1, 2, 3].forEach((next) => timers.later(() => setStep(next), next * 550));
  }

  // Steps 0-2 travel down the layers, step 3 returns to the interface.
  const lit = step === 3 ? 0 : step;
  return (
    <Stage caption={step >= 0 ? log[step] : "One request through every layer"} controls={<DemoButton onClick={send}>Send a request</DemoButton>}>
      <ol className="flex h-full flex-col justify-center">
        {layers.map((layer, index) => (
          <li key={layer} className="flex flex-col items-center">
            {index > 0 && <span className={cn("h-6 w-px transition-colors duration-300", step >= index && step < 3 ? "bg-ink" : "bg-ink/20")} />}
            <span
              className={cn(
                "w-48 border px-4 py-2.5 text-center font-mono text-[0.75rem] transition-colors duration-300",
                lit === index ? "border-ink bg-ink text-paper" : "border-ink/25",
              )}
            >
              {layer}
            </span>
          </li>
        ))}
      </ol>
    </Stage>
  );
}

type AppState = "Loading" | "Empty" | "Ready" | "Error";

function WebAppDemo() {
  const [state, setState] = useState<AppState>("Ready");
  const rows = [
    ["#1042", "Paid"],
    ["#1041", "Packed"],
    ["#1040", "Delivered"],
  ];
  return (
    <Stage
      caption="Every state is designed, not just the happy one"
      controls={(["Loading", "Empty", "Ready", "Error"] as AppState[]).map((option) => (
        <DemoButton key={option} pressed={state === option} onClick={() => setState(option)}>
          {option}
        </DemoButton>
      ))}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <span className="text-sm font-medium">Orders</span>
          <span className="label text-muted">Today</span>
        </div>
        <div key={state} className="swap-in flex flex-1 flex-col justify-center">
          {state === "Loading" && (
            <div className="space-y-3" aria-label="Loading orders">
              {[0, 1, 2].map((row) => (
                <span key={row} className="block h-8 bg-ink/10" style={{ width: `${100 - row * 18}%` }} />
              ))}
            </div>
          )}
          {state === "Empty" && (
            <div className="text-center">
              <p className="font-medium">No orders yet</p>
              <p className="mt-1 text-sm text-muted">New orders will appear here.</p>
            </div>
          )}
          {state === "Ready" && (
            <table className="w-full text-sm">
              <tbody>
                {rows.map(([id, status]) => (
                  <tr key={id} className="border-b border-line last:border-0">
                    <td className="py-2.5 font-mono text-[0.75rem]">{id}</td>
                    <td className="py-2.5 text-right text-muted">{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {state === "Error" && (
            <div className="border-l-2 border-ink pl-4">
              <p className="font-medium">Orders couldn’t load</p>
              <p className="mt-1 text-sm text-muted">Check the connection and try again.</p>
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
}

function EcommerceDemo() {
  const sizes = ["S", "M", "L", "XL"];
  const [size, setSize] = useState<string | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  return (
    <Stage
      caption={cart.length ? `Added size ${cart[cart.length - 1]} · ${cart.length} in cart` : "Choose a size to add to cart"}
      controls={cart.length > 0 && <DemoButton onClick={() => setCart([])}>Empty cart</DemoButton>}
    >
      <div className="grid h-full grid-cols-[2fr_3fr] gap-5">
        <div className="bg-well" />
        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <p className="font-medium">Everyday tee</p>
            <span className="flex items-center gap-1.5 font-mono text-[0.75rem]" aria-label={`${cart.length} items in cart`}>
              Cart
              <span key={cart.length} className="swap-in inline-flex size-5 items-center justify-center rounded-full bg-ink text-[0.625rem] text-paper">
                {cart.length}
              </span>
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">Sample product</p>
          <p className="label mt-5 text-muted">Size</p>
          <div className="mt-2 flex gap-2" role="group" aria-label="Size">
            {sizes.map((option) => (
              <DemoButton key={option} pressed={size === option} onClick={() => setSize(option)}>
                {option}
              </DemoButton>
            ))}
          </div>
          <button
            type="button"
            disabled={!size}
            onClick={() => size && setCart((items) => [...items, size])}
            className="caps mt-auto min-h-11 bg-ink px-4 text-paper transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Add to cart
          </button>
        </div>
      </div>
    </Stage>
  );
}

function ApiDemo() {
  const [response, setResponse] = useState<{ status: string; body: string } | "pending" | null>(null);
  const timers = useTimers();
  const request = (valid: boolean) => ({
    name: "Ada",
    email: valid ? "ada@example.com" : "not-an-email",
    message: "Hello there, about a project.",
  });
  const format = (value: object) => JSON.stringify(value, null, 2);
  const [body, setBody] = useState(format(request(true)));

  function send(valid: boolean) {
    timers.clear();
    const input = request(valid);
    setBody(format(input));

    // Same validation as the contact form: invalid input never leaves the browser.
    const result = validateContact(input);
    if (!result.valid) {
      setResponse({ status: "Not sent · blocked by validation", body: format({ errors: result.errors }) });
      return;
    }

    setResponse("pending");
    timers.later(
      () => setResponse({ status: "200 OK", body: '{\n  "success": true,\n  "message": "Email sent successfully!"\n}' }),
      450,
    );
  }

  return (
    <Stage
      caption="Simulated in the browser; mirrors this site’s Web3Forms contact form"
      controls={
        <>
          <DemoButton onClick={() => send(true)}>Send valid</DemoButton>
          <DemoButton onClick={() => send(false)}>Send invalid</DemoButton>
        </>
      }
    >
      <div className="grid h-full grid-cols-2 gap-4 font-mono text-[0.6875rem] leading-relaxed">
        <div className="min-w-0">
          <p className="text-muted">POST api.web3forms.com/submit</p>
          <pre className="mt-2 overflow-hidden whitespace-pre-wrap break-all">{body}</pre>
        </div>
        <div className="min-w-0 border-l border-line pl-4" aria-live="polite">
          <p className="text-muted">Response</p>
          {response === "pending" && <p className="mt-2 animate-pulse motion-reduce:animate-none">Waiting…</p>}
          {response && response !== "pending" && (
            <div key={response.status} className="swap-in mt-2">
              <p className="font-medium">{response.status}</p>
              <pre className="mt-1 whitespace-pre-wrap">{response.body}</pre>
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
}

function PerformanceDemo() {
  const [run, setRun] = useState(0);
  const steps = [
    { name: "Request", start: 0, width: 12 },
    { name: "Render on the server", start: 12, width: 30 },
    { name: "Stream HTML", start: 30, width: 34 },
    { name: "Load JS for interactive parts", start: 58, width: 26 },
    { name: "Interactive", start: 84, width: 16 },
  ];
  return (
    <Stage
      caption="Illustrative order of events, not a measurement"
      controls={<DemoButton onClick={() => setRun((value) => value + 1)}>Replay</DemoButton>}
    >
      <ol key={run} className="flex h-full flex-col justify-center gap-3">
        {steps.map((step, index) => (
          <li key={step.name} className="grid grid-cols-[minmax(0,11rem)_1fr] items-center gap-3">
            <span className="truncate text-[0.8125rem]">{step.name}</span>
            <span className="relative h-2.5 bg-ink/[0.06]">
              <span
                className="fill-x absolute inset-y-0 bg-ink"
                style={vars({ left: `${step.start}%`, width: `${step.width}%`, "--delay": `${index * 220}ms` })}
              />
            </span>
          </li>
        ))}
      </ol>
    </Stage>
  );
}

const demos: Record<CapabilityId, () => ReactNode> = {
  frontend: FrontendDemo,
  fullstack: FullStackDemo,
  webapp: WebAppDemo,
  ecommerce: EcommerceDemo,
  api: ApiDemo,
  performance: PerformanceDemo,
};

export function CapabilityDemo({ id }: { id: CapabilityId }) {
  const Demo = demos[id];
  return <Demo />;
}

export type LabDemo = "type" | "depth" | "messages";

export type LabEntry = {
  number: string;
  title: string;
  kind: "Experiment" | "Tool" | "UI Study" | "Concept" | "Project";
  status: "Working prototype" | "In progress" | "Shipped" | "Paused";
  year: string;
  description: string;
  instructions: string;
  /** Which interactive surface renders the entry. Only add entries whose demo actually works. */
  demo: LabDemo;
};

export const labEntries: LabEntry[] = [
  {
    number: "001",
    title: "Type that follows the pointer",
    kind: "Experiment",
    status: "Working prototype",
    year: "2026",
    description:
      "A variable weight study. Each letter takes its weight from its distance to the pointer, using the weight axis of the Geist typeface.",
    instructions: "Move the pointer across the word, or use the slider.",
    demo: "type",
  },
  {
    number: "002",
    title: "Interface in layers",
    kind: "UI Study",
    status: "Working prototype",
    year: "2026",
    description:
      "Four interface layers arranged in CSS 3D: page, window, card and action. Pull them apart to see how a screen is built up.",
    instructions: "Tilt the scene with the pointer and drag the depth slider.",
    demo: "depth",
  },
  {
    number: "003",
    title: "Message states",
    kind: "Concept",
    status: "Working prototype",
    year: "2026",
    description:
      "A local simulation of message states: sending, delivered and read, with a typing indicator and a reply. Nothing leaves the browser; there is no realtime backend.",
    instructions: "Type a message and press Send.",
    demo: "messages",
  },
];

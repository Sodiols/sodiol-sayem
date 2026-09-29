// Editable copy for /about. Set portrait to an image path (e.g. "/about/portrait.webp") to show a photo.

export const about = {
  portrait: null as { src: string; alt: string } | null,
  biography: [
    "I’m a web developer based in Sylhet, Bangladesh. I build websites, online stores and web applications, usually taking a project from an empty repository to a live product.",
    "Most of my work runs on Next.js, TypeScript and Supabase. I like that stack because it lets one person own the whole system, the data, the server and the interface, without losing track of any of it.",
  ],
  approach: [
    {
      title: "Start from the content",
      detail: "Structure follows what people come to do. Navigation, data models and layouts are shaped around that before anything is styled.",
    },
    {
      title: "Keep the system small",
      detail: "Fewer dependencies, fewer moving parts. Server rendering by default and JavaScript only where the interface needs it.",
    },
    {
      title: "Finish the details",
      detail: "Empty states, loading states, keyboard focus, slow networks. The parts nobody notices until they are missing.",
    },
  ],
  interests: [
    "Server Components and streaming UI",
    "Postgres data modelling and row level security",
    "Typography and layout on the web",
    "Accessible interaction patterns",
    "Realtime features with WebRTC",
  ],
};

// The three layers drawn in the homepage's About model.
export const stackLayers = [
  { name: "Interface", note: "What people see and use" },
  { name: "Application", note: "Routes, logic and rules" },
  { name: "Data", note: "Records, files and access" },
];

import type { StaticImageData } from "next/image";
// Static imports fingerprint file contents, so replacing artwork invalidates
// both browser and Next image-optimizer caches without a manual version string.
import husnalogy from "../../public/projects/husnalogy.webp";
import tara from "../../public/projects/tara.webp";
import epicElites from "../../public/projects/epicelites.png";
import priChat from "../../public/projects/prichat.png";

export type Project = {
  name: string; slug: string; href: string; image: StaticImageData;
  category: "E-commerce" | "Esports" | "Web app";
  position: string; fit: "cover" | "contain";
  description: string; summary: string; disciplines: string[]; alt: string;
  overview: string; approach: string; implementation: string[]; outcome: string;
  technologies: string[]; contribution: string; context: string;
  decisions: { title: string; detail: string }[];
};

// Copy is grounded in the project sources; attribution for the Meka projects
// was confirmed by the owner. Repository URLs are deliberately not published.
export const projects: readonly Project[] = [
  {
    name: "Husnalogy", slug: "husnalogy", href: "https://husnalogy.com", image: husnalogy,
    category: "E-commerce",
    position: "50% 50%", fit: "contain",
    description: "A storefront and personalization workflow for invitations, wedding stationery and gifts, connecting product discovery to custom designs and order handling.",
    summary: "Personalized commerce, from the storefront and design editor to checkout and order handling.",
    technologies: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Konva"],
    context: "Built at Meka Agency · Sole developer",
    contribution: "I built Husnalogy as the sole developer at Meka Agency, covering the storefront, product customization, backend workflows and administration.",
    decisions: [
      { title: "Keep order totals on the server.", detail: "Checkout resolves prices, product options and delivery charges from stored data instead of accepting totals from the browser. Database transactions keep the order and its items together, while submission identifiers let retries resolve to the same order." },
      { title: "Separate a design from its order snapshot.", detail: "A product template may change after someone places an order. The order workflow captures the design inputs and associated assets so production can work from the version the customer ordered, rather than a later edit." },
      { title: "Give personalization its own interface.", detail: "A canvas-based editor supports custom product designs without turning the product page into a long form. The surrounding storefront keeps product imagery and buying choices prominent." },
    ],
    disciplines: ["Full-stack development", "Commerce UX", "Visual systems"],
    alt: "Husnalogy storefront, account sign-in, personalized invitation product page, and footer shown together.",
    overview: "A commerce website for invitations, wedding stationery and personalized gifts. The presentation gives the products and their details room to be seen.",
    approach: "Invitations need both a clear shopping flow and room for personal details. The storefront uses an editorial product presentation; the customization and order workflows handle the more involved work behind each purchase.",
    implementation: ["Product catalogue, account and cart interfaces", "Canvas-based product personalization", "Server-validated checkout and order snapshots", "Administration and production-task workflows"],
    outcome: "The project brings the customer-facing shop and the systems needed to manage personalized orders into one application.",
  },
  {
    name: "TARA", slug: "tara", href: "https://tarabd.co", image: tara,
    category: "E-commerce",
    position: "50% 50%", fit: "contain",
    description: "A fashion storefront and back office for a Sylhet clothing brand, with product discovery, variant selection and cash-on-delivery ordering.",
    summary: "A fashion storefront with variant-aware discovery, cash-on-delivery checkout and a connected back office.",
    technologies: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Zustand", "Zod"],
    context: "Built at Meka Agency · Sole developer",
    contribution: "I built TARA as the sole developer at Meka Agency, from the responsive storefront and shopping flow to the database-backed checkout, inventory and administration tools.",
    decisions: [
      { title: "Filter the catalogue before paging it.", detail: "Size, colour and stock filters run in the database before sorting and pagination. This keeps matching variants discoverable across the whole catalogue. Filters live in the URL so a customer can share a selection or return to it with the back button." },
      { title: "Place the order and update stock together.", detail: "The order function reads current prices, validates coupons, calculates delivery and locks inventory rows in one database transaction. The browser sends the shopping choices; the database determines the amounts and stock changes." },
      { title: "Keep browsing lightweight.", detail: "Server Components render catalogue content, while client-side state handles interactions such as the persisted guest cart. Fashion imagery leads the page, with navigation and product choices kept close to the buying flow." },
    ],
    disciplines: ["Full-stack development", "E-commerce", "Responsive design"],
    alt: "TARA fashion storefront, collection search, product details, and account sign-in interfaces.",
    overview: "An online store for women’s clothing and accessories in Bangladesh. Customers can browse collections, filter by available variants and place cash-on-delivery orders; the back office manages products, stock and orders.",
    approach: "The collection leads the visual design. Search, filters and product options support that presentation, while the backend keeps catalogue availability, delivery charges and order totals connected to the same store data.",
    implementation: ["Search and filtering by product variants", "Guest cart persisted between visits", "Cash-on-delivery ordering and coupon validation", "Inventory adjustments, access permissions and back-office tools"],
    outcome: "A fashion commerce application that connects product discovery, ordering and day-to-day store management.",
  },
  {
    name: "Epic Elites", slug: "epic-elites", href: "https://epicelites.vercel.app", image: epicElites,
    category: "Esports",
    position: "50% 50%", fit: "contain",
    description: "A website and content dashboard for a Free Fire esports team, bringing the roster, match schedule, results, news and media into one publishing system.",
    summary: "An esports website with team content, match schedules and a private content-management dashboard.",
    technologies: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Motion"],
    context: "Esports website & content management",
    contribution: "My development work spans the public team website and its content-management application, including the interfaces for team information, matches, news and media.",
    decisions: [
      { title: "Separate publishing from presentation.", detail: "The public site reads filtered database views; a private dashboard manages the underlying content. This lets the team update roster information, fixtures and articles without changing site code." },
      { title: "Check access at the mutation boundary.", detail: "Server-side administrator checks, input schemas and database access policies support dashboard operations. Content changes also have an activity-log workflow, making administration part of the application rather than an afterthought." },
      { title: "Make match content structured.", detail: "Schedules and results use dedicated workflows rather than free-form text. The content model accounts for match formats, event time zones and result confirmation, while the public interface retains the team's visual identity." },
    ],
    disciplines: ["Full-stack development", "Sports interface", "Content architecture"],
    alt: "Epic Elites homepage with its esports team wordmark, circular emblem and navigation.",
    overview: "The public home for Epic Elites and a private application for managing its content. Team information, fixtures, results, articles and media have dedicated publishing workflows.",
    approach: "The team’s emblem and typography carry the public identity. Behind those pages, structured content and publishing controls let the team maintain a consistent site as players, fixtures and news change.",
    implementation: ["Team roster, player profiles and media", "Match scheduling and results workflows", "News drafting, scheduling and publishing", "Private dashboard, administrator permissions and activity log"],
    outcome: "A distinct team website backed by tools for keeping its roster, fixtures, news and media up to date.",
  },
  {
    name: "PriChat", slug: "prichat", href: "https://prichat-ebf5.vercel.app", image: priChat,
    category: "Web app",
    position: "50% 50%", fit: "contain",
    description: "A room-based communication application with live messages, membership controls, voice recordings and browser-based calls.",
    summary: "Room-based chat with live messages, membership controls and browser-based voice and video features.",
    technologies: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "WebRTC"],
    context: "Real-time communication application",
    contribution: "My development work covers the room-based application interface and its Supabase integration: authentication, live messages, membership controls and browser media features.",
    decisions: [
      { title: "Treat membership as a data rule.", detail: "Public, passcode and approval-based rooms use different joining flows. Database functions and row-level policies check room membership instead of relying on a hidden button or a client-only route guard." },
      { title: "Update the conversation in place.", detail: "Supabase Realtime delivers database changes to the chat interface so conversations update without a page refresh. A collapsible sidebar keeps room navigation available on smaller screens." },
      { title: "Use browser media APIs for richer conversations.", detail: "Voice recordings are uploaded through Supabase Storage, while calls use WebRTC with database-backed signaling. These are separate parts of the implementation, with different permissions and connection lifecycles from text messaging." },
    ],
    disciplines: ["Full-stack development", "Real-time UX", "Application UI"],
    alt: "PriChat room creation, chat room, mobile interface, and sign-in screen.",
    overview: "A chat application built around rooms and their members. Authentication, live messages and room administration share a Supabase backend, with voice messages and calling interfaces using browser media APIs.",
    approach: "Room navigation and the active conversation form the main interface. Membership rules sit behind that interface in the database, while a collapsible sidebar makes the same room-based model usable on mobile.",
    implementation: ["Email/password and Google authentication", "Real-time room messages, editing and deletion", "Passcode and approval-based room membership", "Voice messages, presence and WebRTC calling interfaces"],
    outcome: "A room-based communication application bringing authentication, membership, live messages and browser media into one focused interface.",
  },
];

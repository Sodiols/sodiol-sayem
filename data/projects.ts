// Case study copy describes what is visible on each live site. Technologies are
// limited to what was confirmed from the production builds. Replace freely.

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  statement: string;
  year?: string;
  url?: string;
  role: string;
  services: string[];
  technologies: string[];
  /** Layers of the architecture diagram, top to bottom. */
  architecture: string[][];
  caseStudy: {
    overview: string;
    challenge: string;
    approach: string;
    development: string;
    features: string[];
    result: string;
    /** Gallery images (by src) shown beside a section. Sections without one render as text. */
    visuals?: Partial<Record<"challenge" | "approach" | "features", string>>;
  };
  menuImage: string;
  heroImage: ProjectImage;
  gallery: ProjectImage[];
};

export const projects: Project[] = [
  {
    slug: "husnalogy",
    number: "01",
    title: "Husnalogy",
    category: "Custom Commerce Platform",
    summary: "A commerce platform for personalised cards, gifts and stationery.",
    statement: "A customisable commerce experience built for personalised products.",
    year: "2026",
    url: "https://husnalogy.com",
    role: "Full Stack Developer",
    services: ["Development", "Architecture", "UX"],
    technologies: ["Next.js", "React", "Supabase", "Tailwind CSS"],
    architecture: [
      ["Browser"],
      ["Next.js"],
      ["Catalogue", "Personalisation", "Cart & Accounts"],
      ["Supabase"],
    ],
    caseStudy: {
      overview:
        "Husnalogy sells wedding invitations, cards, gifts and stationery that customers personalise with their own names and details. The store is organised around occasions and collections rather than a flat product list.",
      challenge:
        "Personalised products carry more decisions than ordinary ones. The site had to present a wide catalogue, from single mugs to full wedding suites, while keeping each path to purchase short and easy to follow.",
      approach:
        "Navigation follows how people shop for a moment: weddings, gifts, personalisations and invitations. Collections such as the wedding suite group related pieces so a customer can take one item or the whole set.",
      development:
        "The storefront is built with Next.js on top of Supabase, which holds the catalogue data and product media. Search, collections, wishlist and cart share one data model so products behave the same wherever they appear.",
      features: [
        "Search across products, collections and gifts",
        "Occasion-led navigation and curated collections",
        "Product personalisation with customer details",
        "Wishlist, cart and customer accounts",
        "Grouped suites sold as individual pieces or sets",
      ],
      result:
        "Husnalogy is live at husnalogy.com, trading with a catalogue that can grow by collection without changes to the structure of the site.",
      visuals: {
        challenge: "/projects/husnalogy/hero.webp",
        approach: "/projects/husnalogy/01.webp",
      },
    },
    menuImage: "/projects/husnalogy/menu.webp",
    heroImage: {
      src: "/projects/husnalogy/cover.webp",
      alt: "Husnalogy shown across its homepage, sign in, product page and footer",
      width: 1447,
      height: 1087,
    },
    gallery: [
      {
        src: "/projects/husnalogy/hero.webp",
        alt: "Husnalogy homepage showing the Wedding Suite collection",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/husnalogy/01.webp",
        alt: "Husnalogy gifting ideas grid with personalised mugs, gift boxes and accessories",
        width: 1600,
        height: 560,
      },
      {
        src: "/projects/husnalogy/02.webp",
        alt: "Husnalogy brand story section explaining the studio",
        width: 1600,
        height: 700,
      },
      {
        src: "/projects/husnalogy/mobile.webp",
        alt: "Husnalogy homepage on a mobile screen",
        width: 780,
        height: 1688,
      },
    ],
  },
  {
    slug: "tara",
    number: "02",
    title: "TARA",
    category: "Fashion Ecommerce",
    summary: "An online store for a women's fashion label in Bangladesh.",
    statement: "A calm storefront for everyday women's fashion in Bangladesh.",
    year: "2026",
    url: "https://tarabd.co",
    role: "Full Stack Developer",
    services: ["Development", "Architecture", "Ecommerce"],
    technologies: ["Next.js", "React", "Supabase"],
    architecture: [
      ["Browser"],
      ["Next.js"],
      ["Catalogue", "Variants & Sizes", "Cart & Accounts"],
      ["Supabase"],
    ],
    caseStudy: {
      overview:
        "TARA is a women's clothing label from Sylhet selling three piece and two piece sets, hijabs and accessories. The store is the brand's main place to present and sell its collections.",
      challenge:
        "Clothing depends on imagery, sizing and variants. Customers need to see the garment, choose a size or colour and reach the cart without friction, mostly on their phones.",
      approach:
        "Categories map directly to how the range is made: unready three piece, ready three piece, two piece and hijab. Product cards carry size and colour selection so shoppers can add to cart straight from a listing.",
      development:
        "Built with Next.js and Supabase. Product data, variants and sale pricing come from the database, so the team updates the range without touching code. Prices are shown in taka with delivery rules for local customers.",
      features: [
        "Category browsing that mirrors the product range",
        "Size and colour variants on product cards",
        "Sale pricing and add to cart from listings",
        "Search across the full catalogue",
        "Customer accounts and cart",
      ],
      result:
        "TARA is live at tarabd.co and serves as the label's storefront for customers across Bangladesh.",
      visuals: {
        challenge: "/projects/tara/hero.webp",
        approach: "/projects/tara/01.webp",
      },
    },
    menuImage: "/projects/tara/menu.webp",
    heroImage: {
      src: "/projects/tara/cover.webp",
      alt: "TARA storefront shown across its homepage, search, product page and sign in",
      width: 1448,
      height: 1086,
    },
    gallery: [
      {
        src: "/projects/tara/hero.webp",
        alt: "TARA homepage with a carousel of clothing categories",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/tara/01.webp",
        alt: "TARA best sellers section with product cards and size selection",
        width: 1600,
        height: 860,
      },
      {
        src: "/projects/tara/02.webp",
        alt: "TARA brand section titled Designed for your everyday story",
        width: 1600,
        height: 760,
      },
      {
        src: "/projects/tara/mobile.webp",
        alt: "TARA homepage on a mobile screen",
        width: 780,
        height: 1688,
      },
    ],
  },
  {
    slug: "meka",
    number: "03",
    title: "Meka Agency",
    category: "Agency Website",
    summary: "A website for a digital agency offering social media, design and web services.",
    statement: "A clear, editable home for a growing digital agency.",
    year: "2026",
    url: "https://meka.agency",
    role: "Web Developer",
    services: ["Development", "Content structure"],
    technologies: ["WordPress", "Elementor", "PHP"],
    architecture: [["Browser"], ["WordPress"], ["Pages", "Services", "Contact"], ["Elementor", "PHP"]],
    caseStudy: {
      overview:
        "Meka is an agency that manages social media, designs visuals and builds websites for brands. The site introduces the agency and turns visitors into booked meetings or calls.",
      challenge:
        "The agency needed a site its own team could update as services and messaging change, without depending on a developer for every edit.",
      approach:
        "A short, direct structure: home, about, services and contact, with two clear actions throughout, book a meeting or call now.",
      development:
        "Built on WordPress with Elementor so pages stay editable by the team. The theme and layouts were set up to keep headings, spacing and calls to action consistent across pages.",
      features: [
        "Editable pages through WordPress and Elementor",
        "Services overview",
        "Meeting booking and call actions",
        "Consistent layout system across pages",
      ],
      result: "Meka's site is live at meka.agency and maintained by the agency.",
      visuals: {
        approach: "/projects/meka/hero.webp",
      },
    },
    menuImage: "/projects/meka/menu.webp",
    heroImage: {
      src: "/projects/meka/cover.webp",
      alt: "Meka Agency website shown with its homepage, consultation form, portfolio and contact details",
      width: 1448,
      height: 1086,
    },
    gallery: [
      {
        src: "/projects/meka/hero.webp",
        alt: "Meka Agency homepage hero with the headline about digital presence",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/meka/mobile.webp",
        alt: "Meka Agency homepage on a mobile screen",
        width: 780,
        height: 1688,
      },
    ],
  },
  {
    slug: "prichat",
    number: "04",
    title: "PriChat",
    category: "Realtime Chat Application",
    summary: "A realtime messaging app with voice messages and calls.",
    statement: "Private conversations, voice notes and calls in the browser.",
    year: "2026",
    url: "https://prichat-ebf5.vercel.app/login",
    role: "Full Stack Developer",
    services: ["Development", "Realtime systems"],
    technologies: ["Next.js", "Firebase", "WebRTC"],
    architecture: [["Browser"], ["Next.js"], ["Auth", "Messages", "Voice & Calls"], ["Firebase", "WebRTC"]],
    caseStudy: {
      overview:
        "PriChat is a web chat application with persistent sign in, realtime messaging, recorded voice messages and browser calls.",
      challenge:
        "Realtime features fail in small, visible ways: a dropped session, a message out of order, a call that never connects. Each one had to be reliable across reloads and unstable connections.",
      approach:
        "Authentication and session state sit at the base, so every conversation, recording and call starts from a known user. Messaging and calls are separate flows that share the same identity.",
      development:
        "Built with Next.js. Firebase handles authentication and realtime data, while calls connect directly between browsers over WebRTC with signalling passed through the app.",
      features: [
        "Persistent authentication across sessions",
        "Realtime one to one messaging",
        "Recorded voice messages",
        "Browser to browser calls over WebRTC",
      ],
      result: "PriChat is live at prichat-ebf5.vercel.app.",
    },
    menuImage: "/projects/prichat/menu.webp",
    heroImage: {
      src: "/projects/prichat/cover.webp",
      alt: "PriChat shown across its chat rooms on desktop and tablet, the new room dialog and the sign in screen",
      width: 1448,
      height: 1086,
    },
    gallery: [
      {
        src: "/projects/prichat/hero.webp",
        alt: "PriChat sign in screen with email, password and Google sign in",
        width: 1600,
        height: 1000,
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

export const projectCount = String(projects.length).padStart(2, "0");

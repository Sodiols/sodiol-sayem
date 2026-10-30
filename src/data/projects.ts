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
};

// Descriptions and disciplines come from the supplied Selected Work source.
// Notes describe that documented scope and artwork, without attributing an
// unverified technology stack, backend features, metrics, or client results.
export const projects: readonly Project[] = [
  {
    name: "Husnalogy", slug: "husnalogy", href: "https://husnalogy.com", image: husnalogy,
    category: "E-commerce",
    position: "50% 50%", fit: "contain",
    description: "An editorial shopping experience for invitations, wedding stationery and personalized gifts, where the details are as considered as the occasion.",
    summary: "An editorial shopping experience for invitations, wedding stationery and personalized gifts.",
    disciplines: ["Full-stack development", "Commerce UX", "Visual systems"],
    alt: "Husnalogy storefront, account sign-in, personalized invitation product page, and footer shown together.",
    overview: "A commerce website for invitations, wedding stationery and personalized gifts. The presentation gives the products and their details room to be seen.",
    approach: "The project pairs a shopping experience with an editorial visual system. Botanical artwork, considered product imagery and a restrained presentation reflect the personal nature of the products.",
    implementation: ["Commerce website", "Invitation and stationery presentation", "Personalized gift shopping experience"],
    outcome: "A shopping destination bringing invitations, stationery and personalized gifts into one editorial commerce experience.",
  },
  {
    name: "TARA", slug: "tara", href: "https://tarabd.co", image: tara,
    category: "E-commerce",
    position: "50% 50%", fit: "contain",
    description: "A fashion-led shopping destination with an understated, editorial presentation and a focus on easy everyday discovery.",
    summary: "A fashion-led shopping destination with an understated editorial presentation.",
    disciplines: ["Full-stack development", "E-commerce", "Responsive design"],
    alt: "TARA fashion storefront, collection search, product details, and account sign-in interfaces.",
    overview: "An online fashion shopping destination. The website brings an editorial approach to discovering clothing, with the collection as the central visual focus.",
    approach: "Fashion imagery carries the identity. An understated presentation supports everyday discovery, while responsive design is part of the documented project scope.",
    implementation: ["Fashion e-commerce", "Editorial collection presentation", "Responsive website design"],
    outcome: "A fashion shopping website centered on clothing, imagery and an easy everyday discovery experience.",
  },
  {
    name: "Epic Elites", slug: "epic-elites", href: "https://epicelites.vercel.app", image: epicElites,
    category: "Esports",
    position: "50% 50%", fit: "contain",
    description: "An energetic esports platform that translates the identity of a team into a complete online experience.",
    summary: "An esports platform built around a team’s identity and online presence.",
    disciplines: ["Full-stack development", "Sports interface", "Content architecture"],
    alt: "Epic Elites esports website with its team identity and a tactical game character.",
    overview: "An esports website that carries a team’s identity into its online presence. The project combines a sports-focused interface with a considered content structure.",
    approach: "The visual direction follows the energy of esports. Team identity and content architecture form the basis of the presentation, rather than a generic corporate website structure.",
    implementation: ["Esports website", "Team identity presentation", "Sports interface and content architecture"],
    outcome: "An online experience giving the esports team a distinct home for its identity and content.",
  },
  {
    name: "PriChat", slug: "prichat", href: "https://prichat-ebf5.vercel.app", image: priChat,
    category: "Web app",
    position: "50% 50%", fit: "contain",
    description: "A lightweight communication product that puts connection and immediacy before unnecessary interface complexity.",
    summary: "A lightweight communication product focused on connection and immediacy.",
    disciplines: ["Full-stack development", "Real-time UX", "Application UI"],
    alt: "PriChat room creation, chat room, mobile interface, and sign-in screen.",
    overview: "A communication platform with a lightweight application interface. The supplied project preview presents real-time private chat rooms as its central experience.",
    approach: "The interface keeps the focus on communication. Real-time UX and application UI are the documented disciplines, with a visual presentation that avoids unnecessary complexity.",
    implementation: ["Communication application", "Real-time private chat room experience", "Application interface design"],
    outcome: "A communication product organized around private rooms, connection and a direct application experience.",
  },
];

import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.longRole}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#f5f5f2",
    theme_color: "#f5f5f2",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

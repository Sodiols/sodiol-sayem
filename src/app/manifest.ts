import type { MetadataRoute } from "next";
import { site } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title, short_name: site.name, description: site.description, start_url: "/", display: "standalone",
    background_color: "#e5e8ce", theme_color: "#e5e8ce",
    icons: [{ src: "/icon.png", sizes: "192x192", type: "image/png" }, { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  };
}

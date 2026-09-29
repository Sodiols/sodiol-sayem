import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { heroStack } from "@/data/technologies";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const label = { fontSize: 18, letterSpacing: 1, textTransform: "uppercase" } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          background: "#f5f5f2",
          color: "#111111",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", ...label }}>
          <span>{site.role}</span>
          <span style={{ color: "#6f6f6a" }}>{site.country}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 184,
              lineHeight: 0.84,
              letterSpacing: -9,
              textTransform: "uppercase",
            }}
          >
            <span>{site.firstName}</span>
            <span>{site.lastName}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", ...label }}>
            {heroStack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

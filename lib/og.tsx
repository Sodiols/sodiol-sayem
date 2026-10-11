import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { ogSize } from "@/lib/share-images";

const paper = "#f4f2e9";
const ink = "#171815";
const accent = "#e7fd46";
const stop = "#b2c000";

export type OgOptions = {
  /** Small mono label after "SODIOL /" in the top row. */
  section: string;
  /** Headline lines, rendered in Archivo Black. */
  title: string[];
  subtitle: string;
  /** Text in the accent box, bottom right. */
  tag: string;
  /** Optional project panel shown on the right, in the project's own colors. */
  panel?: { background: string; foreground: string; label: string };
};

async function loadFonts() {
  const dir = join(process.cwd(), "assets/fonts");
  const [black, bold, mono] = await Promise.all([
    readFile(join(dir, "archivo-latin-900-normal.woff")),
    readFile(join(dir, "archivo-latin-700-normal.woff")),
    readFile(join(dir, "geist-mono-latin-700-normal.woff")),
  ]);
  return [
    { name: "Archivo", data: black, weight: 900 as const, style: "normal" as const },
    { name: "Archivo", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 700 as const, style: "normal" as const },
  ];
}

/** Picks a headline size so the block fits the available width and the ~320px tall middle band. */
function titleSize(lines: string[], width: number, max: number) {
  // Archivo Black capitals average ~0.74em; the extra half character leaves room for the closing stop.
  const longest = Math.max(...lines.map((line) => line.length)) + 0.5;
  const byWidth = width / (longest * 0.74);
  const byHeight = 320 / (lines.length * 0.98);
  return Math.floor(Math.min(max, byWidth, byHeight));
}

export async function renderOgImage({ section, title, subtitle, tag, panel }: OgOptions) {
  const fonts = await loadFonts();
  const titleWidth = panel ? 640 : 1080;
  const size = titleSize(title, titleWidth, panel ? 120 : 176);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: paper,
          color: ink,
          fontFamily: "Archivo",
        }}
      >
        <div style={{ height: 18, background: ink, display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "34px 60px 52px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 22,
              borderBottom: `4px solid ${ink}`,
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 16, height: 16, background: ink, display: "flex" }} />
              <span>SODIOL / {section}</span>
            </div>
            <span>CREATIVE DEVELOPER</span>
          </div>

          <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              {title.map((line, index) => (
                <div
                  key={line}
                  style={{
                    display: "flex",
                    fontSize: size,
                    fontWeight: 900,
                    lineHeight: 0.92,
                    letterSpacing: -size * 0.02,
                  }}
                >
                  {line}
                  {index === title.length - 1 && !/[.?!]$/.test(line) && <span style={{ color: stop }}>.</span>}
                </div>
              ))}
            </div>
            {panel && (
              <div
                style={{
                  width: 360,
                  height: 300,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: 26,
                  background: panel.background,
                  color: panel.foreground,
                  border: `4px solid ${ink}`,
                  boxShadow: `10px 10px 0 ${ink}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 40,
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: -1.5,
                  }}
                >
                  {panel.label}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 40,
              paddingTop: 26,
              borderTop: `4px solid ${ink}`,
            }}
          >
            <div
              style={{
                display: "flex",
                maxWidth: 760,
                fontSize: 34,
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: -0.8,
              }}
            >
              {subtitle}
            </div>
            <div
              style={{
                display: "flex",
                flexShrink: 0,
                padding: "16px 22px",
                background: accent,
                border: `4px solid ${ink}`,
                fontFamily: "Geist Mono",
                fontSize: 20,
                letterSpacing: 1.5,
              }}
            >
              {tag}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}

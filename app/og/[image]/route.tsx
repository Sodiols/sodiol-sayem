import { renderOgImage } from "@/lib/og";
import { shareImages } from "@/lib/share-images";

// Prerendered at build time. The .png extension keeps these URLs out of the trailingSlash redirect,
// so crawlers fetch the image directly instead of following a 308.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(shareImages).map((id) => ({ image: `${id}.png` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params;
  const options = shareImages[image.replace(/\.png$/, "")];
  if (!options) return new Response("Not found", { status: 404 });
  return renderOgImage(options);
}

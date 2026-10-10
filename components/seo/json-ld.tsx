type JsonLdProps = {
  /** Schema.org nodes combined into a single @graph. */
  graph: Record<string, unknown>[];
};

export function JsonLd({ graph }: JsonLdProps) {
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

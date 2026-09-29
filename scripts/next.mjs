// Raises Node's 16 KB request header limit so oversized localhost cookies
// (left behind by other projects) don't cause HTTP 431. `next dev` serves from
// a child process that only inherits NODE_OPTIONS, hence the env variable.
process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS ?? ""} --max-http-header-size=65536`.trim();

await import("next/dist/bin/next");

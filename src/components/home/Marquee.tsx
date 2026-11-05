// A slow band of the name between the toolkit and the letter: the page takes a breath before contact.
const phrase = ["Let’s build something", "Sodiol Sayem", "Full-stack developer", "Sylhet, Bangladesh"];

export function Marquee() {
  const run = <span className="marquee-run">{phrase.map(part => <span key={part}>{part}<i aria-hidden="true">✳</i></span>)}</span>;
  return <div className="marquee" aria-hidden="true"><div className="marquee-track">{run}{run}</div></div>;
}

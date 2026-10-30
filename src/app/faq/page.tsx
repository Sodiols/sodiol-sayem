import Link from "next/link";
import { EditorialPage } from "@/components/pages/EditorialPage";
import { pageMetadata } from "@/lib/metadata";
import styles from "@/components/pages/EditorialPage.module.css";
export const metadata = pageMetadata("/faq");
const questions = [
  ["What kind of projects do you work on?", "Websites, web applications and user-facing digital experiences. My selected work includes commerce, fashion, esports and communication projects."],
  ["Do you handle both frontend and backend development?", "I’m a full stack developer. My project work spans interfaces and application functionality. We can discuss which parts of your project need support and agree on a clear scope."],
  ["What was your role on Husnalogy and TARA?", "I built both projects as the sole developer at Meka Agency, where I have worked as a Senior Developer since July 2026. My work covered the storefronts and their application functionality."],
  ["What technologies do you use?", "My core web stack is TypeScript, React, Next.js, Tailwind CSS, Supabase and PostgreSQL. I choose the supporting tools around the application’s requirements; each case study lists the technologies used."],
  ["Can you work on an existing website?", "We can discuss improvements, a redesign or additional features. A look at the existing site and its code helps establish what is practical."],
  ["Can you build a website from an idea?", "An inquiry can start with an idea. We can discuss requirements, define a scope, then plan the design and development work."],
  ["How can I contact you about a project?", null],
  ["How long does a website project take?", "It depends on the scope, complexity, content and integrations. A useful timeline comes after discussing those requirements, rather than a fixed promise upfront."],
] as const;
export default function FAQ() {
  return <EditorialPage label="FAQ / THE DETAILS" title="A few good questions." description="Some things worth knowing before we get started."><div className={styles.faq}>{questions.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer || <>Use the <Link href="/#contact">homepage contact form</Link> to share a little about what you have in mind.</>}</p></details>)}</div></EditorialPage>;
}

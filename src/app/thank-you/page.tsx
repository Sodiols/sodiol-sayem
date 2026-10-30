import { ThankYou } from "@/components/pages/ThankYou";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { pageMetadata } from "@/lib/metadata";
export const metadata=pageMetadata("/thank-you");
export default function ThankYouPage() { return <><ThankYou /><SiteFooter /></>; }

import { InquiryPage } from "@/components/sections/inquiry-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Contact",
  "Send PraedicoAI a project inquiry through the website contact form.",
  "/contact",
);
export default function ContactPage() {
  return <InquiryPage kind="contact" />;
}

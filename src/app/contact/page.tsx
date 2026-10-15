import { InquiryPage } from "@/components/sections/inquiry-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Contact",
  "Start a conversation with a browser-prepared email inquiry. No automatic delivery or storage.",
  "/contact",
);
export default function ContactPage() {
  return <InquiryPage kind="contact" />;
}

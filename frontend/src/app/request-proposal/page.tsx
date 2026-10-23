import { InquiryPage } from "@/components/sections/inquiry-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Request a Proposal",
  "Prepare a project proposal request in your own email application.",
  "/request-proposal",
);
export default function ProposalPage() {
  return <InquiryPage kind="proposal" />;
}

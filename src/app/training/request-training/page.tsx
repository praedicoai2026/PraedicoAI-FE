import { InquiryPage } from "@/components/sections/inquiry-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Request Training",
  "Prepare a learning request describing your audience, topic, format, and goals.",
  "/training/request-training",
);
export default function TrainingRequestPage() {
  return <InquiryPage kind="training" />;
}

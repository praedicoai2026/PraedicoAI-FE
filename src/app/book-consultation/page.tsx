import { InquiryPage } from "@/components/sections/inquiry-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Request a Consultation",
  "Discuss a technology challenge. Consultation requests do not confirm dates or bookings.",
  "/book-consultation",
);
export default function ConsultationPage() {
  return <InquiryPage kind="consultation" />;
}

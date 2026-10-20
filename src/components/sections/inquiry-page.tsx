import Link from "next/link";
import type { FormKind } from "@/types/contact";
import { formDefinitions } from "@/data/forms";
import { faqs } from "@/data/faqs";
import { PageHero, ContactAside } from "./shared";
import { Section, SectionHeader, FAQList } from "@/components/ui/primitives";
import {
  ContactForm,
  ProposalForm,
  ConsultationForm,
} from "@/components/forms/inquiry-form";
import { SocialLinks } from "@/components/layout/footer";
const forms = {
  contact: ContactForm,
  proposal: ProposalForm,
  consultation: ConsultationForm,
};
export function InquiryPage({ kind }: { kind: FormKind }) {
  const definition = formDefinitions[kind];
  const Form = forms[kind];
  return (
    <>
      <PageHero
        title={definition.title}
        description={definition.description}
        eyebrow={definition.subjectPrefix}
        path={definition.path}
      />
      <Section>
        <div className="form-layout">
          <div>
            <ContactAside />
            <SocialLinks />
            <nav className="grid gap-3 mt-7" aria-label="Other inquiry options">
              <Link href="/request-proposal" className="text-link">
                Request a proposal
              </Link>
              <Link href="/book-consultation" className="text-link">
                Request a consultation
              </Link>
            </nav>
          </div>
          <Form />
        </div>
      </Section>
      <Section className="section-tinted">
        <SectionHeader title="Before you send" />
        <FAQList items={[faqs[3], faqs[0], faqs[6]]} />
        <p className="muted text-sm mt-7">
          {kind === "contact"
            ? "Contact details are sent through the configured email service when you submit. Other inquiry forms prepare an email in your email application. See the "
            : "This form is processed in your browser. Your email application handles the information after you choose to open or send an email. See the "}
          <Link className="text-link" href="/privacy">
            privacy notice
          </Link>
          .
        </p>
      </Section>
    </>
  );
}

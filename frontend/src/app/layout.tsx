import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/navigation/header";
import { Footer, PreFooterCTA } from "@/components/layout/footer";
import { SiteChrome } from "@/components/layout/site-chrome";
import { SiteStructuredData } from "@/components/seo/site-structured-data";
import { site } from "@/data/site";
import "./globals.css";
import "./experience.css";
import "./lead-enquiry.css";

const manrope = localFont({
  src: "../../public/fonts/Manrope-Variable.ttf",
  display: "swap",
  variable: "--font-manrope",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "AI Solutions Company & Practical AI Learning | PraedicoAI",
    template: `%s | PraedicoAI`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI Solutions Company & Practical AI Learning | PraedicoAI",
    description: site.description,
    url: "/",
    siteName: "PraedicoAI",
    images: [
      {
        url: "/images/og/cover.png",
        width: 1200,
        height: 720,
        alt: "Abstract layered shapes representing AI systems",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Solutions Company & Practical AI Learning | PraedicoAI",
    description: site.description,
    images: ["/images/og/cover.png"],
  },
  icons: {
    icon: "/images/PAI.png",
    apple: "/images/PAI.png",
  },
  robots: { index: site.canonicalUrlConfigured, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SiteStructuredData />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pg-theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}})()`,
          }}
        />
      </head>
      <body className={manrope.variable} id="top">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteChrome
          header={<Header />}
          footer={
            <>
              <PreFooterCTA />
              <Footer />
            </>
          }
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}

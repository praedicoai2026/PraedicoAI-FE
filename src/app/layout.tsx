import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/navigation/header";
import { Footer, PreFooterCTA } from "@/components/layout/footer";
import { site } from "@/data/site";
import "./globals.css";
import "./experience.css";

const manrope = localFont({
  src: "../../public/fonts/Manrope-Variable.ttf",
  display: "swap",
  variable: "--font-manrope",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.title}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} | ${site.title}`,
    description: site.description,
    images: [
      {
        url: "/images/og/cover.png",
        width: 1200,
        height: 720,
        alt: "Abstract layered architecture",
      },
    ],
    type: "website",
  },
  icons: { icon: "/images/logo/mark.png" },
  robots: { index: false, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <PreFooterCTA />
        <Footer />
      </body>
    </html>
  );
}

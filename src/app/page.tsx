import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shell/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { WhyRaxin } from "@/components/sections/WhyRaxin";
import { Expertise } from "@/components/sections/Expertise";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import site from "@/data/site.json";
import faqData from "@/data/faq.json";
import type { FaqItem, SiteConfig } from "@/types";
import {
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";

const data = site as SiteConfig;
const faq = faqData as FaqItem[];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationJsonLd(data),
      buildWebSiteJsonLd(data),
      ...data.team.map((member) => buildPersonJsonLd(member)),
      buildFaqJsonLd(faq),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />
      <Header />
      <main id="main">
        <Hero />
        <WhyRaxin />
        <Expertise />
        <Work />
        <Process />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

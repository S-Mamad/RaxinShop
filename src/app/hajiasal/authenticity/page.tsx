import type { Metadata } from "next";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { TrustPageLayout } from "@asal/components/layout/TrustPageLayout";
import { hajiasalPath } from "@asal/lib/paths";

const siteData = site as SiteConfig;
const content = siteData.trustPages!.authenticity;

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: hajiasalPath("/authenticity") },
};

export default function AuthenticityPage() {
  return <TrustPageLayout content={content} />;
}

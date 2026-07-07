import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import type { TrustPageContent } from "@asal/types";

interface TrustPageLayoutProps {
  content: TrustPageContent;
}

export function TrustPageLayout({ content }: TrustPageLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 md:px-6 md:py-32">
      <Reveal>
        <SectionHeading title={content.title} subtitle={content.intro} className="mb-10" />
      </Reveal>
      <div className="flex flex-col gap-8">
        {content.sections.map((section, i) => (
          <Reveal key={section.heading} delay={i * 0.08}>
            <article className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-3 text-lg font-semibold text-brown">{section.heading}</h2>
              <p className="text-base leading-relaxed text-muted">{section.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

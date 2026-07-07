import processData from "@/data/process.json";
import type { ProcessStep } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = processData as ProcessStep[];
const persianIndex = ["۰۱", "۰۲", "۰۳", "۰۴", "۰۵"];

export function Process() {
  return (
    <section id="process" className="border-b border-border py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-16">
          <SectionHeading
            index="03"
            eyebrow="فرآیند"
            title="چطور همکاری می‌کنیم"
            description="از جلسه اول تا لانچ. شفاف و مرحله‌به‌مرحله."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.id} delay={index * 0.04}>
              <article className="flex h-full flex-col border border-border p-6">
                <span className="label-mono text-dim">{persianIndex[index]}</span>
                <h3 className="mt-3 font-display text-lg text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-[1.85] text-muted">
                  {step.description}
                </p>
                {step.duration ? (
                  <p className="label-mono mt-4 text-dim">{step.duration}</p>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

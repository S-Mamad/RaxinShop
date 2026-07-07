"use client";

import processData from "@/data/process.json";
import type { ProcessStep } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = processData as ProcessStep[];

export function Process() {
  return (
    <section id="process" className="border-b border-border bg-surface/30 py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-16">
          <SectionHeading
            index="03"
            eyebrow="فرآیند"
            title="چطور همکاری می‌کنیم"
            description="از brief تا لانچ. شفاف، مرحله‌به‌مرحله."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-5">
          {steps.map((step, index) => (
            <Reveal key={step.id} delay={index * 0.05}>
              <article className="bezel h-full">
                <div className="bezel-inner flex h-full flex-col p-6">
                  <span className="telemetry text-dim">0{index + 1}</span>
                  <h3 className="mt-3 font-display text-lg text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-[1.85] text-muted">
                    {step.description}
                  </p>
                  {step.duration ? (
                    <p className="telemetry mt-4 text-dim">{step.duration}</p>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

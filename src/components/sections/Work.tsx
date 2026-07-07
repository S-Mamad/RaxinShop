"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import projects from "@/data/projects.json";
import type { ProjectItem } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const projectData = projects as ProjectItem[];

export function Work() {
  const project = projectData[0];

  if (!project) return null;

  const isExternal = project.href.startsWith("http");

  return (
    <section id="work" className="border-y border-border py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-12">
          <SectionHeading
            index="02"
            eyebrow="کارها"
            title="نمونه‌کار"
            description="پروژه‌های واقعی. فعلاً با حاجی عسل."
          />
        </Reveal>

        <Reveal delay={0.06}>
          <Link
            href={project.href}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group bezel block overflow-hidden transition-all duration-500 hover:ring-1 hover:ring-accent/20"
          >
            <div className="bezel-inner relative flex min-h-[300px] flex-col justify-end md:min-h-[380px]">
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.015]"
                style={{
                  background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/20" />
              <div className="relative flex flex-col justify-between gap-6 p-8 md:flex-row md:items-end md:p-10">
                <div className="max-w-lg">
                  <span dir="ltr" className="telemetry text-white/70">
                    {project.tag} · deploy
                  </span>
                  <h3 className="mt-4 font-display text-3xl text-white md:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-[15px]">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        dir="ltr"
                        className="border border-white/15 bg-black/20 px-2 py-0.5 font-mono text-[10px] text-white/75"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 bg-black/25 text-white transition-transform duration-500 group-hover:-translate-x-1">
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

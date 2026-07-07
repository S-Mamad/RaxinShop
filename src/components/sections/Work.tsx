"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpLeft } from "lucide-react";
import projects from "@/data/projects.json";
import type { ProjectItem } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const projectData = projects as ProjectItem[];

export function Work() {
  const project = projectData[0];

  if (!project) return null;

  return (
    <section id="work" className="border-y border-border py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="نمونه‌کار"
            title="پروژه‌های در حال ساخت"
            description="هر پروژه‌ای که تحویل می‌دهیم اینجا معرفی می‌شود. فعلاً با حاجی عسل شروع کرده‌ایم."
          />
        </Reveal>

        <Reveal delay={0.08}>
          <Link
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-panel/40 transition-all duration-700 hover:border-border-bright hover:scale-[1.005] md:min-h-[400px]"
          >
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
              style={{
                background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/50 to-void/20" />
            <div className="relative flex flex-col justify-between p-8 md:flex-row md:items-end md:p-12">
              <div className="max-w-xl">
                <span
                  dir="ltr"
                  className="inline-block rounded-full border border-white/20 bg-black/30 px-3 py-1 font-mono text-[11px] text-white/90 backdrop-blur-sm"
                >
                  {project.tag}
                </span>
                <h3 className="mt-5 text-3xl font-bold text-white md:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/80">
                  {project.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      dir="ltr"
                      className="rounded-md bg-black/30 px-2.5 py-1 font-mono text-[11px] text-white/85"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <motion.span
                className="mt-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm md:mt-0"
                whileHover={{ scale: 1.05 }}
              >
                <ArrowUpLeft className="h-5 w-5" strokeWidth={1.5} />
              </motion.span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

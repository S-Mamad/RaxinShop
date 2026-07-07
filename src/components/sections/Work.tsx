"use client";

import projects from "@/data/projects.json";
import type { ProjectItem } from "@/types";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const projectData = projects as ProjectItem[];

export function Work() {
  const featured = projectData.find((p) => p.featured) ?? projectData[0];
  const others = projectData.filter((p) => p.id !== featured?.id);

  if (!featured) return null;

  return (
    <section id="work" className="border-y border-border py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-12">
          <SectionHeading
            index="02"
            eyebrow="کارها"
            title="نمونه‌کار"
            description="پروژه‌های واقعی. از e-commerce تا SaaS و برند دیجیتال."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal delay={0.04} className="md:col-span-2">
            <ProjectCard project={featured} featured />
          </Reveal>
          {others.map((project, index) => (
            <Reveal key={project.id} delay={0.08 + index * 0.04}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

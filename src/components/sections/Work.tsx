"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import projects from "@/data/projects.json";
import type { ProjectItem } from "@/types";
import { useCopy } from "@/hooks/useCopy";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/utils";

const projectData = projects as ProjectItem[];

export function Work() {
  const copy = useCopy();

  return (
    <section id="work" className="border-b border-border py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow={copy.work.eyebrow}
            title={copy.work.title}
            description={copy.work.description}
          />
        </Reveal>

        <div className="flex flex-col gap-8">
          {projectData.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.05}>
              <CaseStudyCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({ project }: { project: ProjectItem }) {
  const isLuxury = project.caseStyle === "luxury";
  const isInfra = project.caseStyle === "infra";
  const isExternal = project.href.startsWith("http");
  const isStatic = project.comingSoon || project.href.startsWith("#");

  const inner = (
    <SpotlightCard
      as="article"
      className={cn(
        "overflow-hidden rounded-2xl",
        isLuxury && "border-gold/20",
        isInfra && "border-cyber/20",
      )}
    >
      <div
        className={cn(
          "grid gap-0 lg:grid-cols-2",
          isLuxury && "lg:grid-cols-[1.15fr_0.85fr]",
        )}
      >
        <div
          className={cn(
            "relative min-h-[220px] overflow-hidden",
            isLuxury ? "bg-[#1a0f05]" : "bg-void",
          )}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover object-center opacity-90 transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
              }}
            />
          )}
          {isInfra ? (
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, rgba(77,184,255,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(61,255,168,0.2), transparent 35%)",
              }}
            />
          ) : null}
          {isLuxury ? (
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f05] via-transparent to-transparent" />
          ) : null}
        </div>

        <div className="flex flex-col p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "label-mono",
                isLuxury ? "text-gold" : isInfra ? "text-cyber" : "text-dim",
              )}
            >
              {project.tag}
            </span>
            {project.year ? (
              <span className="label-mono text-dim">· {project.year}</span>
            ) : null}
            {project.comingSoon ? (
              <span className="label-mono text-dim">· به‌زودی</span>
            ) : null}
          </div>

          <h3
            className={cn(
              "mt-3 font-display text-2xl md:text-3xl",
              isLuxury ? "text-gold" : "text-foreground",
            )}
          >
            {project.title}
          </h3>
          <p className="mt-3 text-sm leading-[1.85] text-muted md:text-[15px]">
            {project.description}
          </p>

          {project.businessValue?.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.businessValue.map((label) => (
                <span
                  key={label}
                  className={cn(
                    "border px-2.5 py-1 text-xs",
                    isLuxury
                      ? "border-gold/30 text-gold"
                      : isInfra
                        ? "border-cyber/30 text-cyber"
                        : "border-border text-dim",
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
          ) : null}

          {project.tech?.length ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  dir="ltr"
                  className="border border-border px-2 py-0.5 font-mono text-[10px] text-dim"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          {project.metrics?.length ? (
            <ul className="mt-5 space-y-1 font-mono text-[11px] text-accent/80">
              {project.metrics.map((m) => (
                <li key={m} dir="ltr">
                  ▸ {m}
                </li>
              ))}
            </ul>
          ) : null}

          {!isStatic ? (
            <span className="mt-auto flex items-center gap-2 self-start pt-6 text-sm text-muted transition-colors group-hover:text-accent">
              مشاهده
              <ArrowLeft className="h-4 w-4" weight="bold" />
            </span>
          ) : null}
        </div>
      </div>
    </SpotlightCard>
  );

  if (isStatic) return <div className="group">{inner}</div>;

  return (
    <Link
      href={project.href}
      className="group block"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </Link>
  );
}

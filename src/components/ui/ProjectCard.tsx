import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import type { ProjectItem } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectItem;
  featured?: boolean;
  className?: string;
}

export function ProjectCard({
  project,
  featured = false,
  className,
}: ProjectCardProps) {
  const isExternal = project.href.startsWith("http");
  const isHash = project.href.startsWith("#");

  const content = (
    <div
      className={cn(
        "bezel-inner relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden",
        featured ? "min-h-[320px] md:min-h-[400px]" : "min-h-[220px]",
      )}
    >
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
          style={{
            background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/75 to-void/30" />
      <div className="relative flex flex-col justify-between gap-4 p-6 md:p-8">
        <div className="max-w-lg">
          <span dir="ltr" className="telemetry text-white/70">
            {project.tag}
            {project.year ? ` · ${project.year}` : ""}
          </span>
          <h3
            className={cn(
              "mt-3 font-display text-white",
              featured ? "text-3xl md:text-4xl" : "text-xl md:text-2xl",
            )}
          >
            {project.title}
          </h3>
          <p
            className={cn(
              "mt-2 leading-relaxed text-white/70",
              featured ? "text-sm md:text-[15px]" : "line-clamp-2 text-xs md:text-sm",
            )}
          >
            {project.description}
          </p>
          {project.metrics ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.metrics.map((m) => (
                <span
                  key={m}
                  className="border border-white/15 bg-black/20 px-2 py-0.5 font-mono text-[10px] text-white/75"
                >
                  {m}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-1.5">
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
        {!isHash ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center self-end border border-white/20 bg-black/25 text-white transition-transform duration-500 group-hover:-translate-x-1">
            <ArrowLeft className="h-4 w-4" weight="bold" />
          </span>
        ) : null}
      </div>
    </div>
  );

  const wrapperClass = cn(
    "group bezel block h-full overflow-hidden transition-all duration-500 hover:ring-1 hover:ring-accent/20",
    className,
  );

  if (isHash) {
    return <div className={wrapperClass}>{content}</div>;
  }

  return (
    <Link
      href={project.href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={wrapperClass}
    >
      {content}
    </Link>
  );
}

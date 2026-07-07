import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { ProjectItem } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectItem;
  featured?: boolean;
  priority?: boolean;
  className?: string;
}

export function ProjectCard({
  project,
  featured = false,
  priority = false,
  className,
}: ProjectCardProps) {
  const isExternal = project.href.startsWith("http");
  const isStatic = project.comingSoon || project.href.startsWith("#");

  const content = (
    <div
      className={cn(
        "relative flex h-full flex-col justify-end overflow-hidden bg-elevated",
        featured ? "min-h-[320px] md:min-h-[400px]" : "min-h-[220px]",
      )}
    >
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-void/40" />
      <div className="relative flex flex-col justify-between gap-4 p-6 md:p-8">
        <div className="max-w-lg">
          <span className="label-mono text-white/60">
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
          {project.comingSoon ? (
            <span className="label-mono mt-3 inline-block text-white/50">
              به‌زودی
            </span>
          ) : null}
          {project.metrics ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.metrics.map((m) => (
                <span
                  key={m}
                  className="border border-white/10 px-2 py-0.5 text-[10px] text-white/70"
                >
                  {m}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {!isStatic ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center self-end border border-white/15 text-white/80 transition-transform duration-300 group-hover:-translate-x-0.5">
            <ArrowLeft className="h-4 w-4" weight="bold" />
          </span>
        ) : null}
      </div>
    </div>
  );

  const wrapperClass = cn(
    "group block h-full overflow-hidden border border-border transition-colors duration-300 hover:border-accent/30",
    className,
  );

  if (isStatic) {
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

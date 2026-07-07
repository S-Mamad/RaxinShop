import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { ProjectItem } from "@/types";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
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

  const imageBlock = project.image ? (
    <Image
      src={project.image}
      alt={project.title}
      fill
      priority={priority}
      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
      sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
    />
  ) : (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
      }}
    />
  );

  const media = featured ? (
    <BrowserFrame
      label={project.href.startsWith("/") ? project.href.slice(1) : "preview"}
      className="h-full"
    >
      <div className={cn("relative w-full", featured ? "aspect-[21/9] md:aspect-[2.4/1]" : "aspect-video")}>
        {imageBlock}
      </div>
    </BrowserFrame>
  ) : (
    <div className={cn("relative w-full overflow-hidden", "aspect-[4/3]")}>
      {imageBlock}
    </div>
  );

  const body = (
    <div
      className={cn(
        "flex flex-col justify-between gap-4",
        featured ? "p-6 md:p-8" : "border-t border-border p-6",
      )}
    >
      <div className="max-w-lg">
        <span className="label-mono text-muted">
          {project.tag}
          {project.year ? ` · ${project.year}` : ""}
        </span>
        <h3
          className={cn(
            "mt-3 font-display text-foreground",
            featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
          )}
        >
          {project.title}
        </h3>
        <p
          className={cn(
            "mt-2 leading-relaxed text-muted",
            featured ? "text-sm md:text-[15px]" : "line-clamp-2 text-xs md:text-sm",
          )}
        >
          {project.description}
        </p>
        {project.comingSoon ? (
          <span className="label-mono mt-3 inline-block text-dim">به‌زودی</span>
        ) : null}
        {project.metrics ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.metrics.map((m) => (
              <span
                key={m}
                className="border border-border px-2 py-0.5 text-[10px] text-muted"
              >
                {m}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {!isStatic ? (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center self-end border border-border-bright text-foreground/80 transition-all duration-300 group-hover:border-accent/40 group-hover:text-accent">
          <ArrowLeft className="h-4 w-4" weight="bold" />
        </span>
      ) : null}
    </div>
  );

  const content = (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden bg-surface/40",
        !featured && "border border-border",
      )}
    >
      {media}
      {body}
    </div>
  );

  const wrapperClass = cn(
    "group block h-full transition-colors duration-300",
    featured && "hover:[&_.border-border-bright]:border-accent/30",
    !featured && "hover:border-accent/25",
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

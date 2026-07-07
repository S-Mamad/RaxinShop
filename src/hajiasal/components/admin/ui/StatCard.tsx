import type { ComponentType } from "react";
import type { IconProps as PhosphorIconProps } from "@phosphor-icons/react";
import { Icon } from "@asal/components/ui/Icon";
import { cn } from "@asal/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ComponentType<PhosphorIconProps>;
  className?: string;
}

export function StatCard({ label, value, hint, icon, className }: StatCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {typeof value === "number" ? value.toLocaleString("fa-IR") : value}
          </p>
          {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
        </div>
        {icon ? (
          <span className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Icon icon={icon} size={20} />
          </span>
        ) : null}
      </div>
    </article>
  );
}

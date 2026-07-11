import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-green">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold tracking-normal text-ink sm:text-3xl">{title}</h2>
      {description ? (
        <div className="mt-3 text-base leading-7 text-ink-muted">{description}</div>
      ) : null}
    </div>
  );
}

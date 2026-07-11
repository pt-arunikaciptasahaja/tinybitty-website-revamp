import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerSize = "sm" | "md" | "lg";

const sizeClasses: Record<ContainerSize, string> = {
  sm: "max-w-container-sm",
  md: "max-w-container-md",
  lg: "max-w-container",
};

type ContainerProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  size?: ContainerSize;
};

export function Container({
  as: Component = "div",
  children,
  className,
  size = "lg",
}: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full px-[var(--space-page-x)]", sizeClasses[size], className)}
    >
      {children}
    </Component>
  );
}

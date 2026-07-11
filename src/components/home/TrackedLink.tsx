"use client";

import type { ReactNode } from "react";
import { trackEvent, type AnalyticsEventName, type AnalyticsPayload } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

type TrackedLinkProps = {
  children: ReactNode;
  href: string;
  eventName: AnalyticsEventName;
  payload?: AnalyticsPayload;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function TrackedLink({
  children,
  href,
  eventName,
  payload,
  variant = "primary",
  size = "md",
  className,
}: TrackedLinkProps) {
  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      className={className}
      onClick={() => trackEvent(eventName, payload)}
    >
      {children}
    </Button>
  );
}

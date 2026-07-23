import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const baseClasses =
  "hallmark-button inline-flex items-center justify-center gap-2 rounded-pill font-semibold focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "hallmark-button--primary bg-brand-green text-white",
  secondary: "hallmark-button--secondary bg-brand-pink/35 text-ink",
  outline: "hallmark-button--outline border border-brand-green text-brand-green",
  ghost: "hallmark-button--ghost text-brand-green",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
};

type SharedButtonProps = {
  children: ReactNode;
  className?: string | undefined;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonAsButtonProps = SharedButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: never;
  };

type ButtonAsLinkProps = SharedButtonProps & {
  href: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
  "aria-label"?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href) {
    const { href, target, rel, onClick, "aria-label": ariaLabel } = props;
    const linkProps: {
      target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
      rel?: string;
      onClick?: MouseEventHandler<HTMLAnchorElement>;
      "aria-label"?: string;
    } = {};

    if (target !== undefined) {
      linkProps.target = target;
    }

    if (rel !== undefined) {
      linkProps.rel = rel;
    }

    if (onClick !== undefined) {
      linkProps.onClick = onClick;
    }

    if (ariaLabel !== undefined) {
      linkProps["aria-label"] = ariaLabel;
    }

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButtonProps;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

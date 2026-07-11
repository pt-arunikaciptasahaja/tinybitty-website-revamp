import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { CartProvider } from "@/features/cart/CartProvider";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <CartProvider>
      <Header />
      {children}
      <Footer />
      <MobileStickyCta />
    </CartProvider>
  );
}

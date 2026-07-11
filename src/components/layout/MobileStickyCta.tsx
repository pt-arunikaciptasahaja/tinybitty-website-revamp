import { siteConfig } from "@/content/site-config";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-raised/95 p-3 shadow-raised backdrop-blur md:hidden">
      <WhatsAppButton label={siteConfig.stickyCta.label} className="w-full" />
    </div>
  );
}

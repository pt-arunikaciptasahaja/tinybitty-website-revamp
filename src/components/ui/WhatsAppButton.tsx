import { siteConfig } from "@/content/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";

type WhatsAppButtonProps = {
  label?: string;
  message?: string;
  className?: string;
};

export function WhatsAppButton({
  label = "Order via WhatsApp",
  message = "Halo Tiny Bitty, saya ingin bertanya tentang pesanan.",
  className,
}: WhatsAppButtonProps) {
  const isConfigured = !siteConfig.whatsappNumber.includes("OWNER_INPUT_REQUIRED");
  const href = isConfigured
    ? (buildWhatsAppUrl(siteConfig.whatsappNumber, message) ?? "/contact")
    : "/contact";

  return (
    <Button href={href} className={className} variant="primary">
      {label}
    </Button>
  );
}

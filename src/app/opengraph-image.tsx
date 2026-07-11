import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site-config";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fff8f2",
          color: "#21392f",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          <span>{siteConfig.name}</span>
          <span style={{ color: "#4f7d5a" }}>WhatsApp enquiry catalogue</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 86, fontWeight: 800, lineHeight: 1 }}>
            Cookies, bundles, and corporate gifts
          </div>
          <div style={{ maxWidth: 860, fontSize: 34, lineHeight: 1.35, color: "#5a665f" }}>
            Browse Tiny Bitty and prepare a structured enquiry for confirmation.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 30,
            color: "#4f7d5a",
            fontWeight: 700,
          }}
        >
          <span>Cookies</span>
          <span>Bundles</span>
          <span>Corporate Gifts</span>
        </div>
      </div>
    ),
    size,
  );
}

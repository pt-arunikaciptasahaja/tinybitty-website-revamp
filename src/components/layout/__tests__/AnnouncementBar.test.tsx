import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { siteConfig } from "@/content/site-config";

describe("AnnouncementBar", () => {
  it("renders announcement text from site configuration", () => {
    render(<AnnouncementBar />);

    expect(screen.getByRole("region", { name: "Site announcement" })).toHaveTextContent(
      siteConfig.announcement.text,
    );
    expect(screen.getByRole("link", { name: siteConfig.announcement.linkLabel })).toHaveAttribute(
      "href",
      siteConfig.announcement.href,
    );
  });
});

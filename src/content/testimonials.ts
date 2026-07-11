import type { Testimonial } from "@/content/schemas";
import { validateTestimonials } from "@/content/validation";

const testimonialFixtures = [
  {
    contentStatus: "approved",
    id: "testimonial-danielle",
    quote:
      "These cookies are insanely good… so comforting and nostalgic. Brought a box to the office and it disappeared in minutes.",
    sourceLabel: "Danielle Mottoh",
    purchaseContext: "Office treat and weekend sharing",
    hasPermission: true,
  },
  {
    contentStatus: "approved",
    id: "testimonial-fajar",
    quote:
      "Bake-perfection at its finest… super crunchy on the outside, incredibly gooey inside. No thoughts, just pure bliss.",
    sourceLabel: "Fajar Tri S",
    purchaseContext: "Cookie order for a cozy home moment",
    hasPermission: true,
  },
] satisfies Testimonial[];

export const testimonials = validateTestimonials(testimonialFixtures);

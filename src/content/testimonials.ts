import type { Testimonial } from "@/content/schemas";
import { validateTestimonials } from "@/content/validation";

const testimonialFixtures = [
  {
    contentStatus: "approved",
    id: "testimonial-danielle",
    quote:
      "These cookies are insanely good… so comforting and nostalgic. Brought a box to the office and it disappeared in minutes.",
    sourceLabel: "Daniella Mottoh",
    jobTitle: "UI/UX Manager",
    purchaseContext: "Office treat and weekend sharing",
    hasPermission: true,
  },
  {
    contentStatus: "approved",
    id: "testimonial-fajar",
    quote:
      "Nothing hits better after a good padel session… crunchy on the outside, gooey inside, and gone before the post-match recap is over.",
    sourceLabel: "Fajar",
    jobTitle: "Padel instructor",
    purchaseContext: "Cookie order for a cozy home moment",
    hasPermission: true,
  },
] satisfies Testimonial[];

export const testimonials = validateTestimonials(testimonialFixtures);

import { z } from "zod";
import { OWNER_INPUT_REQUIRED, imageSchema } from "@/content/schemas";

export const juiceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  category: z.literal("juices"),
  name: z.string().min(1),
  nameStatus: z.literal("provisional"),
  image: imageSchema,
  availability: z.literal("enquiry_only"),
  pricing: z.discriminatedUnion("status", [
    z.object({ status: z.literal("ask_for_price"), amount: z.null() }),
    z.object({ status: z.literal("confirmed"), amount: z.number().int().positive() }),
  ]),
  description: z.string().min(1),
  ingredients: z.array(z.string().min(1)).nullable(),
  volumeMl: z.number().int().positive().nullable(),
  ownerInput: z.record(z.string()),
});
export type Juice = Omit<z.infer<typeof juiceSchema>, "ownerInput">;
export const juiceLaunchImage = imageSchema.parse({
  src: "/Gemini_Generated_Image_nl64ldnl64ldnl64.jpg",
  width: 2752,
  height: 1536,
  alt: "Four Tiny Bitty juice bottles displayed together in the juice collection launch image",
});
// Reference names from the launch brief; not yet an approved product specification.
const juiceRecords = z.array(juiceSchema).parse(
  [
    [
      "mango-chia",
      "Mango & Chia",
      "mango",
      "Make it a mango moment. A golden pick for an afternoon cookie break.",
    ],
    [
      "strawberry-delight",
      "Strawberry Delight",
      "strawberry",
      "A rosy addition to your snack table. Bring Strawberry Delight to your next catch-up.",
    ],
    [
      "guava-glow",
      "Guava Glow",
      "guava",
      "Meet Guava Glow. Add a splash of pink to your everyday routine with this guava-inspired pick.",
    ],
    [
      "soursop-cloud",
      "Soursop Cloud",
      "soursop",
      "Looking beyond mango and berries? Choose Soursop Cloud for your next little sip.",
    ],
  ].map(([slug, name, imageName, description]) => ({
    id: `juice-${slug}`,
    slug,
    name,
    category: "juices",
    image: {
      src: `/juices/${imageName}.jpg`,
      width: 2048,
      height: 2048,
      alt: `${name} Tiny Bitty juice bottle`,
    },
    nameStatus: "provisional",
    availability: "enquiry_only",
    pricing: { status: "confirmed", amount: 20000 },
    description,
    ingredients: null,
    volumeMl: 250,
    ownerInput: Object.fromEntries(
      [
        "finalName",
        "ingredients",
        "allergens",
        "availability",
        "shelfLife",
        "storage",
        "delivery",
      ].map((key) => [key, OWNER_INPUT_REQUIRED]),
    ),
  })),
);
// Only public fields leave the content layer; internal owner markers never reach page props.
export const juiceProducts: Juice[] = juiceRecords.map(({ ownerInput, ...juice }) => {
  void ownerInput;
  return juice;
});
export function juiceVolumeLabel(juice: Pick<Juice, "volumeMl">): string {
  return juice.volumeMl === null ? "Bottle volume to be confirmed" : `${juice.volumeMl} ml`;
}

export const juiceLaunchVideo = z
  .object({
    src: z.string().startsWith("/"),
    label: z.string().min(1),
  })
  .parse({
    src: "/Four_bottles_filled_with_fruit_20261002141901.mp4",
    label: "Tiny Bitty juice collection launch video",
  });

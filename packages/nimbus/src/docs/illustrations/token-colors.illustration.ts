import { defineIllustration } from "@/illustration-kit";

const SWATCHES = [
  "tint",
  "track",
  "icon",
  "textStrong",
  "strong",
  "text",
] as const;

export default defineIllustration({
  name: "token-colors",
  draw: ({ panel, rect }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    // a palette: two rows of three swatches
    ...SWATCHES.map((fill, i) =>
      rect({
        x: 24 + (i % 3) * 18,
        y: 30 + Math.floor(i / 3) * 20,
        w: 14,
        h: 14,
        radius: "100",
        fill,
      })
    ),
  ],
});

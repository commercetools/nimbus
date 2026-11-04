import { defineIllustration } from "@/illustration-kit";

const SWATCHES = ["tint", "track", "textStrong", "strong"] as const;

export default defineIllustration({
  name: "foundations",
  draw: ({ panel, rect, pill }) => [
    // base layer: the design tokens, as four swatches
    panel({ x: 12, y: 58, w: 72, h: 18, radius: "200" }),
    ...SWATCHES.map((fill, i) =>
      rect({ x: 19 + i * 16, y: 63, w: 10, h: 8, radius: "100", fill })
    ),
    // middle layer: the props that use them
    panel({ x: 20, y: 38, w: 56, h: 16, radius: "200" }),
    pill({ x: 28, y: 44.5, w: 14, fill: "text" }),
    pill({ x: 46, y: 44.5, w: 10, fill: "strong" }),
    pill({ x: 60, y: 44.5, w: 8, fill: "text" }),
    // top layer: the interface built on them
    panel({ x: 28, y: 18, w: 40, h: 16, radius: "200", tone: "strong" }),
    pill({ x: 38, y: 24.5, w: 20, fill: "onStrong" }),
  ],
});

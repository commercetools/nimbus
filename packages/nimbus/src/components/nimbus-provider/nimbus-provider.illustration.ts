import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "nimbus-provider",
  draw: ({ panel, dot, pill, field }) => [
    panel({ x: 12, y: 16, w: 72, h: 64, radius: "300" }),
    panel({
      x: 20,
      y: 24,
      w: 24,
      h: 10,
      radius: "200",
      tone: "strong",
      shadow: false,
    }),
    pill({ x: 26, y: 27.5, w: 12, fill: "onStrong" }),
    panel({
      x: 52,
      y: 25,
      w: 16,
      h: 8,
      radius: "full",
      tone: "strong",
      shadow: false,
    }),
    dot({ cx: 64, cy: 29, r: 2.5, fill: "onStrong" }),
    field({ x: 20, y: 40, w: 56, h: 10 }),
    dot({ cx: 28, cy: 66, r: 4, fill: "strong" }),
    dot({ cx: 40, cy: 66, r: 4, fill: "textStrong" }),
    dot({ cx: 52, cy: 66, r: 4, fill: "tint" }),
    pill({ x: 62, y: 64.5, w: 14, fill: "text" }),
  ],
});

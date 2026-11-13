import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "switch",
  draw: ({ panel, dot, pill }) => [
    // on
    panel({ x: 22, y: 34, w: 24, h: 12, radius: "full", tone: "strong" }),
    dot({ cx: 40, cy: 40, r: 4.5, fill: "onStrong" }),
    pill({ x: 52, y: 38.5, w: 22, fill: "onBg" }),
    // off
    panel({
      x: 22,
      y: 50,
      w: 24,
      h: 12,
      radius: "full",
      tone: "track",
      shadow: false,
    }),
    dot({ cx: 28, cy: 56, r: 4.5, fill: "knob" }),
    pill({ x: 52, y: 54.5, w: 16, fill: "onBg" }),
  ],
});

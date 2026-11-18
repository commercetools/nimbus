import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "region",
  draw: ({ panel, dashed, pill }) => [
    dashed({ x: 16, y: 24, w: 64, h: 48, radius: "200", color: "icon" }),
    panel({
      x: 24,
      y: 20,
      w: 20,
      h: 8,
      radius: "100",
      tone: "strong",
      shadow: false,
    }),
    pill({ x: 28, y: 23.25, w: 12, h: 1.5, fill: "onStrong" }),
    pill({ x: 24, y: 40, w: 40, fill: "onBg" }),
    pill({ x: 24, y: 48, w: 32, fill: "onBg" }),
    pill({ x: 24, y: 56, w: 36, fill: "onBg" }),
  ],
});

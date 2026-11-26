import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "default-page",
  draw: ({ panel, pill, line, rect }) => [
    panel({ x: 12, y: 14, w: 72, h: 68, radius: "300" }),
    pill({ x: 20, y: 22, w: 24, h: 4, fill: "textStrong" }),
    panel({
      x: 62,
      y: 20,
      w: 14,
      h: 8,
      radius: "100",
      tone: "strong",
      shadow: false,
    }),
    line({ x1: 12, y1: 34, x2: 84, y2: 34 }),
    rect({ x: 20, y: 42, w: 56, h: 12, fill: "tint", radius: "100" }),
    pill({ x: 26, y: 46.5, w: 24, fill: "text" }),
    rect({ x: 20, y: 58, w: 56, h: 14, fill: "tint", radius: "100" }),
    pill({ x: 26, y: 63.5, w: 32, fill: "text" }),
  ],
});

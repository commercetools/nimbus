import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "public-page-layout",
  draw: ({ panel, rect, pill, dot, line }) => [
    panel({ x: 12, y: 14, w: 72, h: 68, radius: "300" }),
    dot({ cx: 22, cy: 24, r: 3, fill: "strong" }),
    pill({ x: 29, y: 22.5, w: 16, fill: "textStrong" }),
    pill({ x: 62, y: 22.5, w: 14, fill: "text" }),
    line({ x1: 12, y1: 32, x2: 84, y2: 32 }),
    rect({ x: 28, y: 38, w: 40, h: 30, fill: "tint", radius: "200" }),
    pill({ x: 34, y: 44, w: 16, fill: "textStrong" }),
    pill({ x: 34, y: 52, w: 28, fill: "text" }),
    panel({
      x: 34,
      y: 60,
      w: 28,
      h: 6,
      radius: "100",
      tone: "strong",
      shadow: false,
    }),
    pill({ x: 34, y: 74, w: 28, fill: "text" }),
  ],
});

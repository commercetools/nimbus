import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "drawer",
  draw: ({ panel, pill, line, stroke, icons }) => [
    panel({
      x: 12,
      y: 16,
      w: 72,
      h: 64,
      radius: "300",
      tone: "track",
      shadow: false,
    }),
    panel({ x: 44, y: 16, w: 40, h: 64, radius: "300" }),
    pill({ x: 50, y: 24, w: 16, fill: "textStrong" }),
    stroke(icons.close(77, 25.5, 0.8), { color: "icon", w: 0.85 }),
    line({ x1: 44, y1: 32, x2: 84, y2: 32 }),
    pill({ x: 50, y: 40, w: 28, fill: "text" }),
    pill({ x: 50, y: 46, w: 24, fill: "text" }),
    pill({ x: 50, y: 52, w: 28, fill: "text" }),
    panel({
      x: 62,
      y: 66,
      w: 16,
      h: 8,
      radius: "100",
      tone: "strong",
      shadow: false,
    }),
  ],
});

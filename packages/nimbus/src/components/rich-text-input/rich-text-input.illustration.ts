import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "rich-text-input",
  draw: ({ panel, rect, pill, line, stroke, shape }) => [
    panel({ x: 16, y: 24, w: 64, h: 48, radius: "300" }),
    rect({ x: 22, y: 30, w: 10, h: 10, fill: "tint", radius: "100" }),
    pill({ x: 24.5, y: 33.5, w: 5, fill: "textStrong" }),
    stroke(shape("M41,32 l-2,6", { x1: 39, y1: 32, x2: 41, y2: 38 }), {
      color: "icon",
      w: 1,
    }),
    pill({ x: 46, y: 32, w: 6, h: 1.5, fill: "icon" }),
    pill({ x: 46, y: 36.5, w: 6, h: 1.5, fill: "icon" }),
    line({ x1: 16, y1: 44, x2: 80, y2: 44 }),
    pill({ x: 22, y: 50, w: 44, fill: "textStrong" }),
    pill({ x: 22, y: 57, w: 52, fill: "text" }),
    pill({ x: 22, y: 64, w: 30, fill: "text" }),
  ],
});

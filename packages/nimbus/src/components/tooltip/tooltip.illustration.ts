import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "tooltip",
  draw: ({ bubble, pill, panel, stroke, shape, dot, circle, cursor }) => [
    bubble({ x: 26, y: 28, w: 44, h: 16, radius: "100" }),
    pill({ x: 32, y: 34.5, w: 32, fill: "onStrong" }),
    panel({ x: 40, y: 54, w: 16, h: 16, radius: "200" }),
    stroke(shape("M48,61.25 v3.5", { x1: 48, y1: 61.25, x2: 48, y2: 64.75 }), {
      color: "icon",
    }),
    dot({ cx: 48, cy: 59.25, r: 0.6, fill: "icon" }),
    circle({ cx: 48, cy: 62, r: 4.5, stroke: "icon" }),
    cursor({ x: 52, y: 64 }),
  ],
});

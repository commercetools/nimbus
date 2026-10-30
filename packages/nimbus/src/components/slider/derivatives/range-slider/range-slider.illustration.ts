import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "range-slider",
  draw: ({ bubble, pill, circle, stroke }) => [
    bubble({ x: 24, y: 28, w: 16, h: 10, radius: "100" }),
    bubble({ x: 54, y: 28, w: 16, h: 10, radius: "100" }),
    pill({ x: 28, y: 31.5, w: 8, fill: "onStrong" }),
    pill({ x: 58, y: 31.5, w: 8, fill: "onStrong" }),
    pill({ x: 16, y: 45, w: 64, h: 6, fill: "track" }),
    pill({ x: 32, y: 45, w: 30, h: 6, fill: "strong" }),
    circle({ cx: 32, cy: 48, r: 6, fill: "surface", stroke: "strong", w: 1.5 }),
    circle({ cx: 62, cy: 48, r: 6, fill: "surface", stroke: "strong", w: 1.5 }),
    pill({ x: 16, y: 62, w: 10, fill: "onBg" }),
    pill({ x: 70, y: 62, w: 10, fill: "onBg" }),
  ],
});

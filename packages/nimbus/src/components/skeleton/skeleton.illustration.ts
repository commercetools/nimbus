import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "skeleton",
  draw: ({ panel, rect, pill, dot }) => [
    panel({ x: 16, y: 24, w: 64, h: 48, radius: "300" }),
    dot({ cx: 30, cy: 38, r: 6, fill: "track" }),
    pill({ x: 42, y: 34, w: 28, fill: "track" }),
    pill({ x: 42, y: 41, w: 20, fill: "track" }),
    rect({ x: 24, y: 52, w: 48, h: 14, fill: "track", radius: "200" }),
  ],
});

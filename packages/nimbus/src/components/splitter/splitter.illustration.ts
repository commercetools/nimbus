import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "splitter",
  draw: ({ panel, pill, dot }) => [
    panel({ x: 16, y: 24, w: 28, h: 48, radius: "200" }),
    pill({ x: 21, y: 31, w: 14, fill: "textStrong" }),
    pill({ x: 21, y: 39, w: 18, fill: "text" }),
    panel({ x: 52, y: 24, w: 28, h: 48, radius: "200" }),
    pill({ x: 57, y: 31, w: 14, fill: "textStrong" }),
    pill({ x: 57, y: 39, w: 18, fill: "text" }),
    panel({ x: 44, y: 40, w: 8, h: 16, radius: "full", tone: "strong" }),
    dot({ cx: 48, cy: 44, r: 0.8, fill: "onStrong" }),
    dot({ cx: 48, cy: 48, r: 0.8, fill: "onStrong" }),
    dot({ cx: 48, cy: 52, r: 0.8, fill: "onStrong" }),
  ],
});

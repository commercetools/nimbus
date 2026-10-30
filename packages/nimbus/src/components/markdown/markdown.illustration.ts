import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "markdown",
  draw: ({ panel, rect, pill, dot }) => [
    panel({ x: 16, y: 20, w: 64, h: 56, radius: "300" }),
    pill({ x: 24, y: 28, w: 24, h: 4, fill: "textStrong" }),
    pill({ x: 24, y: 38, w: 48, fill: "text" }),
    pill({ x: 24, y: 44, w: 40, fill: "text" }),
    dot({ cx: 27, cy: 55, r: 1.5, fill: "icon" }),
    pill({ x: 33, y: 53.5, w: 28, fill: "text" }),
    rect({ x: 24, y: 62, w: 40, h: 8, fill: "tint", radius: "100" }),
  ],
});

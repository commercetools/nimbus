import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "radio-input",
  draw: ({ panel, pill, circle, dot }) => [
    panel({ x: 16, y: 26, w: 64, h: 44, radius: "300" }),
    circle({ cx: 26, cy: 36, r: 4, stroke: "strong", w: 1 }),
    dot({ cx: 26, cy: 36, r: 2, fill: "strong" }),
    pill({ x: 36, y: 34.5, w: 28, fill: "textStrong" }),
    circle({ cx: 26, cy: 48, r: 4, stroke: "text", w: 1 }),
    pill({ x: 36, y: 46.5, w: 22, fill: "text" }),
    circle({ cx: 26, cy: 60, r: 4, stroke: "text", w: 1 }),
    pill({ x: 36, y: 58.5, w: 26, fill: "text" }),
  ],
});

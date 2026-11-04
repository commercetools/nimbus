import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "floating-action-button",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({ x: 16, y: 20, w: 64, h: 56, radius: "300" }),
    pill({ x: 24, y: 30, w: 32, fill: "textStrong" }),
    pill({ x: 24, y: 38, w: 40, fill: "text" }),
    pill({ x: 24, y: 44, w: 28, fill: "text" }),
    panel({ x: 56, y: 54, w: 24, h: 24, radius: "full", tone: "strong" }),
    stroke(icons.plus(68, 66), { color: "onStrong", w: 1.5 }),
  ],
});

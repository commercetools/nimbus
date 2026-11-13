import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "card",
  draw: ({ panel, rect, pill, stroke, icons }) => [
    panel({ x: 24, y: 20, w: 48, h: 56, radius: "300" }),
    rect({ x: 28, y: 24, w: 40, h: 20, fill: "tint", radius: "200" }),
    stroke(icons.mountains(48, 34), { color: "icon", w: 0.85 }),
    pill({ x: 30, y: 50, w: 24, fill: "textStrong" }),
    pill({ x: 30, y: 57, w: 36, fill: "text" }),
    pill({ x: 30, y: 63, w: 28, fill: "text" }),
  ],
});

import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "code",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({ x: 16, y: 28, w: 64, h: 40, radius: "200" }),
    pill({ x: 24, y: 36, w: 20, fill: "textStrong" }),
    pill({ x: 32, y: 43, w: 28, fill: "text" }),
    pill({ x: 32, y: 50, w: 16, fill: "text" }),
    pill({ x: 24, y: 57, w: 8, fill: "textStrong" }),
    stroke(icons.code(68, 36), { color: "icon", w: 0.85 }),
  ],
});

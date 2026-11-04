import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "multiline-text-input",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({ x: 16, y: 28, w: 64, h: 40, radius: "200" }),
    pill({ x: 22, y: 35, w: 44, fill: "textStrong" }),
    pill({ x: 22, y: 42, w: 52, fill: "text" }),
    pill({ x: 22, y: 49, w: 36, fill: "text" }),
    stroke(icons.resize(73, 61), { color: "icon", w: 0.85 }),
  ],
});

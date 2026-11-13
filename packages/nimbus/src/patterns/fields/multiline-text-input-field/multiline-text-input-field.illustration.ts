import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "multiline-text-input-field",
  draw: ({ panel, pill, stroke, icons }) => [
    pill({ x: 16, y: 24, w: 24, fill: "textStrong" }),
    panel({ x: 16, y: 32, w: 64, h: 32, radius: "200" }),
    pill({ x: 22, y: 38, w: 44, fill: "textStrong" }),
    pill({ x: 22, y: 45, w: 52, fill: "text" }),
    pill({ x: 22, y: 52, w: 30, fill: "text" }),
    stroke(icons.resize(73, 58), { color: "icon", w: 0.85 }),
    pill({ x: 16, y: 70, w: 36, fill: "onBg" }),
  ],
});

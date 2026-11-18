import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "money-input-field",
  draw: ({ panel, pill, line, stroke, icons }) => [
    pill({ x: 16, y: 30, w: 24, fill: "textStrong" }),
    panel({ x: 16, y: 38, w: 64, h: 16, radius: "200" }),
    stroke(icons.coin(26, 46), { color: "icon", w: 0.85 }),
    stroke(icons.chevronDown(36, 46), { color: "icon", w: 0.85 }),
    line({ x1: 43, y1: 42, x2: 43, y2: 50 }),
    pill({ x: 49, y: 44.5, w: 20, fill: "textStrong" }),
    pill({ x: 71, y: 44.5, w: 4, fill: "text" }),
    pill({ x: 16, y: 60, w: 36, fill: "onBg" }),
  ],
});

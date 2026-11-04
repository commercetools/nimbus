import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "money-input",
  draw: ({ panel, pill, line, stroke, icons }) => [
    panel({ x: 16, y: 40, w: 64, h: 16, radius: "200" }),
    stroke(icons.coin(26, 48), { color: "icon", w: 0.85 }),
    stroke(icons.chevronDown(36, 48), { color: "icon", w: 0.85 }),
    line({ x1: 43, y1: 44, x2: 43, y2: 52 }),
    pill({ x: 49, y: 46.5, w: 20, fill: "textStrong" }),
    pill({ x: 71, y: 46.5, w: 4, fill: "text" }),
  ],
});

import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "scoped-search-input",
  draw: ({ panel, pill, line, stroke, icons }) => [
    panel({ x: 16, y: 40, w: 64, h: 16, radius: "200" }),
    pill({ x: 22, y: 46.5, w: 12, fill: "textStrong" }),
    stroke(icons.chevronDown(41, 48), { color: "icon", w: 0.85 }),
    line({ x1: 48, y1: 44, x2: 48, y2: 52 }),
    stroke(icons.search(56, 48), { color: "icon", w: 0.85 }),
    pill({ x: 64, y: 46.5, w: 10, fill: "text" }),
  ],
});

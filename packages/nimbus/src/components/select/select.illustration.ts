import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "select",
  draw: ({ panel, rect, pill, stroke, icons }) => [
    panel({ x: 20, y: 24, w: 56, h: 14, radius: "200" }),
    pill({ x: 26, y: 29.5, w: 20, fill: "textStrong" }),
    stroke(icons.chevronDown(68, 31), { color: "icon", w: 0.85 }),
    panel({ x: 20, y: 42, w: 56, h: 30, radius: "200" }),
    rect({ x: 22, y: 44, w: 52, h: 8, fill: "tint", radius: "100" }),
    pill({ x: 26, y: 46.5, w: 24, fill: "textStrong" }),
    stroke(icons.check(68, 48, 0.8), { color: "strong", w: 0.85 }),
    pill({ x: 26, y: 56.5, w: 28, fill: "text" }),
    pill({ x: 26, y: 64.5, w: 20, fill: "text" }),
  ],
});

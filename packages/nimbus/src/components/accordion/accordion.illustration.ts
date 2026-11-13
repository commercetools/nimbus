import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "accordion",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({ x: 16, y: 18, w: 64, h: 12, radius: "200" }),
    pill({ x: 24, y: 22.5, w: 24, fill: "textStrong" }),
    stroke(icons.chevronUp(72, 24), { color: "icon", w: 0.85 }),
    panel({ x: 16, y: 32, w: 64, h: 14, radius: "200" }),
    pill({ x: 24, y: 36, w: 40, fill: "text" }),
    pill({ x: 24, y: 41, w: 28, fill: "text" }),
    panel({ x: 16, y: 50, w: 64, h: 12, radius: "200" }),
    pill({ x: 24, y: 54.5, w: 20, fill: "text" }),
    stroke(icons.chevronDown(72, 56), { color: "icon", w: 0.85 }),
    panel({ x: 16, y: 66, w: 64, h: 12, radius: "200" }),
    pill({ x: 24, y: 70.5, w: 24, fill: "text" }),
    stroke(icons.chevronDown(72, 72), { color: "icon", w: 0.85 }),
  ],
});

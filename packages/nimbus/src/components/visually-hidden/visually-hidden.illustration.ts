import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "visually-hidden",
  draw: ({ panel, pill, dashed, stroke, icons, dot }) => [
    panel({ x: 16, y: 24, w: 64, h: 48, radius: "300" }),
    pill({ x: 24, y: 32, w: 40, fill: "text" }),
    dashed({ x: 22, y: 40, w: 52, h: 12, radius: "100", color: "icon" }),
    stroke(icons.eye(29, 46), { color: "icon", w: 0.75 }),
    dot({ cx: 29, cy: 46, r: 1.1, fill: "icon" }),
    stroke(icons.slash(29, 46), { color: "icon", w: 0.75 }),
    pill({ x: 36, y: 44.5, w: 32, fill: "muted" }),
    pill({ x: 24, y: 60, w: 32, fill: "text" }),
  ],
});

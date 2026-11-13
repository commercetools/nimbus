import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "pagination",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({ x: 10, y: 40, w: 12, h: 16, radius: "100" }),
    stroke(icons.chevronLeft(16, 48), { color: "icon", w: 0.85 }),
    panel({ x: 26, y: 40, w: 12, h: 16, radius: "100" }),
    pill({ x: 30, y: 46.5, w: 4, fill: "text" }),
    panel({ x: 42, y: 40, w: 12, h: 16, radius: "100", tone: "strong" }),
    pill({ x: 46, y: 46.5, w: 4, fill: "onStrong" }),
    panel({ x: 58, y: 40, w: 12, h: 16, radius: "100" }),
    pill({ x: 62, y: 46.5, w: 4, fill: "text" }),
    panel({ x: 74, y: 40, w: 12, h: 16, radius: "100" }),
    stroke(icons.chevronRight(80, 48), { color: "icon", w: 0.85 }),
  ],
});

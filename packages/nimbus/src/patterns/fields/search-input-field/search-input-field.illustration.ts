import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "search-input-field",
  draw: ({ panel, pill, stroke, icons }) => [
    pill({ x: 16, y: 30, w: 24, fill: "textStrong" }),
    panel({ x: 16, y: 38, w: 64, h: 16, radius: "200" }),
    stroke(icons.search(25, 46), { color: "icon", w: 0.85 }),
    pill({ x: 34, y: 44.5, w: 24, fill: "textStrong" }),
    stroke(icons.close(72, 46, 0.8), { color: "icon", w: 0.85 }),
    pill({ x: 16, y: 60, w: 36, fill: "onBg" }),
  ],
});

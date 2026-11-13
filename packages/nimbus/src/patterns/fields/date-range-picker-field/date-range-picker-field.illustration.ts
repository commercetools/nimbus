import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "date-range-picker-field",
  draw: ({ panel, pill, stroke, icons }) => [
    pill({ x: 16, y: 30, w: 24, fill: "textStrong" }),
    panel({ x: 16, y: 38, w: 64, h: 16, radius: "200" }),
    pill({ x: 22, y: 44.5, w: 14, fill: "textStrong" }),
    pill({ x: 39, y: 45.25, w: 3, h: 1.5, fill: "text" }),
    pill({ x: 45, y: 44.5, w: 14, fill: "textStrong" }),
    stroke(icons.calendar(72, 46), { color: "icon", w: 0.75 }),
    pill({ x: 16, y: 60, w: 36, fill: "onBg" }),
  ],
});

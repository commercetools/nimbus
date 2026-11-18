import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "tab-nav",
  draw: ({ rect, pill, line, dashed }) => [
    pill({ x: 16, y: 24, w: 14, fill: "textStrong" }),
    pill({ x: 38, y: 24, w: 14, fill: "onBg" }),
    pill({ x: 60, y: 24, w: 14, fill: "onBg" }),
    line({ x1: 16, y1: 32, x2: 80, y2: 32 }),
    rect({ x: 14, y: 31, w: 18, h: 2, fill: "strong" }),
    dashed({ x: 16, y: 40, w: 64, h: 30, radius: "200", color: "icon" }),
  ],
});

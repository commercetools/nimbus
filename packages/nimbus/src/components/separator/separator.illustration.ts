import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "separator",
  draw: ({ panel, pill, line }) => [
    panel({ x: 16, y: 20, w: 64, h: 56, radius: "300" }),
    pill({ x: 24, y: 30, w: 40, fill: "textStrong" }),
    pill({ x: 24, y: 38, w: 32, fill: "text" }),
    line({ x1: 24, y1: 48, x2: 72, y2: 48 }),
    pill({ x: 24, y: 56, w: 40, fill: "textStrong" }),
    pill({ x: 24, y: 64, w: 28, fill: "text" }),
  ],
});

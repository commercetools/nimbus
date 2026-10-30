import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "text-input-field",
  draw: ({ panel, pill, stroke, shape }) => [
    pill({ x: 16, y: 30, w: 24, fill: "textStrong" }),
    panel({ x: 16, y: 38, w: 64, h: 16, radius: "200" }),
    pill({ x: 22, y: 46.5, w: 26, fill: "textStrong" }),
    stroke(shape("M51,42 v8", { x1: 51, y1: 42, x2: 51, y2: 50 }), {
      color: "strong",
      w: 1,
    }),
    pill({ x: 16, y: 60, w: 36, fill: "onBg" }),
  ],
});

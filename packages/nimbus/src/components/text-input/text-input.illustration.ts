import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "text-input",
  draw: ({ panel, pill, stroke, shape }) => [
    panel({ x: 16, y: 40, w: 64, h: 16, radius: "200" }),
    pill({ x: 22, y: 46.5, w: 26, fill: "textStrong" }),
    stroke(shape("M51,44 v8", { x1: 51, y1: 44, x2: 51, y2: 52 }), {
      color: "strong",
      w: 1,
    }),
  ],
});

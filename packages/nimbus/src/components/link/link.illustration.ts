import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "link",
  draw: ({ pill, stroke, cursor, icons, shape }) => [
    pill({ x: 16, y: 32, w: 64, fill: "onBg" }),
    pill({ x: 16, y: 44, w: 28, fill: "strong" }),
    stroke(shape("M16,49.5 H44", { x1: 16, y1: 49.5, x2: 44, y2: 49.5 }), {
      color: "strong",
      w: 0.75,
    }),
    stroke(icons.arrowRight(52, 45.5), { color: "strong", w: 0.85 }),
    pill({ x: 16, y: 60, w: 48, fill: "onBg" }),
    cursor({ x: 36, y: 48 }),
  ],
});

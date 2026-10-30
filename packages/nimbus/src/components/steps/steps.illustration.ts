import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "steps",
  draw: ({ pill, dot, stroke, icons, shape }) => [
    stroke(shape("M27,44 H43", { x1: 27, y1: 44, x2: 43, y2: 44 }), {
      color: "strong",
      w: 1.5,
    }),
    stroke(shape("M53,44 H69", { x1: 53, y1: 44, x2: 69, y2: 44 }), {
      color: "track",
      w: 1.5,
    }),
    dot({ cx: 22, cy: 44, r: 5, fill: "strong" }),
    stroke(icons.check(22, 44, 0.8), { color: "onStrong", w: 1 }),
    dot({ cx: 48, cy: 44, r: 5, fill: "strong" }),
    dot({ cx: 48, cy: 44, r: 2, fill: "onStrong" }),
    dot({ cx: 74, cy: 44, r: 5, fill: "track" }),
    pill({ x: 15, y: 56, w: 14, fill: "onBg" }),
    pill({ x: 41, y: 56, w: 14, fill: "onBg" }),
    pill({ x: 67, y: 56, w: 14, fill: "onBg" }),
  ],
});

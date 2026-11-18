import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "form-field",
  draw: ({ pill, dot, field }) => [
    pill({ x: 16, y: 30, w: 24, fill: "textStrong" }),
    dot({ cx: 44, cy: 31.5, r: 1.5, fill: "strong" }),
    field({ x: 16, y: 38, w: 64, h: 16, text: 26 }),
    pill({ x: 16, y: 60, w: 36, fill: "onBg" }),
  ],
});

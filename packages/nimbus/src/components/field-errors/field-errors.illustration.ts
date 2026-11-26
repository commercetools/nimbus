import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "field-errors",
  draw: ({ pill, stroke, field, icons }) => [
    field({ x: 16, y: 28, w: 64, h: 16, text: 26 }),
    stroke(icons.warning(24, 54), { color: "textStrong", w: 0.85 }),
    pill({ x: 32, y: 52.5, w: 36, fill: "textStrong" }),
    stroke(icons.warning(24, 64), { color: "textStrong", w: 0.85 }),
    pill({ x: 32, y: 62.5, w: 28, fill: "textStrong" }),
  ],
});

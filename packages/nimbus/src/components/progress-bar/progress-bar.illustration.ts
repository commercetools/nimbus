import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "progress-bar",
  draw: ({ pill }) => [
    pill({ x: 16, y: 36, w: 24, fill: "onBg" }),
    pill({ x: 66, y: 36, w: 14, fill: "onBg" }),
    pill({ x: 16, y: 50, w: 64, h: 8, fill: "track" }),
    pill({ x: 16, y: 50, w: 40, h: 8, fill: "strong" }),
  ],
});

import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "heading",
  draw: ({ pill }) => [
    pill({ x: 16, y: 30, w: 44, h: 6, fill: "textStrong" }),
    pill({ x: 16, y: 44, w: 64, fill: "onBg" }),
    pill({ x: 16, y: 52, w: 56, fill: "onBg" }),
    pill({ x: 16, y: 60, w: 40, fill: "onBg" }),
  ],
});

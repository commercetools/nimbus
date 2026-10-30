import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "tabs",
  draw: ({ panel, pill }) => [
    panel({ x: 16, y: 22, w: 24, h: 12, radius: "100" }),
    pill({ x: 22, y: 26.5, w: 12, fill: "textStrong" }),
    pill({ x: 46, y: 26.5, w: 12, fill: "onBg" }),
    pill({ x: 66, y: 26.5, w: 10, fill: "onBg" }),
    panel({ x: 16, y: 34, w: 64, h: 40, radius: "200" }),
    pill({ x: 24, y: 42, w: 40, fill: "textStrong" }),
    pill({ x: 24, y: 49, w: 48, fill: "text" }),
    pill({ x: 24, y: 55, w: 32, fill: "text" }),
  ],
});

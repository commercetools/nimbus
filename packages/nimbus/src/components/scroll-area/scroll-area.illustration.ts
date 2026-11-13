import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "scroll-area",
  draw: ({ panel, pill }) => [
    panel({ x: 20, y: 16, w: 56, h: 64, radius: "300" }),
    pill({ x: 28, y: 26, w: 34, fill: "textStrong" }),
    pill({ x: 28, y: 34, w: 28, fill: "text" }),
    pill({ x: 28, y: 42, w: 34, fill: "text" }),
    pill({ x: 28, y: 50, w: 24, fill: "text" }),
    pill({ x: 28, y: 58, w: 34, fill: "text" }),
    pill({ x: 28, y: 66, w: 28, fill: "text" }),
    pill({ x: 28, y: 74, w: 34, h: 1.5, fill: "text" }),
    pill({ x: 68, y: 24, w: 3, h: 48, fill: "track" }),
    pill({ x: 68, y: 28, w: 3, h: 20, fill: "strong" }),
  ],
});

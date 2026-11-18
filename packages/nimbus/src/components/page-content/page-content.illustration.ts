import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "page-content",
  draw: ({ panel, dashed, pill, rect }) => [
    panel({ x: 12, y: 14, w: 72, h: 68, radius: "300" }),
    dashed({ x: 28, y: 20, w: 40, h: 56, radius: "50", color: "icon" }),
    pill({ x: 34, y: 28, w: 20, h: 4, fill: "textStrong" }),
    pill({ x: 34, y: 38, w: 28, fill: "text" }),
    pill({ x: 34, y: 44, w: 28, fill: "text" }),
    pill({ x: 34, y: 50, w: 20, fill: "text" }),
    rect({ x: 34, y: 58, w: 28, h: 12, fill: "tint", radius: "100" }),
  ],
});

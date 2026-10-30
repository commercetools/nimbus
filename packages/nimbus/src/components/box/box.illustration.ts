import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "box",
  draw: ({ panel, dashed, pill }) => [
    panel({ x: 16, y: 20, w: 64, h: 56, radius: "300" }),
    dashed({ x: 24, y: 28, w: 48, h: 40, radius: "100", color: "icon" }),
    pill({ x: 30, y: 36, w: 28, fill: "textStrong" }),
    pill({ x: 30, y: 44, w: 36, fill: "text" }),
    pill({ x: 30, y: 52, w: 24, fill: "text" }),
  ],
});

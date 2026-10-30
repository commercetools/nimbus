import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "form-action-bar",
  draw: ({ panel, pill, line }) => [
    panel({ x: 12, y: 16, w: 72, h: 64, radius: "300" }),
    pill({ x: 20, y: 24, w: 32, fill: "textStrong" }),
    pill({ x: 20, y: 32, w: 44, fill: "text" }),
    pill({ x: 20, y: 38, w: 36, fill: "text" }),
    line({ x1: 12, y1: 56, x2: 84, y2: 56 }),
    pill({ x: 20, y: 65.5, w: 16, fill: "text" }),
    panel({ x: 44, y: 62, w: 14, h: 10, radius: "100", shadow: false }),
    pill({ x: 47, y: 66.5, w: 8, fill: "text" }),
    panel({
      x: 62,
      y: 62,
      w: 14,
      h: 10,
      radius: "100",
      tone: "strong",
      shadow: false,
    }),
    pill({ x: 65, y: 66.5, w: 8, fill: "onStrong" }),
  ],
});

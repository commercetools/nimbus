import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "popover",
  draw: ({ panel, pill }) => [
    panel({ x: 34, y: 20, w: 28, h: 12, radius: "200", tone: "strong" }),
    pill({ x: 42, y: 24.5, w: 12, fill: "onStrong" }),
    panel({ x: 20, y: 40, w: 56, h: 36, radius: "300" }),
    pill({ x: 28, y: 48, w: 24, fill: "textStrong" }),
    pill({ x: 28, y: 56, w: 36, fill: "text" }),
    pill({ x: 28, y: 62, w: 28, fill: "text" }),
  ],
});

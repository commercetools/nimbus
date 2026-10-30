import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "checkbox",
  draw: ({ panel, pill, checkbox }) => [
    panel({ x: 16, y: 28, w: 64, h: 40, radius: "300" }),
    checkbox({ x: 24, y: 36, size: 8, checked: true }),
    pill({ x: 38, y: 38.5, w: 30, fill: "textStrong" }),
    checkbox({ x: 24, y: 52, size: 8 }),
    pill({ x: 38, y: 54.5, w: 24, fill: "text" }),
  ],
});

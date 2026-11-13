import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "toggle-button-group",
  draw: ({ panel, rect, pill }) => [
    panel({ x: 16, y: 40, w: 64, h: 16, radius: "200" }),
    rect({ x: 37, y: 40, w: 22, h: 16, fill: "strong" }),
    pill({ x: 22, y: 46.5, w: 10, fill: "text" }),
    pill({ x: 42, y: 46.5, w: 12, fill: "onStrong" }),
    pill({ x: 64, y: 46.5, w: 10, fill: "text" }),
  ],
});

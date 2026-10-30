import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "toggle-button",
  draw: ({ panel, pill }) => [
    panel({ x: 16, y: 38, w: 28, h: 20, radius: "200" }),
    pill({ x: 22, y: 46.5, w: 16, fill: "text" }),
    panel({ x: 52, y: 38, w: 28, h: 20, radius: "200", tone: "strong" }),
    pill({ x: 58, y: 46.5, w: 16, fill: "onStrong" }),
  ],
});

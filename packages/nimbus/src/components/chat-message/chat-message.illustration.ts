import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "chat-message",
  draw: ({ panel, pill, dot }) => [
    dot({ cx: 24, cy: 40, r: 4, fill: "strong" }),
    panel({ x: 32, y: 32, w: 44, h: 16, radius: "300" }),
    pill({ x: 38, y: 36, w: 28, fill: "text" }),
    pill({ x: 38, y: 42, w: 20, fill: "text" }),
    panel({ x: 36, y: 54, w: 44, h: 12, radius: "300", tone: "strong" }),
    pill({ x: 42, y: 58.5, w: 26, fill: "onStrong" }),
  ],
});

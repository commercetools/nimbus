import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-cursors",
  draw: ({ panel, pill, cursor }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    panel({ x: 24, y: 32, w: 32, h: 12, radius: "200", tone: "strong" }),
    pill({ x: 31, y: 36.5, w: 18, fill: "onStrong" }),
    pill({ x: 24, y: 54, w: 28, fill: "text" }),
    pill({ x: 24, y: 61, w: 20, fill: "text" }),
    cursor({ x: 56, y: 44 }),
  ],
});

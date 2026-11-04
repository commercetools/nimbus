import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-blurs",
  draw: ({ panel, circle, rect }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    // a dot half hidden behind a frosted pane: the blur
    circle({ cx: 40, cy: 48, r: 10, fill: "strong" }),
    rect({ x: 46, y: 30, w: 26, h: 36, radius: "200", fill: "tint" }),
  ],
});

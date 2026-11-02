import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-aspect-ratios",
  draw: ({ panel, dashed, rect, icons, stroke }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    // a frame with a 16:9 shape, and a square one beside it
    dashed({ x: 22, y: 28, w: 36, h: 20, radius: "100", color: "strong" }),
    rect({ x: 24, y: 30, w: 32, h: 16, radius: "50", fill: "tint" }),
    stroke(icons.mountains(40, 38), { color: "icon", w: 0.85 }),
    rect({ x: 62, y: 28, w: 12, h: 12, radius: "50", fill: "track" }),
    rect({ x: 22, y: 54, w: 20, h: 14, radius: "50", fill: "track" }),
    rect({ x: 46, y: 54, w: 28, h: 14, radius: "50", fill: "tint" }),
  ],
});

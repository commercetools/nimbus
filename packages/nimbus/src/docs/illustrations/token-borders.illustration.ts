import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-borders",
  draw: ({ panel, stroke, shape, dashed }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    // three outlines: thin, thick and dashed
    stroke(shape("M24,32 H72 V40 H24 Z", { x1: 24, y1: 32, x2: 72, y2: 40 }), {
      color: "icon",
      w: 0.5,
    }),
    stroke(shape("M24,46 H72 V54 H24 Z", { x1: 24, y1: 46, x2: 72, y2: 54 }), {
      color: "strong",
      w: 2,
    }),
    dashed({ x: 24, y: 60, w: 48, h: 8, radius: "50", color: "icon" }),
  ],
});

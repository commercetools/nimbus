import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-sizes",
  draw: ({ panel, rect, stroke, shape }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    // three squares in growing sizes, on one baseline
    rect({ x: 24, y: 52, w: 8, h: 8, radius: "100", fill: "tint" }),
    rect({ x: 36, y: 46, w: 14, h: 14, radius: "100", fill: "track" }),
    rect({ x: 54, y: 38, w: 22, h: 22, radius: "100", fill: "strong" }),
    // baseline with the size of the largest square
    stroke(
      shape("M54,67 H76 M54,65 V69 M76,65 V69", {
        x1: 54,
        y1: 65,
        x2: 76,
        y2: 69,
      }),
      { color: "icon", w: 0.75 }
    ),
  ],
});

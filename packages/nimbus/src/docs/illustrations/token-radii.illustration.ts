import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-radii",
  draw: ({ panel, stroke, shape }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    // four corners, from sharp to round
    ...[1, 3, 6, 10].map((r, i) => {
      const x = 24 + (i % 2) * 26;
      const y = 30 + Math.floor(i / 2) * 20;
      return stroke(
        shape(
          `M${x},${y + 14} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} H${x + 18}`,
          {
            x1: x,
            y1: y,
            x2: x + 18,
            y2: y + 14,
          }
        ),
        { color: "strong", w: 1.5 }
      );
    }),
  ],
});

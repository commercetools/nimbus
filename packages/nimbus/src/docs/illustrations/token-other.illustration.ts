import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-other",
  draw: ({ panel, dot }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    // a grid of small dots: the rest of the tokens
    ...[0, 1, 2].flatMap((row) =>
      [0, 1, 2, 3].map((col) =>
        dot({
          cx: 28 + col * 14,
          cy: 34 + row * 14,
          r: 3,
          fill: (row + col) % 3 === 0 ? "strong" : "track",
        })
      )
    ),
  ],
});

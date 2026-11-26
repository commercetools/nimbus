import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "stack",
  draw: ({ panel, pill, stroke, shape }) => [
    ...[22, 42, 62].map((y, i) => [
      panel({
        x: 16,
        y,
        w: 64,
        h: 12,
        radius: "200",
        tone: i === 0 ? "strong" : "surface",
      }),
      pill({
        x: 24,
        y: y + 4.5,
        w: 12 + i * 8,
        fill: i === 0 ? "onStrong" : "text",
      }),
    ]),
    ...[34, 54].map((y) =>
      stroke(
        shape(`M72,${y} V${y + 8} M69.5,${y} h5 M69.5,${y + 8} h5`, {
          x1: 69.5,
          y1: y,
          x2: 74.5,
          y2: y + 8,
        }),
        { color: "icon", w: 0.75 }
      )
    ),
  ],
});

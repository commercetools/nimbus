import { defineIllustration } from "@/illustration-kit";

const SWATCHES = ["tint", "track", "textStrong", "strong"] as const;

export default defineIllustration({
  name: "design-tokens",
  draw: ({ panel, rect, stroke, shape }) => [
    panel({ x: 16, y: 22, w: 64, h: 50, radius: "200" }),
    // colors: one hue in four steps
    ...SWATCHES.map((fill, i) =>
      rect({ x: 22 + i * 14, y: 28, w: 10, h: 10, radius: "100", fill })
    ),
    // spacing: four growing gaps
    stroke(
      shape(
        [
          [22, 4],
          [30, 8],
          [42, 12],
          [58, 16],
        ]
          .map(([x, w]) => `M${x},45 v4 M${x},47 h${w} M${x + w},45 v4`)
          .join(" "),
        { x1: 22, y1: 45, x2: 74, y2: 49 }
      ),
      { color: "icon", w: 0.75 }
    ),
    // radii: four growing corners
    stroke(
      shape(
        [1, 3, 6, 10]
          .map((r, i) => {
            const x = 22 + i * 14;
            return `M${x},66 V${56 + r} A${r},${r} 0 0 1 ${x + r},56 H${x + 10}`;
          })
          .join(" "),
        { x1: 22, y1: 56, x2: 74, y2: 66 }
      ),
      { color: "icon", w: 1 }
    ),
  ],
});

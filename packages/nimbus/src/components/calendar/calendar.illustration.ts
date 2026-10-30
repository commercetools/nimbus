import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "calendar",
  draw: ({ panel, pill, circle, dot, stroke, icons }) => [
    panel({ x: 16, y: 20, w: 64, h: 56, radius: "300" }),
    stroke(icons.chevronLeft(24, 28), { color: "icon", w: 0.85 }),
    pill({ x: 38, y: 26.5, w: 20, fill: "textStrong" }),
    stroke(icons.chevronRight(72, 28), { color: "icon", w: 0.85 }),
    ...[0, 1, 2, 3, 4, 5, 6].map((col) =>
      pill({ x: 22 + col * 8, y: 36.5, w: 4, h: 1.5, fill: "text" })
    ),
    ...[46, 54, 62, 70].flatMap((cy, row) =>
      [0, 1, 2, 3, 4, 5, 6].map((col) =>
        row === 1 && col === 3
          ? circle({ cx: 24 + col * 8, cy, r: 3.5, fill: "strong" })
          : dot({ cx: 24 + col * 8, cy, r: 2.2, fill: "muted" })
      )
    ),
  ],
});

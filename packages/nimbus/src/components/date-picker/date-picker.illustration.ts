import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "date-picker",
  draw: ({ panel, pill, circle, dot, stroke, icons }) => [
    panel({ x: 20, y: 20, w: 56, h: 12, radius: "200" }),
    pill({ x: 26, y: 24.5, w: 20, fill: "textStrong" }),
    stroke(icons.calendar(68, 26), { color: "icon", w: 0.75 }),
    panel({ x: 20, y: 36, w: 56, h: 40, radius: "300" }),
    stroke(icons.chevronLeft(28, 43), { color: "icon", w: 0.85 }),
    pill({ x: 40, y: 41.5, w: 16, fill: "textStrong" }),
    stroke(icons.chevronRight(68, 43), { color: "icon", w: 0.85 }),
    ...[52, 60, 68].flatMap((cy, row) =>
      [0, 1, 2, 3, 4, 5, 6].map((col) =>
        row === 1 && col === 3
          ? circle({ cx: 28 + col * 6.67, cy, r: 3.2, fill: "strong" })
          : dot({ cx: 28 + col * 6.67, cy, r: 1.8, fill: "muted" })
      )
    ),
  ],
});

import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "range-calendar",
  draw: ({ panel, band, pill, circle, dot, stroke, icons }) => [
    panel({ x: 16, y: 20, w: 64, h: 56, radius: "300" }),
    stroke(icons.chevronLeft(24, 28), { color: "icon", w: 0.85 }),
    pill({ x: 38, y: 26.5, w: 20, fill: "textStrong" }),
    stroke(icons.chevronRight(72, 28), { color: "icon", w: 0.85 }),
    ...[0, 1, 2, 3, 4, 5, 6].map((col) =>
      pill({ x: 22 + col * 8, y: 36.5, w: 4, h: 1.5, fill: "text" })
    ),
    band({ x: 56, y: 50.5, w: 16, h: 7 }),
    band({ x: 24, y: 58.5, w: 16, h: 7 }),
    ...[46, 54, 62, 70].flatMap((cy, row) =>
      [0, 1, 2, 3, 4, 5, 6].map((col) => {
        const cx = 24 + col * 8;
        const edge = (row === 1 && col === 4) || (row === 2 && col === 2);
        const inside =
          (row === 1 && col === 5) ||
          (row === 1 && col === 6) ||
          (row === 2 && col === 0) ||
          (row === 2 && col === 1);
        return edge
          ? circle({ cx, cy, r: 3.5, fill: "strong" })
          : dot({ cx, cy, r: 2.2, fill: inside ? "text" : "muted" });
      })
    ),
  ],
});

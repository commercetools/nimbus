import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "list-box",
  draw: ({ panel, rect, pill, stroke, icons }) => [
    panel({ x: 20, y: 20, w: 56, h: 56, radius: "200" }),
    rect({ x: 24, y: 37.5, w: 48, h: 11, fill: "tint", radius: "100" }),
    ...[31, 43, 55, 67].map((cy, i) =>
      pill({
        x: 30,
        y: cy - 1.5,
        w: [28, 32, 24, 30][i],
        fill: i === 1 ? "textStrong" : "text",
      })
    ),
    stroke(icons.check(66, 43, 0.9), { color: "strong", w: 1 }),
  ],
});

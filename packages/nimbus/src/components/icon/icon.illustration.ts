import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "icon",
  draw: ({ panel, stroke, icons, dot }) => [
    ...[
      { x: 26, y: 26 },
      { x: 50, y: 26 },
      { x: 26, y: 50 },
      { x: 50, y: 50 },
    ].map(({ x, y }) => panel({ x, y, w: 20, h: 20, radius: "200" })),
    stroke(icons.check(36, 36, 1.6), { color: "icon", w: 1 }),
    stroke(icons.calendar(60, 36), { color: "icon", w: 0.85 }),
    stroke(icons.globe(36, 60), { color: "icon", w: 0.85 }),
    stroke(icons.eye(60, 60), { color: "icon", w: 0.85 }),
    dot({ cx: 60, cy: 60, r: 1.1, fill: "icon" }),
  ],
});

import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "split-button",
  draw: ({ panel, pill, stroke, cursor, icons, shape }) => [
    panel({ x: 20, y: 40, w: 56, h: 16, radius: "200", tone: "strong" }),
    pill({ x: 28, y: 46.5, w: 20, fill: "onStrong" }),
    stroke(shape("M62,43 v10", { x1: 62, y1: 43, x2: 62, y2: 53 }), {
      color: "onStrong",
      w: 0.5,
    }),
    stroke(icons.chevronDown(69, 48), { color: "onStrong", w: 0.85 }),
    cursor({ x: 66, y: 52 }),
  ],
});

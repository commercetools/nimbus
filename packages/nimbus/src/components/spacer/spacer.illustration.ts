import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "spacer",
  draw: ({ panel, pill, dashed, stroke, shape }) => [
    panel({ x: 16, y: 36, w: 24, h: 24, radius: "200" }),
    pill({ x: 21, y: 46.5, w: 14, fill: "text" }),
    panel({ x: 56, y: 36, w: 24, h: 24, radius: "200" }),
    pill({ x: 61, y: 46.5, w: 14, fill: "text" }),
    dashed({ x: 40, y: 36, w: 16, h: 24, radius: "50", color: "icon" }),
    stroke(
      shape("M43,48 H53 M43,45.5 v5 M53,45.5 v5", {
        x1: 43,
        y1: 45.5,
        x2: 53,
        y2: 50.5,
      }),
      { color: "icon", w: 0.75 }
    ),
  ],
});

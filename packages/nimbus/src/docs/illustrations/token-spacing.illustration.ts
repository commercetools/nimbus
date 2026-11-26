import { defineIllustration } from "@/illustration-kit";

/** Block x positions: the gaps between them grow from left to right. */
const BLOCKS = [22, 34, 48, 66];

export default defineIllustration({
  name: "token-spacing",
  draw: ({ panel, rect, stroke, shape }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    ...BLOCKS.map((x) =>
      rect({ x, y: 30, w: 8, h: 20, radius: "100", fill: "strong" })
    ),
    // one bracket under each gap
    stroke(
      shape(
        "M30,60 h4 M30,57.5 v5 M34,57.5 v5 M42,60 h6 M42,57.5 v5 M48,57.5 v5 M56,60 h10 M56,57.5 v5 M66,57.5 v5",
        { x1: 30, y1: 57.5, x2: 66, y2: 62.5 }
      ),
      { color: "icon", w: 0.75 }
    ),
  ],
});

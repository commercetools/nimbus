import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "flex",
  draw: ({ panel, stroke, shape }) => [
    panel({ x: 12, y: 36, w: 16, h: 24, radius: "200" }),
    panel({ x: 36, y: 36, w: 24, h: 24, radius: "200", tone: "strong" }),
    panel({ x: 68, y: 36, w: 16, h: 24, radius: "200" }),
    stroke(
      shape("M28,48 H36 M28,45.5 v5 M36,45.5 v5", {
        x1: 28,
        y1: 45.5,
        x2: 36,
        y2: 50.5,
      }),
      { color: "icon", w: 0.75 }
    ),
    stroke(
      shape("M60,48 H68 M60,45.5 v5 M68,45.5 v5", {
        x1: 60,
        y1: 45.5,
        x2: 68,
        y2: 50.5,
      }),
      { color: "icon", w: 0.75 }
    ),
  ],
});

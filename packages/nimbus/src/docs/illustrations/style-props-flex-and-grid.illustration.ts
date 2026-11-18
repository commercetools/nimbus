import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "style-props-flex-and-grid",
  draw: ({ panel, rect }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    // a row of items on top, a grid of cells below
    rect({ x: 22, y: 28, w: 12, h: 10, radius: "100", fill: "strong" }),
    rect({ x: 38, y: 28, w: 20, h: 10, radius: "100", fill: "strong" }),
    rect({ x: 62, y: 28, w: 12, h: 10, radius: "100", fill: "strong" }),
    rect({ x: 22, y: 44, w: 24, h: 10, radius: "100", fill: "track" }),
    rect({ x: 50, y: 44, w: 24, h: 10, radius: "100", fill: "track" }),
    rect({ x: 22, y: 58, w: 24, h: 10, radius: "100", fill: "track" }),
    rect({ x: 50, y: 58, w: 24, h: 10, radius: "100", fill: "track" }),
  ],
});

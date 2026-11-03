import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "style-props-layout",
  draw: ({ panel, rect, pill }) => [
    // a page: header, sidebar and content area
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    rect({ x: 22, y: 28, w: 52, h: 8, radius: "100", fill: "strong" }),
    rect({ x: 22, y: 40, w: 14, h: 28, radius: "100", fill: "track" }),
    rect({ x: 40, y: 40, w: 34, h: 28, radius: "100", fill: "tint" }),
    pill({ x: 44, y: 46, w: 20, fill: "text" }),
    pill({ x: 44, y: 53, w: 26, fill: "muted" }),
  ],
});

import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "item-group",
  draw: ({ panel, pill, listRow, line }) => [
    panel({ x: 16, y: 20, w: 64, h: 56, radius: "300" }),
    pill({ x: 24, y: 27, w: 20, h: 2.5, fill: "textStrong" }),
    listRow({ x: 16, y: 34, w: 64 }),
    line({ x1: 22, y1: 46, x2: 74, y2: 46 }),
    listRow({ x: 16, y: 46, w: 64 }),
    line({ x1: 22, y1: 58, x2: 74, y2: 58 }),
    listRow({ x: 16, y: 58, w: 64 }),
  ],
});

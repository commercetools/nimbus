import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "date-input",
  draw: ({ panel, pill, stroke, icons, shape }) => [
    panel({ x: 16, y: 40, w: 64, h: 16, radius: "200" }),
    pill({ x: 22, y: 46.5, w: 8, fill: "textStrong" }),
    stroke(shape("M33.5,51 l3,-6", { x1: 33.5, y1: 45, x2: 36.5, y2: 51 }), {
      color: "icon",
      w: 0.75,
    }),
    pill({ x: 40, y: 46.5, w: 8, fill: "textStrong" }),
    stroke(shape("M51.5,51 l3,-6", { x1: 51.5, y1: 45, x2: 54.5, y2: 51 }), {
      color: "icon",
      w: 0.75,
    }),
    pill({ x: 58, y: 46.5, w: 10, fill: "textStrong" }),
    stroke(icons.calendar(74, 48), { color: "icon", w: 0.75 }),
  ],
});

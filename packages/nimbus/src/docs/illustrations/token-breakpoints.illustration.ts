import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-breakpoints",
  draw: ({ panel, pill, stroke, shape, dashed }) => [
    // a wide screen, with a narrow one inside
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    pill({ x: 22, y: 28, w: 24, fill: "text" }),
    pill({ x: 22, y: 36, w: 36, fill: "text" }),
    dashed({ x: 22, y: 46, w: 36, h: 22, radius: "100", color: "icon" }),
    // the breakpoint, as a vertical guide
    stroke(shape("M64,28 V68", { x1: 64, y1: 28, x2: 64, y2: 68 }), {
      color: "strong",
      w: 1,
    }),
  ],
});

import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-shadows",
  draw: ({ panel, pill }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200", shadow: false }),
    // cards that lift off the page: flat, raised and high
    panel({ x: 22, y: 38, w: 16, h: 24, radius: "100", shadow: false }),
    panel({ x: 40, y: 34, w: 16, h: 24, radius: "100" }),
    panel({ x: 58, y: 28, w: 16, h: 24, radius: "100" }),
    pill({ x: 25, y: 50, w: 10, fill: "text" }),
    pill({ x: 43, y: 46, w: 10, fill: "text" }),
    pill({ x: 61, y: 40, w: 10, fill: "text" }),
  ],
});

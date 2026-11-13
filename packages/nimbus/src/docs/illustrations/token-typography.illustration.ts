import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-typography",
  draw: ({ panel, pill }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    // a type scale: heading, subheading and body lines
    pill({ x: 24, y: 29, w: 30, h: 6, fill: "textStrong" }),
    pill({ x: 24, y: 41, w: 22, h: 4, fill: "text" }),
    pill({ x: 24, y: 51, w: 48, fill: "text" }),
    pill({ x: 24, y: 58, w: 42, fill: "text" }),
    pill({ x: 24, y: 65, w: 34, fill: "text" }),
  ],
});

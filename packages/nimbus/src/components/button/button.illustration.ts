import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "button",
  draw: ({ panel, pill, cursor }) => [
    panel({ x: 24, y: 40, w: 48, h: 16, radius: "200", tone: "strong" }),
    pill({ x: 36, y: 46.5, w: 24, fill: "onStrong" }),
    cursor({ x: 62, y: 52 }),
  ],
});

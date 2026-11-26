import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-z-indices",
  draw: ({ panel }) => [
    // three layers, each one above the last
    panel({ x: 20, y: 24, w: 30, h: 26, radius: "200" }),
    panel({ x: 32, y: 36, w: 30, h: 26, radius: "200", tone: "strong" }),
    panel({ x: 46, y: 48, w: 30, h: 26, radius: "200" }),
  ],
});

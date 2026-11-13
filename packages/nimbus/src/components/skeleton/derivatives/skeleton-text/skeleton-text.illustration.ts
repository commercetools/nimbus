import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "skeleton-text",
  draw: ({ pill }) => [
    pill({ x: 16, y: 34, w: 64, fill: "track" }),
    pill({ x: 16, y: 42, w: 64, fill: "track" }),
    pill({ x: 16, y: 50, w: 64, fill: "track" }),
    pill({ x: 16, y: 58, w: 40, fill: "track" }),
  ],
});

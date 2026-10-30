import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "skeleton-circle",
  draw: ({ dot }) => [
    dot({ cx: 22, cy: 48, r: 6, fill: "track" }),
    dot({ cx: 40, cy: 48, r: 10, fill: "track" }),
    dot({ cx: 66, cy: 48, r: 16, fill: "track" }),
  ],
});

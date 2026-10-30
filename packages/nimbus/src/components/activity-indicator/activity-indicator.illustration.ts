import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "activity-indicator",
  draw: ({ dot }) => [
    dot({ cx: 34, cy: 48, r: 4, fill: "text" }),
    dot({ cx: 48, cy: 48, r: 4, fill: "textStrong" }),
    dot({ cx: 62, cy: 48, r: 4, fill: "strong" }),
  ],
});

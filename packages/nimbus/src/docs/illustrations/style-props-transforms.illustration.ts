import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "style-props-transforms",
  draw: ({ panel, dashed, stroke, icons }) => [
    // the element in place, and the same element moved and scaled up
    dashed({ x: 14, y: 44, w: 20, h: 20, radius: "200", color: "icon" }),
    stroke(icons.arrowRight(44, 54), { color: "icon", w: 1 }),
    panel({ x: 54, y: 34, w: 30, h: 30, radius: "300", tone: "strong" }),
  ],
});

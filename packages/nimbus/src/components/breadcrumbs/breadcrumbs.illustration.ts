import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "breadcrumbs",
  draw: ({ panel, pill, stroke, icons }) => [
    panel({ x: 10, y: 38, w: 76, h: 20, radius: "200" }),
    pill({ x: 18, y: 46.5, w: 14, fill: "text" }),
    stroke(icons.chevronRight(37, 48), { color: "icon", w: 0.85 }),
    pill({ x: 42, y: 46.5, w: 16, fill: "text" }),
    stroke(icons.chevronRight(63, 48), { color: "icon", w: 0.85 }),
    pill({ x: 68, y: 46.5, w: 12, fill: "textStrong" }),
  ],
});

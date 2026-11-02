import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "icons",
  draw: ({ panel, pill, rect, stroke, icons }) => [
    panel({ x: 18, y: 18, w: 60, h: 60, radius: "200" }),
    // search field
    panel({ x: 24, y: 24, w: 48, h: 10, radius: "200", shadow: false }),
    stroke(icons.search(30, 29), { color: "icon", w: 0.85 }),
    pill({ x: 37, y: 27.5, w: 16, fill: "text" }),
    // results, the match is selected
    rect({ x: 26, y: 41, w: 12, h: 12, radius: "200", fill: "strong" }),
    stroke(icons.star(32, 47), { color: "onStrong", w: 0.85 }),
    ...[
      icons.clock(48, 47),
      icons.upload(64, 47),
      icons.calendar(32, 64),
      icons.warning(48, 64),
      icons.info(64, 64),
    ].map((path) => stroke(path, { color: "icon", w: 0.85 })),
  ],
});

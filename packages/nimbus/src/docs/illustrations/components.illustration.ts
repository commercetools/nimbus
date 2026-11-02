import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "components",
  draw: ({ panel, pill, dashed, cursor }) => [
    // blocks that are already in place
    panel({ x: 12, y: 52, w: 32, h: 24, radius: "200", tone: "strong" }),
    pill({ x: 18, y: 62.5, w: 20, fill: "onStrong" }),
    panel({ x: 48, y: 52, w: 36, h: 24, radius: "200" }),
    pill({ x: 54, y: 58.5, w: 24, fill: "textStrong" }),
    pill({ x: 54, y: 66.5, w: 14, fill: "text" }),
    // the open slot
    dashed({ x: 12, y: 24, w: 32, h: 24, radius: "200", color: "icon" }),
    // a block lifted on its way to the slot
    panel({ x: 48, y: 20, w: 36, h: 24, radius: "200" }),
    panel({
      x: 54,
      y: 28,
      w: 18,
      h: 8,
      radius: "200",
      tone: "strong",
      shadow: false,
    }),
    pill({ x: 58, y: 30.5, w: 10, fill: "onStrong" }),
    cursor({ x: 74, y: 34 }),
  ],
});

import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "meter",
  draw: ({ panel, pill }) => [
    pill({ x: 16, y: 33, w: 24, fill: "onBg" }),
    pill({ x: 62, y: 33, w: 18, fill: "onBg" }),
    panel({
      x: 16,
      y: 42,
      w: 24,
      h: 8,
      radius: "50",
      tone: "strong",
      shadow: false,
    }),
    panel({
      x: 41,
      y: 42,
      w: 16,
      h: 8,
      radius: "50",
      tone: "text",
      shadow: false,
    }),
    panel({
      x: 58,
      y: 42,
      w: 22,
      h: 8,
      radius: "50",
      tone: "track",
      shadow: false,
    }),
    ...(
      [
        { x: 16, tone: "strong" },
        { x: 40, tone: "text" },
        { x: 64, tone: "track" },
      ] as const
    ).flatMap(({ x, tone }) => [
      panel({ x, y: 58, w: 4, h: 4, radius: "50", tone, shadow: false }),
      pill({ x: x + 7, y: 58.5, w: 10, fill: "onBg" }),
    ]),
  ],
});

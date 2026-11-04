import { defineIllustration } from "@/illustration-kit";

/** Centers of the three hooked tiles: hotkeys, copy, drag and drop. */
const HOTKEY = 24;
const COPY = 48;
const DRAG = 72;
const MID = 56;

export default defineIllustration({
  name: "hooks",
  draw: ({ panel, rect, stroke, shape }) => [
    // a rail of hooks
    rect({ x: 12, y: 31, w: 72, h: 4, radius: "full", fill: "textStrong" }),
    ...[HOTKEY, COPY, DRAG].map((cx) =>
      panel({ x: cx - 10, y: 46, w: 20, h: 20, radius: "200" })
    ),
    stroke(
      shape(
        [HOTKEY, COPY, DRAG]
          .map((cx) => `M${cx + 3},35 V43 A3,3 0 0 1 ${cx - 3},43 V40`)
          .join(" "),
        { x1: 21, y1: 35, x2: 75, y2: 46 }
      ),
      { color: "icon", w: 1.75 }
    ),
    // each one holds a behavior: a hotkey (the command key)
    stroke(
      shape(
        [
          `M${HOTKEY - 1.5},${MID - 3} V${MID + 3}`,
          `M${HOTKEY + 1.5},${MID - 3} V${MID + 3}`,
          `M${HOTKEY - 3},${MID - 1.5} H${HOTKEY + 3}`,
          `M${HOTKEY - 3},${MID + 1.5} H${HOTKEY + 3}`,
          `M${HOTKEY - 1.5},${MID - 3} A1.5,1.5 0 1 0 ${HOTKEY - 3},${MID - 1.5}`,
          `M${HOTKEY + 1.5},${MID - 3} A1.5,1.5 0 1 1 ${HOTKEY + 3},${MID - 1.5}`,
          `M${HOTKEY - 1.5},${MID + 3} A1.5,1.5 0 1 1 ${HOTKEY - 3},${MID + 1.5}`,
          `M${HOTKEY + 1.5},${MID + 3} A1.5,1.5 0 1 0 ${HOTKEY + 3},${MID + 1.5}`,
        ].join(" "),
        { x1: HOTKEY - 4.5, y1: MID - 4.5, x2: HOTKEY + 4.5, y2: MID + 4.5 }
      ),
      { color: "icon", w: 0.85 }
    ),
    // copy to clipboard: two sheets
    stroke(
      shape(
        [
          `M${COPY - 1},${MID - 2} h5 a1,1 0 0 1 1,1 v5 a1,1 0 0 1 -1,1 h-5 a1,1 0 0 1 -1,-1 v-5 a1,1 0 0 1 1,-1 Z`,
          `M${COPY - 5},${MID + 2} V${MID - 4} a1,1 0 0 1 1,-1 H${COPY + 2}`,
        ].join(" "),
        { x1: COPY - 5, y1: MID - 5, x2: COPY + 5, y2: MID + 5 }
      ),
      { color: "icon", w: 0.85 }
    ),
    // drag and drop: move arrows
    stroke(
      shape(
        [
          `M${DRAG},${MID - 5} V${MID + 5} M${DRAG - 5},${MID} H${DRAG + 5}`,
          `M${DRAG - 1.75},${MID - 3.25} L${DRAG},${MID - 5} L${DRAG + 1.75},${MID - 3.25}`,
          `M${DRAG - 1.75},${MID + 3.25} L${DRAG},${MID + 5} L${DRAG + 1.75},${MID + 3.25}`,
          `M${DRAG - 3.25},${MID - 1.75} L${DRAG - 5},${MID} L${DRAG - 3.25},${MID + 1.75}`,
          `M${DRAG + 3.25},${MID - 1.75} L${DRAG + 5},${MID} L${DRAG + 3.25},${MID + 1.75}`,
        ].join(" "),
        { x1: DRAG - 5, y1: MID - 5, x2: DRAG + 5, y2: MID + 5 }
      ),
      { color: "icon", w: 0.85 }
    ),
  ],
});

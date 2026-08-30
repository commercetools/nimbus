import "@testing-library/jest-dom/vitest";

// jsdom implements no SVG geometry. visx/d3 marks never need real measurements
// here (charts receive explicit width/height), but a few code paths call these
// APIs defensively — stub them so a render never throws in jsdom.
const svgProto = globalThis.SVGElement?.prototype as
  | (SVGElement & {
      getBBox?: () => { x: number; y: number; width: number; height: number };
      getComputedTextLength?: () => number;
    })
  | undefined;

if (svgProto && !svgProto.getBBox) {
  svgProto.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 });
}
if (svgProto && !svgProto.getComputedTextLength) {
  svgProto.getComputedTextLength = () => 0;
}

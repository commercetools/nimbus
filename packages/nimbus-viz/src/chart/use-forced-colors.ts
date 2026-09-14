import { useEffect, useState } from "react";

const QUERY = "(forced-colors: active)";

function detect(): boolean {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

/**
 * `true` in a forced-colors context (Windows High Contrast, `forced-colors:
 * active`). Because chart paint is inline SVG `fill`/`stroke` set from JS — which
 * the OS palette does NOT override the way it does CSS backgrounds — charts must
 * react in JS: switch series to `CanvasText`/system colors and turn on the
 * `ChartPatternDefs` textures so identity survives on shape, not hue. SSR/jsdom
 * without `matchMedia` resolves to `false` and never throws.
 */
export function useForcedColors(): boolean {
  const [forced, setForced] = useState<boolean>(detect);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const mql = window.matchMedia(QUERY);
    const onChange = () => setForced(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  return forced;
}

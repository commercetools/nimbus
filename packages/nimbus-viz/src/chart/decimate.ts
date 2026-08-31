export interface XYPoint {
  x: number;
  y: number;
}

/**
 * Largest-Triangle-Three-Buckets downsampling for dense line/area series. Keeps
 * the visually significant points (peaks, troughs, inflections) while cutting a
 * multi-thousand-point series to `threshold` points, so a chart renders far
 * fewer DOM nodes without visibly changing shape. The reusable data-side of the
 * large-N story (a Canvas renderer is the complementary per-chart piece).
 *
 * `x` must be numeric and ascending (convert Date → epoch first). Returns a copy
 * of the input when it's already at or under `threshold`, and always preserves
 * the first and last points.
 */
export function lttb<T extends XYPoint>(
  data: readonly T[],
  threshold: number
): T[] {
  const n = data.length;
  if (threshold >= n || threshold < 3) return data.slice();

  const sampled: T[] = [];
  const bucketSize = (n - 2) / (threshold - 2);
  let a = 0; // first point is always kept
  sampled.push(data[a]);

  for (let i = 0; i < threshold - 2; i++) {
    // Average point of the *next* bucket (the triangle's far vertex).
    let avgX = 0;
    let avgY = 0;
    const avgStart = Math.floor((i + 1) * bucketSize) + 1;
    const avgEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, n);
    const avgLen = Math.max(1, avgEnd - avgStart);
    for (let j = avgStart; j < avgEnd; j++) {
      avgX += data[j].x;
      avgY += data[j].y;
    }
    avgX /= avgLen;
    avgY /= avgLen;

    // Pick the point in the current bucket that forms the largest triangle.
    const rangeStart = Math.floor(i * bucketSize) + 1;
    const rangeEnd = Math.floor((i + 1) * bucketSize) + 1;
    const pa = data[a];
    let maxArea = -1;
    let next = rangeStart;
    for (let j = rangeStart; j < rangeEnd; j++) {
      const area =
        Math.abs(
          (pa.x - avgX) * (data[j].y - pa.y) -
            (pa.x - data[j].x) * (avgY - pa.y)
        ) * 0.5;
      if (area > maxArea) {
        maxArea = area;
        next = j;
      }
    }
    sampled.push(data[next]);
    a = next;
  }

  sampled.push(data[n - 1]);
  return sampled;
}

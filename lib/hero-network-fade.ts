export type NetworkPoint = { x: number; y: number };
export type NetworkRect = NetworkPoint & { width: number; height: number };

/** Smooth value and slope at both ends, including the distance cutoff. */
export function smoothOpacity(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}
export function connectionOpacity(distance: number, reach: number) {
  return reach > 0 ? 1 - smoothOpacity(distance / reach) : 0;
}
export function approachOpacity(current: number, target: number, seconds: number) {
  return current + (target - current) * (1 - Math.exp(-Math.max(0, seconds) / .22));
}
function distanceToRect(point: NetworkPoint, rect: NetworkRect, margin = 0) {
  const dx = Math.max(rect.x - margin - point.x, 0, point.x - rect.x - rect.width - margin);
  const dy = Math.max(rect.y - margin - point.y, 0, point.y - rect.y - rect.height - margin);
  return dx && dy ? Math.sqrt(dx * dx + dy * dy) : Math.max(dx, dy);
}
export function boundaryOpacity(point: NetworkPoint, width: number, height: number, photos: NetworkRect[]) {
  let alpha = smoothOpacity(Math.min(point.x, width - point.x, point.y, height - point.y) / 36);
  // Fully transparent before the hard safety clip, not just inside the photograph.
  photos.forEach(photo => { alpha *= smoothOpacity(distanceToRect(point, photo, 2) / 64); });
  return alpha;
}
function textOpacity(point: NetworkPoint, text: NetworkRect[]) {
  let alpha = 1;
  for (const rect of text) {
    // Most samples are either inside a text block or well outside its feather.
    if (point.x < rect.x - 24 || point.x > rect.x + rect.width + 24 || point.y < rect.y - 24 || point.y > rect.y + rect.height + 24) continue;
    alpha = Math.min(alpha, .5 + .5 * smoothOpacity(distanceToRect(point, rect) / 24));
    if (alpha === .5) break;
  }
  return alpha;
}

/** Vary alpha along the segment; fading endpoints alone still leaves a cut edge. */
export function lineFadeStops(a: NetworkPoint, b: NetworkPoint, width: number, height: number, photos: NetworkRect[], text: NetworkRect[]) {
  const offsets = new Set<number>([0, 1]);
  const dx = b.x - a.x, dy = b.y - a.y;
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 12));
  for (let i = 1; i < steps; i++) offsets.add(i / steps);
  const crossing = (origin: number, delta: number, edge: number) => {
    if (!delta) return;
    const t = (edge - origin) / delta;
    if (t > 0 && t < 1) offsets.add(t);
  };
  [0, 36, width - 36, width].forEach(x => crossing(a.x, dx, x));
  [0, 36, height - 36, height].forEach(y => crossing(a.y, dy, y));
  // Include the exact safety boundary, so interpolation cannot bridge across it.
  for (const rect of photos) for (const margin of [2, 66]) {
    [rect.x - margin, rect.x + rect.width + margin].forEach(x => crossing(a.x, dx, x));
    [rect.y - margin, rect.y + rect.height + margin].forEach(y => crossing(a.y, dy, y));
  }
  return [...offsets].sort((x, y) => x - y).map(offset => {
    const point = { x: a.x + dx * offset, y: a.y + dy * offset };
    return { offset, opacity: boundaryOpacity(point, width, height, photos) * textOpacity(point, text) };
  });
}

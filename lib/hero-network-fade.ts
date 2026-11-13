export type NetworkPoint = { x: number; y: number };
export type NetworkRect = NetworkPoint & { width: number; height: number };

export function expandRect(rect: NetworkRect, margin: number): NetworkRect {
  return { x: rect.x - margin, y: rect.y - margin, width: rect.width + margin * 2, height: rect.height + margin * 2 };
}
export function segmentIntersectsRect(a: NetworkPoint, b: NetworkPoint, rect: NetworkRect) {
  let enter = 0, leave = 1;
  for (const [origin, delta, low, high] of [[a.x, b.x - a.x, rect.x, rect.x + rect.width], [a.y, b.y - a.y, rect.y, rect.y + rect.height]]) {
    if (delta === 0) { if (origin < low || origin > high) return false; continue; }
    const near = (low - origin) / delta, far = (high - origin) / delta;
    enter = Math.max(enter, Math.min(near, far)); leave = Math.min(leave, Math.max(near, far));
    if (enter > leave) return false;
  }
  return true;
}
function pointSegmentDistance(p: NetworkPoint, a: NetworkPoint, b: NetworkPoint) {
  const dx = b.x - a.x, dy = b.y - a.y, lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared)) : 0;
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
}
/** Reject the entire segment: never cut a surviving line around individual letters. */
export function segmentClearanceOpacity(a: NetworkPoint, b: NetworkPoint, forbidden: NetworkRect[]) {
  let alpha = 1;
  for (const rect of forbidden) {
    if (segmentIntersectsRect(a, b, rect)) return 0;
    const corners = [{ x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y },
      { x: rect.x, y: rect.y + rect.height }, { x: rect.x + rect.width, y: rect.y + rect.height }];
    const distance = Math.min(distanceToRect(a, rect), distanceToRect(b, rect), ...corners.map(p => pointSegmentDistance(p, a, b)));
    alpha = Math.min(alpha, smoothOpacity(distance / 24));
  }
  return alpha;
}
/** A soft light stays wholly inside a free pocket, away from photo clipping. */
export function backgroundPocket(width: number, height: number, photos: NetworkRect[]): NetworkRect {
  let pockets: NetworkRect[] = [{ x: 16, y: 16, width: Math.max(0, width - 32), height: Math.max(0, height - 32) }];
  for (const photo of photos) {
    const cut = expandRect(photo, 48);
    pockets = pockets.flatMap(p => {
      const left = Math.max(p.x, cut.x), right = Math.min(p.x + p.width, cut.x + cut.width);
      const top = Math.max(p.y, cut.y), bottom = Math.min(p.y + p.height, cut.y + cut.height);
      if (left >= right || top >= bottom) return [p];
      return [{ x: p.x, y: p.y, width: p.width, height: top - p.y },
        { x: p.x, y: bottom, width: p.width, height: p.y + p.height - bottom },
        { x: p.x, y: top, width: left - p.x, height: bottom - top },
        { x: right, y: top, width: p.x + p.width - right, height: bottom - top }].filter(r => r.width > 0 && r.height > 0);
    });
  }
  return pockets.sort((a, b) => b.width * b.height - a.width * a.height)[0] || { x: 0, y: 0, width: 0, height: 0 };
}

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

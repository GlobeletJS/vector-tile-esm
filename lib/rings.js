export function classifyRings(rings) {
  // Classifies an array of rings into polygons with outer rings and holes
  if (rings.length <= 1) return [rings];

  var polygons = [];
  var polygon, ccw;

  rings.forEach(ring => {
    let area = signedArea(ring);
    if (area === 0) return;

    if (ccw === undefined) ccw = area < 0;

    if (ccw === area < 0) {
      if (polygon) polygons.push(polygon);
      polygon = [ring];

    } else {
      polygon.push(ring);
    }
  });
  if (polygon) polygons.push(polygon);

  return polygons;
}

function signedArea(ring) {
  const xmul = (p1, p2) => (p2.x - p1.x) * (p1.y + p2.y);

  const accumulate = (sum, p1, i, array) => sum + xmul(p1, array[i-1]);

  const initialValue = xmul(ring[0], ring[ring.length - 1]);

  return ring.reduce(accumulate, initialValue); // * 0.5;
}

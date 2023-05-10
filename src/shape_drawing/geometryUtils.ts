export const distance = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Add this function to calculate the variance of the distances to the centroid
export const calculateDistanceVariance = (
  path: Array<{ x: number; y: number }>,
  centroid: { x: number; y: number }
): number => {
  let sum = 0;
  let sumSq = 0;

  for (const point of path) {
    const dist = distance(point, centroid);
    sum += dist;
    sumSq += dist * dist;
  }

  const mean = sum / path.length;
  const variance = sumSq / path.length - mean * mean;

  return variance;
};


// Calculate the centroid of the path
export const calculateCentroid = (
  path: Array<{ x: number; y: number }>
): { x: number; y: number } => {
  let sumX = 0;
  let sumY = 0;

  for (const point of path) {
    sumX += point.x;
    sumY += point.y;
  }

  const centroidX = sumX / path.length;
  const centroidY = sumY / path.length;

  return { x: centroidX, y: centroidY };
};


export const calculateAngle = (
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
) => {
  const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
  return Math.abs(angle2 - angle1);
};

import {calculateAngle, calculateCentroid, calculateDistanceVariance} from './geometryUtils'
import { Point, Shape } from './types'

export const classifyPath = (
  path: Array<{ x: number; y: number }>
): "line" | "circle" | "freehand" => {
  if (path.length < 1) {
    return "freehand";
  }

  // Check for straight line
  let isStraightLine = true;
  for (let i = 1; i < path.length - 1; i++) {
    const angle = calculateAngle(path[i - 1], path[i], path[i + 1]);
    if (angle > Math.PI * 0.7 || angle < Math.PI * 0.3) {
      isStraightLine = false;
      break;
    }
  }

  if (isStraightLine) {
    return "line";
  }

  // Check for circle
  const centroid = calculateCentroid(path);
  const variance = calculateDistanceVariance(path, centroid);
  const circleThreshold = 10; // Adjust this value to control circle detection sensitivity

  if (variance < circleThreshold) {
    return "circle";
  }
  return "freehand";
};

// Add this function to create a perfect circle path
export const createCirclePath = (
  centroid: { x: number; y: number },
  radius: number,
  numPoints: number
): Array<{ x: number; y: number }> => {
  const circlePath = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints;
    circlePath.push({
      x: centroid.x + radius * Math.cos(angle),
      y: centroid.y + radius * Math.sin(angle),
    });
  }

  return circlePath;
};

export const isPathClosed = (path: Point[]) => {
  if (path.length < 2) return false;

  const firstPoint = path[0];
  const lastPoint = path[path.length - 1];
  const threshold = 10;

  // Calculate the distance between the first and last points
  const distance = Math.sqrt(
    Math.pow(lastPoint.x - firstPoint.x, 2) +
      Math.pow(lastPoint.y - firstPoint.y, 2)
  );

  return distance < threshold;
};

export const  isInsideShape = (point:Point, shape:Shape) => {
  let {x,y} = point
  let points = shape.path
  var inside = false;
  for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
    var xi = points[i].x, yi = points[i].y;
    var xj = points[j].x, yj = points[j].y;
    var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
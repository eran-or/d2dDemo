import { useState, useEffect, MouseEvent, useCallback } from "react";
import simplify from "simplify-js";

export const useShapeDrawing = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  image: HTMLImageElement | null
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapePath, setShapePath] = useState<{ x: number; y: number }[]>([]);
  const [isPathComplete, setIsPathComplete] = useState(false);
  const [shapes, setShapes] = useState<Array<Array<Point>>>([]);

  const snapDistance = 10;

  const distance = (
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ): number => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Calculate the centroid of the path
  const calculateCentroid = (
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

  // Add this function to calculate the variance of the distances to the centroid
  const calculateDistanceVariance = (
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

  const classifyPath = (
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

  
  const smoothPath = (path: Array<{ x: number; y: number }>) => {
    if (path.length < 3) {
      return path;
    }

    const newPath = [path[0]];
    let isStraightLine = true;

    for (let i = 1; i < path.length - 1; i++) {
      const angle = calculateAngle(path[i - 1], path[i], path[i + 1]);
      if (angle > Math.PI * 0.7 || angle < Math.PI * 0.3) {
        newPath.push(path[i]);
        isStraightLine = false;
      }
    }
    newPath.push(path[path.length - 1]);
    return isStraightLine ? newPath : simplify(newPath, 2);
  };

  // Add this function to create a perfect circle path
  const createCirclePath = (
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

  type Point = {
    x: number;
    y: number;
  };

  const isPathClosed = (path: Point[]) => {
    if (path.length < 2) return false;

    const firstPoint = path[0];
    const lastPoint = path[path.length - 1];
    const threshold = 10; // You can adjust this value as needed

    // Calculate the distance between the first and last points
    const distance = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) +
        Math.pow(lastPoint.y - firstPoint.y, 2)
    );

    return distance < threshold;
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    const point = getCanvasMouseCoords(e, canvasRef.current);
  
    if (!isDrawing) {
      setIsDrawing(true);
  
      if (!isPathComplete) {
        // If the previous path is not complete, add the new point to the current path
        setShapePath((prevShapePath) => [...prevShapePath, point]);
      } else {
        // If the previous path is complete, start a new path
        setShapePath([point]);
        setIsPathComplete(false);
      }
    } else {
      setShapePath((prevShapePath) => [...prevShapePath, point]);
  
      if (shapePath.length > 2) {
        const isClosed = isPathClosed([...shapePath, point]);
        if (isClosed) {
          setIsPathComplete(true);
          setShapes((prevShapes) => [...prevShapes, [...shapePath, point]]);
          setShapePath([]);
        }
      }
    }
  
    // Clear the previous shapePath and set isPathComplete to false when starting a new path
    if (!isPathComplete) {
      setShapePath([]);
      setIsPathComplete(false);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
  if (!canvasRef.current || !isDrawing) return;

  const point = getCanvasMouseCoords(e, canvasRef.current);
  setIsDrawing(false);
  setShapePath((prevShapePath) => [...prevShapePath, point]);

  const isClosed = isPathClosed([...shapePath, point]);
  if (isClosed) {
    setIsPathComplete(true);
    setShapes((prevShapes) => [...prevShapes, [...shapePath, point]]);
    setShapePath([]);
  } else {
    setIsPathComplete(false);
  }
};

  const undoLastEdge = () => {
    setShapePath((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
  
      // Remove the last point in the path
      return prev.slice(0, prev.length - 1);
    });
  };
  

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current || !isDrawing || isPathComplete) return;
    const point = getCanvasMouseCoords(e, canvasRef.current);
    setShapePath((prevShapePath) => [...prevShapePath, point]);
  };

  const snapToVertex = (x: number, y: number) => {
    if (shapePath.length === 0) return false;

    const firstPoint = shapePath[0];
    const dx = Math.abs(x - firstPoint.x);
    const dy = Math.abs(y - firstPoint.y);

    return dx <= snapDistance && dy <= snapDistance;
  };

  const calculateAngle = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number }
  ) => {
    const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    return Math.abs(angle2 - angle1);
  };
  
  const draw = useCallback(() => {
    
    if (!canvasRef.current || !image) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
  
    const drawShapes = (ctx: CanvasRenderingContext2D) => {
      shapes.forEach((shape) => {
        if (shape.length === 0) return;
  
        ctx.beginPath();
        ctx.moveTo(shape[0].x, shape[0].y);
  
        for (let i = 1; i < shape.length; i++) {
          ctx.lineTo(shape[i].x, shape[i].y);
        }
  
        ctx.closePath();
        ctx.stroke();
      });
    };
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
    // Draw the image
    ctx.drawImage(
      image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  
    // Draw the stored shapes
    drawShapes(ctx);
  
    // Draw the currently active shape
    if (shapePath.length > 0) {
      ctx.beginPath();
      ctx.moveTo(shapePath[0].x, shapePath[0].y);
  
      for (let i = 1; i < shapePath.length; i++) {
        ctx.lineTo(shapePath[i].x, shapePath[i].y);
      }

      // Only call closePath() when isPathComplete is true
      if (isPathComplete) {
        ctx.closePath();
      }
      ctx.stroke();
    }
  }, [canvasRef, image, shapePath, shapes, isPathComplete]);
  
  const getCanvasMouseCoords = (
    e: MouseEvent,
    canvas: HTMLCanvasElement
  ): Point => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  useEffect(() => {
      draw();
  }, [draw]);

  return { handleMouseDown, handleMouseUp, handleMouseMove, undoLastEdge };
};

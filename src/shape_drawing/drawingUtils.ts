import { MouseEvent } from 'react'
import { Point, Shape } from './types'
import { isInsideShape } from "./pathUtils";

export const draw = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  image: HTMLImageElement | null,
  shapes: Shape[],
  shapePath: Point[],
  isPathComplete: boolean
) => {
  if (!canvasRef.current || !image) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    shapes.forEach((shape) => {
      if (shape.path.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(shape.path[0].x, shape.path[0].y);
  
      for (let i = 1; i < shape.path.length; i++) {
        ctx.lineTo(shape.path[i].x, shape.path[i].y);
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
}


export const getCanvasMouseCoords = (
  e: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>
): Point | undefined => {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;
  const canvas = canvasRef.current
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
};

export const findIntersectingShape = (
  point: Point,
  shapes: Shape[]
): number => {
  for (let i = 0; i < shapes.length; i++) {
    if (isInsideShape(point, shapes[i])) {
      
      return i;
    }
  }
  return -1;
};
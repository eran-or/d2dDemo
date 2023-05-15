import { MouseEvent, RefObject } from "react";
import { Point, Shape } from "./types";
import { isInsideShape } from "./pathUtils";

interface DrawProps {
  canvasRef: React.RefObject<HTMLCanvasElement>,
  image?: HTMLImageElement | null,
  shapes: Shape[],
  shapePath: Point[],
  clearCanvas?: boolean
}
export const draw = ({
  canvasRef,
  image,
  shapes,
  shapePath
}:DrawProps) => {
  
  if (!canvasRef.current || !image) return;

  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;

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
    drawShapes(ctx, shapes);

  // Draw the currently active shape
  if (shapePath.length > 0) {
    ctx.beginPath();
    ctx.moveTo(shapePath[0].x, shapePath[0].y);

    for (let i = 1; i < shapePath.length; i++) {
      ctx.lineTo(shapePath[i].x, shapePath[i].y);
    }
    ctx.stroke();
  }else{
    ctx.closePath();
  }
};

export const drawShapes = (ctx: CanvasRenderingContext2D, shapes: Shape[]) => {
  
  shapes.forEach((shape) => {
    if (shape.path.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(shape.path[0].x, shape.path[0].y);

    for (let i = 1; i < shape.path.length; i++) {
      ctx.lineTo(shape.path[i].x, shape.path[i].y);
    }
    ctx.closePath();
    
    
    if(shape.onDropArea){
      // Fill the shape
      ctx.fillStyle = "gray";  // Set the fill color
      ctx.fill();  // Fill the shape
    }else{
      ctx.stroke();
    }
  });
};

export const getCanvasMouseCoords = (
  e: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>
): Point | undefined => {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  
  if (!ctx) return;
  const canvas = canvasRef.current;
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
interface DrawDraggableShapeProps {
  shapeCanvasRef: RefObject<HTMLCanvasElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  shape: Shape;
  leftmost: number;
  topmost: number;
  rightmost: number;
  bottommost: number;
}

export const drawDraggableShape = ({
  shapeCanvasRef, 
  canvasRef, 
  shape, 
  leftmost, 
  topmost, 
  rightmost, 
  bottommost
}:DrawDraggableShapeProps) => {
  
  if (!shapeCanvasRef.current || !canvasRef.current) return;
  const shapeContext = shapeCanvasRef.current.getContext("2d");
  if (!shapeContext) return;

  const ctx = canvasRef.current.getContext("2d");
  if(!ctx) return
  const width = (rightmost - leftmost)||1;
  const height = (bottommost - topmost)||1;

  shapeCanvasRef.current.width = width;
  shapeCanvasRef.current.height = height;

  // Draw the shape on the new canvas
  shapeContext.beginPath();
  shapeContext.moveTo(shape.path[0].x - leftmost, shape.path[0].y - topmost);


  for (let i = 1; i < shape.path.length; i++) {
    shapeContext.lineTo(shape.path[i].x - leftmost, shape.path[i].y - topmost);
  }

  shapeContext.closePath();

  // Save the state of the context
  shapeContext.save();

  // Clip the shape
  shapeContext.clip();

  // Draw the background image from the main canvas
  shapeContext.drawImage(
    canvasRef.current,
    -leftmost,
    -topmost,
    canvasRef.current.width,
    canvasRef.current.height
  );

  // Restore the state of the context
  shapeContext.restore();

};

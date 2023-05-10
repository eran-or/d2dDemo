import { DragEvent, useCallback } from "react";
import { Point } from './shape_drawing/types'
interface DragAndDropHandlers {
  onShapeDragStart: (e: DragEvent)=> void;
  handleDrop: (e: React.DragEvent<HTMLCanvasElement>, shape: Array<{ x: number; y: number }>) => void;
}

export const useDragAndDropShapes = (shapeIndex: number, dragStartPosition: Point): DragAndDropHandlers => {
  
  const onShapeDragStart = (e: DragEvent<Element>) => {
    console.log(e);
    // e.dataTransfer.setData("shape", JSON.stringify(shape));
  };

  const handleDrop = (e: React.DragEvent<HTMLCanvasElement>) => {
    // e.preventDefault();
    console.log(e);
    
    // const shapeIndex = e.dataTransfer.getData("text/plain");
    // const droppedShape = shapes[shapeIndex];

    // if (droppedShape) {
    //   onShapeDropped(droppedShape);
    // }
  };

  return { onShapeDragStart, handleDrop };

};

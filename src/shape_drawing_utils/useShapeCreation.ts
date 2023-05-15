import { useState, MouseEvent } from "react";
import { Point, Shape } from "./types";
import { getCanvasMouseCoords, findIntersectingShape } from "./drawingUtils";
import { isPathClosed } from "./pathUtils";
import { v4 as uuidv4 } from 'uuid';

interface ShapeCreationCallbacks {
  onShapeCreated: (newShape: Shape) => void;
  onShapeUndo: (newShape: Shape) => void;
  drawCurrentShape?: (shapePath:Point[]) => void;
  onShapeDragStart?: (shapeIndex: number) => void;
}

interface ShapeCreationArgs {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  callbacks: ShapeCreationCallbacks;
}

interface ShapeCreationReturn {
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  undoLastShape: () => void;
  shapes: Shape[];
  shapePath: Point[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>
}


export const useShapeCreation = ({
  canvasRef,
  callbacks,
}: ShapeCreationArgs): ShapeCreationReturn => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapePath, setShapePath] = useState<Point[]>([]);
  const [shapes, setShapes] = useState<Array<Shape>>([]);
  const { onShapeCreated, onShapeUndo } = callbacks 
  
  const undoLastShape = () => {
    const lastShape = shapes[shapes.length-1]
    if(lastShape?.onDropArea){
      alert("can't undo shapes on drop area, please delete first the shape")
      return 
    }

    setShapes((prevShapes) => {
      const shapesCopy = [...prevShapes];
      const removed = shapesCopy.pop();
      if(removed){
        onShapeUndo(removed)
      }
      return shapesCopy;
    });
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!canvasRef || !canvasRef.current) return;
    const point = getCanvasMouseCoords(e, canvasRef);
    if (!point) return;
    const clickedShapeIndex = findIntersectingShape(point, shapes);
    
    if(clickedShapeIndex === -1){
      setIsDrawing(true);
      setShapePath([point]);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!canvasRef.current || !isDrawing) return;

    if(shapePath.length<2){
      setIsDrawing(false);
      setShapePath([]);
      return
    }

    const point = getCanvasMouseCoords(e, canvasRef);
    if (!point) return;
  
    // Finish the shape
    setShapePath((prevShapePath) => [...prevShapePath, point]);
  
    if (!isPathClosed(shapePath)) {
      const startPoint = shapePath[0];
      setShapePath((prevShapePath) => [...prevShapePath, startPoint]);
    }
    
    const newShape: Shape = {
      id: uuidv4(),
      path: shapePath,
      onDropArea:false,
    };
    
    setShapes((prevShapes) => [...prevShapes, newShape]);
    onShapeCreated(newShape)    
    setIsDrawing(false);
    setShapePath([]);
  }; 

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current || !isDrawing) return;
    const point = getCanvasMouseCoords(e, canvasRef);
    if (point) {
      setShapePath((prevShapePath) => [...prevShapePath, point]);
    }
  };

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    undoLastShape,
    shapePath,
    shapes,
    setShapes
  };
};

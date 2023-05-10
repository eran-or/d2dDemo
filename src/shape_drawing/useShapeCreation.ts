import { useState, MouseEvent, useRef } from "react";
import { Point, Shape } from "./types";
import { getCanvasMouseCoords, findIntersectingShape } from "./drawingUtils";
import { isInsideShape, isPathClosed } from "./pathUtils";
import { v4 as uuidv4 } from 'uuid';


interface ShapeCreationCallbacks {
  onShapeCreated: (newShape: Shape) => void;
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
  // clearAllShapes: () => void;
  undoLastShape: () => void;
  shapes: Shape[];
}


export const useShapeCreation = ({
  canvasRef,
  callbacks,
}: ShapeCreationArgs): ShapeCreationReturn => {
  const snapDistance = 10;
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapePath, setShapePath] = useState<Point[]>([]);
  const [isPathComplete, setIsPathComplete] = useState(false);
  const [shapes, setShapes] = useState<Array<Shape>>([]);
  let isDraggingRef = useRef(false);
  let selectedShapeIndexRef = useRef<number | undefined>();
  const { onShapeCreated, onShapeDragStart } = callbacks 
  
  const undoLastShape = () => {
    setShapes((prevShapes) => {
      const shapesCopy = [...prevShapes];
      shapesCopy.pop();
      return shapesCopy;
    });
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!canvasRef.current) return;
  
    const point = getCanvasMouseCoords(e, canvasRef);
    if (!point) return;
    
    setIsDrawing(true);
    setShapePath([point]);
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!canvasRef.current || !isDrawing) return;
    const point = getCanvasMouseCoords(e, canvasRef);
    if (!point) return;
    
    // Finish the shape
  setShapePath((prevShapePath) => [...prevShapePath, point]);
  let isClosed = isPathClosed(shapePath);
  while (!isClosed) {
    const startPoint = shapePath[0];
    setShapePath((prevShapePath) => [...prevShapePath, startPoint]);
    isClosed = isPathClosed(shapePath);
  }
      const newShape: Shape = {
        id: uuidv4(),
        path: shapePath,
        backgroundData: null,
      };
      
      setShapes((prevShapes) => [...prevShapes, newShape]);
      setIsDrawing(false);
      setShapePath([]);
      
      onShapeCreated(newShape);
   
  };  

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current || !isDrawing) return;
    const point = getCanvasMouseCoords(e, canvasRef);
    if (point) {
      const newShapePath = [...shapePath, point];
      if (isPathClosed(newShapePath)) {
        setIsPathComplete(true);
        setIsDrawing(false);
        setShapePath(newShapePath);
      } else {
        setShapePath(newShapePath);
      }
    }
  };

  // // We expose these as callbacks for when a shape starts and finishes being drawn
  // const onShapeStart = (shapeIndex: number, dragStartPosition: Point) => {
  //   // You could put any logic you want here. For now, we'll just log it
  //   console.log(
  //     `Shape ${shapeIndex} started being drawn at position:`,
  //     dragStartPosition
  //   );
  // };

  // const onShapeComplete = (shape: Shape) => {
  //   // You could put any logic you want here. For now, we'll just log it
  //   console.log("Shape completed:", shape);
  //   setShapes((prevShapes) => [...prevShapes, shape]);
  //   setIsDrawing(false);
  //   setIsPathComplete(true);
  //   setShapePath([]);
  // };

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    undoLastShape,
    // clearAllShapes,
    // onShapeStart,
    // onShapeComplete,
    shapes,
  };
};

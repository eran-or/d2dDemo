import { useEffect, useRef, useState } from "react";
import { useShapeCreation } from "./shape_drawing_utils/useShapeCreation";
import { FileInput } from "./FileInput";
import { resizeImage } from "./helpers/helpers";
import { Shape } from "./shape_drawing_utils/types";
import { DraggableShapeList } from "./draggable_shape_list/DraggableShapeList";
import { ShapeDropArea } from "./ShapeDropArea";
import {draw} from './shape_drawing_utils/drawingUtils'

export const PuzzleEditor: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggableShapes, setDraggableShapes] = useState<Shape[]>([]);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const imageCanvasContainerRef = useRef<HTMLDivElement>(null);
  const {
    shapes,
    undoLastShape,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setShapes,
    shapePath
  } = useShapeCreation({
    canvasRef,
    callbacks: {
      onShapeCreated: (shape: Shape) => {
        // Add the new shape to the list of draggable shapes
        setDraggableShapes((prevShapes) => [...prevShapes, shape]);
      },
      onShapeUndo: (shape:Shape) => {
        setDraggableShapes((prevShapes) => prevShapes.filter(_=>_.id !== shape.id));
      }
    },
  });

  useEffect(() => {
    draw({canvasRef, image, shapes, shapePath});
  }, [canvasRef, image, shapes, shapePath, draggableShapes]);
  
  useEffect(() => {
    if (!canvasRef.current || !image) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    const { newWidth, newHeight } = resizeImage(image, 500, 500, 100, 100);
    canvasRef.current.width = newWidth;
    canvasRef.current.height = newHeight;
    context.drawImage(image, 0, 0, newWidth, newHeight);
  }, [canvasRef, image]);

  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        setImage(img);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleShapeDelete = (id:string, leftmost:number, topmost:number)=>{
    const updatedShapes = addRemoveFromDropArea(id, "remove")
    const el = document.getElementById(id)
    
    if(el&&dropAreaRef.current){
      imageCanvasContainerRef.current?.appendChild(el)
      el.style.left = leftmost+"px"
      el.style.top = topmost+"px"
    }
    setShapes(updatedShapes)
  }

  const addRemoveFromDropArea = (id:string, action:string) => {
    let isOnDropArea = action === "add"? true : false
    return shapes.map((shape) => {
      if(shape.id === id){
        shape.onDropArea = isOnDropArea
      }
      return shape
    })
  }

  const handleShapeDrop = (id:string)=>{
    const updatedShapes = addRemoveFromDropArea(id, "add")
    setShapes(updatedShapes)
  }
  
  
  return (
    <>
      <div className="flex items-center">
        <button className="btn-primary block h-fit mx-2 min-w-min" onClick={undoLastShape}>
          Undo Last Shape
        </button>
        <FileInput onFileChange={handleFileChange} />
      </div>
      <div className="flex min-h-[300px]">
        <div ref={imageCanvasContainerRef} className="relative flex-1 bg-gainsboro">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
          <DraggableShapeList
            shapes={draggableShapes}
            canvasRef={canvasRef}
            onShapeDelete={handleShapeDelete}
          /> 
        </div>
         <div className="flex-1 bg-stone-100">
          <ShapeDropArea ref={dropAreaRef} onShapeDrop={handleShapeDrop} />
        </div>
      </div>
    </>
  );
};

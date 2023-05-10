import { useEffect, useRef, useState } from "react";
import { useShapeCreation } from "./shape_drawing/useShapeCreation";
import { useCanvasRendering } from "./shape_drawing/useCanvasRendering";
import { FileInput } from "./FileInput";
import { resizeImage } from './helpers'
import { Shape } from './shape_drawing/types'
import { ShapeDrawer } from "./shape_drawing/ShapeDrawer";
import { ShapeDropArea } from "./ShapeDropArea";


// Canvas for displaying the uploaded image and drawing the shape
export const PuzzleEditor: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const [shapes, setShapes] = useState<Shape[]>([]);
  const {shapes, undoLastShape, handleMouseDown, handleMouseMove, handleMouseUp} = useShapeCreation({canvasRef, callbacks:{
    onShapeCreated: (shape: Shape) => {
      // Add the new shape to the list of draggable shapes
      setShapes((prevShapes) => [...prevShapes, shape]);
    },
  }});
  
  useCanvasRendering({ canvasRef, image, shapes: shapes });

  useEffect(() => {
    if (!canvasRef.current || !image) return;
    const context = canvasRef.current.getContext('2d');
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

  const handleShapeDrop = (shape: Shape) => {
    // Implement your shape drop logic here
  };

  return (
    <div>
      <FileInput onFileChange={handleFileChange} />
      <button onClick={undoLastShape}>Undo Last Shape</button>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <ShapeDrawer />
      <ShapeDropArea onShapeDrop={handleShapeDrop} />
    </div>
  );
};

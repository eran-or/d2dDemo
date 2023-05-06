import { useEffect, useRef } from "react";
import { useShapeDrawing } from "./useShapeDrawing";

export interface ImageCanvasProps {
  image: HTMLImageElement | null;
  onUndo: (undoFunc: () => void) => void;
}

// Canvas for displaying the uploaded image and drawing the shape
export const ImageCanvas: React.FC<ImageCanvasProps> = ({ image, onUndo }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { handleMouseDown, handleMouseUp, handleMouseMove, undoLastEdge } = useShapeDrawing(canvasRef, image);
  const undoLastEdgeRef = useRef(undoLastEdge);
  const resizeImage = (img: HTMLImageElement, maxWidth: number, maxHeight: number, minWidth: number, minHeight: number) => {
    const aspectRatio = img.width / img.height;
    let newWidth = maxWidth;
    let newHeight = maxHeight;
  
    if (img.width > maxWidth || img.height > maxHeight) {
      if (img.width > img.height) {
        newWidth = maxWidth;
        newHeight = maxWidth / aspectRatio;
      } else {
        newWidth = maxHeight * aspectRatio;
        newHeight = maxHeight;
      }
    } else if (img.width < minWidth || img.height < minHeight) {
      if (img.width < img.height) {
        newWidth = minWidth;
        newHeight = minWidth / aspectRatio;
      } else {
        newWidth = minHeight * aspectRatio;
        newHeight = minHeight;
      }
    } else {
      newWidth = img.width;
      newHeight = img.height;
    }
  
    return { newWidth, newHeight };
  };
  
  useEffect(() => {
    if (!canvasRef.current || !image) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

  const { newWidth, newHeight } = resizeImage(image, 500, 500, 100, 100);
  canvasRef.current.width = newWidth;
  canvasRef.current.height = newHeight;
  context.drawImage(image, 0, 0, newWidth, newHeight);

  }, [canvasRef, image]);
  
  useEffect(() => {
    undoLastEdgeRef.current = undoLastEdge;
  }, [undoLastEdge]);

  useEffect(() => {
    const handleUndo = () => {
      undoLastEdgeRef.current();
    };
    onUndo(handleUndo);
  }, [onUndo]);
  
  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};
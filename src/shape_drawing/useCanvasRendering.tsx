import { useEffect } from "react";
import { resizeImage } from '../helpers'

interface UseCanvasRenderingProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  image: HTMLImageElement | null;
}

export const useCanvasRendering = ({ canvasRef, image }: UseCanvasRenderingProps) => {
  
  useEffect(() => {
    if (!canvasRef.current || !image) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    const { newWidth, newHeight } = resizeImage(image, 500, 500, 100, 100);
    canvasRef.current.width = newWidth;
    canvasRef.current.height = newHeight;
    context.drawImage(image, 0, 0, newWidth, newHeight);

  }, [canvasRef, image]);
};
import { useRef } from "react";

// Canvas for displaying the cut-out shape
export const ShapeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // TODO: Implement shape cutting and moving to this canvas

  return (
    <canvas ref={canvasRef} width={500} height={500} />
  );
};
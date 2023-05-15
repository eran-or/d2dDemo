import React from "react";
import { Shape } from "../shape_drawing_utils/types";
import { DraggableShape } from "./DraggableShape";

interface DraggableShapeListProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  shapes: Shape[],
  onShapeDelete: (id:string, leftmost:number, topmost:number) => void;
}

export const DraggableShapeList: React.FC<DraggableShapeListProps> = ({canvasRef, shapes, onShapeDelete}) => {
  return (
    <>
      {shapes.map((shape, index) => {
        let leftmost = shape.path[0].x;
        let rightmost = shape.path[0].x;
        let topmost = shape.path[0].y;
        let bottommost = shape.path[0].y;
        for (let j = 1; j < shape.path.length; j++) {
          if (shape.path[j].x < leftmost) {
            leftmost = shape.path[j].x;
          }
          if (shape.path[j].x > rightmost) {
            rightmost = shape.path[j].x;
          }
          if (shape.path[j].y < topmost) {
            topmost = shape.path[j].y;
          }
          if (shape.path[j].y > bottommost) {
            bottommost = shape.path[j].y;
          }
        }
        
        return (
            <DraggableShape
              key={index}
              leftmost={leftmost}
              bottommost={bottommost}
              rightmost={rightmost}
              topmost={topmost}
              shape={shape}
              canvasRef = {canvasRef}
              onShapeDelete={onShapeDelete}
            />
      )})}
    </>
  );
};

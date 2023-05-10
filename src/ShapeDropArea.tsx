// TargetDroppable.tsx
import React from "react";
import { useDrop } from "react-dnd";
import { Shape } from './shape_drawing/types'

type ShapeDropAreaProps = {
  onShapeDrop: (shape: Shape) => void;
};

export const ShapeDropArea: React.FC<ShapeDropAreaProps> = ({ onShapeDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "shape",
    drop: (shape: Shape) => {
      onShapeDrop(shape);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        width: 300,
        height: 300,
        backgroundColor: isOver ? "lightgreen" : "lightgray",
      }}
    />
  );
};

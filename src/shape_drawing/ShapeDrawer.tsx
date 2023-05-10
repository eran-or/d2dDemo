import React, { useRef, useState } from 'react';
import { Shape, Point } from './types';
import { useShapeCreation } from './useShapeCreation';
import { DraggableShape } from '../DraggableShape';

export const ShapeDrawer: React.FC = () => {
  const [draggableShapes, setDraggableShapes] = useState<Shape[]>([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {shapes} = useShapeCreation({canvasRef, callbacks:{
    onShapeCreated: (shape: Shape) => {
      // Add the new shape to the list of draggable shapes
      setDraggableShapes((prevShapes) => [...prevShapes, shape]);
    },
  }});

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>

    <svg>
      {shapes.map((shape, index) => (
        <DraggableShape
          key={index}
          shape={shape}
          isSelected={index === selectedShapeIndex}
          onDrag={(draggedShape: Shape) => {
            // Update the position of the dragged shape
            setDraggableShapes((prevShapes) => prevShapes.map((shape, i) => i === index ? draggedShape : shape));
          }}
        />
      ))}
    </svg>
    </div>
  );
};

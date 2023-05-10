import React from 'react';
import { useDrag } from 'react-dnd';
import { Shape } from './shape_drawing/types';

interface DraggableShapeProps {
  shape: Shape;
  isSelected: boolean;
  onDrag?: (draggedShape: Shape) => void;
}

export const DraggableShape: React.FC<DraggableShapeProps> = ({ shape, isSelected, onDrag }) => {
  const [, drag] = useDrag(() => ({
    type: "shape",
    item: { id: shape.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // TODO: Convert the shape path to an SVG path string
  // This will depend on how you're representing the shapes
  

  return (
    <path
      d={shape.path.join(' ')}
      ref={drag}
      fill="none" stroke={isSelected ? 'red' : 'black'} />
  );
};

export default DraggableShape;

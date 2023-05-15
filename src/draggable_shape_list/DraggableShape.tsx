import React, { useRef } from "react";
import { Shape } from "../shape_drawing_utils/types";
import { drawDraggableShape } from "../shape_drawing_utils/drawingUtils";
import Delete from '../images/bin.png'

interface DraggableShapeProps {
  shape: Shape;
  leftmost: number;
  topmost: number;
  rightmost: number;
  bottommost: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onShapeDelete: (id:string, leftmost:number, topmost:number) => void;
}

export const DraggableShape: React.FC<DraggableShapeProps> = ({
  shape,
  leftmost,
  topmost,
  rightmost,
  bottommost,
  canvasRef,
  onShapeDelete,
}) => {
  const shapeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const draggableRef = useRef(null)
  const handleDragStart = (ev:React.DragEvent<HTMLDivElement>)=>{
    drawDraggableShape({
      shapeCanvasRef, 
      canvasRef, 
      shape, 
      leftmost, 
      topmost, 
      rightmost, 
      bottommost
    });
    ev.dataTransfer.setData("text", (ev.target as HTMLElement).id);
  }
  
  const handleShapeDelete = (id:string) => {
    draggableRef.current = null
    onShapeDelete(shape.id, leftmost, topmost)
  }

  return (
    <div
      ref={draggableRef}
      id={shape.id}
      onDragStart={handleDragStart}
      draggable
      className={`absolute`}
      style={{
        width:(rightmost - leftmost)+'px',
        height:(bottommost - topmost)+'px',
        left: leftmost,
        top: topmost,
      }}>
      {shape.onDropArea&&<img src={Delete} alt="" className="w-4 h-4 absolute cursor-pointer" onClick={()=>handleShapeDelete(shape.id)} />}
        <canvas ref={shapeCanvasRef} style={{width:'100%', height:'100%'}} />
      </div>
  );
};

export default DraggableShape;

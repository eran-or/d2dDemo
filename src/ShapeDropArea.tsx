import React, { forwardRef } from "react";
import { Shape } from './shape_drawing_utils/types'

type ShapeDropAreaProps = {
  onShapeDrop: (shape: string) => void;
};

export const ShapeDropArea = forwardRef<HTMLDivElement, ShapeDropAreaProps> (({ onShapeDrop }, ref) => {
 
const handleDrop = (ev: React.DragEvent<HTMLDivElement>)=>{
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var el = document.getElementById(data);
  
  if (el) {
    let target = (ev.target as HTMLElement)
    el.style.left = ev.clientX+"px"
    el.style.top = ev.clientY+"px"
    target.appendChild(el);
    onShapeDrop(data)
  }
}
const allowDrop = (ev:React.DragEvent) => {
  ev.preventDefault();
}
//The list of droped shapes is managed by the native drag of the browser and therefore the deletion of item is managed by the PuzzleEditor
  return (
    <div
      ref={ref}
      onDragOver={allowDrop}
      onDrop={handleDrop}
      className={`w-full h-full`}

    />
  );
});

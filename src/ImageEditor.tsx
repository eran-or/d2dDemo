import { useCallback, useState } from "react";
import { FileInput } from "./FileInput";
import { ShapeCanvas } from "./ShapeCanvas";
import { ImageCanvas } from "./ImageCanvas";

// Main component
const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [undoLastEdge, setUndoLastEdge] = useState<() => void>(() => () => {});


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

  const handleUndo = useCallback((undoFunc: () => void) => {
    setUndoLastEdge(() => undoFunc);
  }, []);

  return (
    <div>
      <FileInput onFileChange={handleFileChange} />
      <button className={"btn-primary"} onClick={undoLastEdge}>Undo Last Edge</button>
      <div className="flex">
      <ImageCanvas image={image} onUndo={handleUndo} />
      <ShapeCanvas />
      </div>
    </div>
  );
};

export default ImageEditor;
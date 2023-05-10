import React from 'react';
import { PuzzleEditor } from './PuzzleEditor';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
     <PuzzleEditor />
     </DndProvider>
  );
}

export default App;

import { useState } from "react";

export default function useDragAndDrop() {
  const [dragOver, setDragOver] = useState(false);
  const [fileDropError, setFileDropError] = useState(null);

  const onDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // to avoid occasional drop issues on Chrome pre-100
    setDragOver(true);
  };

  const onDragLeave = e => {
    setDragOver(false);
  };

  return {
    dragOver,
    setDragOver,
    onDragOver,
    onDragLeave,
    fileDropError,
    setFileDropError,
  };
}
// Import required libraries
import React, { useState, useRef, useEffect } from 'react';

// File input for image upload
export const FileInput: React.FC<{ onFileChange: (file: File) => void }> = ({ onFileChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <input type="file" accept="image/*" onChange={handleFileChange} />
  );
};
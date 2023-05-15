import React from "react";

export const FileInput: React.FC<{ onFileChange: (file: File) => void }> = ({
  onFileChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <input
      className={
        "w-min form-input form-file block text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      }
      role="button"
      type="file"
      accept="image/*"
      onChange={handleFileChange}
    />
  );
};

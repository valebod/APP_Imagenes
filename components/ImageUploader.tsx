import React, { useRef } from 'react';
import { UploadCloud } from './Icons';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-gray-800/50 transition-colors"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <UploadCloud className="w-12 h-12 text-gray-500 mb-2" />
      <p className="text-gray-400 font-semibold">Haz clic para subir una imagen</p>
      <p className="text-xs text-gray-500">PNG, JPG, o WEBP</p>
    </div>
  );
};

export default ImageUploader;
import React from 'react';
import ImageUploader from './ImageUploader';
import { ImageIcon } from './Icons';

interface ImageDisplayProps {
  originalImage: string | null;
  editedImage: string | null;
  isLoading: boolean;
  onUpload: (file: File) => void;
  onImageClick: (imageUrl: string) => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, editedImage, isLoading, onUpload, onImageClick }) => {
  return (
    <div className="w-full max-w-4xl p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className={`relative aspect-square bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden transition-all ${originalImage ? 'cursor-zoom-in hover:scale-105' : ''}`}
          onClick={() => originalImage && onImageClick(originalImage)}
        >
          {originalImage ? (
            <img src={originalImage} alt="Original" className="object-contain w-full h-full" />
          ) : (
            <ImageUploader onUpload={onUpload} />
          )}
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">Original</div>
        </div>
        <div 
          className={`relative aspect-square bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden transition-all ${editedImage ? 'cursor-zoom-in hover:scale-105' : ''}`}
          onClick={() => editedImage && onImageClick(editedImage)}
        >
          {isLoading && <LoadingSkeleton />}
          {!isLoading && editedImage && <img src={editedImage} alt="Editada" className="object-contain w-full h-full" />}
          {!isLoading && !editedImage && (
            <div className="text-center text-gray-500">
                <ImageIcon className="mx-auto h-16 w-16" />
                <p className="mt-2 text-lg">Tu imagen editada aparecerá aquí</p>
            </div>
          )}
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">Editada</div>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
    <div className="w-full h-full bg-gray-700 animate-pulse"></div>
);

export default ImageDisplay;
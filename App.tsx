import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { editImageWithGemini, getSuggestionWithGemini } from './services/geminiService';
import { ImageFile, EditOptions } from './types';
import ImageDisplay from './components/ImageDisplay';
import ControlPanel from './components/ControlPanel';
import ImageModal from './components/ImageModal';
import { Camera, MagicWand, AlertTriangle, Download } from './components/Icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [modalImage, setModalImage] = useState<string | null>(null);

  const [editOptions, setEditOptions] = useState<EditOptions>({
    style: null,
    lighting: null,
    composition: null,
  });

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile({
        file: file,
        base64: reader.result as string,
        mimeType: file.type,
      });
      setEditedImage(null);
      setError(null);
    };
    reader.onerror = () => {
      setError('Error al leer el archivo de imagen.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!imageFile) {
      setError('Por favor, sube una imagen primero.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const generatedImageBase64 = await editImageWithGemini(imageFile, editOptions, customPrompt);
      setEditedImage(`data:${imageFile.mimeType};base64,${generatedImageBase64}`);
    } catch (e) {
      console.error(e);
      setError('Error al generar la imagen. Revisa la consola para más detalles.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, editOptions, customPrompt]);

  const handleGetSuggestion = useCallback(async () => {
      setIsSuggesting(true);
      setError(null);
      try {
        const suggestion = await getSuggestionWithGemini(editOptions);
        setCustomPrompt(suggestion);
      } catch(e) {
        console.error(e);
        setError('Error al obtener sugerencias. Revisa la consola para más detalles.');
      } finally {
        setIsSuggesting(false);
      }
  }, [editOptions]);

  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    // Suggest a filename, user can change it
    const fileName = `editada-${imageFile?.file.name.split('.')[0] || 'imagen'}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleImageClick = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col lg:flex-row font-sans">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center relative">
        {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-800 border border-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-10">
                <AlertTriangle />
                <span>{error}</span>
            </div>
        )}
        <ImageDisplay 
          originalImage={imageFile?.base64 || null}
          editedImage={editedImage}
          isLoading={isLoading}
          onUpload={handleImageUpload}
          onImageClick={handleImageClick}
        />
        {!imageFile && (
          <div className="text-center text-gray-500 mt-8">
            <Camera className="mx-auto h-16 w-16" />
            <p className="mt-2 text-lg">Sube una imagen para empezar</p>
            <p className="text-sm">Tu viaje creativo comienza con un solo clic.</p>
          </div>
        )}
      </main>

      <aside className="w-full lg:w-96 bg-gray-800/50 backdrop-blur-sm border-l border-gray-700/50 flex flex-col">
        <div className="p-6 border-b border-gray-700/50">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MagicWand />
            Test Imágenes Profe Vale
          </h1>
          <p className="text-sm text-gray-400 mt-1">Edita tus imágenes con el poder de la IA.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
           <ControlPanel
            editOptions={editOptions}
            setEditOptions={setEditOptions}
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
            onGetSuggestion={handleGetSuggestion}
            isSuggesting={isSuggesting}
            disabled={!imageFile || isLoading}
          />
        </div>
       
        <div className="p-6 border-t border-gray-700/50 mt-auto sticky bottom-0 bg-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={!imageFile || isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center text-lg shadow-lg shadow-indigo-900/50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </>
              ) : 'Generar Imagen'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!editedImage || isLoading}
              className="flex-shrink-0 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold p-3 rounded-lg transition-colors duration-300"
              aria-label="Descargar imagen"
            >
              <Download className="h-6 w-6" />
            </button>
          </div>
        </div>
      </aside>
      
      {modalImage && <ImageModal imageUrl={modalImage} onClose={() => setModalImage(null)} />}
    </div>
  );
};

export default App;
import React from 'react';
import { EditOptions } from '../types';
import { STYLE_OPTIONS, LIGHTING_OPTIONS, COMPOSITION_OPTIONS } from '../constants';
import OptionSelector from './OptionSelector';
import { Sparkles } from './Icons';

interface ControlPanelProps {
  editOptions: EditOptions;
  setEditOptions: React.Dispatch<React.SetStateAction<EditOptions>>;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  onGetSuggestion: () => void;
  isSuggesting: boolean;
  disabled: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  editOptions, setEditOptions, customPrompt, setCustomPrompt, onGetSuggestion, isSuggesting, disabled
}) => {
  
  const handleOptionChange = (category: keyof EditOptions, option: string) => {
    setEditOptions(prev => ({
      ...prev,
      [category]: prev[category] === option ? null : option
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <OptionSelector
        title="Estilo"
        options={STYLE_OPTIONS}
        selectedOption={editOptions.style}
        onSelect={(option) => handleOptionChange('style', option)}
        disabled={disabled}
      />
      <OptionSelector
        title="Iluminación"
        options={LIGHTING_OPTIONS}
        selectedOption={editOptions.lighting}
        onSelect={(option) => handleOptionChange('lighting', option)}
        disabled={disabled}
      />
      <OptionSelector
        title="Composición"
        options={COMPOSITION_OPTIONS}
        selectedOption={editOptions.composition}
        onSelect={(option) => handleOptionChange('composition', option)}
        disabled={disabled}
      />
      <div>
        <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Prompt Personalizado
        </label>
        <div className="relative">
          <textarea
            id="custom-prompt"
            rows={4}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={disabled}
            placeholder="ej., 'Añade un gato con un sombrero de fiesta'"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 pr-24 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50"
          />
          <button 
            onClick={onGetSuggestion}
            disabled={disabled || isSuggesting}
            className="absolute top-2 right-2 bg-indigo-600/50 hover:bg-indigo-600/80 text-white px-2 py-1 text-xs rounded-md font-semibold flex items-center gap-1 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isSuggesting ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : <Sparkles className="h-4 w-4" />}
            Sugerir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
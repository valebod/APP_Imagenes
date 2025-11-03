import React from 'react';

interface OptionSelectorProps {
  title: string;
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  disabled: boolean;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ title, options, selectedOption, onSelect, disabled }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-300">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              disabled={disabled}
              className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 border
                ${
                  isSelected
                    ? 'bg-indigo-500 border-indigo-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OptionSelector;
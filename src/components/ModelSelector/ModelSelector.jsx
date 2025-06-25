import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Cpu, Zap, Brain} from 'lucide-react';
import { AI_MODELS } from '../models/models';
import './ModelSelector.css';

export const ModelSelector = ({
  selectedModel,
  onModelChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedModelData = AI_MODELS.find(model => model.id === selectedModel);

  const getModelIcon = (modelId) => {
    switch (modelId) {
      case 'mistralai_prompt': return <Zap className="logo-icon1" />;
      case 'mistralai_prefix': return <Brain className="logo-icon1" />;
      case 'mistralai_qlora': return <Cpu className="logo-icon1" />;
      default: return <Cpu className="logo-icon1" />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="model-dropdown" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-button"
      >
        <div className="selected-model">
          <div className={`model-dot ${selectedModelData?.color || 'default-dot'}`}></div>
          {getModelIcon(selectedModel)}
          <span className="model-name">
            {selectedModelData?.name || 'Select Model'}
          </span>
        </div>
        <ChevronDown className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-items">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
                className={`dropdown-item ${selectedModel === model.id ? 'active' : ''}`}
              >
                <div className={`model-dot ${model.color}`}></div>
                {getModelIcon(model.id)}
                <div className="model-info">
                  <div className="model-title">{model.name}</div>
                  <div className="model-description">{model.description}</div>
                </div>
                <div className="model-provider">{model.provider}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

};
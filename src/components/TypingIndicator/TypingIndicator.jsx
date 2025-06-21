import React from 'react';
import { Stethoscope } from 'lucide-react';
import './TypingIndicator.css';

export const TypingIndicator = () => {
  return (
    <div className="typing-row">
      <div className="typing-avatar">
        <Stethoscope className="icon-white" />
      </div>

      <div className="typing-body">
        <div className="typing-bubble">
          <div className="typing-dots">
            <div className="dot delay-0"></div>
            <div className="dot delay-1"></div>
            <div className="dot delay-2"></div>
          </div>
        </div>
        <div className="typing-label">
          AI is thinking...
        </div>
      </div>
    </div>
  );

};
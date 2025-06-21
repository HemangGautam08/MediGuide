import React from 'react';
import { User, Bot, Stethoscope } from 'lucide-react';
import { AI_MODELS } from '../models/models';
import './Message.css';

export const Message = ({ message }) => {
  const isUser = message.sender === 'user';
  const model = message.model ? AI_MODELS.find(m => m.id === message.model) : null;

  return (
    <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
      <div className={`message-avatar ${isUser ? 'user-avatar' : 'bot-avatar'}`}>
        {isUser ? (
          <User className="avatar-icon" />
        ) : (
          <Stethoscope className="avatar-icon" />
        )}
      </div>

      <div className={`message-body ${isUser ? 'align-right' : 'align-left'}`}>
        <div className={`message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
          <div className="message-content">{message.content}</div>
        </div>

        <div className={`message-meta ${isUser ? 'meta-right' : 'meta-left'}`}>
          {model && !isUser && (
            <>
              <div className={`model-dot ${model.color}`}></div>
              <span className="model-name">{model.name}</span>
              <span className="separator">•</span>
              <span className="model-provider">{model.provider}</span>
              <span className="separator">•</span>
            </>
          )}
          <span className="timestamp">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );

};

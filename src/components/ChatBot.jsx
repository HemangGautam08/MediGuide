import React, { useState, useRef, useEffect } from 'react';
import { Stethoscope, AlertTriangle, RefreshCw } from 'lucide-react';
import { Message } from './Message/Message';
import { MessageInput } from './MessageInput/MessageInput';
import { ModelSelector } from './ModelSelector/ModelSelector';
import { TypingIndicator } from './TypingIndicator/TypingIndicator';
import { ChatService } from './chatService';
import { AI_MODELS } from './models/models';
import './ChatBot.css';

export const ChatBot = () => {
  const [chatState, setChatState] = useState({
    messages: [
      {
        id: '1',
        content: "Hello! I'm your AI medical assistant. I can help answer your health questions and provide general medical information. Please remember that I'm not a replacement for professional medical advice, diagnosis, or treatment. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        model: 'mistral'
      }
    ],
    selectedModel: 'mistralai_prompt',
    isLoading: false,
    error: null
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      const selectedModel = AI_MODELS.find(model => model.id === chatState.selectedModel);
      const response = await ChatService.sendMessage(content, selectedModel);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
        model: selectedModel.id
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred while connecting to the AI service'
      }));
    }
  };

  const handleModelChange = (modelId) => {
    setChatState(prev => ({
      ...prev,
      selectedModel: modelId,
      error: null
    }));
  };

  const handleRetry = () => {
    setChatState(prev => ({
      ...prev,
      error: null
    }));
  };

  const selectedModelData = AI_MODELS.find(model => model.id === chatState.selectedModel);

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="branding">
            <div className="logo">
              <Stethoscope className="logo-icon" />
            </div>
            <div>
              <h1 className="title">MediGuide</h1>
              <p className="subtitle">Advanced Medical Assistant</p>
            </div>
          </div>

          <div className="model-section">
            <ModelSelector
              selectedModel={chatState.selectedModel}
              onModelChange={handleModelChange}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        <div className="messages-wrapper">
          {chatState.messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {chatState.isLoading && <TypingIndicator />}

          {chatState.error && (
            <div className="error-container">
              <div className="error-icon">
                <AlertTriangle className="error-alert-icon" />
              </div>
              <div className="error-box">
                <div className="error-content">
                  <div>
                    <div className="error-title">Connection Error</div>
                    <div className="error-message">{chatState.error}</div>
                    <div className="error-details">
                      Unable to connect to {selectedModelData?.name} ({selectedModelData?.provider}). 
                      Please check your connection or try a different model.
                    </div>
                  </div>
                  <button onClick={handleRetry} className="retry-button">
                    <RefreshCw className="retry-icon" />
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="input-wrapper">
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={chatState.isLoading}
        />
      </div>

      {/* Disclaimer */}
      <div className="disclaimer">
        <div className="disclaimer-content">
          <div className="disclaimer-inner">
            <div className="pulse-dot"></div>
            <p className="disclaimer-text">
              AI-powered medical information • Not a substitute for professional medical advice
            </p>
            <div className="pulse-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );

};
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Send } from 'lucide-react';
import './MessageInput.css';

export const MessageInput = ({
  onSendMessage,
  isLoading
}) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="input-container">
      <div className="input-form-wrapper">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="button-group">
            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`voice-button ${isListening ? 'voice-button-active' : 'voice-button-inactive'}`}
                disabled={isLoading}
                title={isListening ? 'Stop recording' : 'Start voice input'}
              >
                {isListening ? (
                  <MicOff className="icon-size" />
                ) : (
                  <Mic className="icon-size" />
                )}
              </button>
            )}
          </div>
          
          <div className="textarea-container">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening... Speak now" : "Describe your symptoms or ask a health question..."}
              className={`message-textarea ${isListening ? 'textarea-listening' : 'textarea-normal'}`}
              rows={1}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="submit-button"
          >
            {isLoading ? (
              <Loader2 className="icon-size spinner" />
            ) : (
              <Send className="icon-size" />
            )}
          </button>
        </form>
        
        {isLoading && (
          <div className="status-message loading-message">
            <Loader2 className="icon-size spinner" />
            <span>AI is analyzing your query...</span>
          </div>
        )}
        
        {isListening && (
          <div className="status-message listening-message">
            <div className="listening-indicator"></div>
            <span>Listening... Speak clearly into your microphone</span>
          </div>
        )}
        
        {!speechSupported && (
          <div className="no-support-message">
            Voice input not supported in this browser
          </div>
        )}
      </div>
    </div>
  );
};
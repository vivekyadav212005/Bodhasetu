import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, MicOff } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { geminiService, ChatMessage } from '../../services/geminiService';

const FloatingChatbot: React.FC = () => {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    {
      en: "What are today's safety alerts?",
      ml: "ഇന്നത്തെ സുരക്ഷാ അലേർട്ടുകൾ എന്തൊക്കെയാണ്?"
    },
    {
      en: "Show me pending document reviews",
      ml: "കാത്തിരിക്കുന്ന ഡോക്യുമെന്റ് റിവ്യൂകൾ കാണിക്കുക"
    },
    {
      en: "System status check",
      ml: "സിസ്റ്റം സ്റ്റാറ്റസ് പരിശോധന"
    }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Voice recognition implementation would go here
  };

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      const userMessage = message.trim();
      setMessage('');
      setIsLoading(true);

      try {
        const response = await geminiService.sendMessage(userMessage, language);
        setMessages(prev => [...prev, 
          {
            id: Date.now().toString(),
            type: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
            language
          },
          {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: response,
            timestamp: new Date().toISOString(),
            language
          }
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'bot',
          content: language === 'malayalam' 
            ? 'ക്ഷമിക്കണം, ഒരു പിശക് സംഭവിച്ചു. ദയവായി വീണ്ടും ശ്രമിക്കുക.'
            : 'Sorry, an error occurred. Please try again.',
          timestamp: new Date().toISOString(),
          language
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuickQuestion = async (question: { en: string; ml: string }) => {
    const questionText = language === 'malayalam' ? question.ml : question.en;
    setMessage('');
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(questionText, language);
      setMessages(prev => [...prev, 
        {
          id: Date.now().toString(),
          type: 'user',
          content: questionText,
          timestamp: new Date().toISOString(),
          language
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response,
          timestamp: new Date().toISOString(),
          language
        }
      ]);
    } catch (error) {
      console.error('Error sending quick question:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: language === 'malayalam' 
          ? 'ക്ഷമിക്കണം, ഒരു പിശക് സംഭവിച്ചു. ദയവായി വീണ്ടും ശ്രമിക്കുക.'
          : 'Sorry, an error occurred. Please try again.',
        timestamp: new Date().toISOString(),
        language
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-xl">
        <div className="flex items-center space-x-2">
          <MessageSquare size={20} />
          <h3 className="font-semibold">
            {language === 'malayalam' ? 'AI സഹായി' : 'AI Assistant'}
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-blue-700 p-1 rounded transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat Content */}
      <div className="h-96 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-3">
            {/* Chat Messages */}
            {messages.length === 0 ? (
              <>
                {/* Welcome Message */}
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-700">
                      {language === 'malayalam' 
                        ? 'ഹലോ! ഞാൻ നിങ്ങളുടെ AI സഹായിയാണ്. രേഖകളെ കുറിച്ചോ സിസ്റ്റത്തെ കുറിച്ചോ എന്തെങ്കിലും ചോദിക്കാം.'
                        : "Hello! I'm your AI assistant. Ask me anything about documents or the system."
                      }
                    </p>
                  </div>
                </div>

                {/* Quick Questions */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">
                    {language === 'malayalam' ? 'ദ്രുത ചോദ്യങ്ങൾ:' : 'Quick Questions:'}
                  </p>
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="block w-full text-left p-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      {language === 'malayalam' ? question.ml : question.en}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <div className={`border rounded-lg p-3 max-w-xs ${
                    msg.type === 'user'
                      ? 'bg-blue-600 border-blue-500'
                      : 'bg-white border-gray-200'
                  }`}>
                    <p className={`text-sm ${
                      msg.type === 'user' 
                        ? 'text-white' 
                        : 'text-gray-700'
                    }`}>
                      {msg.content}
                    </p>
                    <p className={`text-xs mt-1 ${
                      msg.type === 'user' 
                        ? 'text-blue-100' 
                        : 'text-gray-500'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-700">
                      {language === 'malayalam' ? 'ഉത്തരം തയ്യാറാക്കുന്നു...' : 'Preparing response...'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={language === 'malayalam' 
                  ? 'സ്വാഭാവിക ഭാഷയിൽ ചോദ്യം ചോദിക്കുക...' 
                  : 'Ask a question in natural language...'}
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={handleVoiceToggle}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                  isListening 
                    ? 'text-red-500 animate-pulse' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>

          {isListening && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>
                {language === 'malayalam' ? 'കേൾക്കുന്നു...' : 'Listening...'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingChatbot;
import React, { useState } from 'react';
import { Search, Filter, FileText, MessageSquare, Mic, User, Bot } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const SearchInterface: React.FC = () => {
  const { language } = useApp();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'chat'>('search');

  const searchResults = [
    {
      id: '1',
      title: 'Safety Protocol for Electrical Maintenance',
      titleMalayalam: 'വൈദ്യുത അറ്റകുറ്റപ്പണിക്കുള്ള സുരക്ഷാ പ്രോട്ടോക്കോൾ',
      chunk: 'All electrical maintenance work must follow standard safety procedures including proper lockout/tagout procedures...',
      chunkMalayalam: 'എല്ലാ വൈദ്യുത അറ്റകുറ്റപ്പണി ജോലികളും സ്റ്റാൻഡേർഡ് സുരക്ഷാ നടപടിക്രമങ്ങൾ പാലിക്കണം...',
      relevance: 0.92,
      documentType: 'safety',
      date: '2024-12-15'
    },
    {
      id: '2',
      title: 'Equipment Maintenance Schedule Q1 2025',
      titleMalayalam: 'ഉപകരണ അറ്റകുറ്റപ്പണി ഷെഡ്യൂൾ Q1 2025',
      chunk: 'Quarterly maintenance schedule for all critical equipment in stations 1-5...',
      chunkMalayalam: 'സ്റ്റേഷൻ 1-5 ലെ എല്ലാ നിർണായക ഉപകരണങ്ങളുടെയും ത്രൈമാസിക അറ്റകുറ്റപ്പണി ഷെഡ്യൂൾ...',
      relevance: 0.87,
      documentType: 'maintenance',
      date: '2025-01-10'
    }
  ];

  const chatMessages = [
    {
      id: '1',
      type: 'user' as const,
      content: 'What are the safety requirements for electrical work?',
      contentMalayalam: 'വൈദ്യുത ജോലിക്കുള്ള സുരക്ഷാ ആവശ്യകതകൾ എന്തൊക്കെയാണ്?',
      timestamp: '10:30 AM'
    },
    {
      id: '2',
      type: 'bot' as const,
      content: 'Based on the safety protocols document, electrical work requires: 1) Proper lockout/tagout procedures, 2) Use of personal protective equipment, 3) Voltage testing before work begins, 4) Two-person team for high-voltage work.',
      contentMalayalam: 'സുരക്ഷാ പ്രോട്ടോക്കോൾ രേഖ അനുസരിച്ച്, വൈദ്യുത ജോലിക്ക് ആവശ്യമാണ്: 1) ശരിയായ ലോക്കൗട്ട്/ടാഗൗട്ട് നടപടിക്രമങ്ങൾ, 2) വ്യക്തിഗത സുരക്ഷാ ഉപകരണങ്ങളുടെ ഉപയോഗം, 3) ജോലി ആരംभിക്കുന്നതിന് മുമ്പ് വോൾട്ടേജ് പരീക്ഷണം, 4) ഉയർന്ന വോൾട്ടേജ് ജോലിക്ക് രണ്ട് പേരുടെ ടീം.',
      timestamp: '10:31 AM'
    }
  ];

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Voice recognition implementation would go here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'malayalam' ? 'തിരച്ചിൽ & AI സഹായി' : 'Search & AI Assistant'}
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'search'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Search size={20} />
            <span>{language === 'malayalam' ? 'സെമാന്റിക് സെർച്ച്' : 'Semantic Search'}</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'chat'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare size={20} />
            <span>{language === 'malayalam' ? 'AI ചാറ്റ്' : 'AI Chat'}</span>
          </button>
        </div>

        {/* Search Interface */}
        {activeTab === 'search' && (
          <div className="p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={language === 'malayalam' 
                      ? 'സ്വാഭാവിക ഭാഷയിൽ ചോദ്യം ചോദിക്കുക...' 
                      : 'Ask a question in natural language...'}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleVoiceSearch}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                      isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter size={16} />
                  <span className="hidden sm:inline">
                    {language === 'malayalam' ? 'ഫിൽട്ടറുകൾ' : 'Filters'}
                  </span>
                </button>
              </div>

              {showFilters && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'malayalam' ? 'രേഖയുടെ തരം' : 'Document Type'}
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                        <option>{language === 'malayalam' ? 'എല്ലാം' : 'All'}</option>
                        <option>{language === 'malayalam' ? 'സുരക്ഷ' : 'Safety'}</option>
                        <option>{language === 'malayalam' ? 'അറ്റകുറ്റപ്പണി' : 'Maintenance'}</option>
                        <option>{language === 'malayalam' ? 'കരാർ' : 'Contract'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'malayalam' ? 'തീയതി പരിധി' : 'Date Range'}
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                        <option>{language === 'malayalam' ? 'ഏതെങ്കിലും സമയം' : 'Any time'}</option>
                        <option>{language === 'malayalam' ? 'കഴിഞ്ഞ മാസം' : 'Last month'}</option>
                        <option>{language === 'malayalam' ? 'കഴിഞ്ഞ വർഷം' : 'Last year'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'malayalam' ? 'അനുസരണ നില' : 'Compliance Status'}
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                        <option>{language === 'malayalam' ? 'എല്ലാം' : 'All'}</option>
                        <option>{language === 'malayalam' ? 'അനുസരിക്കുന്നു' : 'Compliant'}</option>
                        <option>{language === 'malayalam' ? 'മുന്നറിയിപ്പുകൾ' : 'Warnings'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {searchResults.map((result) => (
                <div key={result.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FileText size={20} className="text-blue-600 flex-shrink-0" />
                      <h3 className="font-semibold text-lg text-gray-900">
                        {language === 'malayalam' ? result.titleMalayalam : result.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {Math.round(result.relevance * 100)}% {language === 'malayalam' ? 'പൊരുത്തം' : 'match'}
                      </span>
                      <span className="text-sm text-gray-500">{result.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {language === 'malayalam' ? result.chunkMalayalam : result.chunk}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full capitalize">
                      {result.documentType}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      {language === 'malayalam' ? 'പൂർണ്ണ രേഖ കാണുക' : 'View Full Document'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Interface */}
        {activeTab === 'chat' && (
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                      }`}>
                        {message.type === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'
                      }`}>
                        <p className="text-sm">
                          {language === 'malayalam' ? message.contentMalayalam || message.content : message.content}
                        </p>
                        <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={language === 'malayalam' 
                  ? 'സ്വാഭാവിക ഭാഷയിൽ ചോദ്യം ചോദിക്കുക...' 
                  : 'Ask a question in natural language...'}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleVoiceSearch}
                className={`p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors ${
                  isListening ? 'text-red-500 animate-pulse' : 'text-gray-600'
                }`}
              >
                <Mic size={16} />
              </button>
              <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {language === 'malayalam' ? 'അയക്കുക' : 'Send'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInterface;
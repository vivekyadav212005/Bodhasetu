// Mock Gemini AI service for demo purposes
// To use real Gemini API, uncomment the import and set VITE_GEMINI_API_KEY
// import { GoogleGenerativeAI } from '@google/generative-ai';
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'your-api-key-here');

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  language: 'malayalam' | 'english';
}

export class GeminiService {
  private chatHistory: ChatMessage[] = [];

  constructor() {
    // Mock constructor - no real model initialization needed
  }

  async sendMessage(message: string, language: 'malayalam' | 'english' = 'english'): Promise<string> {
    try {
      // Add user message to history
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: message,
        timestamp: new Date().toISOString(),
        language
      };
      this.chatHistory.push(userMessage);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate mock response based on message content
      const responseText = this.generateMockResponse(message, language);

      // Add bot response to history
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: responseText,
        timestamp: new Date().toISOString(),
        language
      };
      this.chatHistory.push(botMessage);

      return responseText;
    } catch (error) {
      console.error('Error in mock Gemini service:', error);
      return language === 'malayalam' 
        ? 'ക്ഷമിക്കണം, ഒരു പിശക് സംഭവിച്ചു. ദയവായി വീണ്ടും ശ്രമിക്കുക.'
        : 'Sorry, an error occurred. Please try again.';
    }
  }

  private generateMockResponse(message: string, language: 'malayalam' | 'english'): string {
    const lowerMessage = message.toLowerCase();
    
    // Safety alerts
    if (lowerMessage.includes('safety') || lowerMessage.includes('alert') || lowerMessage.includes('സുരക്ഷാ')) {
      return language === 'malayalam' 
        ? 'ഇന്നത്തെ സുരക്ഷാ അലേർട്ടുകൾ: 1) ഫയർ സുരക്ഷാ ഉപകരണങ്ങൾ പരിശോധിക്കേണ്ടതുണ്ട് 2) ഇലക്ട്രിക്കൽ സിസ്റ്റം അപ്ഡേറ്റ് ആവശ്യമാണ് 3) എമർജൻസി എക്സിറ്റ് റൂട്ടുകൾ വൃത്തിയാക്കുക'
        : 'Today\'s safety alerts: 1) Fire safety equipment needs inspection 2) Electrical system update required 3) Emergency exit routes need cleaning';
    }
    
    // Document reviews
    if (lowerMessage.includes('document') || lowerMessage.includes('review') || lowerMessage.includes('ഡോക്യുമെന്റ്')) {
      return language === 'malayalam' 
        ? 'കാത്തിരിക്കുന്ന ഡോക്യുമെന്റ് റിവ്യൂകൾ: 1) പ്രോജക്റ്റ് അഗ്രീമെന്റ് - ലീഗൽ റിവ്യൂ 2) ബജറ്റ് അപ്രൂവൽ - ഫിനാൻസ് റിവ്യൂ 3) സാങ്കേതിക സ്പെസിഫിക്കേഷൻ - എഞ്ചിനീയറിംഗ് റിവ്യൂ'
        : 'Pending document reviews: 1) Project Agreement - Legal Review 2) Budget Approval - Finance Review 3) Technical Specification - Engineering Review';
    }
    
    // System status
    if (lowerMessage.includes('system') || lowerMessage.includes('status') || lowerMessage.includes('സിസ്റ്റം')) {
      return language === 'malayalam' 
        ? 'സിസ്റ്റം സ്റ്റാറ്റസ്: ✅ ഓൺലൈൻ ✅ ഡാറ്റാബേസ് കണക്റ്റ് ✅ ബാക്കപ്പ് പൂർത്തിയായി ✅ എല്ലാ സേവനങ്ങളും സാധാരണമായി പ്രവർത്തിക്കുന്നു'
        : 'System Status: ✅ Online ✅ Database Connected ✅ Backup Complete ✅ All services running normally';
    }
    
    // Upload help
    if (lowerMessage.includes('upload') || lowerMessage.includes('അപ്‌ലോഡ്')) {
      return language === 'malayalam' 
        ? 'ഡോക്യുമെന്റ് അപ്‌ലോഡ് സഹായം: 1) മാനുവൽ അപ്‌ലോഡ് - ഫയലുകൾ ഡ്രാഗ് ചെയ്യുക 2) ഇമെയിൽ അപ്‌ലോഡ് - ഇമെയിലുകളിൽ നിന്ന് ഡോക്യുമെന്റുകൾ ലഭിക്കുക 3) പിന്തുണയ്ക്കുന്ന ഫോർമാറ്റുകൾ: PDF, DOC, DOCX, JPG, PNG'
        : 'Document Upload Help: 1) Manual Upload - Drag and drop files 2) Email Upload - Get documents from emails 3) Supported formats: PDF, DOC, DOCX, JPG, PNG';
    }
    
    // Compliance
    if (lowerMessage.includes('compliance') || lowerMessage.includes('അനുസരണ')) {
      return language === 'malayalam' 
        ? 'അനുസരണ വിവരങ്ങൾ: 1) ISO 9001 സർട്ടിഫിക്കേഷൻ പുതുക്കൽ ആവശ്യമാണ് 2) GDPR അനുസരണ പരിശോധന നടത്തുക 3) ഇന്റർനൽ ഓഡിറ്റ് റിപ്പോർട്ട് സമർപ്പിക്കുക'
        : 'Compliance Information: 1) ISO 9001 certification renewal required 2) GDPR compliance check needed 3) Internal audit report submission due';
    }
    
    // Default responses
    const defaultResponses = language === 'malayalam' 
      ? [
          'ഞാൻ നിങ്ങളെ സഹായിക്കാൻ ഇവിടെയുണ്ട്. രേഖകൾ, സുരക്ഷ, അനുസരണ, അല്ലെങ്കിൽ സിസ്റ്റത്തെ കുറിച്ച് കൂടുതൽ ചോദിക്കാം.',
          'നിങ്ങളുടെ ചോദ്യം മനസ്സിലാക്കി. ബോധസേതു സിസ്റ്റത്തിൽ നിങ്ങൾക്ക് സഹായം ആവശ്യമുണ്ടെങ്കിൽ എന്നെ ചോദിക്കാം.',
          'ഡോക്യുമെന്റ് മാനേജ്മെന്റ് സിസ്റ്റത്തെ കുറിച്ച് കൂടുതൽ അറിയാൻ എന്നെ ചോദിക്കാം. ഞാൻ ഇവിടെ സഹായിക്കാൻ തയ്യാറാണ്.'
        ]
      : [
          'I\'m here to help you. You can ask me more about documents, safety, compliance, or the system.',
          'I understand your question. If you need help with the BodhaSetu system, feel free to ask me.',
          'You can ask me more about the document management system. I\'m here to assist you.'
        ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  private createSystemPrompt(language: 'malayalam' | 'english'): string {
    const basePrompt = `You are an AI assistant for BodhaSetu, a document management and compliance system. You help users with:
- Document management and organization
- Compliance monitoring and alerts
- System navigation and features
- Technical support and guidance
- Safety and regulatory information

Please provide helpful, accurate, and concise responses. If you don't know something specific about the system, suggest where the user might find the information.`;

    if (language === 'malayalam') {
      return `${basePrompt}

മലയാളത്തിൽ മറുപടി നൽകുക. ഉപയോക്താവിന് സഹായകരവും കൃത്യവുമായ ഉത്തരങ്ങൾ നൽകുക. സിസ്റ്റത്തെക്കുറിച്ച് നിങ്ങൾക്ക് അറിയാത്ത എന്തെങ്കിലും ഉണ്ടെങ്കിൽ, ഉപയോക്താവിന് എവിടെയാണ് വിവരങ്ങൾ കണ്ടെത്താൻ കഴിയുമെന്ന് നിർദ്ദേശിക്കുക.`;
    }

    return basePrompt;
  }

  getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  clearHistory(): void {
    this.chatHistory = [];
  }
}

// Create a singleton instance
export const geminiService = new GeminiService();

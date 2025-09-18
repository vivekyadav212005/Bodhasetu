export interface User {
  id: string;
  name: string;
  email: string;
  role: 'engineer' | 'admin' | 'legal' | 'finance' | 'controller';
  language: 'malayalam' | 'english' | 'bilingual';
  department: string;
  designation?: string;
  avatar?: string;
}

export interface Document {
  id: string;
  title: string;
  titleMalayalam?: string;
  type: 'technical' | 'contract' | 'compliance' | 'financial' | 'operational';
  uploadDate: string;
  status: 'processing' | 'completed' | 'error' | 'pending_review';
  language: 'malayalam' | 'english' | 'bilingual';
  summary: string;
  summaryMalayalam?: string;
  complianceFlags: ComplianceFlag[];
  fileUrl: string;
  uploadedBy: string;
  size: number;
  pages: number;
}

export interface ComplianceFlag {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  messageMalayalam?: string;
  documentId: string;
  acknowledged: boolean;
  dueDate?: string;
}

export interface SearchResult {
  documentId: string;
  title: string;
  chunk: string;
  relevanceScore: number;
  metadata: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  language: 'malayalam' | 'english';
}

export interface LoginCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
  attachments: EmailAttachment[];
  body?: string;
  isRead: boolean;
}

export interface EmailAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'other';
  size: number;
  url?: string;
}
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Document, ComplianceFlag } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  language: 'malayalam' | 'english';
  setLanguage: (lang: 'malayalam' | 'english') => void;
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  alerts: ComplianceFlag[];
  setAlerts: (alerts: ComplianceFlag[]) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(authUser);
  
  const [language, setLanguage] = useState<'malayalam' | 'english'>('english');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [alerts, setAlerts] = useState<ComplianceFlag[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Update user when auth user changes
  React.useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      language,
      setLanguage,
      documents,
      setDocuments,
      alerts,
      setAlerts,
      sidebarOpen,
      setSidebarOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};
import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import EngineerDashboard from './components/Dashboard/EngineerDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import LegalDashboard from './components/Dashboard/LegalDashboard';
import FinanceDashboard from './components/Dashboard/FinanceDashboard';
import ControllerDashboard from './components/Dashboard/ControllerDashboard';
import DocumentUpload from './components/Documents/DocumentUpload';
import EmailUpload from './components/Documents/EmailUpload';
import SearchInterface from './components/Search/SearchInterface';
import ComplianceAlerts from './components/Compliance/ComplianceAlerts';
import FloatingChatbot from './components/Chat/FloatingChatbot';

const AppContent: React.FC = () => {
  const { user } = useApp();
  const [currentView, setCurrentView] = React.useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        switch (user?.role) {
          case 'admin':
            return <AdminDashboard />;
          case 'legal':
            return <LegalDashboard />;
          case 'finance':
            return <FinanceDashboard />;
          case 'controller':
            return <ControllerDashboard />;
          default:
            return <EngineerDashboard />;
        }
      case 'upload':
        return <DocumentUpload onNavigateToEmailUpload={() => setCurrentView('email-upload')} />;
      case 'email-upload':
        return <EmailUpload />;
      case 'search':
        return <SearchInterface />;
      case 'compliance':
        return <ComplianceAlerts />;
      default:
        return <EngineerDashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 overflow-x-hidden">
            {renderCurrentView()}
          </main>
        </div>
        <FloatingChatbot />
        
        {/* Navigation Buttons for Demo */}
        <div className="fixed bottom-6 left-6 flex flex-col space-y-2 z-40">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'dashboard' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('upload')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'upload' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => setCurrentView('email-upload')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'email-upload' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Email Upload
          </button>
          <button
            onClick={() => setCurrentView('search')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'search' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setCurrentView('compliance')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'compliance' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Compliance
          </button>
        </div>
      </div>
    </AppProvider>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <img 
              src="/public/WhatsApp Image 2025-09-14 at 19.31.05_ee4cf298.jpg" 
              alt="BodhaSetu Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">BodhaSetu</h2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AppContent />;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AuthenticatedApp />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
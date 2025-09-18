import React from 'react';
import { Menu, Bell, User, Globe, Search } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { t } from '../../utils/translations';

const Header: React.FC = () => {
  const { user, language, setLanguage, sidebarOpen, setSidebarOpen, alerts } = useApp();
  const { logout } = useAuth();
  
  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <img 
              src="/public/WhatsApp Image 2025-09-14 at 19.31.05_ee4cf298.jpg" 
              alt="BodhaSetu Logo" 
              className="w-6 h-6 object-contain"
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            {language === 'malayalam' ? 'ബോധസേതു' : 'BodhaSetu'}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder', language)}
            className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setLanguage(language === 'english' ? 'malayalam' : 'english')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-1"
          title="Toggle Language"
        >
          <Globe size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {language === 'english' ? 'ML' : 'EN'}
          </span>
        </button>

        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          {unacknowledgedAlerts > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unacknowledgedAlerts}
            </span>
          )}
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.designation}</p>
          </div>
          <div className="relative group">
            <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-3 border-b border-gray-200">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.department}</p>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                {language === 'malayalam' ? 'ലോഗ് ഔട്ട്' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
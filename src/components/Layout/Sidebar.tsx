import React from 'react';
import { 
  Home, 
  FileText, 
  Search, 
  Shield, 
  Settings, 
  Users, 
  BarChart3, 
  AlertTriangle,
  Upload,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  labelMalayalam: string;
  path: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', labelMalayalam: 'ഡാഷ്ബോർഡ്', path: '/dashboard' },
  { icon: FileText, label: 'Documents', labelMalayalam: 'രേഖകൾ', path: '/documents' },
  { icon: Upload, label: 'Upload', labelMalayalam: 'അപ്‌ലോഡ്', path: '/upload' },
  { icon: Search, label: 'Search', labelMalayalam: 'തിരയുക', path: '/search' },
  { icon: Shield, label: 'Compliance', labelMalayalam: 'അനുസരണം', path: '/compliance' },
  { icon: BarChart3, label: 'Analytics', labelMalayalam: 'വിശകലനം', path: '/analytics', roles: ['admin'] },
  { icon: Users, label: 'User Management', labelMalayalam: 'ഉപയോക്താക്കൾ', path: '/users', roles: ['admin'] },
  { icon: MessageSquare, label: 'AI Assistant', labelMalayalam: 'AI സഹായി', path: '/chat' },
  { icon: Settings, label: 'Settings', labelMalayalam: 'ക്രമീകരണങ്ങൾ', path: '/settings' }
];

const Sidebar: React.FC = () => {
  const { user, language, sidebarOpen } = useApp();
  const [activeItem, setActiveItem] = React.useState('/dashboard');

  const filteredItems = navItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || '')
  );

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setActiveItem(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">
                {language === 'malayalam' ? item.labelMalayalam : item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {language === 'malayalam' ? 'സിസ്റ്റം സ്റ്റാറ്റസ്' : 'System Status'}
            </span>
          </div>
          <p className="text-xs text-blue-700">
            {language === 'malayalam' ? 'എല്ലാ സേവനങ്ങളും പ്രവർത്തിക്കുന്നു' : 'All services operational'}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
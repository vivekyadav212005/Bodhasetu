import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

const EngineerDashboard: React.FC = () => {
  const { language } = useApp();

  const stats = [
    {
      title: language === 'malayalam' ? 'ആകെ രേഖകൾ' : 'Total Documents',
      value: '247',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: language === 'malayalam' ? 'പ്രോസസ്സിംഗ്' : 'Processing',
      value: '12',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: language === 'malayalam' ? 'പൂർത്തിയായത്' : 'Completed',
      value: '198',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: language === 'malayalam' ? 'അവലോകനം വേണ്ടത്' : 'Needs Review',
      value: '37',
      icon: AlertCircle,
      color: 'bg-red-500'
    }
  ];

  const recentTasks = [
    {
      title: 'Technical Specification Review',
      titleMalayalam: 'സാങ്കേതിക സ്പെസിഫിക്കേഷൻ അവലോകനം',
      status: 'pending',
      priority: 'high',
      dueDate: '2025-01-16'
    },
    {
      title: 'Safety Protocol Update',
      titleMalayalam: 'സുരക്ഷാ പ്രോട്ടോക്കോൾ അപ്ഡേറ്റ്',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2025-01-18'
    },
    {
      title: 'Equipment Manual Translation',
      titleMalayalam: 'ഉപകരണ മാനുവൽ വിവർത്തനം',
      status: 'completed',
      priority: 'low',
      dueDate: '2025-01-15'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'malayalam' ? 'എഞ്ചിനീയർ ഡാഷ്ബോർഡ്' : 'Engineer Dashboard'}
        </h1>
        <div className="flex items-center space-x-2">
          <TrendingUp size={20} className="text-green-600" />
          <span className="text-sm text-gray-600">
            {language === 'malayalam' ? 'ഈ മാസം 15% വർധന' : '15% increase this month'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'malayalam' ? 'സമീപകാല ടാസ്കുകൾ' : 'Recent Tasks'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {language === 'malayalam' ? task.titleMalayalam : task.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {language === 'malayalam' ? 'അവസാന തീയതി:' : 'Due:'} {task.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Search Interface */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'malayalam' ? 'AI തിരച്ചിൽ' : 'AI Search'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={language === 'malayalam' ? 'സാങ്കേതിക രേഖകൾ തിരയുക...' : 'Search technical documents...'}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-3 text-blue-600 hover:text-blue-800">
                  <FileText size={20} />
                </button>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  {language === 'malayalam' ? 'സാധാരണ ചോദ്യങ്ങൾ:' : 'Common Queries:'}
                </h4>
                {[
                  {
                    en: 'Safety protocols for electrical work',
                    ml: 'വൈദ്യുത ജോലിക്കുള്ള സുരക്ഷാ പ്രോട്ടോക്കോളുകൾ'
                  },
                  {
                    en: 'Equipment maintenance schedules',
                    ml: 'ഉപകരണ അറ്റകുറ്റപ്പണി ഷെഡ്യൂളുകൾ'
                  }
                ].map((query, index) => (
                  <button
                    key={index}
                    className="block w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    {language === 'malayalam' ? query.ml : query.en}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerDashboard;
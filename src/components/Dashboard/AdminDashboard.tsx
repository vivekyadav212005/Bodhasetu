import React from 'react';
import { Users, Server, Activity, AlertTriangle, Database, Settings, TrendingUp, Shield } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const AdminDashboard: React.FC = () => {
  const { language, user } = useApp();

  const systemStats = [
    {
      title: language === 'malayalam' ? 'സിസ്റ്റം ആരോഗ്യം' : 'System Health',
      value: '98.5%',
      icon: Activity,
      color: 'bg-green-500',
      trend: '+0.2%'
    },
    {
      title: language === 'malayalam' ? 'സജീവ ഉപയോക്താക്കൾ' : 'Active Users',
      value: '247',
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12'
    },
    {
      title: language === 'malayalam' ? 'പ്രോസസ്സിംഗ് ക്യൂ' : 'Processing Queue',
      value: '23',
      icon: Database,
      color: 'bg-yellow-500',
      trend: '-5'
    },
    {
      title: language === 'malayalam' ? 'സുരക്ഷാ അലേർട്ടുകൾ' : 'Security Alerts',
      value: '3',
      icon: Shield,
      color: 'bg-red-500',
      trend: '+1'
    }
  ];

  const recentActivities = [
    {
      type: 'user_login',
      message: language === 'malayalam' ? `${user?.name || 'ഉപയോക്താവ്'} ലോഗിൻ ചെയ്തു` : `${user?.name || 'User'} logged in`,
      time: '2 minutes ago',
      department: 'Engineering'
    },
    {
      type: 'document_processed',
      message: language === 'malayalam' ? 'സുരക്ഷാ പ്രോട്ടോക്കോൾ പ്രോസസ്സ് ചെയ്തു' : 'Safety Protocol processed',
      time: '5 minutes ago',
      department: 'Operations'
    },
    {
      type: 'compliance_alert',
      message: language === 'malayalam' ? 'പുതിയ കംപ്ലയൻസ് അലേർട്ട്' : 'New compliance alert generated',
      time: '10 minutes ago',
      department: 'Legal'
    }
  ];

  const departmentStats = [
    { name: 'Engineering', users: 45, documents: 1250, alerts: 2 },
    { name: 'Legal', users: 12, documents: 890, alerts: 1 },
    { name: 'Finance', users: 18, documents: 670, alerts: 0 },
    { name: 'Operations', users: 32, documents: 980, alerts: 3 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'malayalam' ? 'അഡ്മിൻ ഡാഷ്ബോർഡ്' : 'Admin Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'malayalam' ? 'സിസ്റ്റം നിരീക്ഷണവും മാനേജ്‌മെന്റും' : 'System monitoring and management'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp size={20} className="text-green-600" />
          <span className="text-sm text-gray-600">
            {language === 'malayalam' ? 'എല്ലാ സേവനങ്ങളും പ്രവർത്തിക്കുന്നു' : 'All services operational'}
          </span>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend} {language === 'malayalam' ? 'കഴിഞ്ഞ മണിക്കൂറിൽ' : 'from last hour'}
                  </p>
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
        {/* Department Overview */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'malayalam' ? 'വകുപ്പ് അവലോകനം' : 'Department Overview'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-500">
                      {dept.users} {language === 'malayalam' ? 'ഉപയോക്താക്കൾ' : 'users'} • 
                      {dept.documents} {language === 'malayalam' ? 'രേഖകൾ' : 'documents'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {dept.alerts > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        {dept.alerts} {language === 'malayalam' ? 'അലേർട്ട്' : 'alerts'}
                      </span>
                    )}
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'malayalam' ? 'സമീപകാല പ്രവർത്തനങ്ങൾ' : 'Recent Activities'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'compliance_alert' ? 'bg-red-500' :
                    activity.type === 'document_processed' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      <span className="text-xs text-blue-600">{activity.department}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Management */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'malayalam' ? 'സിസ്റ്റം മാനേജ്‌മെന്റ്' : 'System Management'}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users size={20} className="text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'ഉപയോക്താക്കളെ മാനേജ് ചെയ്യുക' : 'Manage Users'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'റോളുകളും അനുമതികളും' : 'Roles and permissions'}
                </p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Server size={20} className="text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'സിസ്റ്റം കോൺഫിഗറേഷൻ' : 'System Configuration'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'API, വർക്ക്ഫ്ലോ സെറ്റിംഗുകൾ' : 'API, workflow settings'}
                </p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings size={20} className="text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'സിസ്റ്റം ലോഗുകൾ' : 'System Logs'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'ഓഡിറ്റ് ട്രയൽ, പിശകുകൾ' : 'Audit trail, errors'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
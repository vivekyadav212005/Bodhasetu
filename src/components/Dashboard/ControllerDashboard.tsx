import React from 'react';
import { Zap, AlertTriangle, Activity, Settings, Gauge, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const ControllerDashboard: React.FC = () => {
  const { language } = useApp();

  const operationalStats = [
    {
      title: language === 'malayalam' ? 'സിസ്റ്റം സ്റ്റാറ്റസ്' : 'System Status',
      value: 'Online',
      valueMalayalam: 'ഓൺലൈൻ',
      icon: Activity,
      color: 'bg-green-500',
      trend: '99.8%'
    },
    {
      title: language === 'malayalam' ? 'സജീവ അലേർട്ടുകൾ' : 'Active Alerts',
      value: '3',
      icon: AlertTriangle,
      color: 'bg-red-500',
      trend: '+1'
    },
    {
      title: language === 'malayalam' ? 'സ്റ്റേഷൻ സ്റ്റാറ്റസ്' : 'Station Status',
      value: '12/12',
      icon: MapPin,
      color: 'bg-blue-500',
      trend: 'All Active'
    },
    {
      title: language === 'malayalam' ? 'പ്രതികരണ സമയം' : 'Response Time',
      value: '2.3s',
      icon: Clock,
      color: 'bg-purple-500',
      trend: '-0.5s'
    }
  ];

  const activeAlerts = [
    {
      id: '1',
      type: 'safety',
      title: 'High Temperature Alert - Station 5',
      titleMalayalam: 'ഉയർന്ന താപനില അലേർട്ട് - സ്റ്റേഷൻ 5',
      severity: 'high',
      timestamp: '2025-01-15 14:30',
      location: 'Control Room A',
      status: 'active'
    },
    {
      id: '2',
      type: 'maintenance',
      title: 'Scheduled Maintenance Due - Station 2',
      titleMalayalam: 'ഷെഡ്യൂൾ ചെയ്ത അറ്റകുറ്റപ്പണി - സ്റ്റേഷൻ 2',
      severity: 'medium',
      timestamp: '2025-01-15 12:15',
      location: 'Equipment Bay',
      status: 'acknowledged'
    },
    {
      id: '3',
      type: 'operational',
      title: 'Protocol Update Required',
      titleMalayalam: 'പ്രോട്ടോക്കോൾ അപ്ഡേറ്റ് ആവശ്യം',
      severity: 'low',
      timestamp: '2025-01-15 10:45',
      location: 'Central Control',
      status: 'pending'
    }
  ];

  const stationStatus = [
    { id: 'ST001', name: 'Station 1', status: 'operational', load: 85, lastUpdate: '14:30' },
    { id: 'ST002', name: 'Station 2', status: 'maintenance', load: 0, lastUpdate: '12:15' },
    { id: 'ST003', name: 'Station 3', status: 'operational', load: 92, lastUpdate: '14:29' },
    { id: 'ST004', name: 'Station 4', status: 'operational', load: 78, lastUpdate: '14:31' },
    { id: 'ST005', name: 'Station 5', status: 'warning', load: 95, lastUpdate: '14:30' },
    { id: 'ST006', name: 'Station 6', status: 'operational', load: 88, lastUpdate: '14:28' }
  ];

  const recentActions = [
    {
      action: 'Alert Acknowledged',
      actionMalayalam: 'അലേർട്ട് അംഗീകരിച്ചു',
      details: 'High temperature alert for Station 5',
      detailsMalayalam: 'സ്റ്റേഷൻ 5 ന്റെ ഉയർന്ന താപനില അലേർട്ട്',
      timestamp: '14:30',
      user: 'Controller A'
    },
    {
      action: 'Protocol Updated',
      actionMalayalam: 'പ്രോട്ടോക്കോൾ അപ്ഡേറ്റ് ചെയ്തു',
      details: 'Emergency response protocol v2.1',
      detailsMalayalam: 'എമർജൻസി റെസ്പോൺസ് പ്രോട്ടോക്കോൾ v2.1',
      timestamp: '12:45',
      user: 'Controller B'
    },
    {
      action: 'Maintenance Scheduled',
      actionMalayalam: 'അറ്റകുറ്റപ്പണി ഷെഡ്യൂൾ ചെയ്തു',
      details: 'Station 2 equipment maintenance',
      detailsMalayalam: 'സ്റ്റേഷൻ 2 ഉപകരണ അറ്റകുറ്റപ്പണി',
      timestamp: '11:20',
      user: 'Controller A'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'maintenance': return 'bg-blue-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      operational: language === 'malayalam' ? 'പ്രവർത്തനക്ഷമം' : 'Operational',
      warning: language === 'malayalam' ? 'മുന്നറിയിപ്പ്' : 'Warning',
      maintenance: language === 'malayalam' ? 'അറ്റകുറ്റപ്പണി' : 'Maintenance',
      offline: language === 'malayalam' ? 'ഓഫ്‌ലൈൻ' : 'Offline'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'malayalam' ? 'കൺട്രോൾ റൂം ഡാഷ്ബോർഡ്' : 'Control Room Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'malayalam' ? 'പ്രവർത്തന നിരീക്ഷണവും നിയന്ത്രണവും' : 'Operational monitoring and control'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">
            {language === 'malayalam' ? 'തത്സമയ നിരീക്ഷണം' : 'Live Monitoring'}
          </span>
        </div>
      </div>

      {/* Operational Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {operationalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {language === 'malayalam' && stat.valueMalayalam ? stat.valueMalayalam : stat.value}
                  </p>
                  <p className="text-sm mt-1 text-gray-500">{stat.trend}</p>
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
        {/* Active Alerts */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'malayalam' ? 'സജീവ അലേർട്ടുകൾ' : 'Active Alerts'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {language === 'malayalam' ? alert.titleMalayalam : alert.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{alert.location}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{alert.timestamp}</span>
                    <div className="flex items-center space-x-2">
                      {alert.status === 'acknowledged' ? (
                        <span className="flex items-center space-x-1 text-green-600 text-sm">
                          <CheckCircle size={14} />
                          <span>{language === 'malayalam' ? 'അംഗീകരിച്ചു' : 'Acknowledged'}</span>
                        </span>
                      ) : (
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                          {language === 'malayalam' ? 'അംഗീകരിക്കുക' : 'Acknowledge'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Station Status */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'malayalam' ? 'സ്റ്റേഷൻ സ്റ്റാറ്റസ്' : 'Station Status'}
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-3">
              {stationStatus.map((station) => (
                <div key={station.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${getStatusColor(station.status)} rounded-full`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{station.name}</p>
                      <p className="text-sm text-gray-500">
                        {getStatusText(station.status)} • {language === 'malayalam' ? 'അവസാന അപ്ഡേറ്റ്:' : 'Last update:'} {station.lastUpdate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{station.load}%</p>
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${station.load > 90 ? 'bg-red-500' : station.load > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${station.load}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Actions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'malayalam' ? 'സമീപകാല പ്രവർത്തനങ്ങൾ' : 'Recent Actions'}
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActions.map((action, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {language === 'malayalam' ? action.actionMalayalam : action.action}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {language === 'malayalam' ? action.detailsMalayalam : action.details}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-500">{action.timestamp}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-blue-600">{action.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Tools */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'malayalam' ? 'നിയന്ത്രണ ടൂളുകൾ' : 'Control Tools'}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Gauge size={20} className="text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'സിസ്റ്റം മോണിറ്റർ' : 'System Monitor'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'തത്സമയ സിസ്റ്റം മെട്രിക്സ്' : 'Real-time system metrics'}
                </p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings size={20} className="text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'കൺട്രോൾ പാനൽ' : 'Control Panel'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'സിസ്റ്റം കോൺഫിഗറേഷൻ' : 'System configuration'}
                </p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Zap size={20} className="text-red-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'എമർജൻസി പ്രോട്ടോക്കോൾ' : 'Emergency Protocol'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'അടിയന്തര പ്രതികരണം' : 'Emergency response'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControllerDashboard;
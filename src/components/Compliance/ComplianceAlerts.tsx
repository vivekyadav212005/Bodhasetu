import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, AlertCircle, Filter, Download, Eye } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  titleMalayalam: string;
  description: string;
  descriptionMalayalam: string;
  documentId: string;
  documentTitle: string;
  acknowledged: boolean;
  dueDate?: string;
  createdDate: string;
  priority: 'high' | 'medium' | 'low';
}

const ComplianceAlerts: React.FC = () => {
  const { language } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Safety Certificate Expiration',
      titleMalayalam: 'സുരക്ഷാ സർട്ടിഫിക്കറ്റ് കാലാവധി',
      description: 'Safety certificate for Station 3 expires in 15 days. Renewal required immediately.',
      descriptionMalayalam: 'സ്റ്റേഷൻ 3 ന്റെ സുരക്ഷാ സർട്ടിഫിക്കറ്റ് 15 ദിവസത്തിനുള്ളിൽ കാലാവധി കഴിയും. ഉടൻ പുതുക്കേണ്ടതുണ്ട്.',
      documentId: 'doc_001',
      documentTitle: 'Station 3 Safety Certificate',
      acknowledged: false,
      dueDate: '2025-01-30',
      createdDate: '2025-01-15',
      priority: 'high'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Budget Allocation Review',
      titleMalayalam: 'ബജറ്റ് അലോക്കേഷൻ അവലോകനം',
      description: 'Q1 budget allocation requires approval from finance department.',
      descriptionMalayalam: 'Q1 ബജറ്റ് അലോക്കേഷനു ഫിനാൻസ് വകുപ്പിന്റെ അനുമതി ആവശ്യമാണ്.',
      documentId: 'doc_002',
      documentTitle: 'Q1 2025 Budget Plan',
      acknowledged: false,
      dueDate: '2025-01-25',
      createdDate: '2025-01-12',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'info',
      title: 'Maintenance Schedule Update',
      titleMalayalam: 'അറ്റകുറ്റപ്പണി ഷെഡ്യൂൾ അപ്ഡേറ്റ്',
      description: 'Monthly maintenance schedule has been updated with new protocols.',
      descriptionMalayalam: 'പുതിയ പ്രോട്ടോക്കോളുകളോടെ മാസിക അറ്റകുറ്റപ്പണി ഷെഡ്യൂൾ അപ്ഡേറ്റ് ചെയ്തിരിക്കുന്നു.',
      documentId: 'doc_003',
      documentTitle: 'Maintenance Protocol v2.1',
      acknowledged: true,
      createdDate: '2025-01-10',
      priority: 'low'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle size={20} className="text-red-600" />;
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-600" />;
      case 'info':
        return <CheckCircle size={20} className="text-blue-600" />;
      default:
        return <AlertCircle size={20} className="text-gray-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const typeMatch = filterType === 'all' || alert.type === filterType;
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'acknowledged' && alert.acknowledged) ||
      (filterStatus === 'pending' && !alert.acknowledged);
    return typeMatch && statusMatch;
  });

  const handleAcknowledge = (alertId: string) => {
    // Implementation for acknowledging alerts
    console.log('Acknowledging alert:', alertId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'malayalam' ? 'അനുസരണ അലേർട്ടുകൾ' : 'Compliance Alerts'}
        </h1>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            <span>{language === 'malayalam' ? 'റിപ്പോർട്ട് എക്സ്പോർട്ട്' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {language === 'malayalam' ? 'ആകെ അലേർട്ടുകൾ' : 'Total Alerts'}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{alerts.length}</p>
            </div>
            <AlertCircle size={32} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {language === 'malayalam' ? 'നിർണായകം' : 'Critical'}
              </p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {alerts.filter(a => a.type === 'critical').length}
              </p>
            </div>
            <AlertTriangle size={32} className="text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {language === 'malayalam' ? 'കാത്തിരിക്കുന്നു' : 'Pending'}
              </p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {alerts.filter(a => !a.acknowledged).length}
              </p>
            </div>
            <Clock size={32} className="text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {language === 'malayalam' ? 'അംഗീകരിച്ചത്' : 'Acknowledged'}
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {alerts.filter(a => a.acknowledged).length}
              </p>
            </div>
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <span className="font-medium text-gray-700">
                {language === 'malayalam' ? 'ഫിൽട്ടറുകൾ:' : 'Filters:'}
              </span>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{language === 'malayalam' ? 'എല്ലാ തരങ്ങൾ' : 'All Types'}</option>
              <option value="critical">{language === 'malayalam' ? 'നിർണായകം' : 'Critical'}</option>
              <option value="warning">{language === 'malayalam' ? 'മുന്നറിയിപ്പ്' : 'Warning'}</option>
              <option value="info">{language === 'malayalam' ? 'വിവരം' : 'Info'}</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{language === 'malayalam' ? 'എല്ലാ സ്റ്റാറ്റസുകൾ' : 'All Status'}</option>
              <option value="pending">{language === 'malayalam' ? 'കാത്തിരിക്കുന്നു' : 'Pending'}</option>
              <option value="acknowledged">{language === 'malayalam' ? 'അംഗീകരിച്ചത്' : 'Acknowledged'}</option>
            </select>
          </div>
        </div>

        {/* Alerts List */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-6 rounded-lg border-2 ${getAlertColor(alert.type)} ${
                  !alert.acknowledged ? 'shadow-md' : 'opacity-75'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {language === 'malayalam' ? alert.titleMalayalam : alert.title}
                      </h3>
                      <p className="text-gray-700 mt-1 leading-relaxed">
                        {language === 'malayalam' ? alert.descriptionMalayalam : alert.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>
                      {alert.priority}
                    </span>
                    {alert.acknowledged && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {language === 'malayalam' ? 'അംഗീകരിച്ചു' : 'Acknowledged'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      {language === 'malayalam' ? 'രേഖ:' : 'Document:'} {alert.documentTitle}
                    </span>
                    <span>
                      {language === 'malayalam' ? 'സൃഷ്ടിച്ചത്:' : 'Created:'} {alert.createdDate}
                    </span>
                    {alert.dueDate && (
                      <span className="text-red-600 font-medium">
                        {language === 'malayalam' ? 'അവസാന തീയതി:' : 'Due:'} {alert.dueDate}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={16} />
                      <span>{language === 'malayalam' ? 'രേഖ കാണുക' : 'View Document'}</span>
                    </button>
                    
                    {!alert.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <CheckCircle size={16} />
                        <span>{language === 'malayalam' ? 'അംഗീകരിക്കുക' : 'Acknowledge'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceAlerts;
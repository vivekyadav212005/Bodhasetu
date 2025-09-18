import React from 'react';
import { Scale, FileText, AlertTriangle, CheckCircle, Clock, Download, Eye, Filter } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const LegalDashboard: React.FC = () => {
  const { language } = useApp();

  const complianceStats = [
    {
      title: language === 'malayalam' ? 'കംപ്ലയൻസ് സ്കോർ' : 'Compliance Score',
      value: '94.2%',
      icon: Scale,
      color: 'bg-green-500',
      trend: '+2.1%'
    },
    {
      title: language === 'malayalam' ? 'പെൻഡിംഗ് റിവ്യൂ' : 'Pending Review',
      value: '18',
      icon: Clock,
      color: 'bg-yellow-500',
      trend: '+3'
    },
    {
      title: language === 'malayalam' ? 'നിർണായക അലേർട്ടുകൾ' : 'Critical Alerts',
      value: '5',
      icon: AlertTriangle,
      color: 'bg-red-500',
      trend: '-2'
    },
    {
      title: language === 'malayalam' ? 'പൂർത്തിയായ ഓഡിറ്റുകൾ' : 'Completed Audits',
      value: '127',
      icon: CheckCircle,
      color: 'bg-blue-500',
      trend: '+8'
    }
  ];

  const flaggedDocuments = [
    {
      id: '1',
      title: 'Contract Amendment - Station 3',
      titleMalayalam: 'കരാർ ഭേദഗതി - സ്റ്റേഷൻ 3',
      type: 'contract',
      severity: 'high',
      issue: 'Missing regulatory approval clause',
      issueMalayalam: 'റെഗുലേറ്ററി അപ്രൂവൽ ക്ലോസ് ഇല്ല',
      dueDate: '2025-01-20',
      department: 'Engineering'
    },
    {
      id: '2',
      title: 'Budget Allocation Q1 2025',
      titleMalayalam: 'ബജറ്റ് അലോക്കേഷൻ Q1 2025',
      type: 'financial',
      severity: 'medium',
      issue: 'Exceeds departmental limits',
      issueMalayalam: 'വകുപ്പിന്റെ പരിധി കവിയുന്നു',
      dueDate: '2025-01-25',
      department: 'Finance'
    },
    {
      id: '3',
      title: 'Safety Protocol Update',
      titleMalayalam: 'സുരക്ഷാ പ്രോട്ടോക്കോൾ അപ്ഡേറ്റ്',
      type: 'safety',
      severity: 'low',
      issue: 'Minor formatting issues',
      issueMalayalam: 'ചെറിയ ഫോർമാറ്റിംഗ് പ്രശ്നങ്ങൾ',
      dueDate: '2025-01-30',
      department: 'Operations'
    }
  ];

  const auditTrail = [
    {
      action: 'Document Approved',
      actionMalayalam: 'രേഖ അനുമോദിച്ചു',
      document: 'Safety Manual v2.1',
      user: 'Legal Officer',
      timestamp: '2025-01-15 14:30'
    },
    {
      action: 'Compliance Flag Raised',
      actionMalayalam: 'കംപ്ലയൻസ് ഫ്ലാഗ് ഉയർത്തി',
      document: 'Contract Amendment',
      user: 'System',
      timestamp: '2025-01-15 12:15'
    },
    {
      action: 'Version Updated',
      actionMalayalam: 'പതിപ്പ് അപ്ഡേറ്റ് ചെയ്തു',
      document: 'Budget Plan Q1',
      user: 'Finance Officer',
      timestamp: '2025-01-15 10:45'
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'malayalam' ? 'നിയമ വകുപ്പ് ഡാഷ്ബോർഡ്' : 'Legal Department Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'malayalam' ? 'കംപ്ലയൻസ് നിരീക്ഷണവും ഓഡിറ്റ് മാനേജ്‌മെന്റും' : 'Compliance monitoring and audit management'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={16} />
            <span>{language === 'malayalam' ? 'കംപ്ലയൻസ് റിപ്പോർട്ട്' : 'Compliance Report'}</span>
          </button>
        </div>
      </div>

      {/* Compliance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend} {language === 'malayalam' ? 'ഈ മാസം' : 'this month'}
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
        {/* Flagged Documents */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'malayalam' ? 'ഫ്ലാഗ് ചെയ്ത രേഖകൾ' : 'Flagged Documents'}
              </h2>
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                <Filter size={16} />
                <span className="text-sm">{language === 'malayalam' ? 'ഫിൽട്ടർ' : 'Filter'}</span>
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {flaggedDocuments.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {language === 'malayalam' ? doc.titleMalayalam : doc.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {language === 'malayalam' ? doc.issueMalayalam : doc.issue}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(doc.severity)}`}>
                      {doc.severity}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{doc.department}</span>
                      <span>
                        {language === 'malayalam' ? 'അവസാന തീയതി:' : 'Due:'} {doc.dueDate}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Eye size={14} />
                        <span className="text-sm">{language === 'malayalam' ? 'കാണുക' : 'View'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'malayalam' ? 'ഓഡിറ്റ് ട്രയൽ' : 'Audit Trail'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {auditTrail.map((entry, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {language === 'malayalam' ? entry.actionMalayalam : entry.action}
                    </p>
                    <p className="text-sm text-gray-600">{entry.document}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{entry.user}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{entry.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Tools */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'malayalam' ? 'കംപ്ലയൻസ് ടൂളുകൾ' : 'Compliance Tools'}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText size={20} className="text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'റിപ്പോർട്ട് ജനറേറ്റർ' : 'Report Generator'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'കസ്റ്റം കംപ്ലയൻസ് റിപ്പോർട്ടുകൾ' : 'Custom compliance reports'}
                </p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Scale size={20} className="text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'നിയമ ഡാറ്റാബേസ്' : 'Legal Database'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'നിയമങ്ങളും നിയന്ത്രണങ്ങളും' : 'Laws and regulations'}
                </p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <AlertTriangle size={20} className="text-red-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'റിസ്ക് അസസ്മെന്റ്' : 'Risk Assessment'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'കംപ്ലയൻസ് റിസ്ക് വിശകലനം' : 'Compliance risk analysis'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDashboard;
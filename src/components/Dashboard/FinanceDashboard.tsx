import React from 'react';
import { DollarSign, TrendingUp, FileText, AlertCircle, PieChart, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const FinanceDashboard: React.FC = () => {
  const { language } = useApp();

  const financialStats = [
    {
      title: language === 'malayalam' ? 'മാസിക ബജറ്റ്' : 'Monthly Budget',
      value: '₹2.4Cr',
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+5.2%'
    },
    {
      title: language === 'malayalam' ? 'പെൻഡിംഗ് അപ്രൂവലുകൾ' : 'Pending Approvals',
      value: '12',
      icon: Clock,
      color: 'bg-yellow-500',
      trend: '+3'
    },
    {
      title: language === 'malayalam' ? 'കരാർ മൂല്യം' : 'Contract Value',
      value: '₹18.7Cr',
      icon: FileText,
      color: 'bg-blue-500',
      trend: '+12.3%'
    },
    {
      title: language === 'malayalam' ? 'കംപ്ലയൻസ് സ്കോർ' : 'Compliance Score',
      value: '96.8%',
      icon: CheckCircle,
      color: 'bg-purple-500',
      trend: '+1.2%'
    }
  ];

  const pendingApprovals = [
    {
      id: '1',
      title: 'Equipment Purchase - Station 2',
      titleMalayalam: 'ഉപകരണ വാങ്ങൽ - സ്റ്റേഷൻ 2',
      amount: '₹45,00,000',
      department: 'Engineering',
      priority: 'high',
      submittedDate: '2025-01-12',
      dueDate: '2025-01-18'
    },
    {
      id: '2',
      title: 'Maintenance Contract Renewal',
      titleMalayalam: 'മെയിന്റനൻസ് കരാർ പുതുക്കൽ',
      amount: '₹12,50,000',
      department: 'Operations',
      priority: 'medium',
      submittedDate: '2025-01-14',
      dueDate: '2025-01-22'
    },
    {
      id: '3',
      title: 'Software License Upgrade',
      titleMalayalam: 'സോഫ്റ്റ്‌വെയർ ലൈസൻസ് അപ്ഗ്രേഡ്',
      amount: '₹8,75,000',
      department: 'IT',
      priority: 'low',
      submittedDate: '2025-01-15',
      dueDate: '2025-01-25'
    }
  ];

  const budgetBreakdown = [
    { category: 'Personnel', categoryMalayalam: 'ജീവനക്കാർ', amount: 45, color: 'bg-blue-500' },
    { category: 'Equipment', categoryMalayalam: 'ഉപകരണങ്ങൾ', amount: 25, color: 'bg-green-500' },
    { category: 'Maintenance', categoryMalayalam: 'അറ്റകുറ്റപ്പണി', amount: 20, color: 'bg-yellow-500' },
    { category: 'Others', categoryMalayalam: 'മറ്റുള്ളവ', amount: 10, color: 'bg-purple-500' }
  ];

  const recentTransactions = [
    {
      type: 'expense',
      description: 'Safety Equipment Purchase',
      descriptionMalayalam: 'സുരക്ഷാ ഉപകരണ വാങ്ങൽ',
      amount: '₹2,50,000',
      date: '2025-01-15',
      status: 'completed'
    },
    {
      type: 'approval',
      description: 'Contract Amendment Approved',
      descriptionMalayalam: 'കരാർ ഭേദഗതി അനുമോദിച്ചു',
      amount: '₹15,00,000',
      date: '2025-01-14',
      status: 'approved'
    },
    {
      type: 'pending',
      description: 'Budget Allocation Request',
      descriptionMalayalam: 'ബജറ്റ് അലോക്കേഷൻ അഭ്യർത്ഥന',
      amount: '₹8,00,000',
      date: '2025-01-13',
      status: 'pending'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'approved': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'malayalam' ? 'ധനകാര്യ ഡാഷ്ബോർഡ്' : 'Finance Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'malayalam' ? 'ബജറ്റ് നിരീക്ഷണവും അപ്രൂവൽ മാനേജ്‌മെന്റും' : 'Budget monitoring and approval management'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp size={20} className="text-green-600" />
          <span className="text-sm text-gray-600">
            {language === 'malayalam' ? 'ബജറ്റ് ട്രാക്കിൽ' : 'Budget on track'}
          </span>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => {
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
        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'malayalam' ? 'പെൻഡിംഗ് അപ്രൂവലുകൾ' : 'Pending Approvals'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {language === 'malayalam' ? approval.titleMalayalam : approval.title}
                      </h3>
                      <p className="text-lg font-semibold text-green-600 mt-1">{approval.amount}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(approval.priority)}`}>
                      {approval.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{approval.department}</span>
                      <span>
                        {language === 'malayalam' ? 'അവസാന തീയതി:' : 'Due:'} {approval.dueDate}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                        {language === 'malayalam' ? 'അനുമോദിക്കുക' : 'Approve'}
                      </button>
                      <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors">
                        {language === 'malayalam' ? 'കാണുക' : 'View'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'malayalam' ? 'ബജറ്റ് വിഭജനം' : 'Budget Breakdown'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {budgetBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${item.color} rounded`}></div>
                    <span className="font-medium text-gray-900">
                      {language === 'malayalam' ? item.categoryMalayalam : item.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{item.amount}%</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.amount}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'malayalam' ? 'സമീപകാല ഇടപാടുകൾ' : 'Recent Transactions'}
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'expense' ? 'bg-red-500' :
                    transaction.type === 'approval' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {language === 'malayalam' ? transaction.descriptionMalayalam : transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{transaction.amount}</p>
                  <p className={`text-sm capitalize ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Tools */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'malayalam' ? 'ധനകാര്യ ടൂളുകൾ' : 'Financial Tools'}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <PieChart size={20} className="text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'ബജറ്റ് അനാലിസിസ്' : 'Budget Analysis'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'വിശദമായ ബജറ്റ് റിപ്പോർട്ടുകൾ' : 'Detailed budget reports'}
                </p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar size={20} className="text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'ബജറ്റ് പ്ലാനിംഗ്' : 'Budget Planning'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'ഭാവി ബജറ്റ് പ്രവചനങ്ങൾ' : 'Future budget forecasts'}
                </p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <AlertCircle size={20} className="text-red-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {language === 'malayalam' ? 'കംപ്ലയൻസ് ചെക്ക്' : 'Compliance Check'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'malayalam' ? 'ധനകാര്യ നിയമ പാലനം' : 'Financial regulation compliance'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
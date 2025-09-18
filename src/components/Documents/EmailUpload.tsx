import React, { useState, useEffect } from 'react';
import { Mail, Download, FileText, Calendar, User, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { EmailMessage, EmailAttachment } from '../../types';

const EmailUpload: React.FC = () => {
  const { language } = useApp();
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<Array<{ emailId: string; progress: number; status: string }>>([]);

  // Mock email data
  const mockEmails: EmailMessage[] = [
    {
      id: '1',
      from: 'contracts@company.com',
      subject: 'Project Agreement - Phase 1',
      date: '2024-01-15T10:30:00Z',
      attachments: [
        { id: '1', name: 'project_agreement.pdf', type: 'pdf', size: 2048576 },
        { id: '2', name: 'terms_conditions.doc', type: 'doc', size: 1024000 }
      ],
      isRead: false
    },
    {
      id: '2',
      from: 'legal@firm.com',
      subject: 'Compliance Review - Q4 2023',
      date: '2024-01-14T14:20:00Z',
      attachments: [
        { id: '3', name: 'compliance_report.pdf', type: 'pdf', size: 1536000 },
        { id: '4', name: 'audit_findings.docx', type: 'docx', size: 512000 }
      ],
      isRead: true
    },
    {
      id: '3',
      from: 'finance@department.com',
      subject: 'Budget Allocation Documents',
      date: '2024-01-13T09:15:00Z',
      attachments: [
        { id: '5', name: 'budget_2024.pdf', type: 'pdf', size: 3072000 },
        { id: '6', name: 'expense_report.xlsx', type: 'other', size: 256000 }
      ],
      isRead: false
    },
    {
      id: '4',
      from: 'engineering@tech.com',
      subject: 'Technical Specifications',
      date: '2024-01-12T16:45:00Z',
      attachments: [
        { id: '7', name: 'tech_specs.pdf', type: 'pdf', size: 4096000 },
        { id: '8', name: 'design_documents.doc', type: 'doc', size: 1792000 }
      ],
      isRead: true
    }
  ];

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setEmails(mockEmails);
      setLoading(false);
    }, 1500);
  };

  const handleEmailSelect = (emailId: string) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(emailId)) {
      newSelected.delete(emailId);
    } else {
      newSelected.add(emailId);
    }
    setSelectedEmails(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEmails.size === emails.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(emails.map(email => email.id)));
    }
  };

  const handleUploadSelected = async () => {
    if (selectedEmails.size === 0) return;

    const selectedEmailList = emails.filter(email => selectedEmails.has(email.id));
    
    // Initialize upload progress
    const initialProgress = selectedEmailList.map(email => ({
      emailId: email.id,
      progress: 0,
      status: 'uploading'
    }));
    setUploadProgress(initialProgress);

    // Simulate upload process
    selectedEmailList.forEach((email, index) => {
      const interval = setInterval(() => {
        setUploadProgress(prev => 
          prev.map((upload, i) => 
            upload.emailId === email.id
              ? { ...upload, progress: Math.min(upload.progress + 20, 100) }
              : upload
          )
        );
      }, 300);

      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(prev => 
          prev.map((upload, i) => 
            upload.emailId === email.id
              ? { ...upload, progress: 100, status: 'completed' }
              : upload
          )
        );
      }, 2000 + (index * 500));
    });

    // Clear selection after upload
    setTimeout(() => {
      setSelectedEmails(new Set());
      setUploadProgress([]);
    }, 5000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      default:
        return '📎';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'malayalam' ? 'ഇമെയിൽ അപ്‌ലോഡ്' : 'Email Upload'}
          </h1>
        </div>
        <button
          onClick={fetchEmails}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>{language === 'malayalam' ? 'പുതുക്കുക' : 'Refresh'}</span>
        </button>
      </div>

      {/* Email List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'malayalam' ? 'ഇമെയിലുകൾ' : 'Emails'}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {selectedEmails.size === emails.length 
                  ? (language === 'malayalam' ? 'എല്ലാം നീക്കം ചെയ്യുക' : 'Deselect All')
                  : (language === 'malayalam' ? 'എല്ലാം തിരഞ്ഞെടുക്കുക' : 'Select All')
                }
              </button>
              {selectedEmails.size > 0 && (
                <button
                  onClick={handleUploadSelected}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {language === 'malayalam' 
                    ? `${selectedEmails.size} അപ്‌ലോഡ് ചെയ്യുക` 
                    : `Upload ${selectedEmails.size} Selected`
                  }
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw size={32} className="animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">
                {language === 'malayalam' ? 'ഇമെയിലുകൾ ലോഡ് ചെയ്യുന്നു...' : 'Loading emails...'}
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 border rounded-lg transition-all cursor-pointer ${
                    selectedEmails.has(email.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleEmailSelect(email.id)}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedEmails.has(email.id)}
                      onChange={() => handleEmailSelect(email.id)}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <User size={16} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {email.from}
                        </span>
                        {!email.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <Mail size={16} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">
                          {email.subject}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500">
                          {formatDate(email.date)}
                        </span>
                      </div>
                      
                      {email.attachments.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <FileText size={16} className="text-gray-400 flex-shrink-0" />
                            <span className="text-xs font-medium text-gray-600">
                              {language === 'malayalam' ? 'അറ്റാച്ച്മെന്റുകൾ:' : 'Attachments:'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 ml-6">
                            {email.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded text-xs"
                              >
                                <span>{getAttachmentIcon(attachment.type)}</span>
                                <span className="text-gray-700">{attachment.name}</span>
                                <span className="text-gray-500">({formatFileSize(attachment.size)})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'malayalam' ? 'അപ്‌ലോഡ് പുരോഗതി' : 'Upload Progress'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {uploadProgress.map((upload) => {
                const email = emails.find(e => e.id === upload.emailId);
                return (
                  <div key={upload.emailId} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Mail size={20} className="text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {email?.subject}
                        </span>
                        <div className="flex items-center space-x-2">
                          {upload.status === 'completed' && (
                            <CheckCircle size={16} className="text-green-600" />
                          )}
                          <span className="text-sm text-gray-500">{upload.progress}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            upload.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailUpload;

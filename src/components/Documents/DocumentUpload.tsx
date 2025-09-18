import React, { useState, useCallback } from 'react';
import { Upload, FileText, Globe, Mail, MessageSquare, Database, X, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

interface UploadSource {
  id: string;
  name: string;
  nameMalayalam: string;
  icon: React.ComponentType<any>;
  description: string;
  descriptionMalayalam: string;
}

const uploadSources: UploadSource[] = [
  {
    id: 'manual',
    name: 'Manual Upload',
    nameMalayalam: 'മാനുവൽ അപ്‌ലോഡ്',
    icon: Upload,
    description: 'Drag & drop files or browse',
    descriptionMalayalam: 'ഫയലുകൾ ഡ്രാഗ് ചെയ്യുക അല്ലെങ്കിൽ ബ്രൗസ് ചെയ്യുക'
  },
  {
    id: 'email',
    name: 'Email Fetch',
    nameMalayalam: 'ഇമെയിൽ നിന്ന്',
    icon: Mail,
    description: 'Fetch from IMAP server',
    descriptionMalayalam: 'IMAP സെർവറിൽ നിന്ന് ലഭിക്കുക'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    nameMalayalam: 'വാട്സ്ആപ്പ്',
    icon: MessageSquare,
    description: 'Import from messaging app',
    descriptionMalayalam: 'മെസേജിംഗ് ആപ്പിൽ നിന്ന് ഇമ്പോർട്ട് ചെയ്യുക'
  },
  {
    id: 'sharepoint',
    name: 'SharePoint',
    nameMalayalam: 'ഷെയർപോയിന്റ്',
    icon: Database,
    description: 'Connect to enterprise systems',
    descriptionMalayalam: 'എന്റർപ്രൈസ് സിസ്റ്റങ്ങളുമായി ബന്ധിപ്പിക്കുക'
  }
];

interface DocumentUploadProps {
  onNavigateToEmailUpload?: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onNavigateToEmailUpload }) => {
  const { language } = useApp();
  const [selectedSource, setSelectedSource] = useState<string>('manual');
  const [selectedLanguage, setSelectedLanguage] = useState<'malayalam' | 'english' | 'bilingual'>('bilingual');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Array<{ name: string; progress: number; status: string }>>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = (files: File[]) => {
    const newUploads = files.map(file => ({
      name: file.name,
      progress: 0,
      status: 'uploading'
    }));
    
    setUploadProgress(newUploads);

    // Simulate upload progress
    files.forEach((file, index) => {
      const interval = setInterval(() => {
        setUploadProgress(prev => 
          prev.map((upload, i) => 
            i === index 
              ? { ...upload, progress: Math.min(upload.progress + 10, 100) }
              : upload
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(prev => 
          prev.map((upload, i) => 
            i === index 
              ? { ...upload, progress: 100, status: 'completed' }
              : upload
          )
        );
      }, 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'malayalam' ? 'രേഖ അപ്‌ലോഡ്' : 'Document Upload'}
        </h1>
      </div>

      {/* Upload Source Selection */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'malayalam' ? 'അപ്‌ലോഡ് ഉറവിടം തിരഞ്ഞെടുക്കുക' : 'Select Upload Source'}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {uploadSources.map((source) => {
              const Icon = source.icon;
              return (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(source.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedSource === source.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Icon size={32} className={selectedSource === source.id ? 'text-blue-600' : 'text-gray-400'} />
                    <h3 className="font-medium text-gray-900">
                      {language === 'malayalam' ? source.nameMalayalam : source.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {language === 'malayalam' ? source.descriptionMalayalam : source.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'malayalam' ? 'പ്രോസസ്സിംഗ് ഭാഷ' : 'Processing Language'}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'malayalam', name: 'Malayalam Only', nameMalayalam: 'മലയാളം മാത്രം' },
              { id: 'english', name: 'English Only', nameMalayalam: 'ഇംഗ്ലീഷ് മാത്രം' },
              { id: 'bilingual', name: 'Bilingual', nameMalayalam: 'ദ്വിഭാഷ' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id as any)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage === lang.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Globe size={20} className={selectedLanguage === lang.id ? 'text-blue-600' : 'text-gray-400'} />
                  <span className="font-medium text-gray-900">
                    {language === 'malayalam' ? lang.nameMalayalam : lang.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Area */}
      {selectedSource === 'manual' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'malayalam' 
                  ? 'ഫയലുകൾ ഇവിടെ ഡ്രാഗ് ചെയ്യുക' 
                  : 'Drag files here or click to browse'}
              </h3>
              <p className="text-gray-500 mb-4">
                {language === 'malayalam'
                  ? 'PDF, DOC, DOCX, JPG, PNG ഫയലുകൾ പിന്തുണയ്ക്കുന്നു'
                  : 'Supports PDF, DOC, DOCX, JPG, PNG files'}
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
                onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FileText size={16} className="mr-2" />
                {language === 'malayalam' ? 'ഫയലുകൾ തിരഞ്ഞെടുക്കുക' : 'Select Files'}
              </label>
            </div>
            
            {/* Email Upload Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  {language === 'malayalam' 
                    ? 'അല്ലെങ്കിൽ ഇമെയിലുകളിൽ നിന്ന് ഡോക്യുമെന്റുകൾ അപ്‌ലോഡ് ചെയ്യുക' 
                    : 'Or upload documents from emails'}
                </p>
                <button
                  onClick={onNavigateToEmailUpload}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Mail size={16} className="mr-2" />
                  {language === 'malayalam' ? 'ഇമെയിൽ അപ്‌ലോഡ്' : 'Email Upload'}
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Fetch Area */}
      {selectedSource === 'email' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6">
            <div className="text-center">
              <Mail size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'malayalam' 
                  ? 'ഇമെയിൽ സെർവറിൽ നിന്ന് ഫെച്ച് ചെയ്യുക' 
                  : 'Fetch from Email Server'}
              </h3>
              <p className="text-gray-500 mb-6">
                {language === 'malayalam'
                  ? 'IMAP സെർവറിൽ നിന്ന് ഇമെയിലുകളും അറ്റാച്ച്മെന്റുകളും ലഭിക്കുക'
                  : 'Retrieve emails and attachments from IMAP server'}
              </p>
              <button
                onClick={onNavigateToEmailUpload}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail size={16} className="mr-2" />
                {language === 'malayalam' ? 'ഇമെയിൽ അപ്‌ലോഡ് പേജിലേക്ക് പോകുക' : 'Go to Email Upload Page'}
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

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
              {uploadProgress.map((upload, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <FileText size={20} className="text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{upload.name}</span>
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
                  <button className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
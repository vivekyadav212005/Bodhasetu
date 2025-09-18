import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield, Globe, AlertCircle, Loader2, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validateGovernmentEmail } from '../../utils/auth';

const LoginPage: React.FC = () => {
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<'english' | 'malayalam'>('english');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = language === 'malayalam' 
        ? 'പേര് ആവശ്യമാണ്' 
        : 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = language === 'malayalam' 
        ? 'പേര് കുറഞ്ഞത് 2 അക്ഷരം വേണം' 
        : 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      errors.email = language === 'malayalam' 
        ? 'ഇമെയിൽ ആവശ്യമാണ്' 
        : 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = language === 'malayalam' 
        ? 'സാധുവായ ഇമെയിൽ വിലാസം നൽകുക' 
        : 'Please enter a valid email address';
    } else if (!validateGovernmentEmail(formData.email)) {
      errors.email = language === 'malayalam' 
        ? 'സർക്കാർ ഇമെയിൽ വിലാസം ഉപയോഗിക്കുക (.gov.in)' 
        : 'Please use your official government email (.gov.in)';
    }
    
    if (!formData.password) {
      errors.password = language === 'malayalam' 
        ? 'പാസ്‌വേഡ് ആവശ്യമാണ്' 
        : 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = language === 'malayalam' 
        ? 'പാസ്‌വേഡ് കുറഞ്ഞത് 6 അക്ഷരം വേണം' 
        : 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(formData);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const translations = {
    english: {
      title: 'BodhaSetu',
      subtitle: 'Intelligent Document Management System',
      description: 'Secure access to government document management and compliance system',
      nameLabel: 'Full Name',
      namePlaceholder: 'Enter your full name',
      emailLabel: 'Official Email Address',
      emailPlaceholder: 'your.name@department.gov.in',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      loginButton: 'Sign In',
      loggingIn: 'Signing In...',
      forgotPassword: 'Forgot Password?',
      secureLogin: 'Secure Government Login',
      supportedDepartments: 'Supported Departments',
      departments: [
        'Engineering & Technical Services',
        'Administration & IT',
        'Legal Affairs',
        'Finance & Accounts',
        'Operations & Control'
      ],
      footer: 'Government of India • Secure Document Management',
      languageToggle: 'മലയാളം'
    },
    malayalam: {
      title: 'ബോധസേതു',
      subtitle: 'ബുദ്ധിമാനായ രേഖ മാനേജ്‌മെന്റ് സിസ്റ്റം',
      description: 'സർക്കാർ രേഖ മാനേജ്‌മെന്റ്, അനുസരണ സിസ്റ്റത്തിലേക്കുള്ള സുരക്ഷിത പ്രവേശനം',
      nameLabel: 'പൂർണ്ണ നാമം',
      namePlaceholder: 'നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക',
      emailLabel: 'ഔദ്യോഗിക ഇമെയിൽ വിലാസം',
      emailPlaceholder: 'your.name@department.gov.in',
      passwordLabel: 'പാസ്‌വേഡ്',
      passwordPlaceholder: 'നിങ്ങളുടെ പാസ്‌വേഡ് നൽകുക',
      loginButton: 'സൈൻ ഇൻ',
      loggingIn: 'സൈൻ ഇൻ ചെയ്യുന്നു...',
      forgotPassword: 'പാസ്‌വേഡ് മറന്നോ?',
      secureLogin: 'സുരക്ഷിത സർക്കാർ ലോഗിൻ',
      supportedDepartments: 'പിന്തുണയുള്ള വകുപ്പുകൾ',
      departments: [
        'എഞ്ചിനീയറിംഗ് & സാങ്കേതിക സേവനങ്ങൾ',
        'അഡ്മിനിസ്ട്രേഷൻ & ഐടി',
        'നിയമകാര്യങ്ങൾ',
        'ധനകാര്യം & അക്കൗണ്ടുകൾ',
        'പ്രവർത്തനങ്ങൾ & നിയന്ത്രണം'
      ],
      footer: 'ഭാരത സർക്കാർ • സുരക്ഷിത രേഖ മാനേജ്‌മെന്റ്',
      languageToggle: 'English'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Info */}
        <div className="text-white space-y-8 lg:pr-8">
          {/* Logo and Title */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <img 
                  src="/public/WhatsApp Image 2025-09-14 at 19.31.05_ee4cf298.jpg" 
                  alt="BodhaSetu Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{t.title}</h1>
                <p className="text-blue-200 text-lg">{t.subtitle}</p>
              </div>
            </div>
            <p className="text-blue-100 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
              {t.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-teal-300" />
              <span className="text-blue-100">{t.secureLogin}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-teal-300" />
              <span className="text-blue-100">
                {language === 'malayalam' ? 'ദ്വിഭാഷാ പിന്തുണ' : 'Bilingual Support'}
              </span>
            </div>
          </div>

          {/* Supported Departments */}
          <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
            <h3 className="text-lg font-semibold mb-4 text-teal-300">{t.supportedDepartments}</h3>
            <ul className="space-y-2">
              {t.departments.map((dept, index) => (
                <li key={index} className="text-blue-100 text-sm flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  <span>{dept}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
            {/* Language Toggle */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setLanguage(language === 'english' ? 'malayalam' : 'english')}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe size={16} />
                <span>{t.languageToggle}</span>
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 text-sm font-medium">
                    {language === 'malayalam' ? 'ലോഗിൻ പിശക്' : 'Login Error'}
                  </p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.nameLabel}
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t.namePlaceholder}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                </div>
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>{t.loggingIn}</span>
                  </>
                ) : (
                  <span>{t.loginButton}</span>
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={loading}
                >
                  {t.forgotPassword}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-blue-200 text-sm mt-6">
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
export const translations = {
  english: {
    dashboard: 'Dashboard',
    documents: 'Documents',
    search: 'Search',
    compliance: 'Compliance',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    upload: 'Upload Document',
    processing: 'Processing',
    completed: 'Completed',
    error: 'Error',
    pendingReview: 'Pending Review',
    critical: 'Critical',
    warning: 'Warning',
    info: 'Information',
    acknowledge: 'Acknowledge',
    searchPlaceholder: 'Search documents...',
    askQuestion: 'Ask a question...',
    recentDocuments: 'Recent Documents',
    systemHealth: 'System Health',
    userManagement: 'User Management',
    complianceAlerts: 'Compliance Alerts',
    documentsSummary: 'Documents Summary',
    aiAssistant: 'AI Assistant'
  },
  malayalam: {
    dashboard: 'ഡാഷ്ബോർഡ്',
    documents: 'രേഖകൾ',
    search: 'തിരയുക',
    compliance: 'അനുസരണം',
    settings: 'ക്രമീകരണങ്ങൾ',
    profile: 'പ്രൊഫൈൽ',
    logout: 'ലോഗ് ഔട്ട്',
    upload: 'രേഖ അപ്‌ലോഡ് ചെയ്യുക',
    processing: 'പ്രോസസ്സിംഗ്',
    completed: 'പൂർത്തിയായി',
    error: 'പിശക്',
    pendingReview: 'അവലോകനം കാത്തിരിക്കുന്നു',
    critical: 'നിർണായകം',
    warning: 'മുന്നറിയിപ്പ്',
    info: 'വിവരം',
    acknowledge: 'അംഗീകരിക്കുക',
    searchPlaceholder: 'രേഖകൾ തിരയുക...',
    askQuestion: 'ചോദ്യം ചോദിക്കുക...',
    recentDocuments: 'സമീപകാല രേഖകൾ',
    systemHealth: 'സിസ്റ്റം ആരോഗ്യം',
    userManagement: 'ഉപയോക്താക്കളുടെ മാനേജ്‌മെന്റ്',
    complianceAlerts: 'അനുസരണ അലേർട്ടുകൾ',
    documentsSummary: 'രേഖകളുടെ സംഗ്രഹം',
    aiAssistant: 'AI സഹായി'
  }
};

export const t = (key: keyof typeof translations.english, language: 'malayalam' | 'english') => {
  return translations[language][key] || translations.english[key];
};
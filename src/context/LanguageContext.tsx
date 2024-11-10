import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // General
    appTitle: 'نظام إدارة شرائح الاتصال',
    logout: 'تسجيل الخروج',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    search: 'بحث',
    loading: 'جاري التحميل...',
    
    // Dashboard
    totalSims: 'عدد الشرائح',
    monthlyCost: 'التكلفة الشهرية',
    annualCost: 'التكلفة السنوية',
    costAnalysis: 'تحليل التكاليف',
    
    // SIM Cards
    simNumber: 'رقم الشريحة',
    serviceType: 'نوع الخدمة',
    provider: 'مزود الخدمة',
    cost: 'التكلفة',
    location: 'الموقع',
    notes: 'ملاحظات',
    addNewSim: 'إضافة شريحة جديدة',
    
    // Service Types
    data: 'بيانات',
    calls: 'مكالمات',
    mixed: 'مختلط',
    vsat: 'انترنت فضائي (VSAT)',
    microwave: 'انترنت Microwave',
    
    // Projects
    projects: 'المشاريع',
    addProject: 'إضافة مشروع',
    projectName: 'اسم المشروع',
    projectDescription: 'وصف المشروع',
    startDate: 'تاريخ البداية',
    endDate: 'تاريخ النهاية',
    branch: 'الفرع',
    noProjects: 'لا توجد مشاريع',
    
    // Branches
    mainBranch: 'المركز الرئيسي',
    tabukBranch: 'فرع تبوك',
    riyadhBranch: 'فرع الرياض',
    qassimBranch: 'فرع القصيم',
    madinahBranch: 'فرع المدينه المنورة',
    dammamBranch: 'فرع الدمام',
    abhaBranch: 'فرع ابها',
    qiddiyaBranch: 'فرع القدية',
    tamamaBranch: 'فرع التمامة',
    jeddahBranch: 'فرع جده',
    
    // Location Picker
    selectLocation: 'تحديد الموقع',
    currentLocation: 'موقعي الحالي',
    searchLocation: 'ابحث عن موقع...',
    selectedAddress: 'العنوان المحدد',
    confirmLocation: 'تأكيد الموقع',
    
    // Files
    technicalFiles: 'الملفات الفنية',
    uploadDwg: 'رفع ملف DWG',
    uploadKmz: 'رفع ملف KMZ',
    
    // Invoice
    invoice: 'فاتورة',
    invoiceNumber: 'رقم الفاتورة',
    date: 'التاريخ',
    printInvoice: 'طباعة الفاتورة',
    paymentInfo: 'معلومات الدفع',
    total: 'المجموع',
    
    // Developer
    developer: 'تطوير: تامر الجوهري'
  },
  en: {
    // General
    appTitle: 'SIM Card Management System',
    logout: 'Logout',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    loading: 'Loading...',
    
    // Dashboard
    totalSims: 'Total SIM Cards',
    monthlyCost: 'Monthly Cost',
    annualCost: 'Annual Cost',
    costAnalysis: 'Cost Analysis',
    
    // SIM Cards
    simNumber: 'SIM Number',
    serviceType: 'Service Type',
    provider: 'Provider',
    cost: 'Cost',
    location: 'Location',
    notes: 'Notes',
    addNewSim: 'Add New SIM',
    
    // Service Types
    data: 'Data',
    calls: 'Calls',
    mixed: 'Mixed',
    vsat: 'VSAT Internet',
    microwave: 'Microwave Internet',
    
    // Projects
    projects: 'Projects',
    addProject: 'Add Project',
    projectName: 'Project Name',
    projectDescription: 'Project Description',
    startDate: 'Start Date',
    endDate: 'End Date',
    branch: 'Branch',
    noProjects: 'No projects found',
    
    // Branches
    mainBranch: 'Main Branch',
    tabukBranch: 'Tabuk Branch',
    riyadhBranch: 'Riyadh Branch',
    qassimBranch: 'Qassim Branch',
    madinahBranch: 'Madinah Branch',
    dammamBranch: 'Dammam Branch',
    abhaBranch: 'Abha Branch',
    qiddiyaBranch: 'Qiddiya Branch',
    tamamaBranch: 'Tamama Branch',
    jeddahBranch: 'Jeddah Branch',
    
    // Location Picker
    selectLocation: 'Select Location',
    currentLocation: 'Current Location',
    searchLocation: 'Search location...',
    selectedAddress: 'Selected Address',
    confirmLocation: 'Confirm Location',
    
    // Files
    technicalFiles: 'Technical Files',
    uploadDwg: 'Upload DWG File',
    uploadKmz: 'Upload KMZ File',
    
    // Invoice
    invoice: 'Invoice',
    invoiceNumber: 'Invoice Number',
    date: 'Date',
    printInvoice: 'Print Invoice',
    paymentInfo: 'Payment Information',
    total: 'Total',
    
    // Developer
    developer: 'Developed by: Tamer El Gohary'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
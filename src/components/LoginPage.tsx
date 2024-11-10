import React, { useState } from 'react';
import { LogIn, Globe2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

interface Translations {
  [key: string]: {
    login: string;
    username: string;
    password: string;
    loginButton: string;
    errorMessage: string;
    systemTitle: string;
    enterUsername: string;
    enterPassword: string;
    developer: string;
  };
}

const translations: Translations = {
  ar: {
    login: 'تسجيل الدخول',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    loginButton: 'تسجيل الدخول',
    errorMessage: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    systemTitle: 'نظام إدارة شرائح الاتصال',
    enterUsername: 'أدخل اسم المستخدم',
    enterPassword: 'أدخل كلمة المرور',
    developer: 'تطوير: تامر الجوهري'
  },
  en: {
    login: 'Login',
    username: 'Username',
    password: 'Password',
    loginButton: 'Login',
    errorMessage: 'Invalid username or password',
    systemTitle: 'SIM Card Management System',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    developer: 'Developed by: Tamer El Gohary'
  }
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '123456') {
      onLogin();
    } else {
      setError(t.errorMessage);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-start to-background-end flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Language Toggle */}
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Globe2 className="w-5 h-5" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>

          {/* Logo and Title */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <img
                src="https://e.top4top.io/p_3231azaak1.png"
                alt="Company Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            </div>
            <h2 className="text-2xl font-bold text-primary-600">{t.login}</h2>
            <p className="text-gray-600 mt-2">{t.systemTitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.username}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder={t.enterUsername}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder={t.enterPassword}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-5 h-5" />
              {t.loginButton}
            </button>
          </form>
        </div>

        {/* Developer Credit */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          {t.developer}
        </div>
      </div>
    </div>
  );
}
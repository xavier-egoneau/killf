import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

const LanguageSwitcher = () => {
  const { locale, t, changeLocale } = useI18n(); // PAS getAvailableLocales ici
  const [isOpen, setIsOpen] = useState(false);
  
  // Langues disponibles en dur pour l'instant
  const availableLocales = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ];

  const handleLocaleChange = (newLocale) => {
    changeLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        title={t('language')}
      >
        <Globe size={16} className="mr-2" />
        <span className="hidden sm:inline">{t('language')}</span>
        <span className="sm:hidden">{locale.toUpperCase()}</span>
        <svg 
          className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le menu */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu déroulant */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            <div className="py-1">
              {availableLocales.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => handleLocaleChange(loc.code)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    locale === loc.code
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{loc.name}</span>
                    {locale === loc.code && (
                      <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
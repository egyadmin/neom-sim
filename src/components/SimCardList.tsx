import React from 'react';
import { Trash2, Smartphone, MapPin, FileUp } from 'lucide-react';
import { SimCard } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SimCardListProps {
  simCards: SimCard[];
  onDelete: (id: number) => void;
}

export function SimCardList({ simCards, onDelete }: SimCardListProps) {
  const { language, t } = useLanguage();

  if (simCards.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">
          {language === 'ar' ? 'لم يتم إضافة أي شرائح بعد' : 'No SIM cards added yet'}
        </p>
      </div>
    );
  }

  const translateServiceType = (type: string) => {
    const translations: { [key: string]: string } = {
      'بيانات': 'Data',
      'مكالمات': 'Calls',
      'مختلط': 'Mixed',
      'انترنت فضائي (VSAT)': 'VSAT Internet',
      'انترنت Microwave': 'Microwave Internet'
    };
    return language === 'en' ? translations[type] || type : type;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">
          {language === 'ar' ? 'الشرائح المسجلة' : 'Registered SIM Cards'}
        </h2>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden divide-y divide-gray-100">
        {simCards.map((card) => (
          <div key={card.id} className="p-4 space-y-3 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{card.number}</p>
                <p className="text-sm text-gray-600">{card.provider}</p>
              </div>
              <button
                onClick={() => onDelete(card.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">{language === 'ar' ? 'نوع الخدمة' : 'Service Type'}</p>
                <p className="font-medium">{translateServiceType(card.serviceType)}</p>
              </div>
              <div>
                <p className="text-gray-600">{language === 'ar' ? 'التكلفة الشهرية' : 'Monthly Cost'}</p>
                <p className="font-medium">
                  {card.monthlyCost.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                </p>
              </div>
            </div>
            {card.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{card.location.address}</span>
              </div>
            )}
            {card.technicalFiles && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {card.technicalFiles.dwg && (
                  <div className="flex items-center gap-1">
                    <FileUp className="w-4 h-4 text-blue-600" />
                    <span>DWG</span>
                  </div>
                )}
                {card.technicalFiles.kmz && (
                  <div className="flex items-center gap-1">
                    <FileUp className="w-4 h-4 text-blue-600" />
                    <span>KMZ</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden sm:block">
        <div className="max-w-[95%] mx-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-center whitespace-nowrap">
                  {language === 'ar' ? 'رقم الشريحة' : 'SIM Number'}
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-center whitespace-nowrap">
                  {language === 'ar' ? 'نوع الخدمة' : 'Service Type'}
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-center whitespace-nowrap">
                  {language === 'ar' ? 'مزود الخدمة' : 'Provider'}
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-center whitespace-nowrap">
                  {language === 'ar' ? 'التكلفة الشهرية' : 'Monthly Cost'}
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-center whitespace-nowrap">
                  {language === 'ar' ? 'التكلفة السنوية' : 'Annual Cost'}
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-center whitespace-nowrap">
                  {language === 'ar' ? 'الموقع' : 'Location'}
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-center whitespace-nowrap">
                  {language === 'ar' ? 'الملفات الفنية' : 'Technical Files'}
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-center whitespace-nowrap">
                  {language === 'ar' ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {simCards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-center whitespace-nowrap">{card.number}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {translateServiceType(card.serviceType)}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">{card.provider}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {card.monthlyCost.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {(card.monthlyCost * 12).toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {card.location ? (
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate max-w-[200px]" title={card.location.address}>
                          {card.location.address}
                        </span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {card.technicalFiles?.dwg && (
                        <span className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          <FileUp className="w-4 h-4" />
                          DWG
                        </span>
                      )}
                      {card.technicalFiles?.kmz && (
                        <span className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          <FileUp className="w-4 h-4" />
                          KMZ
                        </span>
                      )}
                      {!card.technicalFiles && '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => onDelete(card.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={language === 'ar' ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
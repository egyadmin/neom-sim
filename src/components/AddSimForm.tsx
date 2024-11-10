import React, { useState, useRef } from 'react';
import { PlusCircle, MapPin, Upload, FileUp, X } from 'lucide-react';
import { SimCard, Project } from '../types';
import { LocationPicker } from './LocationPicker';
import { useLanguage } from '../context/LanguageContext';

interface AddSimFormProps {
  onAdd: (card: SimCard) => void;
  projects: Project[];
}

export function AddSimForm({ onAdd, projects }: AddSimFormProps) {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    number: '',
    serviceType: language === 'ar' ? 'بيانات' : 'Data',
    monthlyCost: '',
    provider: 'STC',
    notes: '',
    projectId: '',
    location: null as { lat: number; lng: number; address: string; } | null,
    technicalFiles: {
      dwg: null as string | null,
      kmz: null as string | null
    }
  });

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const dwgInputRef = useRef<HTMLInputElement>(null);
  const kmzInputRef = useRef<HTMLInputElement>(null);

  const serviceTypes = {
    ar: ['بيانات', 'مكالمات', 'مختلط', 'انترنت فضائي (VSAT)', 'انترنت Microwave'],
    en: ['Data', 'Calls', 'Mixed', 'VSAT Internet', 'Microwave Internet']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: 0,
      monthlyCost: Number(formData.monthlyCost),
      projectId: formData.projectId ? Number(formData.projectId) : undefined,
      location: formData.location || undefined,
      technicalFiles: formData.technicalFiles.dwg || formData.technicalFiles.kmz ? {
        dwg: formData.technicalFiles.dwg || undefined,
        kmz: formData.technicalFiles.kmz || undefined
      } : undefined
    });
    setFormData({
      number: '',
      serviceType: language === 'ar' ? 'بيانات' : 'Data',
      monthlyCost: '',
      provider: 'STC',
      notes: '',
      projectId: '',
      location: null,
      technicalFiles: {
        dwg: null,
        kmz: null
      }
    });
  };

  const handleFileUpload = (type: 'dwg' | 'kmz') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        technicalFiles: {
          ...prev.technicalFiles,
          [type]: e.target?.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type: 'dwg' | 'kmz') => {
    setFormData(prev => ({
      ...prev,
      technicalFiles: {
        ...prev.technicalFiles,
        [type]: null
      }
    }));
  };

  const needsLocation = ['انترنت فضائي (VSAT)', 'انترنت Microwave', 'VSAT Internet', 'Microwave Internet'].includes(formData.serviceType);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {language === 'ar' ? 'إضافة شريحة جديدة' : 'Add New SIM Card'}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'رقم الشريحة' : 'SIM Number'}
          </label>
          <input
            type="text"
            required
            value={formData.number}
            onChange={e => setFormData({ ...formData, number: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={language === 'ar' ? '05xxxxxxxx' : '05xxxxxxxx'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'نوع الخدمة' : 'Service Type'}
          </label>
          <select
            value={formData.serviceType}
            onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {serviceTypes[language].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'مزود الخدمة' : 'Service Provider'}
          </label>
          <select
            value={formData.provider}
            onChange={e => setFormData({ ...formData, provider: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="STC">STC</option>
            <option value="Mobily">Mobily</option>
            <option value="Zain">Zain</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'التكلفة الشهرية' : 'Monthly Cost'}
          </label>
          <input
            type="number"
            required
            value={formData.monthlyCost}
            onChange={e => setFormData({ ...formData, monthlyCost: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {needsLocation && (
          <>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'الموقع' : 'Location'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.location?.address || ''}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder={language === 'ar' ? 'اختر الموقع من الخريطة' : 'Select location from map'}
                />
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  {language === 'ar' ? 'تحديد الموقع' : 'Select Location'}
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'الملفات الفنية' : 'Technical Files'}
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* DWG File Upload */}
                <div>
                  <input
                    type="file"
                    ref={dwgInputRef}
                    accept=".dwg"
                    onChange={handleFileUpload('dwg')}
                    className="hidden"
                  />
                  {formData.technicalFiles.dwg ? (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <FileUp className="w-5 h-5 text-blue-600" />
                      <span className="flex-1 text-sm truncate">
                        {language === 'ar' ? 'تم رفع ملف DWG' : 'DWG file uploaded'}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile('dwg')}
                        className="p-1 hover:bg-blue-100 rounded-full"
                      >
                        <X className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => dwgInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <span>{language === 'ar' ? 'رفع ملف DWG' : 'Upload DWG File'}</span>
                    </button>
                  )}
                </div>

                {/* KMZ File Upload */}
                <div>
                  <input
                    type="file"
                    ref={kmzInputRef}
                    accept=".kmz"
                    onChange={handleFileUpload('kmz')}
                    className="hidden"
                  />
                  {formData.technicalFiles.kmz ? (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <FileUp className="w-5 h-5 text-blue-600" />
                      <span className="flex-1 text-sm truncate">
                        {language === 'ar' ? 'تم رفع ملف KMZ' : 'KMZ file uploaded'}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile('kmz')}
                        className="p-1 hover:bg-blue-100 rounded-full"
                      >
                        <X className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => kmzInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <span>{language === 'ar' ? 'رفع ملف KMZ' : 'Upload KMZ File'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'المشروع' : 'Project'}
          </label>
          <select
            value={formData.projectId}
            onChange={e => setFormData({ ...formData, projectId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">
              {language === 'ar' ? 'اختر المشروع' : 'Select Project'}
            </option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ar' ? 'ملاحظات' : 'Notes'}
          </label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={language === 'ar' ? 'ملاحظات إضافية...' : 'Additional notes...'}
            rows={3}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <PlusCircle className="w-5 h-5" />
        {language === 'ar' ? 'إضافة شريحة' : 'Add SIM Card'}
      </button>

      {showLocationPicker && (
        <LocationPicker
          onSelect={(location) => {
            setFormData({ ...formData, location });
            setShowLocationPicker(false);
          }}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </form>
  );
}
import React, { useState } from 'react';
import { Building2, Calendar, Printer, Trash2, X, Plus, MapPin, Edit2, AlertTriangle } from 'lucide-react';
import { InvoiceModal } from './InvoiceModal';
import { LocationPicker } from './LocationPicker';
import { Project, SimCard } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProjectsListProps {
  projects: Project[];
  simCards: SimCard[];
  onClose: () => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onDeleteProject: (id: number) => void;
  onUpdateProject?: (id: number, project: Partial<Project>) => void;
}

export function ProjectsList({ 
  projects, 
  simCards, 
  onClose, 
  onAddProject, 
  onDeleteProject,
  onUpdateProject 
}: ProjectsListProps) {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedProjectForInvoice, setSelectedProjectForInvoice] = useState<number | null>(null);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [newProjectLocation, setNewProjectLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const { language, t } = useLanguage();
  
  const getProjectCost = (projectId: number) => {
    const projectSimCards = simCards.filter(sim => sim.projectId === projectId);
    const monthlyCost = projectSimCards.reduce((sum, sim) => sum + sim.monthlyCost, 0);
    const annualCost = monthlyCost * 12;
    return { monthlyCost, annualCost };
  };

  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const projectData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      branch: formData.get('branch') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string || undefined,
      location: newProjectLocation || undefined,
    };

    if (selectedProjectForEdit) {
      onUpdateProject?.(selectedProjectForEdit.id, projectData);
      setSelectedProjectForEdit(null);
    } else {
      onAddProject(projectData);
    }
    
    setShowAddProject(false);
    setNewProjectLocation(null);
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setNewProjectLocation(location);
    setShowLocationPicker(false);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProjectForEdit(project);
    setNewProjectLocation(project.location || null);
    setShowAddProject(true);
  };

  const handleDeleteConfirm = (projectId: number) => {
    const projectSimCards = simCards.filter(sim => sim.projectId === projectId);
    if (projectSimCards.length > 0) {
      alert(language === 'ar' 
        ? 'لا يمكن حذف المشروع لأنه يحتوي على شرائح مرتبطة به'
        : 'Cannot delete project because it has associated SIM cards');
      return;
    }
    setShowDeleteConfirm(projectId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {t('projects')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          {/* Add Project Button */}
          {!showAddProject && (
            <button
              onClick={() => {
                setSelectedProjectForEdit(null);
                setShowAddProject(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white p-4 rounded-xl hover:bg-primary-700 transition-colors mb-6"
            >
              <Plus className="w-6 h-6" />
              <span className="text-lg">{t('addProject')}</span>
            </button>
          )}

          {showAddProject ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedProjectForEdit ? t('editProject') : t('addProject')}
              </h3>
              <form onSubmit={handleAddProject}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {t('projectName')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      defaultValue={selectedProjectForEdit?.name}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                      {t('branch')}
                    </label>
                    <select
                      id="branch"
                      name="branch"
                      required
                      defaultValue={selectedProjectForEdit?.branch}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">{language === 'ar' ? 'اختر الفرع' : 'Select Branch'}</option>
                      <option value={t('mainBranch')}>{t('mainBranch')}</option>
                      <option value={t('tabukBranch')}>{t('tabukBranch')}</option>
                      <option value={t('riyadhBranch')}>{t('riyadhBranch')}</option>
                      <option value={t('qassimBranch')}>{t('qassimBranch')}</option>
                      <option value={t('madinahBranch')}>{t('madinahBranch')}</option>
                      <option value={t('dammamBranch')}>{t('dammamBranch')}</option>
                      <option value={t('abhaBranch')}>{t('abhaBranch')}</option>
                      <option value={t('qiddiyaBranch')}>{t('qiddiyaBranch')}</option>
                      <option value={t('tamamaBranch')}>{t('tamamaBranch')}</option>
                      <option value={t('jeddahBranch')}>{t('jeddahBranch')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('location')}
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={newProjectLocation?.address || ''}
                        readOnly
                        className="block w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50"
                        placeholder={language === 'ar' ? 'اختر الموقع من الخريطة' : 'Select location from map'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLocationPicker(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <MapPin className="w-5 h-5" />
                        {language === 'ar' ? 'تحديد الموقع' : 'Select Location'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      {t('projectDescription')}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      defaultValue={selectedProjectForEdit?.description}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        {t('startDate')}
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        required
                        defaultValue={selectedProjectForEdit?.startDate}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        {t('endDate')}
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        defaultValue={selectedProjectForEdit?.endDate}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddProject(false);
                        setNewProjectLocation(null);
                        setSelectedProjectForEdit(null);
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      {selectedProjectForEdit ? t('save') : t('add')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('noProjects')}</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {projects.map(project => {
                const costs = getProjectCost(project.id);
                return (
                  <div key={project.id} className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Building2 className="w-4 h-4" />
                          <span>{project.branch}</span>
                        </div>
                        {project.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{project.location.address}</span>
                          </div>
                        )}
                        {project.description && (
                          <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProjectForInvoice(project.id)}
                          className="flex items-center gap-2 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                          <span>{t('printInvoice')}</span>
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={t('edit')}
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(project.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">{t('monthlyCost')}</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {costs.monthlyCost.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">{t('annualCost')}</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {costs.annualCost.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ar' 
                    ? 'هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.'
                    : 'Are you sure you want to delete this project? This action cannot be undone.'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  onDeleteProject(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLocationPicker && (
        <LocationPicker
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationPicker(false)}
        />
      )}

      {selectedProjectForInvoice && (
        <InvoiceModal
          project={projects.find(p => p.id === selectedProjectForInvoice)!}
          simCards={simCards.filter(sim => sim.projectId === selectedProjectForInvoice)}
          onClose={() => setSelectedProjectForInvoice(null)}
        />
      )}
    </div>
  );
}
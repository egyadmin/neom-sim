import React, { useState } from 'react';
import { Menu, PlusCircle, Smartphone, Signal, DollarSign, Calendar, LogOut, FolderKanban, Globe2, Building2, MapPin } from 'lucide-react';
import { SimCard } from './types';
import { CostChart } from './components/CostChart';
import { SimCardList } from './components/SimCardList';
import { AddSimForm } from './components/AddSimForm';
import { LoginPage } from './components/LoginPage';
import { ProjectsButton } from './components/ProjectsButton';
import { ProjectsList } from './components/ProjectsList';
import { useDatabase } from './hooks/useDatabase';
import { useProjects } from './hooks/useProjects';
import { useLanguage } from './context/LanguageContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  const {
    simCards,
    loading: loadingSimCards,
    error: simCardsError,
    addSimCard,
    deleteSimCard
  } = useDatabase();

  const {
    projects,
    loading: loadingProjects,
    error: projectsError,
    addProject,
    deleteProject
  } = useProjects();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (loadingSimCards || loadingProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const totalMonthlyCost = simCards.reduce((sum, card) => sum + card.monthlyCost, 0);
  const totalAnnualCost = totalMonthlyCost * 12;

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-background-start to-background-end">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://e.top4top.io/p_3231azaak1.png"
                alt="Company Logo"
                className="h-8 w-auto sm:h-10"
              />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">{t('appTitle')}</h1>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe2 className="w-5 h-5" />
                {language === 'ar' ? 'English' : 'العربية'}
              </button>
              <ProjectsButton onClick={() => setShowProjects(true)} />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="sm:hidden mt-4 space-y-2 border-t pt-4">
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe2 className="w-5 h-5" />
                {language === 'ar' ? 'English' : 'العربية'}
              </button>
              <button
                onClick={() => {
                  setShowProjects(true);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FolderKanban className="w-5 h-5" />
                <span>{t('projects')}</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('logout')}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">{t('totalSims')}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{simCards.length}</p>
              </div>
              <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">{t('projects')}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <FolderKanban className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">{t('monthlyCost')}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalMonthlyCost.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                </p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">{t('annualCost')}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalAnnualCost.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                </p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Projects Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">{t('projects')}</h2>
            <button
              onClick={() => setShowProjects(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t('addProject')}</span>
            </button>
          </div>
          
          <div className="p-6">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <FolderKanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('noProjects')}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map(project => {
                  const projectSimCards = simCards.filter(sim => sim.projectId === project.id);
                  const projectMonthlyCost = projectSimCards.reduce((sum, sim) => sum + sim.monthlyCost, 0);
                  
                  return (
                    <div key={project.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <h3 className="font-semibold text-gray-800 mb-2">{project.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Building2 className="w-4 h-4" />
                        <span>{project.branch}</span>
                      </div>
                      {project.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{project.location.address}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          {projectSimCards.length} {t('totalSims')}
                        </div>
                        <div className="font-medium text-gray-900">
                          {projectMonthlyCost.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SIM Cards List */}
          <div className="lg:col-span-2">
            <SimCardList simCards={simCards} onDelete={deleteSimCard} />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('costAnalysis')}</h2>
              <CostChart simCards={simCards} />
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <AddSimForm onAdd={addSimCard} projects={projects} />
            </div>
          </div>
        </div>
      </main>

      {/* Projects Modal */}
      {showProjects && (
        <ProjectsList
          projects={projects}
          simCards={simCards}
          onClose={() => setShowProjects(false)}
          onAddProject={addProject}
          onDeleteProject={deleteProject}
        />
      )}
    </div>
  );
}

export default App;
import React from 'react';
import { FolderKanban } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProjectsButtonProps {
  onClick: () => void;
}

export function ProjectsButton({ onClick }: ProjectsButtonProps) {
  const { t } = useLanguage();
  
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
    >
      <FolderKanban className="w-5 h-5" />
      <span>{t('projects')}</span>
    </button>
  );
}
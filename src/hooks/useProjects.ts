import { useState, useEffect } from 'react';
import { dbOperations, initDB } from '../db';
import { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
        await refreshProjects();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في قاعدة البيانات');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refreshProjects = async () => {
    try {
      const projectList = await dbOperations.projects.getAll();
      setProjects(projectList);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث المشاريع');
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      await dbOperations.projects.add({
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
      });
      await refreshProjects();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إضافة المشروع');
      return false;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await dbOperations.projects.delete(id);
      await refreshProjects();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في حذف المشروع');
      return false;
    }
  };

  return {
    projects,
    loading,
    error,
    addProject,
    deleteProject,
    refreshProjects,
  };
}
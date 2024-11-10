import { useState, useEffect } from 'react';
import { dbOperations, initDB } from '../db';

export interface SimCard {
  id?: number;
  number: string;
  serviceType: string;
  provider: string;
  monthlyCost: number;
  notes?: string;
  projectId?: number;
}

export function useDatabase() {
  const [simCards, setSimCards] = useState<SimCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
        await refreshData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في قاعدة البيانات');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refreshData = async () => {
    try {
      const cards = await dbOperations.simCards.getAll();
      const cardsWithCosts = await Promise.all(
        cards.map(async (card) => {
          const costs = await dbOperations.monthlyCosts.getBySimCard(card.id!);
          const currentDate = new Date();
          const currentCost = costs.find(
            cost => cost.month === currentDate.getMonth() + 1 && 
                   cost.year === currentDate.getFullYear()
          );
          
          return {
            ...card,
            monthlyCost: currentCost?.amount || 0,
          };
        })
      );
      setSimCards(cardsWithCosts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث البيانات');
    }
  };

  const addSimCard = async (card: Omit<SimCard, 'id'>) => {
    try {
      const simId = await dbOperations.simCards.add({
        number: card.number,
        serviceType: card.serviceType,
        provider: card.provider,
        notes: card.notes,
        projectId: card.projectId,
      });

      if (card.monthlyCost > 0) {
        const now = new Date();
        await dbOperations.monthlyCosts.add({
          simId,
          amount: card.monthlyCost,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        });
      }

      await refreshData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إضافة الشريحة');
      return false;
    }
  };

  const deleteSimCard = async (id: number) => {
    try {
      await dbOperations.simCards.delete(id);
      await refreshData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في حذف الشريحة');
      return false;
    }
  };

  return {
    simCards,
    loading,
    error,
    addSimCard,
    deleteSimCard,
    refreshData,
  };
}
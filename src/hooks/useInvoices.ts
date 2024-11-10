import { useState, useEffect } from 'react';
import { dbOperations, initDB } from '../db';

export interface Invoice {
  id?: number;
  projectId: number;
  invoiceNumber: string;
  date: Date;
  totalAmount: number;
  status: 'draft' | 'issued' | 'paid';
}

export function useInvoices(projectId?: number) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
        if (projectId) {
          await refreshInvoices(projectId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error initializing database');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [projectId]);

  const refreshInvoices = async (projectId: number) => {
    try {
      const invoiceList = await dbOperations.invoices.getByProject(projectId);
      setInvoices(invoiceList);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error refreshing invoices');
    }
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    try {
      await dbOperations.invoices.add(invoice);
      if (projectId) {
        await refreshInvoices(projectId);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding invoice');
      return false;
    }
  };

  const updateInvoice = async (id: number, data: Partial<Invoice>) => {
    try {
      await dbOperations.invoices.update(id, data);
      if (projectId) {
        await refreshInvoices(projectId);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating invoice');
      return false;
    }
  };

  const deleteInvoice = async (id: number) => {
    try {
      await dbOperations.invoices.delete(id);
      if (projectId) {
        await refreshInvoices(projectId);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting invoice');
      return false;
    }
  };

  return {
    invoices,
    loading,
    error,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    refreshInvoices,
  };
}
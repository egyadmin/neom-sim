import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SimCardDB extends DBSchema {
  sim_cards: {
    key: number;
    value: {
      id?: number;
      number: string;
      serviceType: string;
      provider: string;
      notes?: string;
      projectId?: number;
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-number': string };
  };
  monthly_costs: {
    key: number;
    value: {
      id?: number;
      simId: number;
      amount: number;
      month: number;
      year: number;
      createdAt: Date;
    };
    indexes: { 'by-sim-date': [number, number, number] };
  };
  projects: {
    key: number;
    value: {
      id?: number;
      name: string;
      description?: string;
      branch: string;
      startDate: Date;
      endDate?: Date;
      createdAt: Date;
      updatedAt: Date;
    };
  };
  invoices: {
    key: number;
    value: {
      id?: number;
      projectId: number;
      invoiceNumber: string;
      date: Date;
      totalAmount: number;
      status: 'draft' | 'issued' | 'paid';
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-project': number };
  };
}

let db: IDBPDatabase<SimCardDB>;

export async function initDB() {
  db = await openDB<SimCardDB>('sim-management', 2, {
    upgrade(db, oldVersion, newVersion) {
      // Create sim_cards store if it doesn't exist
      if (!db.objectStoreNames.contains('sim_cards')) {
        const simCardsStore = db.createObjectStore('sim_cards', {
          keyPath: 'id',
          autoIncrement: true,
        });
        simCardsStore.createIndex('by-number', 'number', { unique: true });
      }

      // Create monthly_costs store if it doesn't exist
      if (!db.objectStoreNames.contains('monthly_costs')) {
        const monthlyCostsStore = db.createObjectStore('monthly_costs', {
          keyPath: 'id',
          autoIncrement: true,
        });
        monthlyCostsStore.createIndex('by-sim-date', ['simId', 'month', 'year']);
      }

      // Create projects store if it doesn't exist
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }

      // Create invoices store if it doesn't exist
      if (!db.objectStoreNames.contains('invoices')) {
        const invoicesStore = db.createObjectStore('invoices', {
          keyPath: 'id',
          autoIncrement: true,
        });
        invoicesStore.createIndex('by-project', 'projectId');
      }
    },
  });
  return db;
}

export async function getDB() {
  if (!db) {
    await initDB();
  }
  return db;
}

export const dbOperations = {
  simCards: {
    async add(data: Omit<SimCardDB['sim_cards']['value'], 'id' | 'createdAt' | 'updatedAt'>) {
      const db = await getDB();
      return db.add('sim_cards', {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },

    async update(id: number, data: Partial<SimCardDB['sim_cards']['value']>) {
      const db = await getDB();
      const simCard = await db.get('sim_cards', id);
      if (!simCard) throw new Error('SIM card not found');
      
      return db.put('sim_cards', {
        ...simCard,
        ...data,
        updatedAt: new Date(),
      });
    },

    async delete(id: number) {
      const db = await getDB();
      await db.delete('sim_cards', id);
    },

    async getAll() {
      const db = await getDB();
      return db.getAll('sim_cards');
    },

    async getByProject(projectId: number) {
      const db = await getDB();
      const allCards = await db.getAll('sim_cards');
      return allCards.filter(card => card.projectId === projectId);
    }
  },

  monthlyCosts: {
    async add(data: Omit<SimCardDB['monthly_costs']['value'], 'id' | 'createdAt'>) {
      const db = await getDB();
      return db.add('monthly_costs', {
        ...data,
        createdAt: new Date(),
      });
    },

    async getBySimCard(simId: number) {
      const db = await getDB();
      const index = db.transaction('monthly_costs').store.index('by-sim-date');
      return index.getAll(IDBKeyRange.bound(
        [simId, 0, 0],
        [simId, 99, 9999]
      ));
    },
  },

  projects: {
    async add(data: Omit<SimCardDB['projects']['value'], 'id' | 'createdAt' | 'updatedAt'>) {
      const db = await getDB();
      return db.add('projects', {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },

    async getAll() {
      const db = await getDB();
      return db.getAll('projects');
    },

    async get(id: number) {
      const db = await getDB();
      return db.get('projects', id);
    },

    async delete(id: number) {
      const db = await getDB();
      await db.delete('projects', id);
      
      // Delete associated invoices
      const invoices = await db.getAllFromIndex('invoices', 'by-project', id);
      for (const invoice of invoices) {
        await db.delete('invoices', invoice.id!);
      }
    },
  },

  invoices: {
    async add(data: Omit<SimCardDB['invoices']['value'], 'id' | 'createdAt' | 'updatedAt'>) {
      const db = await getDB();
      return db.add('invoices', {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },

    async getByProject(projectId: number) {
      const db = await getDB();
      return db.getAllFromIndex('invoices', 'by-project', projectId);
    },

    async update(id: number, data: Partial<SimCardDB['invoices']['value']>) {
      const db = await getDB();
      const invoice = await db.get('invoices', id);
      if (!invoice) throw new Error('Invoice not found');

      return db.put('invoices', {
        ...invoice,
        ...data,
        updatedAt: new Date(),
      });
    },

    async delete(id: number) {
      const db = await getDB();
      await db.delete('invoices', id);
    },
  },
};
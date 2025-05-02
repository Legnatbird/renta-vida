import { create } from 'zustand';
import { Finance } from '@/types/finances';

interface FinanceStore {
  finances: Finance[];
  addFinance: (finance: Finance) => void;
  updateFinance: (id: string, updatedFinance: Partial<Finance>) => void;
  removeFinance: (id: string) => void;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  finances: [
    {
      id: '1',
      title: 'Bank Statement - May 2025',
      description: 'Monthly statement from National Bank',
      category: 'bank',
      date: new Date('2025-05-15').toISOString(),
      fileName: 'may_2025_statement.pdf',
    },
    {
      id: '2',
      title: 'Investment Portfolio',
      description: 'Current investment holdings and performance',
      category: 'investment',
      date: new Date('2025-05-10').toISOString(),
      fileName: 'investment_portfolio_q2.pdf',
    },
    {
      id: '3',
      title: 'Monthly Budget',
      description: 'Personal budget for June 2025',
      category: 'expense',
      date: new Date('2025-06-01').toISOString(),
      fileName: 'june_2025_budget.xlsx',
    },
  ],
  addFinance: (finance) => set((state) => ({ finances: [...state.finances, finance] })),
  updateFinance: (id, updatedFinance) => set((state) => ({
    finances: state.finances.map((finance) => finance.id === id ? { ...finance, ...updatedFinance } : finance),
  })),
  removeFinance: (id) => set((state) => ({
    finances: state.finances.filter((finance) => finance.id !== id),
  })),
}));
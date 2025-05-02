export type FinanceCategory = 'bank' | 'investment' | 'expense' | 'document';

export interface Finance {
  id: string;
  title: string;
  description: string;
  category: FinanceCategory;
  date: string; // ISO date string
  fileName: string;
}
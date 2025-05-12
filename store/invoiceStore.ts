import { create } from 'zustand';

export interface Invoice {
  id: string;
  issuer: string;
  logo?: string;
  amount: number;
  date: Date;
  category: string;
  status: 'processed' | 'pending' | 'analyzed';
}

interface InvoiceStore {
  invoices: Invoice[];
  getInvoicesByEmail: (email: string) => Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updatedInvoice: Partial<Invoice>) => void;
  removeInvoice: (id: string) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  // Sample invoice data - in a real app, this would be filtered by email address
  invoices: [
    {
      id: '1',
      issuer: 'Netflix',
      logo: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/netflix_logo_icon_170919.png',
      amount: 14.99,
      date: new Date(2023, 7, 15),
      category: 'subscriptions',
      status: 'analyzed'
    },
    {
      id: '2',
      issuer: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
      amount: 59.95,
      date: new Date(2023, 7, 12),
      category: 'shopping',
      status: 'analyzed'
    },
    {
      id: '3',
      issuer: 'Uber',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Uber_App_Icon.svg/2048px-Uber_App_Icon.svg.png',
      amount: 23.50,
      date: new Date(2023, 7, 10),
      category: 'transport',
      status: 'analyzed'
    },
    {
      id: '4',
      issuer: 'Water & Electric Company',
      amount: 120.75,
      date: new Date(2023, 7, 5),
      category: 'utilities',
      status: 'analyzed'
    },
    {
      id: '5',
      issuer: 'Spotify',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png',
      amount: 9.99,
      date: new Date(2023, 7, 3),
      category: 'subscriptions',
      status: 'analyzed'
    }
  ],
  
  // Get invoices for a specific email - in this mock, we return all invoices
  getInvoicesByEmail: (email) => get().invoices,
  
  // Add a new invoice
  addInvoice: (invoice) => set((state) => ({ 
    invoices: [...state.invoices, invoice] 
  })),
  
  // Update an existing invoice
  updateInvoice: (id, updatedInvoice) => set((state) => ({
    invoices: state.invoices.map((invoice) => 
      invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
    ),
  })),
  
  // Remove an invoice
  removeInvoice: (id) => set((state) => ({
    invoices: state.invoices.filter((invoice) => invoice.id !== id),
  })),
}));

import { create } from 'zustand';

export interface LinkedEmail {
  id: number;
  email: string;
  isSync: boolean;
  lastSync: string;
}

interface EmailState {
  linkedEmails: LinkedEmail[];
  addEmail: (email: string) => void;
  removeEmail: (id: number) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  linkedEmails: [
    { id: 1, email: 'john.doe@gmail.com', isSync: true, lastSync: '10' }
  ],
  addEmail: (email: string) => 
    set((state) => ({
      linkedEmails: [
        ...state.linkedEmails, 
        { 
          id: state.linkedEmails.length + 1, 
          email, 
          isSync: true, 
          lastSync: '1' 
        }
      ]
    })),
  removeEmail: (id: number) => 
    set((state) => ({
      linkedEmails: state.linkedEmails.filter(email => email.id !== id)
    })),
}));

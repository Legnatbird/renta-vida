import { create } from 'zustand';
import { Message } from '@/types/chat';

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: '1',
      text: 'Hello! I\'m your financial assistant. How can I help you plan your financial future today?',
      sender: 'bot',
      timestamp: new Date('2025-06-05T09:00:00').toISOString(),
    },
  ],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));
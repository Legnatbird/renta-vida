import { create } from 'zustand';
import { Message } from '@/types/chat';

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  initializeMessages: (message: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [], // Start with empty messages
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  initializeMessages: (welcomeMessage: string) => set({
    messages: [
      {
        id: '1',
        text: welcomeMessage,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      },
    ]
  }),
}));
export type SenderType = 'user' | 'bot';

export interface Message {
  id: string;
  text: string;
  sender: SenderType;
  timestamp: string; // ISO date string
}

export interface ChatAction {
  type: 'ADD_GOAL' | 'UPDATE_GOAL' | 'REMOVE_GOAL';
  payload: any;
}
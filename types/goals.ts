export type Priority = 'high' | 'medium' | 'low';

export interface Goal {
  id: string;
  title: string;
  amount: number;
  targetDate: string; // ISO date string
  priority: Priority;
  progress: number; // percentage from 0-100
  description: string;
}
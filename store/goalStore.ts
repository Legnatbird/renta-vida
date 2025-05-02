import { create } from 'zustand';
import { Goal } from '@/types/goals';

interface GoalStore {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updatedGoal: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
}

export const useGoalStore = create<GoalStore>((set) => ({
  goals: [
    {
      id: '1',
      title: 'Buy a House',
      amount: 200000,
      targetDate: new Date('2030-06-15').toISOString(),
      priority: 'high',
      progress: 25,
      description: 'Save for a down payment on a house in the suburbs',
    },
    {
      id: '2',
      title: 'Child\'s Education',
      amount: 50000,
      targetDate: new Date('2028-01-10').toISOString(),
      priority: 'medium',
      progress: 40,
      description: 'University fund for my daughter',
    },
    {
      id: '3',
      title: 'Retirement',
      amount: 500000,
      targetDate: new Date('2045-12-31').toISOString(),
      priority: 'high',
      progress: 15,
      description: 'Building retirement nest egg',
    },
    {
      id: '4',
      title: 'Travel to Europe',
      amount: 10000,
      targetDate: new Date('2026-07-20').toISOString(),
      priority: 'low',
      progress: 60,
      description: 'Dream vacation touring Europe',
    },
  ],
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (id, updatedGoal) => set((state) => ({
    goals: state.goals.map((goal) => goal.id === id ? { ...goal, ...updatedGoal } : goal),
  })),
  removeGoal: (id) => set((state) => ({
    goals: state.goals.filter((goal) => goal.id !== id),
  })),
}));
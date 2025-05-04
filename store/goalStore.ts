import { create } from 'zustand';
import { Goal, RentalPlan } from '@/types/goals';

interface GoalStore {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updatedGoal: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  selectPlan: (goalId: string, planId: string) => void;
  makePayment: (goalId: string, amount: number) => void;
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
      status: 'configuration',
      plans: [
        {
          id: 'plan-1-a',
          name: 'Plan A: High Contribution',
          monthlyRent: 1500,
          rentPeriod: 5,
          monthlyContribution: 3000,
          achievementDate: new Date('2028-01-15').toISOString(),
          strengths: [
            'Meets the goal earlier than the target date',
            'Higher returns on investment'
          ],
          weaknesses: [
            'High monthly payment may strain finances',
            'Less flexibility for other expenses'
          ]
        },
        {
          id: 'plan-1-b',
          name: 'Plan B: Balanced Approach',
          monthlyRent: 1200,
          rentPeriod: 5,
          monthlyContribution: 2500,
          achievementDate: new Date('2029-03-15').toISOString(),
          strengths: [
            'More affordable monthly payments',
            'Compatible with current cash flow'
          ],
          weaknesses: [
            'Takes longer to achieve the goal',
            'Slightly lower total returns'
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Child\'s Education',
      amount: 50000,
      targetDate: new Date('2028-01-10').toISOString(),
      priority: 'medium',
      progress: 40,
      description: 'University fund for my daughter',
      status: 'in_progress',
      plans: [
        {
          id: 'plan-2-a',
          name: 'Plan A: Fast Track',
          monthlyRent: 1200,
          rentPeriod: 4,
          monthlyContribution: 2800,
          achievementDate: new Date('2026-08-10').toISOString(),
          strengths: ['Completes goal ahead of schedule', 'Higher overall returns'],
          weaknesses: ['Higher monthly financial commitment']
        },
        {
          id: 'plan-2-b',
          name: 'Plan B: Steady Pace',
          monthlyRent: 950,
          rentPeriod: 4,
          monthlyContribution: 2200,
          achievementDate: new Date('2027-05-10').toISOString(),
          strengths: ['More manageable monthly payments', 'Good balance of time and contribution'],
          weaknesses: ['Slightly delayed completion compared to Plan A']
        }
      ],
      selectedPlan: 'plan-2-a',
      pendingPayment: 2000,
      nextPaymentDate: new Date('2025-07-01').toISOString()
    },
    {
      id: '3',
      title: 'Retirement',
      amount: 500000,
      targetDate: new Date('2045-12-31').toISOString(),
      priority: 'high',
      progress: 15,
      description: 'Building retirement nest egg',
      status: 'configuration',
      plans: [
        {
          id: 'plan-3-a',
          name: 'Plan A: Aggressive Growth',
          monthlyRent: 3000,
          rentPeriod: 20,
          monthlyContribution: 5000,
          achievementDate: new Date('2042-06-30').toISOString(),
          strengths: ['Earlier retirement possible', 'Higher compound growth'],
          weaknesses: ['Requires significant monthly investment', 'Less flexibility for other financial goals']
        },
        {
          id: 'plan-3-b',
          name: 'Plan B: Conservative Growth',
          monthlyRent: 2400,
          rentPeriod: 20,
          monthlyContribution: 4000,
          achievementDate: new Date('2044-09-30').toISOString(),
          strengths: ['More affordable monthly contribution', 'Still achieves goal before target date'],
          weaknesses: ['Less total accumulation', 'May need to work longer before retirement']
        }
      ]
    },
    {
      id: '4',
      title: 'Travel to Europe',
      amount: 10000,
      targetDate: new Date('2026-07-20').toISOString(),
      priority: 'low',
      progress: 60,
      description: 'Dream vacation touring Europe',
      status: 'in_progress',
      plans: [
        {
          id: 'plan-4-a',
          name: 'Plan A: Rapid Saving',
          monthlyRent: 500,
          rentPeriod: 1,
          monthlyContribution: 800,
          achievementDate: new Date('2025-12-20').toISOString(),
          strengths: ['Quick achievement of travel goal', 'Can plan trip earlier'],
          weaknesses: ['Higher monthly commitment']
        },
        {
          id: 'plan-4-b',
          name: 'Plan B: Gradual Saving',
          monthlyRent: 350,
          rentPeriod: 1,
          monthlyContribution: 600,
          achievementDate: new Date('2026-05-20').toISOString(),
          strengths: ['Lower monthly payments', 'More flexibility with budget'],
          weaknesses: ['Slightly delayed trip planning']
        }
      ],
      selectedPlan: 'plan-4-a',
      pendingPayment: 800,
      nextPaymentDate: new Date('2025-07-01').toISOString()
    },
  ],
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (id, updatedGoal) => set((state) => ({
    goals: state.goals.map((goal) => goal.id === id ? { ...goal, ...updatedGoal } : goal),
  })),
  removeGoal: (id) => set((state) => ({
    goals: state.goals.filter((goal) => goal.id !== id),
  })),
  selectPlan: (goalId, planId) => set((state) => ({
    goals: state.goals.map((goal) => 
      goal.id === goalId 
        ? { 
            ...goal, 
            selectedPlan: planId, 
            status: 'in_progress',
            // Calculate next payment date as 1 month from now
            nextPaymentDate: new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ).toISOString(),
            // Set pending payment to the monthly contribution of the selected plan
            pendingPayment: goal.plans?.find(plan => plan.id === planId)?.monthlyContribution || 0
          } 
        : goal
    ),
  })),
  makePayment: (goalId, amount) => set((state) => ({
    goals: state.goals.map((goal) => {
      if (goal.id === goalId) {
        const pendingPayment = (goal.pendingPayment || 0) - amount;
        // Update progress based on payment
        const selectedPlan = goal.plans?.find(plan => plan.id === goal.selectedPlan);
        const totalContributions = selectedPlan ? selectedPlan.monthlyContribution * (selectedPlan.rentPeriod * 12) : goal.amount;
        const currentContributions = totalContributions - (pendingPayment > 0 ? pendingPayment : 0);
        const newProgress = Math.min(100, Math.round((currentContributions / totalContributions) * 100));
        
        return { 
          ...goal, 
          pendingPayment: pendingPayment > 0 ? pendingPayment : 0,
          progress: newProgress,
          // Set next payment date 1 month later if payment is complete
          nextPaymentDate: pendingPayment <= 0 ? 
            new Date(new Date(goal.nextPaymentDate || "").setMonth(new Date(goal.nextPaymentDate || "").getMonth() + 1)).toISOString() 
            : goal.nextPaymentDate,
          // Set status to completed if progress reaches 100%
          status: newProgress >= 100 ? 'completed' : 'in_progress'
        };
      }
      return goal;
    }),
  })),
}));
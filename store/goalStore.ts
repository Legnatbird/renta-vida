import { create } from 'zustand';
import { Goal, RentalPlan } from '@/types/goals';

interface GoalStore {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updatedGoal: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  selectPlan: (goalId: string, planId: string) => void;
  makePayment: (goalId: string, amount: number) => { goalCompleted: boolean };
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: [
    {
      id: '1',
      titleKey: 'goals.titles.buyHouse',
      amount: 200000,
      targetDate: new Date('2030-06-15').toISOString(),
      priority: 'high',
      progress: 25,
      descriptionKey: 'goals.descriptions.buyHouse',
      status: 'configuration',
      plans: [
        {
          id: 'plan-1-a',
          nameKey: 'goals.plans.highContribution',
          monthlyRent: 1500,
          rentPeriod: 5,
          monthlyContribution: 3000,
          achievementDate: new Date('2028-01-15').toISOString(),
          strengths: [
            'goals.strengths.betterTimeline',
            'goals.strengths.betterReturns'
          ],
          weaknesses: [
            'goals.weaknesses.strainFinances',
            'goals.weaknesses.lessForExpenses'
          ]
        },
        {
          id: 'plan-1-b',
          nameKey: 'goals.plans.balancedApproach',
          monthlyRent: 1200,
          rentPeriod: 5,
          monthlyContribution: 2500,
          achievementDate: new Date('2029-03-15').toISOString(),
          strengths: [
            'goals.strengths.affordableContribution',
            'goals.strengths.cashFlowFriendly'
          ],
          weaknesses: [
            'goals.weaknesses.longerToAchieve',
            'goals.weaknesses.lowerReturns'
          ]
        }
      ]
    },
    {
      id: '2',
      titleKey: 'goals.titles.education',
      amount: 50000,
      targetDate: new Date('2028-01-10').toISOString(),
      priority: 'medium',
      progress: 40,
      descriptionKey: 'goals.descriptions.education',
      status: 'in_progress',
      plans: [
        {
          id: 'plan-2-a',
          nameKey: 'goals.plans.fastTrack',
          monthlyRent: 1200,
          rentPeriod: 4,
          monthlyContribution: 2800,
          achievementDate: new Date('2026-08-10').toISOString(),
          strengths: [
            'goals.strengths.quickAchievement', 
            'goals.strengths.betterReturns'
          ],
          weaknesses: [
            'goals.weaknesses.higherCommitment'
          ]
        },
        {
          id: 'plan-2-b',
          nameKey: 'goals.plans.steadyPace',
          monthlyRent: 950,
          rentPeriod: 4,
          monthlyContribution: 2200,
          achievementDate: new Date('2027-05-10').toISOString(),
          strengths: [
            'goals.strengths.affordableContribution', 
            'goals.strengths.goodBalance'
          ],
          weaknesses: [
            'goals.weaknesses.delayedCompletion'
          ]
        }
      ],
      selectedPlan: 'plan-2-a',
      pendingPayment: 2000,
      nextPaymentDate: new Date('2025-07-01').toISOString()
    },
    {
      id: '3',
      titleKey: 'goals.titles.retirement',
      amount: 500000,
      targetDate: new Date('2045-12-31').toISOString(),
      priority: 'high',
      progress: 15,
      descriptionKey: 'goals.descriptions.retirement',
      status: 'configuration',
      plans: [
        {
          id: 'plan-3-a',
          nameKey: 'goals.plans.aggressiveGrowth',
          monthlyRent: 3000,
          rentPeriod: 20,
          monthlyContribution: 5000,
          achievementDate: new Date('2042-06-30').toISOString(),
          strengths: [
            'goals.strengths.earlierRetirement',
            'goals.strengths.higherGrowth'
          ],
          weaknesses: [
            'goals.weaknesses.highInvestment',
            'goals.weaknesses.lessFlexibility'
          ]
        },
        {
          id: 'plan-3-b',
          nameKey: 'goals.plans.conservativeGrowth',
          monthlyRent: 2400,
          rentPeriod: 20,
          monthlyContribution: 4000,
          achievementDate: new Date('2044-09-30').toISOString(),
          strengths: [
            'goals.strengths.affordableContribution', 
            'goals.strengths.achievesGoalEarly'
          ],
          weaknesses: [
            'goals.weaknesses.lessAccumulation',
            'goals.weaknesses.longerWorkPeriod'
          ]
        }
      ]
    },
    {
      id: '4',
      titleKey: 'goals.titles.travel',
      amount: 10000,
      targetDate: new Date('2026-07-20').toISOString(),
      priority: 'low',
      progress: 60,
      descriptionKey: 'goals.descriptions.travel',
      status: 'in_progress',
      plans: [
        {
          id: 'plan-4-a',
          nameKey: 'goals.plans.rapidSaving',
          monthlyRent: 500,
          rentPeriod: 1,
          monthlyContribution: 800,
          achievementDate: new Date('2025-12-20').toISOString(),
          strengths: [
            'goals.strengths.quickAchievement', 
            'goals.strengths.earlierPlanning'
          ],
          weaknesses: [
            'goals.weaknesses.higherCommitment'
          ]
        },
        {
          id: 'plan-4-b',
          nameKey: 'goals.plans.gradualSaving',
          monthlyRent: 350,
          rentPeriod: 1,
          monthlyContribution: 600,
          achievementDate: new Date('2026-05-20').toISOString(),
          strengths: [
            'goals.strengths.affordableContribution', 
            'goals.strengths.moreBudgetFlexibility'
          ],
          weaknesses: [
            'goals.weaknesses.delayedPlanning'
          ]
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
  makePayment: (goalId, amount) => {
    let goalCompleted = false;
    
    set((state) => {
      const updatedGoals = state.goals.map((goal) => {
        if (goal.id === goalId) {
          // Handle pending payment for the month
          const pendingPayment = Math.max(0, (goal.pendingPayment || 0) - amount);
          
          // Get the selected plan
          const selectedPlan = goal.plans?.find(plan => plan.id === goal.selectedPlan);
          
          // Calculate total amount needed for the goal
          const totalGoalAmount = goal.amount;
          
          // Calculate accumulated amount so far based on progress
          let accumulatedAmount = (goal.progress / 100) * totalGoalAmount;
          
          // Add the current payment to the accumulated amount
          accumulatedAmount += amount;
          
          // Calculate new progress as a percentage of total goal
          const newProgress = Math.min(100, Math.round((accumulatedAmount / totalGoalAmount) * 100));
          
          // Check if goal is now completed
          goalCompleted = newProgress >= 100;
          
          // Explicitly type the status as a valid GoalStatus
          const newStatus: 'completed' | 'in_progress' = goalCompleted ? 'completed' : 'in_progress';
          
          // Calculate new next payment date - always use a valid date (current date if no existing date)
          const nextPaymentDateObj = pendingPayment <= 0 
            ? new Date(goal.nextPaymentDate || new Date().toISOString())
            : new Date(goal.nextPaymentDate || new Date().toISOString());
            
          // Set next payment to one month later if monthly payment is complete
          if (pendingPayment <= 0) {
            nextPaymentDateObj.setMonth(nextPaymentDateObj.getMonth() + 1);
          }
          
          // If goal is completed, set pending payment to null instead of 0
          // This prevents UI from showing "0" for completed goals
          const finalPendingPayment = goalCompleted ? null : pendingPayment;
          
          return { 
            ...goal, 
            pendingPayment: finalPendingPayment,
            progress: newProgress,
            // Use the calculated next payment date
            nextPaymentDate: pendingPayment <= 0 ? nextPaymentDateObj.toISOString() : goal.nextPaymentDate,
            // Set status to completed if progress reaches 100%
            status: newStatus
          };
        }
        return goal;
      });
      
      // Return in format that Zustand expects
      return { goals: updatedGoals as Goal[] };
    });
    
    return { goalCompleted };
  },
}));
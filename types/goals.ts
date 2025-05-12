// Define proper types for our translation keys
export type GoalTitleKey = 
  | 'goals.titles.buyHouse'
  | 'goals.titles.education'
  | 'goals.titles.retirement'
  | 'goals.titles.travel';

export type GoalDescriptionKey =
  | 'goals.descriptions.buyHouse'
  | 'goals.descriptions.education'
  | 'goals.descriptions.retirement'
  | 'goals.descriptions.travel';

export type PlanNameKey =
  | 'goals.plans.highContribution'
  | 'goals.plans.balancedApproach'
  | 'goals.plans.fastTrack'
  | 'goals.plans.steadyPace'
  | 'goals.plans.aggressiveGrowth'
  | 'goals.plans.conservativeGrowth'
  | 'goals.plans.rapidSaving'
  | 'goals.plans.gradualSaving';

export type GoalPriority = 'high' | 'medium' | 'low';
export type GoalStatus = 'configuration' | 'in_progress' | 'completed';

export interface RentalPlan {
  id: string;
  nameKey: PlanNameKey; // Strongly typed key
  monthlyRent: number;
  rentPeriod: number; // in years
  monthlyContribution: number;
  achievementDate: string; // ISO date string
  strengths: string[];
  weaknesses: string[];
}

export interface Goal {
  id: string;
  titleKey: GoalTitleKey; // Strongly typed key
  amount: number;
  targetDate: string; // ISO date string
  priority: GoalPriority;
  progress: number; // percentage from 0-100
  descriptionKey: GoalDescriptionKey; // Strongly typed key
  status: GoalStatus;
  plans?: RentalPlan[];
  selectedPlan?: string; // ID of selected plan
  pendingPayment?: number | null;
  nextPaymentDate?: string; // ISO date string
}
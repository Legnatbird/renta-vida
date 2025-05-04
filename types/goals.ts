export type Priority = 'high' | 'medium' | 'low';
export type GoalStatus = 'configuration' | 'in_progress' | 'completed';

export interface RentalPlan {
  id: string;
  name: string;
  monthlyRent: number;
  rentPeriod: number; // in years
  monthlyContribution: number;
  achievementDate: string; // ISO date string
  strengths: string[];
  weaknesses: string[];
}

export interface Goal {
  id: string;
  title: string;
  amount: number;
  targetDate: string; // ISO date string
  priority: Priority;
  progress: number; // percentage from 0-100
  description: string;
  status: GoalStatus;
  plans?: RentalPlan[];
  selectedPlan?: string; // ID of selected plan
  pendingPayment?: number;
  nextPaymentDate?: string; // ISO date string
}
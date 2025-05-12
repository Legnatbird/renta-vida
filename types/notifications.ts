export type NotificationType = 
  | 'payment_due'
  | 'payment_completed'
  | 'goal_progress'
  | 'goal_achievement'
  | 'insurance_recommendation';

export type InsuranceType = 
  | 'education'
  | 'life'
  | 'personal_accident'
  | 'voluntary_pension'
  | 'life_annuity'
  | 'voluntary_rent';

export interface NotificationAction {
  labelKey: string;           // Translation key for the action button
  label: string;            // Text for the action button
  screen: string;             // Screen to navigate to
  params?: Record<string, any>; // Parameters to pass to the screen
}

export interface Notification {
  id: string;
  type: NotificationType;
  titleKey: string;           // Translation key for the title
  messageKey: string;         // Translation key for the message
  messageParams?: Record<string, any>; // Parameters for message interpolation
  date: string;               // ISO date string
  read: boolean;              // Whether the notification has been read
  
  // Optional fields based on notification type
  insuranceType?: InsuranceType;
  reason?: string;            // Translation key for recommendation reason
  paymentAmount?: number;
  paymentDueDate?: string;    // ISO date string
  goalId?: string;
  savingAmount?: number;

  // Action to take when notification is pressed
  action?: NotificationAction;
  
  // For backwards compatibility during transition
  title?: string;             // Legacy title field
  message?: string;           // Legacy message field
}

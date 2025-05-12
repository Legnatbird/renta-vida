import { create } from 'zustand';
import { Notification, InsuranceType } from '@/types/notifications';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  getInsuranceRecommendations: () => Notification[];
  getPaymentNotifications: () => Notification[];
  getGoalNotifications: () => Notification[];
}

// Datos iniciales para probar
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'insurance_recommendation',
    titleKey: 'notifications.insuranceTypes.education',
    messageKey: 'notifications.messages.educationInsurance',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
    read: false,
    insuranceType: 'education',
    reason: 'notifications.reasons.educationalGoals',
    action: {
      label: 'notifications.viewDetails',
      labelKey: 'notifications.viewDetails',
      screen: 'InsuranceDetails',
      params: { type: 'education' }
    }
  },
  {
    id: '2',
    type: 'payment_due',
    titleKey: 'notifications.titles.paymentDue',
    messageKey: 'notifications.messages.paymentDueHouse',
    messageParams: { days: 3, goalName: 'Comprar una Casa' },
    date: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 horas atrás
    read: false,
    paymentAmount: 350,
    paymentDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 días en el futuro
    goalId: '1',
    action: {
      label: 'notifications.makePayment',
      labelKey: 'notifications.makePayment',
      screen: 'Payment',
      params: { goalId: '1' }
    }
  },
  {
    id: '3',
    type: 'insurance_recommendation',
    titleKey: 'notifications.insuranceTypes.life',
    messageKey: 'notifications.messages.lifeInsurance',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 horas atrás
    read: true,
    insuranceType: 'life',
    reason: 'notifications.reasons.familyProfile',
    action: {
      label: 'notifications.viewDetails',
      labelKey: 'notifications.viewDetails',
      screen: 'InsuranceDetails',
      params: { type: 'life' }
    }
  },
  {
    id: '4',
    type: 'payment_completed',
    titleKey: 'notifications.titles.paymentConfirmed',
    messageKey: 'notifications.messages.paymentConfirmed',
    messageParams: { amount: 250, goalName: 'Fondo de Jubilación' },
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 día atrás
    read: true,
    paymentAmount: 250,
    goalId: '3',
    action: {
      label: 'notifications.viewReceipt',
      labelKey: 'notifications.viewReceipt',
      screen: 'PaymentReceipt',
      params: { paymentId: 'pay_123456' }
    }
  },
  {
    id: '5',
    type: 'insurance_recommendation',
    titleKey: 'notifications.insuranceTypes.life_annuity',
    messageKey: 'notifications.messages.lifeAnnuity',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 días atrás
    read: true,
    insuranceType: 'life_annuity',
    reason: 'notifications.reasons.retirementGoal',
    action: {
      label: 'notifications.viewDetails',
      labelKey: 'notifications.viewDetails',
      screen: 'InsuranceDetails',
      params: { type: 'life_annuity' }
    }
  },
  {
    id: '6',
    type: 'goal_progress',
    titleKey: 'notifications.titles.goalProgress',
    messageKey: 'notifications.messages.goalProgress',
    messageParams: { percentage: 50, goalName: 'Vacaciones en Europa' },
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 días atrás
    read: true,
    goalId: '2',
    action: {
      label: 'notifications.viewProgress',
      labelKey: 'notifications.viewProgress',
      screen: 'GoalDetails',
      params: { goalId: '2' }
    }
  },
  {
    id: '7',
    type: 'insurance_recommendation',
    titleKey: 'notifications.insuranceTypes.personal_accident',
    messageKey: 'notifications.messages.personalAccident',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 días atrás
    read: true,
    insuranceType: 'personal_accident',
    reason: 'notifications.reasons.riskProfile',
    action: {
      label: 'notifications.viewDetails',
      labelKey: 'notifications.viewDetails',
      screen: 'InsuranceDetails',
      params: { type: 'personal_accident' }
    }
  },
  {
    id: '8',
    type: 'insurance_recommendation',
    titleKey: 'notifications.insuranceTypes.voluntary_pension',
    messageKey: 'notifications.messages.voluntaryPension',
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 días atrás
    read: true,
    insuranceType: 'voluntary_pension',
    reason: 'notifications.reasons.taxOptimization',
    action: {
      label: 'notifications.viewDetails',
      labelKey: 'notifications.viewDetails',
      screen: 'InsuranceDetails',
      params: { type: 'voluntary_pension' }
    }
  },
  {
    id: '9',
    type: 'insurance_recommendation',
    titleKey: 'notifications.insuranceTypes.voluntary_rent',
    messageKey: 'notifications.messages.voluntaryRent',
    date: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), // 6 días atrás
    read: true,
    insuranceType: 'voluntary_rent',
    reason: 'notifications.reasons.savingsCapacity',
    action: {
      label: 'notifications.viewDetails',
      labelKey: 'notifications.viewDetails',
      screen: 'InsuranceDetails',
      params: { type: 'voluntary_rent' }
    }
  }
];

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter(n => !n.read).length,
  
  addNotification: (notification) => set(state => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + (notification.read ? 0 : 1)
  })),
  
  markAsRead: (id) => set(state => {
    const notifications = state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    
    return {
      notifications,
      unreadCount: notifications.filter(n => !n.read).length
    };
  }),
  
  markAllAsRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),
  
  removeNotification: (id) => set(state => {
    const notification = state.notifications.find(n => n.id === id);
    const unreadDelta = notification && !notification.read ? -1 : 0;
    
    return {
      notifications: state.notifications.filter(n => n.id !== id),
      unreadCount: state.unreadCount + unreadDelta
    };
  }),
  
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
  
  getInsuranceRecommendations: () => {
    return get().notifications.filter(n => n.type === 'insurance_recommendation');
  },
  
  getPaymentNotifications: () => {
    return get().notifications.filter(n => 
      n.type === 'payment_due' || n.type === 'payment_completed'
    );
  },
  
  getGoalNotifications: () => {
    return get().notifications.filter(n => 
      n.type === 'goal_progress' || n.type === 'goal_achievement'
    );
  }
}));

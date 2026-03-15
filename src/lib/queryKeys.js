// Centralized React Query keys for consistent caching
export const queryKeys = {
  bills: ['bills'],
  users: ['users'],
  dashboard: ['dashboard'],
  wallet: ['wallet'],
  hotels: ['hotels'],
  admin: {
    dashboardOverview: ['admin', 'dashboardOverview'],
    notifications: ['admin', 'notifications'],
    tickets: ['admin', 'tickets'],
    users: ['admin', 'users'],
    partners: ['admin', 'partners'],
    orders: ['admin', 'orders'],
    payments: ['admin', 'payments'],
    ratings: ['admin', 'ratings'],
    employees: ['admin', 'employees'],
    reports: ['admin', 'reports'],
    settings: ['admin', 'settings'],
  },
};

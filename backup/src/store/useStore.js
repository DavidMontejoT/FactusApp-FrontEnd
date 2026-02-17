import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      // UI State
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id: Date.now() }]
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        })),

      // Loading States
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),

      // Plan Limits
      planLimits: {
        FREE: { invoices: 15, products: 20, clients: 30 },
        BASIC: { invoices: 50, products: 100, clients: 200 },
        FULL: { invoices: Infinity, products: Infinity, clients: Infinity },
      },

      getPlanLimits: () => {
        const { user } = get();
        const plan = user?.plan || 'FREE';
        return get().planLimits[plan];
      },

      canCreateInvoice: () => {
        const { user } = get();
        if (!user) return false;
        const limits = get().getPlanLimits();
        return user.invoicesCount < limits.invoices;
      },
    }),
    {
      name: 'factusapp-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useStore;

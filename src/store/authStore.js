import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Auth state
      userId: null,
      email: null,
      isAuthenticated: false,
      isEmailVerified: false,
      
      // Actions
      setAuth: (userId, email, isEmailVerified) => set({
        userId,
        email,
        isAuthenticated: true,
        isEmailVerified
      }),
      
      clearAuth: () => set({
        userId: null,
        email: null,
        isAuthenticated: false,
        isEmailVerified: false
      }),
      
      setEmailVerified: (isVerified) => set({
        isEmailVerified: isVerified
      }),
      
      // Getters
      getUserId: () => get().userId,
      getEmail: () => get().email,
      getIsAuthenticated: () => get().isAuthenticated,
      getIsEmailVerified: () => get().isEmailVerified,
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({
        userId: state.userId,
        email: state.email,
        isAuthenticated: state.isAuthenticated,
        isEmailVerified: state.isEmailVerified,
      }),
    }
  )
);

export default useAuthStore; 
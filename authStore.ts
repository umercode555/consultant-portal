import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'consultant' | 'student'
  avatarUrl?: string
  phone?: string
  department?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        const res = await api.post('/auth/login', { email, password })
        const { token, user } = res.data
        localStorage.setItem('token', token)
        set({ user, token, isLoading: false })
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },

      setUser: (user: User) => set({ user })
    }),
    {
      name: 'consulthub-auth',
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
)

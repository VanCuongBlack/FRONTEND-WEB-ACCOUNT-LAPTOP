import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserData, UserRole } from '@/services/auth.service'

export type User = UserData

function readStoredUser() {
  try {
    const rawUser = localStorage.getItem('user')
    return rawUser ? (JSON.parse(rawUser) as User) : null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null

  setUser: (user: User | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearAuth: () => void
  logout: () => void

  isAuthenticated: () => boolean
  hasRole: (roles: UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: readStoredUser(),
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      isLoading: false,
      error: null,

      setUser: (user) => {
        set({ user })

        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
        } else {
          localStorage.removeItem('user')
        }
      },

      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        set({
          accessToken,
          refreshToken,
        })
      },

      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))

        set({
          user,
          accessToken,
          refreshToken,
          error: null,
        })
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearAuth: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        localStorage.removeItem('auth-storage')

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
        })
      },

      logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        localStorage.removeItem('auth-storage')

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
        })

        window.location.href = '/login'
      },

      isAuthenticated: () => {
        return Boolean(get().user && get().accessToken)
      },

      hasRole: (roles) => {
        const role = get().user?.role
        const roleName =
          typeof role === 'string'
            ? role
            : role && typeof role === 'object' && 'name' in role
              ? role.name
              : null

        return Boolean(typeof roleName === 'string' && roles.includes(roleName))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)

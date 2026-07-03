import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

function getRoleName(role: unknown) {
  if (typeof role === 'string') return role

  if (role && typeof role === 'object' && 'name' in role) {
    const roleName = (role as { name?: unknown }).name
    return typeof roleName === 'string' ? roleName : null
  }

  return null
}

function getRoleFromToken(token?: string | null) {
  if (!token) return null

  try {
    const payload = parseJwtPayload(token)
    return typeof payload.role === 'string' ? payload.role : null
  } catch {
    return null
  }
}

function parseJwtPayload(token: string) {
  const payload = token.split('.')[1]
  if (!payload) throw new Error('Invalid token')

  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return JSON.parse(atob(padded)) as { exp?: number; role?: unknown }
}

function isTokenValid(token?: string | null) {
  if (!token) return false

  try {
    const payload = parseJwtPayload(token)
    if (typeof payload.exp !== 'number') return false
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { user, accessToken, clearAuth } = useAuthStore()

  if (!user || !isTokenValid(accessToken)) {
    clearAuth()
    return <Navigate to="/login" replace />
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const role = getRoleName(user.role) ?? getRoleFromToken(accessToken)

    if (!role || !requiredRoles.includes(role)) {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute

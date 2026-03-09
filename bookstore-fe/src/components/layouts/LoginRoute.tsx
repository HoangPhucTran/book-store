import { Navigate } from 'react-router-dom'
import type { JSX } from 'react'
import { isAuthenticated } from '../../api/auth'

export default function LoginRoute({
  children,
}: {
  children: JSX.Element
}) {
  if (isAuthenticated()) {
    return <Navigate to="/users" replace />
  }

  return children
}

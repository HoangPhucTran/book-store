import { Navigate } from 'react-router-dom'
import {  type JSX } from 'react'
import { getToken, isAuthenticated } from '../../api/auth';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element
}) {
  console.log('Check auth' + isAuthenticated(), getToken());
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  return children
}

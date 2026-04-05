'use client'

import { useState } from 'react'
import { parseRoleFromJwt } from '../lib/jwt'

type Role = 'admin' | 'staff'

interface LoginProps {
  onLogin: (role: Role, token: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const form = new URLSearchParams()
      form.append('username', employeeId.trim())
      form.append('password', password)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.detail ?? 'Invalid credentials.')
        return
      }

      const { access_token } = await res.json()
      const role = parseRoleFromJwt(access_token)

      if (!role) {
        setError('Token is missing role. Contact your administrator.')
        return
      }

      localStorage.setItem('token', access_token)
      onLogin(role, access_token)
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10'>
      <div className='ui-card w-full max-w-md p-8'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-slate-900'>QCIMS Login</h1>
          <p className='ui-muted mt-2'>Sign in with your credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='mb-2 block text-sm font-semibold text-slate-900'>
              Employee ID
            </label>
            <input
              type='text'
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder='Enter your employee ID'
              className='ui-input px-4 py-3'
              required
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-semibold text-slate-900'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              className='ui-input px-4 py-3'
              required
            />
          </div>

          {error && (
            <p className='rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700'>
              {error}
            </p>
          )}

          <button
            type='submit'
            disabled={loading}
            className='ui-button-primary w-full px-4 py-3 font-semibold'
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

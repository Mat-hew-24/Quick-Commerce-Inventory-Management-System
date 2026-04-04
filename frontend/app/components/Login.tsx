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
    <div className='flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10'>
      <div className='w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-slate-900'>QCIMS Login</h1>
          <p className='mt-2 text-sm text-slate-600'>
            Sign in with your credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='block text-sm font-semibold text-slate-900 mb-2'>
              Employee ID
            </label>
            <input
              type='text'
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder='Enter your employee ID'
              className='w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-slate-900 mb-2'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              className='w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
            className='w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

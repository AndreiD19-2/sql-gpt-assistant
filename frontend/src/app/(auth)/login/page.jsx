'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
// import 'C:\Users\diroftei\OneDrive - ENDAVA\Documents\sql-assistant-gpt\frontend\src\app\globals.css ' 
import '@/app/globals.css'
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password
      })

      const token = res.data.access_token
      localStorage.setItem(
        'sql-assistant-auth',
        JSON.stringify({ user: { email }, token })
      )

      router.push('/classic')
    } catch (err) {
      setError('Email sau parolă incorectă.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-24 px-6 py-10 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold text-center text-sky-700 mb-8 flex items-center justify-center gap-2">
        <span role="img">🔐</span> Autentificare
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Parolă</label>
          <input
            type="password"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Se autentifică...' : 'Login'}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <p className="text-sm text-center mt-6">
        Nu ai cont?{' '}
        <a href="/register" className="text-sky-600 font-medium hover:underline">
          Creează cont
        </a>
      </p>
    </div>
  )
}

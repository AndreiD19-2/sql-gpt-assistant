'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import '@/app/globals.css'

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Parolele nu se potrivesc.')
      return
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        email,
        password,
        full_name: fullName
      })

      setSuccess('Cont creat cu succes! Redirecționare în curs...')
      setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
      setError('Eroare la înregistrare. Emailul poate fi deja folosit.')
    }
  }

  return (
    <div className="max-w-sm mx-auto py-20">
      <h1 className="text-2xl font-bold text-sky-700 mb-6">🆕 Creare cont nou</h1>

      <div className="mb-4">
        <label className="block text-sm mb-1">Email</label>
        <input
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Nume complet</label>
        <input
          className="w-full border p-2 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Parolă</label>
        <input
          type="password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Confirmare parolă</label>
        <input
          type="password"
          className="w-full border p-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handleRegister}
        disabled={!email || !password || !confirmPassword}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Creează cont
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">{success}</p>}

      <p className="text-sm mt-4">
        Ai deja cont? <a href="/login" className="text-sky-700 underline">Autentificare</a>
      </p>
    </div>
  )
}

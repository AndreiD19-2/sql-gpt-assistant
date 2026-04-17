'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const authData = localStorage.getItem('sql-assistant-auth')
    if (!authData) {
      router.push('/login')
      return
    }

    let token = ''
    try {
      token = JSON.parse(authData).token
    } catch (e) {
      console.error('Token invalid:', e)
      setError('Autentificare invalidă.')
      router.push('/login')
      return
    }

    if (!token) {
      setError('Token lipsă.')
      router.push('/login')
      return
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    fetch(`${API_URL}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setHistory(data)
      })
      .catch((err) => {
        console.error('Eroare fetch:', err)
        setError('Eroare la încărcarea istoricului.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="p-4 text-sm text-gray-500">Se încarcă istoricul...</p>
  if (error) return <p className="p-4 text-sm text-red-500">{error}</p>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-sky-700">📚 Istoric execuții SQL</h1>

      {history.length === 0 ? (
        <p className="text-sm text-gray-500">Niciun rezultat înregistrat.</p>
      ) : (
        history.map((item) => (
          <Link
            key={item.id}
            href={`/history/${item.id}`}
            className="block border rounded p-4 hover:bg-sky-50 transition"
          >
            <p className="font-medium text-gray-800 truncate">{item.question}</p>
            <p className="text-xs text-gray-400">{new Date(item.time).toLocaleString()}</p>
          </Link>
        ))
      )}
    </div>
  )
}

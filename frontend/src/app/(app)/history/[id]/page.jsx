'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function HistoryDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('sql-assistant-auth'))?.token

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setItem(data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-4 text-sm text-gray-500">Se încarcă detaliile...</p>
  if (!item || item.error) return <p className="text-red-500">Eroare: Istoric inexistent sau neautorizat.</p>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-sky-700">🧾 Detalii interogare</h1>
      <p><strong>Întrebare:</strong> {item.question}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Timp:</strong> {new Date(item.time).toLocaleString()}</p>

      <div>
        <h2 className="font-semibold mt-4">🧠 Răspuns GPT:</h2>
        <pre className="bg-gray-100 rounded p-3 whitespace-pre-wrap text-sm text-gray-800">{item.message}</pre>
      </div>

      <div>
        <h2 className="font-semibold mt-4">📜 SQL generat:</h2>
        <code className="block bg-slate-800 text-white p-3 rounded mt-1 text-sm">{item.sql}</code>
      </div>
    </div>
  )
}
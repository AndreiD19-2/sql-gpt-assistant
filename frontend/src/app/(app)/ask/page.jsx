'use client'
import React, { useState } from 'react'
import axios from 'axios'

export default function AskPage() {
  const [question, setQuestion] = useState('')
  const [sql, setSql] = useState('')
  const [data, setData] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    setLoading(true)
    setError('')
    setSql('')
    setData([])

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ask`, {
        question,
      })
      setSql(res.data.sql)
      setData(res.data.data || [])
      setError(res.data.error || '')
    } catch (err) {
      setError('Eroare la conectarea cu backendul.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">🔍 Întreabă baza de date</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Ex: Afișează angajații care lipsesc în iulie"
        />
        <button
          onClick={handleAsk}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Execută
        </button>
      </div>

      {loading && <p className="text-gray-500">Se încarcă...</p>}

      {sql && (
        <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap mb-4">
          <strong>SQL generat:</strong>
          {"\n" + sql}
        </pre>
      )}

      {error && <div className="text-red-600 mb-4">❌ {error}</div>}

      {data.length > 0 && (
        <table className="w-full border mt-4 text-sm">
          <thead>
            <tr>
              {Object.keys(data[0]).map((col) => (
                <th key={col} className="border px-2 py-1 bg-gray-100">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((cell, i) => (
                  <td key={i} className="border px-2 py-1">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

'use client'
import { useState } from 'react'
import axios from 'axios'

export default function InsertGptPage() {
  const [question, setQuestion] = useState('')
  const [sql, setSql] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInsert = async () => {
    setLoading(true)
    setSql('')
    setMessage('')
    setError('')

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/insert-from-gpt`, {
        question,
      })
      setSql(res.data.sql || '')
      setMessage(res.data.message || '')
      setError(res.data.error || '')
    } catch (err) {
      setError('Eroare la conectarea cu backendul.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">🧠 Inserare automată cu GPT</h1>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Ex: Inserează 5 utilizatori random în tabela users"
      />

      <button
        onClick={handleInsert}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Generează și inserează
      </button>

      {loading && <p className="text-gray-500 mt-4">Se generează și execută...</p>}

      {sql && (
        <pre className="bg-gray-100 p-3 mt-4 rounded text-sm whitespace-pre-wrap">
          <strong>SQL generat:</strong>
          {"\n" + sql}
        </pre>
      )}

      {message && <p className="text-green-700 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">❌ {error}</p>}
    </div>
  )
}

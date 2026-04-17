'use client'
import React, { useState } from 'react'
import axios from 'axios'

export default function DdlPage() {
  const [question, setQuestion] = useState('')
  const [sql, setSql] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [executing, setExecuting] = useState(false)

  const generateDDL = async () => {
    setExecuting(true)
    setError('')
    setResult('')
    setSql('')

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ddl`, {
        question,
      })
      setSql(res.data.sql)
      if (res.data.error) {
        setError(res.data.error)
      } else {
        setResult('✅ Comanda a fost executată cu succes.')
      }
    } catch (err) {
      setError('Eroare la conectarea cu backendul.')
    } finally {
      setExecuting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">🛠 Creează tabele cu GPT</h1>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Ex: Creează un tabel projects cu id, name, start_date, status"
      />
      <button
        onClick={generateDDL}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Generează și execută
      </button>

      {executing && <p className="text-gray-500 mt-4">Se generează...</p>}

      {sql && (
        <pre className="bg-gray-100 p-3 mt-4 text-sm whitespace-pre-wrap rounded">
          <strong>SQL generat:</strong>
          {"\n" + sql}
        </pre>
      )}

      {error && <p className="text-red-600 mt-4">❌ {error}</p>}
      {result && <p className="text-green-700 mt-4">{result}</p>}
    </div>
  )
}

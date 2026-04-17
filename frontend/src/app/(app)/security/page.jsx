// 📁 frontend/src/app/security/page.jsx

'use client'

import { useState } from 'react'
import axios from 'axios'
import CodeMirror from '@uiw/react-codemirror'
import { sql as sqlLang } from '@codemirror/lang-sql'

export default function SecurityPage() {
  const [question, setQuestion] = useState('')
  const [sql, setSql] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setSql('')
    setMessage('')
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/advanced`, {
        mode: 'security',
        question
      }, {
        headers: {
          'x-api-key': localStorage.getItem('OPENAI_API_KEY') || '',
          'x-conn-str': localStorage.getItem('SQLSERVER_CONN_STR') || ''
        }
      })
      setSql(res.data.sql || '')
      setMessage(res.data.message || '')
    } catch (err) {
      setMessage('Eroare la generarea comenzii.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-sky-700">🔐 Gestionare permisiuni SQL</h1>

      <div className="flex gap-4">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Ex: Acordă permisiune SELECT pe tabela employees lui user_x"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={!question || loading}
        >
          Generează
        </button>
      </div>

      {loading && <p className="text-gray-500">Se generează...</p>}

      {sql && (
        <div>
          <h2 className="font-semibold text-sm mb-2">🧾 SQL generat</h2>
          <CodeMirror
            value={sql}
            height="200px"
            extensions={[sqlLang()]}
            theme="light"
            editable={true}
          />
        </div>
      )}

      {message && (
        <div className="text-green-700 whitespace-pre-wrap bg-green-50 border-l-4 border-green-500 p-4">
          {message}
        </div>
      )}
    </div>
  )
}

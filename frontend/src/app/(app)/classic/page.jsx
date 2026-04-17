// 📁 frontend/src/app/classic/page.jsx

'use client'

import { useState } from 'react'
import axios from 'axios'
import CodeMirror from '@uiw/react-codemirror'
import { sql as sqlLang } from '@codemirror/lang-sql'

const CLASSIC_ENDPOINTS = {
  select: '/ask',
  insert: '/insert-smart',
  update: '/update-smart',
  delete: '/delete-smart',
  ddl: '/ddl'
}

export default function ClassicPage() {
  const [mode, setMode] = useState('select')
  const [question, setQuestion] = useState('')
  const [sql, setSql] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setSql('')
    setData(null)
    setError('')
    setMessage('')

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${CLASSIC_ENDPOINTS[mode]}`, {
        question
      }, {
        headers: {
          'x-api-key': localStorage.getItem('OPENAI_API_KEY') || '',
          'x-conn-str': localStorage.getItem('SQLSERVER_CONN_STR') || ''
        }
      })
      setSql(res.data.sql || '')
      if (res.data.data) setData(res.data.data)
      if (res.data.message) setMessage(res.data.message)
      if (res.data.error) setError(res.data.error)
    } catch (err) {
      setError('Eroare la comunicarea cu backendul.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-sky-700">🟦 Modul SQL Clasic</h1>

      <div className="flex gap-4">
        <select
          className="border p-2 rounded"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {Object.keys(CLASSIC_ENDPOINTS).map((m) => (
            <option key={m} value={m}>{m.toUpperCase()}</option>
          ))}
        </select>

        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Scrie o cerere SQL în limbaj natural..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={!question || loading}
        >
          Execută
        </button>
      </div>

      {loading && <p className="text-gray-500">Se execută...</p>}

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

      {error && <p className="text-red-600">❌ {error}</p>}

      {data?.rows?.length > 0 && (
        <div className="overflow-auto">
          <table className="w-full border text-sm mt-4">
            <thead>
              <tr>
                {data.columns.map((col, idx) => (
                  <th key={idx} className="bg-gray-100 border px-2 py-1">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((val, cIdx) => (
                    <td key={cIdx} className="border px-2 py-1">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 

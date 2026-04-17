// 📁 frontend/src/app/sql-gpt/page.jsx

'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import CodeMirror from '@uiw/react-codemirror'
import { sql as sqlLang } from '@codemirror/lang-sql'

const ENDPOINTS = {
  ddl: '/ddl', delete: '/delete-smart', dictionary: '/sql-dictionary',
  insert: '/insert-smart', natural: '/nlp', procedure: '/procedure',
  select: '/ask', trigger: '/trigger', update: '/update-smart', transaction: '/transaction'
}

export default function SqlGptPage() {
  const [mode, setMode] = useState('select')
  const [question, setQuestion] = useState('')
  const [sql, setSql] = useState('')
  const [data, setData] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isDangerous, setIsDangerous] = useState(false)
  const [history, setHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('sql-assistant-history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('sql-assistant-history', JSON.stringify(history))
  }, [history])

  const exportCSV = () => {
    if (!data?.rows?.length) return
    const header = data.columns.join(',')
    const rows = data.rows.map(row => row.join(',')).join('\n')
    const blob = new Blob([`${header}\n${rows}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'query_result.csv'
    link.click()
  }

  const handleExecute = async () => {
    setLoading(true)
    setSql('')
    setData(null)
    setError('')
    setMessage('')
    setIsDangerous(false)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS[mode]}`, { question })
      setSql(res.data.sql || '')
      if (res.data.dangerous) {
        setShowModal(true)
        setIsDangerous(true)
        return
      }
      if (res.data.data) setData(res.data.data)
      if (res.data.message) setMessage(res.data.message)
      if (res.data.error) setError(res.data.error)

      const entry = {
        question,
        sql: res.data.sql,
        message: res.data.message || '',
        time: new Date().toISOString(),
        isFavorite: false
      }
      setHistory(prev => [entry, ...prev.slice(0, 49)])
    } catch (err) {
      setError('Eroare la conectarea cu backendul.')
    } finally {
      setLoading(false)
    }
  }

  const handleForceExecute = async () => {
    setShowModal(false)
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/execute-sql`, { sql, force: true })
      setMessage(res.data.message || '')
      setError(res.data.error || '')
    } catch (err) {
      setError('Eroare la execuția forțată.')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (idx) => {
    const updated = [...history]
    updated[idx].isFavorite = !updated[idx].isFavorite
    setHistory(updated)
  }

  const filteredHistory = history.filter(h =>
    h.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.sql?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-screen-xl mx-auto p-6">
      <aside className="md:col-span-1 border-r pr-4">
        <h2 className="font-bold text-lg mb-2 flex items-center gap-2">📚 Istoric</h2>
        <input
          className="w-full mb-3 p-2 text-sm border rounded"
          placeholder="Caută în istoric..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="text-sm space-y-2 max-h-[600px] overflow-y-auto">
          {filteredHistory.map((h, idx) => (
            <li key={idx} className="border-b pb-2 cursor-pointer group">
              <div
                onClick={() => {
                  setQuestion(h.question)
                  setSql(h.sql)
                  setData(null)
                  setMessage(h.message || '')
                  setError('')
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-gray-700 truncate w-5/6">{h.question}</div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(idx); }}
                    className="text-yellow-500 hover:scale-105"
                  >
                    {h.isFavorite ? '⭐' : '☆'}
                  </button>
                </div>
                {h.message && <div className="text-xs text-gray-500 mt-1">{h.message.slice(0, 100)}...</div>}
                <div className="text-xs text-gray-400">{new Date(h.time).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <main className="md:col-span-3">
        <h1 className="text-2xl font-bold mb-4 text-sky-700">🧠 SQL GPT Assistant</h1>

        {sql && question && (
          <div className="mb-4">
            <button
              onClick={handleExecute}
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
            >
              Execută din nou această interogare
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="border p-2 rounded">
            {Object.keys(ENDPOINTS).map((key) => (
              <option key={key} value={key}>{key.toUpperCase()}</option>
            ))}
          </select>

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Scrie o cerere SQL în limbaj natural..."
            className="flex-1 border p-2 rounded"
          />

          <button
            onClick={handleExecute}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Execută
          </button>
        </div>

        {loading && <p className="text-gray-500">Se execută...</p>}

        {sql && (
          <div className="mb-4">
            <h2 className="font-semibold text-sm mb-1">🧾 SQL generat:</h2>
            <CodeMirror value={sql} height="200px" extensions={[sqlLang()]} theme="light" editable={true} />
          </div>
        )}

        {error && <p className="text-red-600 mb-2">❌ {error}</p>}
        {message && <p className="text-green-700 mb-2 whitespace-pre-line">{message}</p>}

        {data?.rows?.length > 0 && (
          <div className="overflow-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={exportCSV}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Exportă CSV
              </button>
            </div>
            <table className="w-full border text-sm">
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

        {!loading && !data?.rows?.length && sql && (
          <p className="text-gray-500 mt-4">Niciun rezultat de afișat.</p>
        )}

        {showModal && isDangerous && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-bold text-red-600 mb-2">⚠️ Atenție!</h2>
              <p className="mb-4">Query-ul generat este considerat periculos:</p>
              <CodeMirror value={sql} height="150px" extensions={[sqlLang()]} readOnly theme="light" />
              <div className="flex justify-end gap-4 mt-4">
                <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowModal(false)}>
                  Anulează
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={handleForceExecute}>
                  Execută oricum
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

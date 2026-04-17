// 📁 frontend/src/app/settings/page.jsx

'use client'

import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [connStr, setConnStr] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedApi = localStorage.getItem('OPENAI_API_KEY') || ''
    const savedConn = localStorage.getItem('SQLSERVER_CONN_STR') || ''
    setApiKey(savedApi)
    setConnStr(savedConn)
  }, [])

  const handleSave = () => {
    localStorage.setItem('OPENAI_API_KEY', apiKey)
    localStorage.setItem('SQLSERVER_CONN_STR', connStr)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-sky-700 mb-6">⚙️ Setări aplicație</h1>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">🔑 OPENAI_API_KEY</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-xxxxxxxxxxxx"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">🗄️ SQLSERVER_CONN_STR</label>
        <textarea
          className="w-full border p-2 rounded"
          value={connStr}
          onChange={(e) => setConnStr(e.target.value)}
          placeholder="DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=DB;UID=user;PWD=pass"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Salvează configurarea
      </button>

      {saved && (
        <p className="text-green-600 mt-4">✔️ Setările au fost salvate local.</p>
      )}
    </div>
  )
}

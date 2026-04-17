'use client'
import { useState } from 'react'
import axios from 'axios'

export default function ProjectsInsertPage() {
  const [form, setForm] = useState({
    name: '',
    start_date: '',
    end_date: '',
    status: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/table/projects/insert`, {
        values: form
      })
      setMessage(res.data.message)
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Eroare la inserare.')
      setMessage('')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">➕ Adaugă proiect</h1>

      <div className="space-y-4">
        <input name="name" onChange={handleChange} value={form.name} placeholder="Nume proiect" className="w-full border p-2 rounded" />
        <input name="start_date" type="date" onChange={handleChange} value={form.start_date} className="w-full border p-2 rounded" />
        <input name="end_date" type="date" onChange={handleChange} value={form.end_date} className="w-full border p-2 rounded" />
        <input name="status" onChange={handleChange} value={form.status} placeholder="Status (activ/inactiv)" className="w-full border p-2 rounded" />
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Salvează
        </button>
      </div>

      {message && <p className="text-green-700 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">❌ {error}</p>}
    </div>
  )
}

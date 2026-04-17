// 📁 frontend/src/context/SettingsContext.jsx

'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [apiKey, setApiKey] = useState('')
  const [connStr, setConnStr] = useState('')

  useEffect(() => {
    setApiKey(localStorage.getItem('OPENAI_API_KEY') || '')
    setConnStr(localStorage.getItem('SQLSERVER_CONN_STR') || '')
  }, [])

  const saveSettings = (newApi, newConn) => {
    setApiKey(newApi)
    setConnStr(newConn)
    localStorage.setItem('OPENAI_API_KEY', newApi)
    localStorage.setItem('SQLSERVER_CONN_STR', newConn)
  }

  return (
    <SettingsContext.Provider value={{ apiKey, connStr, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)

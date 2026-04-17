'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true) // 🧠 cheie!

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sql-assistant-auth')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setUser(parsed.user)
          setToken(parsed.token)
        } catch {
          localStorage.removeItem('sql-assistant-auth') // fallback
        }
      }
      setLoading(false) // 🧠 doar după ce am încercat să încărcăm userul
    }
  }, [])

  const login = (userData, tokenValue) => {
    setUser(userData)
    setToken(tokenValue)
    localStorage.setItem(
      'sql-assistant-auth',
      JSON.stringify({ user: userData, token: tokenValue })
    )
  }

  const logout = () => {
    setUser(null)
    setToken('')
    localStorage.removeItem('sql-assistant-auth')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

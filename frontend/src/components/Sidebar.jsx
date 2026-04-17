// 📁 frontend/src/components/Sidebar.jsx

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'

const navItems = [
  { label: '🏠 Home', href: '/' },
  { label: '🟦 Clasice', href: '/classic' },
  { label: '🧠 Avansat GPT', href: '/advanced' },
  { label: '📚 Istoric', href: '/history' },
  { label: '🔐 Securitate', href: '/security' },
  { label: '⏳ Joburi SQL', href: '/jobs' },
  { label: '⚙️ Setări', href: '/settings' }
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  // Redirecționează la login dacă nu e logat
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-gray-100 border-r h-screen p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold text-sky-700">SQL Assistant GPT</h1>
        {user && <p className="text-sm text-gray-600 mt-1">👤 {user.email}</p>}

        <nav className="flex flex-col gap-2 mt-6">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`p-2 rounded hover:bg-sky-100 transition ${
                pathname === href ? 'bg-sky-200 font-semibold' : ''
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-600 hover:underline"
          >
            🔓 Logout
          </button>
        ) : (
          <Link href="/login" className="text-blue-600 text-sm hover:underline">
            🔐 Autentificare
          </Link>
        )}
      </div>
    </aside>
  )
}

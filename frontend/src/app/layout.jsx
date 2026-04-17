// import './globals.css'
// import Sidebar from '@/components/Sidebar'
// // import { SettingsProvider } from '@/context/SettingsContext'

// export const metadata = {
//   title: 'SQL GPT Assistant',
//   description: 'Asistent AI pentru SQL și DDL',
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="flex min-h-screen">
//         <Sidebar />
//         <main className="flex-1 p-6 bg-white overflow-y-auto">
//           {children}
//         </main>
//       </body>
//     </html>
//   )
// }
// 📁 frontend/src/app/layout.jsx

import './globals.css'
import Sidebar from '../components/Sidebar'
import { SettingsProvider } from '../context/SettingsContext'
import { AuthProvider } from '../context/AuthContext' // ✅

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <AuthProvider> {/* ✅ Adăugat aici */}
          <SettingsProvider>
            <Sidebar />
            <main className="flex-1 p-6 bg-white overflow-y-auto">
              {children}
            </main>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Login - SQL Assistant GPT',
  description: 'Autentificare utilizator',
}

export default function AuthLayout({ children }) {
  return (
    <html lang="ro">
      <body className="bg-white min-h-screen flex items-center justify-center">
        {children}
      </body>
    </html>
  )
}

// frontend/src/app/page.jsx

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold text-sky-700 mb-4">🧠 SQL Assistant GPT</h1>
      <p className="text-lg text-gray-700 mb-8">
        Explorează funcționalitățile aplicației tale conversaționale pentru baze de date:
      </p>
      <ul className="text-left text-gray-800 space-y-3 max-w-xl mx-auto">
        <li>🟦 <strong>Clasice</strong>: SELECT, INSERT, DELETE, UPDATE, DDL</li>
        <li>🧠 <strong>Avansat GPT</strong>: CREATE VIEW, INDEX, TRIGGER, etc.</li>
        <li>📚 <strong>Istoric</strong>: întrebări, SQL-uri și mesaje GPT anterioare</li>
        <li>🔐 <strong>Securitate</strong>: GRANT, REVOKE, permisiuni și roluri</li>
        <li>⏳ <strong>Joburi SQL</strong>: programarea de joburi automate</li>
        <li>⚙️ <strong>Setări</strong>: configurări API, UI și preferințe</li>
      </ul>
    </div>
  )
}

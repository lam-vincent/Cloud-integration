export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* The Centered Container */}
      <main className="max-w-[800px] mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Planning Poker</h1>
          <p className="text-slate-500">Estimate your stories with your team</p>
        </header>
        
        {children}
      </main>
    </div>
  )
}
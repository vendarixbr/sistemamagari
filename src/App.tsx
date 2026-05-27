import { useState, type ReactNode } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './components/Dashboard'
import Demandas from './components/Demandas'
import Clientes from './components/Clientes'
import Creators from './components/Creators'
import Financeiro from './components/Financeiro'
import Calendario from './components/Calendario'
import Briefing from './components/Briefing'
import Prompts from './components/Prompts'
import Roteiro from './components/Roteiro'
import CentralIA from './components/CentralIA'
import Login from './components/Login'
import Register from './components/Register'

type Page = 'dashboard'|'demandas'|'calendario'|'clientes'|'creators'|'financeiro'|'briefing'|'prompts'|'roteiro'|'ia'
type AuthView = 'login' | 'register'
type User = { name: string; email: string }

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem('creatorhub_session')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const pages: Record<Page, ReactNode> = {
  dashboard: <Dashboard />,
  demandas:  <Demandas />,
  calendario:<Calendario />,
  clientes:  <Clientes />,
  creators:  <Creators />,
  financeiro:<Financeiro />,
  briefing:  <Briefing />,
  prompts:   <Prompts />,
  roteiro:   <Roteiro />,
  ia:        <CentralIA />,
}

export default function App() {
  const [user, setUser] = useState<User | null>(loadSession)
  const [authView, setAuthView] = useState<AuthView>('login')
  const [active, setActive] = useState<Page>('dashboard')

  function handleLogin(u: User) { setUser(u) }

  function handleLogout() {
    localStorage.removeItem('creatorhub_session')
    setUser(null)
    setAuthView('login')
  }

  if (!user) {
    return authView === 'login'
      ? <Login onLogin={handleLogin} onGoRegister={()=>setAuthView('register')} />
      : <Register onLogin={handleLogin} onGoLogin={()=>setAuthView('login')} />
  }

  return (
    <div className="app-layout">
      <Sidebar active={active} setActive={setActive} user={user} onLogout={handleLogout} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <TopBar user={user} onNavigate={p => setActive(p as Page)} />
        <main className="main-content">
          {pages[active]}
        </main>
      </div>
    </div>
  )
}

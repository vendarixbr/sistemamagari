import { type ReactNode } from 'react'

type Page =
  | 'dashboard' | 'demandas' | 'calendario' | 'clientes' | 'creators'
  | 'financeiro' | 'briefing' | 'prompts' | 'roteiro' | 'ia'

interface Props {
  active: Page
  setActive: (p: Page) => void
  user?: { name: string; email: string }
  onLogout?: () => void
}

function Ico({ children, size = 16 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

const NAV_MAIN = [
  {
    id: 'dashboard', label: 'Dashboard',
    icon: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>
  },
  {
    id: 'demandas', label: 'Demandas',
    icon: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>
  },
  {
    id: 'calendario', label: 'Calendário',
    icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>
  },
]

const NAV_BUSINESS = [
  {
    id: 'clientes', label: 'Clientes',
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>
  },
  {
    id: 'creators', label: 'Creators',
    icon: <><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></>
  },
  {
    id: 'financeiro', label: 'Financeiro',
    icon: <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>
  },
]

const NAV_TOOLS = [
  {
    id: 'briefing', label: 'Briefing',
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></>
  },
  {
    id: 'prompts', label: 'Prompts',
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>
  },
  {
    id: 'roteiro', label: 'Roteiro',
    icon: <><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></>
  },
  {
    id: 'ia', label: 'Central IA',
    icon: <><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></>
  },
]

function NavItem({ label, icon, active, onClick }: {
  id?: string; label: string; icon: ReactNode; active: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', borderRadius: 10, marginBottom: 2,
      background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
      color: active ? '#fff' : 'rgba(255,255,255,0.45)',
      fontSize: 13.5, fontWeight: active ? 600 : 400,
      transition: 'all 0.13s', textAlign: 'left', border: 'none',
    }}
    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)' }}
    onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)' } }}
    >
      <span style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'var(--grad-brand)' : 'rgba(255,255,255,0.06)',
        boxShadow: active ? '0 4px 12px rgba(200,31,31,0.4)' : 'none',
        color: active ? '#fff' : 'inherit',
        transition: 'all 0.13s',
      }}>
        <Ico size={14}>{icon}</Ico>
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {active && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--brand)',
          boxShadow: '0 0 8px var(--brand)',
        }}/>
      )}
    </button>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
      padding: '0 12px', marginTop: 18, marginBottom: 6,
    }}>
      {label}
    </div>
  )
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function Sidebar({ active, setActive, user, onLogout }: Props) {
  return (
    <aside style={{
      width: 'var(--sidebar-w)', minWidth: 'var(--sidebar-w)',
      height: '100vh',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--sidebar-border)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>

      {/* ── Logo ── */}
      <div style={{ padding: '20px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--grad-brand)',
            boxShadow: '0 4px 16px rgba(200,31,31,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.03em', lineHeight: 1.1 }}>CreatorHub</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10.5, marginTop: 1 }}>Workspace Pro</div>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 8px' }}>

        {/* Main */}
        {NAV_MAIN.map(item => (
          <NavItem key={item.id} {...item} active={active === item.id} onClick={() => setActive(item.id as Page)}/>
        ))}

        {/* Negócio */}
        <SectionLabel label="Negócio"/>
        {NAV_BUSINESS.map(item => (
          <NavItem key={item.id} {...item} active={active === item.id} onClick={() => setActive(item.id as Page)}/>
        ))}

        {/* Ferramentas IA */}
        <SectionLabel label="Ferramentas IA"/>
        {NAV_TOOLS.map(item => (
          <NavItem key={item.id} {...item} active={active === item.id} onClick={() => setActive(item.id as Page)}/>
        ))}

        {/* Workspace */}
        <SectionLabel label="Workspace"/>
        <div style={{ padding: '4px 12px 2px' }}>
          {[
            { label: 'Studio Pro', color: 'var(--brand)', active: true },
            { label: 'Freelancer', color: 'rgba(255,255,255,0.2)', active: false },
          ].map(w => (
            <div key={w.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: w.color, flexShrink: 0,
                boxShadow: w.active ? `0 0 7px ${w.color}` : 'none',
              }}/>
              <span style={{
                fontSize: 13, color: w.active ? '#fff' : 'rgba(255,255,255,0.3)',
                fontWeight: w.active ? 500 : 400,
              }}>{w.label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* ── Settings ── */}
      <div style={{ padding: '8px 8px 0', borderTop: '1px solid var(--sidebar-border)' }}>
        <button style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 10,
          background: 'transparent', color: 'rgba(255,255,255,0.45)',
          fontSize: 13.5, fontWeight: 400, transition: 'all 0.13s', textAlign: 'left', border: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)' }}
        >
          <span style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'rgba(255,255,255,0.06)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </span>
          Configurações
        </button>
      </div>

      {/* ── User footer ── */}
      <div style={{ padding: '10px 8px 12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'var(--grad-brand)',
            boxShadow: '0 0 12px rgba(200,31,31,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {user?.name ? initials(user.name) : 'U'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 12.5, fontWeight: 600,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name ?? 'Você'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10.5,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email ?? ''}
            </div>
          </div>
          <button onClick={onLogout} title="Sair" style={{
            width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.3)', flexShrink: 0, cursor: 'pointer',
            transition: 'all 0.13s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--red)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(248,113,113,0.2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

    </aside>
  )
}

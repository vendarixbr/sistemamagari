import { useState } from 'react'

interface Props {
  user?: { name: string; email: string }
  onNavigate?: (page: string) => void
}

function initials(name: string) {
  return name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function todayLabel() {
  return new Date().toLocaleDateString('pt-BR',{ weekday:'long', day:'numeric', month:'long' })
}

export default function TopBar({ user, onNavigate }: Props) {
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [notifs] = useState(3)

  return (
    <header style={{
      height:64, flexShrink:0,
      borderBottom:'1px solid var(--border)',
      display:'flex', alignItems:'center', padding:'0 32px',
      background:'var(--bg)',
      position:'sticky', top:0, zIndex:20,
    }}>
      {/* Greeting */}
      <div style={{ flex:1 }}>
        <div style={{ fontSize:19, fontWeight:700, color:'var(--text)', letterSpacing:'-0.03em', lineHeight:1.1 }}>
          {greeting()}, <span style={{ background:'var(--grad-brand)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            {user?.name?.split(' ')[0] ?? 'você'}
          </span>
        </div>
        <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2, textTransform:'capitalize' }}>
          {todayLabel()}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {/* Search */}
        {showSearch ? (
          <div style={{ position:'relative' }}>
            <input
              autoFocus
              type="text" value={search}
              onChange={e=>setSearch(e.target.value)}
              onBlur={()=>{ if(!search) setShowSearch(false) }}
              onKeyDown={e=>{ if(e.key==='Escape'){setSearch('');setShowSearch(false)} }}
              placeholder="Buscar..."
              style={{ width:200, paddingLeft:32, height:36, borderRadius:10, fontSize:13 }}
            />
            <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', opacity:0.4 }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
        ) : (
          <button onClick={()=>setShowSearch(true)} style={{
            width:36, height:36, borderRadius:10,
            border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center',
            color:'var(--text-2)', transition:'all 0.12s',
          }}
          onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='var(--bg-elevated)';(e.currentTarget as HTMLButtonElement).style.color='var(--text)'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent';(e.currentTarget as HTMLButtonElement).style.color='var(--text-2)'}}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        )}

        {/* Notifications */}
        <button style={{
          width:36, height:36, borderRadius:10, position:'relative',
          border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center',
          color:'var(--text-2)', transition:'all 0.12s',
        }}
        onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='var(--bg-elevated)'}}
        onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent'}}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {notifs > 0 && (
            <span style={{
              position:'absolute', top:6, right:6,
              width:7, height:7, borderRadius:'50%',
              background:'var(--brand)', boxShadow:'0 0 6px var(--brand)',
            }}/>
          )}
        </button>

        {/* Create button */}
        <button className="btn btn-primary btn-sm" onClick={()=>onNavigate?.('demandas')}
          style={{ gap:6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Criar
        </button>

        {/* Avatar */}
        <div style={{
          width:36, height:36, borderRadius:10,
          background:'var(--grad-brand)',
          boxShadow:'0 0 12px rgba(200,31,31,0.3)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer',
          flexShrink:0,
        }}>
          {user ? initials(user.name) : 'U'}
        </div>
      </div>
    </header>
  )
}

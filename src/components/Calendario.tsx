import { useState } from 'react'

type EventType = 'prazo' | 'gravacao' | 'recebimento' | 'reuniao'

interface Evento {
  id: number; titulo: string; cliente: string
  data: string; tipo: EventType; valor?: number
  status?: string
}

const eventos: Evento[] = [
  { id:1,  titulo:'Prazo: Reels junho',         cliente:'Studio Brava',  data:'2026-05-28', tipo:'prazo'      },
  { id:2,  titulo:'Prazo: Stories semana',       cliente:'Café Terral',   data:'2026-05-29', tipo:'prazo'      },
  { id:3,  titulo:'Gravação podcast ep.12',      cliente:'Studio Brava',  data:'2026-05-30', tipo:'gravacao'   },
  { id:4,  titulo:'Recebimento Mensal',          cliente:'Studio Brava',  data:'2026-05-31', tipo:'recebimento', valor:1800 },
  { id:5,  titulo:'Reunião de briefing',         cliente:'Moda Ritz',     data:'2026-06-02', tipo:'reuniao'    },
  { id:6,  titulo:'Prazo: Feed layout',          cliente:'Moda Ritz',     data:'2026-06-02', tipo:'prazo'      },
  { id:7,  titulo:'Recebimento Mensal',          cliente:'Café Terral',   data:'2026-06-03', tipo:'recebimento', valor:1200 },
  { id:8,  titulo:'Recebimento Mensal',          cliente:'Moda Ritz',     data:'2026-06-05', tipo:'recebimento', valor:2200 },
  { id:9,  titulo:'Prazo: Artes carrossel',      cliente:'Café Terral',   data:'2026-06-01', tipo:'prazo'      },
  { id:10, titulo:'Gravação stories tutorial',   cliente:'Pessoal',       data:'2026-05-30', tipo:'gravacao'   },
]

const tipoConfig: Record<EventType, { label:string; color:string; bg:string; icon:string }> = {
  prazo:       { label:'Prazo',       color:'var(--red)',   bg:'var(--red-bg)',   icon:'⏰' },
  gravacao:    { label:'Gravação',    color:'var(--blue)',  bg:'var(--blue-bg)',  icon:'🎥' },
  recebimento: { label:'Recebimento', color:'var(--green)', bg:'var(--green-bg)', icon:'💰' },
  reuniao:     { label:'Reunião',     color:'var(--purple)',bg:'var(--purple-bg)',icon:'👥' },
}

type Filter = 'Tudo' | 'Somente hoje' | 'Somente prazos' | 'Recebimentos'

function formatDate(d: string) {
  const dt = new Date(d + 'T12:00:00')
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
  return { weekday: dias[dt.getDay()], day: dt.getDate(), month: meses[dt.getMonth()], full: dt }
}

function isToday(d: string) {
  const today = new Date(); today.setHours(0,0,0,0)
  const dt = new Date(d + 'T12:00:00'); dt.setHours(0,0,0,0)
  return dt.getTime() === today.getTime()
}

function isPast(d: string) {
  const today = new Date(); today.setHours(0,0,0,0)
  const dt = new Date(d + 'T12:00:00'); dt.setHours(0,0,0,0)
  return dt < today
}

export default function Calendario() {
  const [filter, setFilter] = useState<Filter>('Tudo')

  const sorted = [...eventos].sort((a,b) => a.data.localeCompare(b.data))

  const filtered = sorted.filter(e => {
    if (filter === 'Somente hoje')   return isToday(e.data)
    if (filter === 'Somente prazos') return e.tipo === 'prazo'
    if (filter === 'Recebimentos')   return e.tipo === 'recebimento'
    return true
  })

  // Group by date
  const grouped: Record<string, Evento[]> = {}
  filtered.forEach(e => {
    if (!grouped[e.data]) grouped[e.data] = []
    grouped[e.data].push(e)
  })

  return (
    <div className="page-inner">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Calendário</h1>
          <p className="page-desc">Prazos, gravações e recebimentos</p>
        </div>
        <button className="btn btn-secondary btn-sm">⚙ Planejar semana</button>
      </div>

      <div className="tabs">
        {(['Tudo','Somente hoje','Somente prazos','Recebimentos'] as Filter[]).map(f => (
          <button key={f} className={`tab${filter===f?' active':''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
        {Object.entries(grouped).map(([date, evs]) => {
          const { weekday, day, month } = formatDate(date)
          const past = isPast(date)
          const today = isToday(date)

          return (
            <div key={date}>
              {/* Date label */}
              <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: today ? 'var(--brand)' : past ? 'var(--bg-subtle)' : 'var(--bg-card)',
                  border: `1px solid ${today ? 'var(--brand)' : 'var(--border)'}`,
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 700, lineHeight:1, color: today ? '#fff' : past ? 'var(--text-3)' : 'var(--text)' }}>
                    {day}
                  </span>
                  <span style={{ fontSize: 9, textTransform:'uppercase', letterSpacing:'0.05em', color: today ? 'rgba(255,255,255,0.8)' : 'var(--text-3)' }}>
                    {month}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 13, color: past ? 'var(--text-3)' : 'var(--text)' }}>
                    {weekday}
                    {today && <span className="badge badge-red" style={{ marginLeft: 8, fontSize: 10 }}>Hoje</span>}
                  </span>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{evs.length} evento{evs.length !== 1 ? 's' : ''}</div>
                </div>
              </div>

              {/* Events */}
              <div style={{ marginLeft: 56, display:'flex', flexDirection:'column', gap: 6 }}>
                {evs.map(e => {
                  const cfg = tipoConfig[e.tipo]
                  return (
                    <div key={e.id} className="card" style={{
                      padding: '11px 16px', display:'flex', alignItems:'center',
                      justifyContent:'space-between', opacity: past ? 0.6 : 1,
                    }}>
                      <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                        <span style={{
                          width: 32, height: 32, borderRadius: 8, background: cfg.bg,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize: 14, flexShrink: 0,
                        }}>{cfg.icon}</span>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{e.titulo}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{e.cliente}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                        {e.valor && (
                          <span style={{ fontWeight: 600, color: 'var(--green)', fontSize: 13 }}>
                            R$ {e.valor.toLocaleString('pt-BR')}
                          </span>
                        )}
                        <span className={`badge ${e.tipo==='prazo'?'badge-red':e.tipo==='recebimento'?'badge-green':e.tipo==='reuniao'?'badge-purple':'badge-blue'}`}
                          style={{ fontSize: 10 }}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="card empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <p>Nenhum evento encontrado para esse filtro.</p>
          </div>
        )}
      </div>
    </div>
  )
}

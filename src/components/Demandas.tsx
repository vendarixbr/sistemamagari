import { useState } from 'react'

type Priority = 'Alta' | 'Normal' | 'Baixa'
type Status = 'todo' | 'progress' | 'review' | 'done' | 'waiting'

interface Demand {
  id: number; title: string; client: string; priority: Priority
  status: Status; date: string; tags: string[]
}

const INIT: Demand[] = [
  { id:1, title:'Reels junho',            client:'Studio Brava', priority:'Alta',   status:'todo',     date:'2026-05-28', tags:[] },
  { id:2, title:'Stories semana 22',      client:'Café Terral',  priority:'Normal', status:'todo',     date:'2026-06-02', tags:[] },
  { id:3, title:'Feed planejamento',      client:'Moda Ritz',    priority:'Normal', status:'todo',     date:'2026-06-05', tags:[] },
  { id:4, title:'Editar vídeo podcast',   client:'Studio Brava', priority:'Alta',   status:'progress', date:'2026-05-30', tags:['Vídeo'] },
  { id:5, title:'Copy legenda lançamento',client:'Moda Ritz',    priority:'Normal', status:'progress', date:'2026-05-28', tags:[] },
  { id:6, title:'Artes carrossel',        client:'Café Terral',  priority:'Baixa',  status:'review',   date:'2026-06-01', tags:['Design'] },
  { id:7, title:'Pack stories tutorial',  client:'Pessoal',      priority:'Normal', status:'done',     date:'2026-05-25', tags:[] },
  { id:8, title:'Roteiro YouTube',        client:'Studio Brava', priority:'Alta',   status:'waiting',  date:'2026-06-03', tags:['Roteiro'] },
]

const COLS: { id: Status; label: string; color: string; dot: string }[] = [
  { id:'todo',     label:'A Fazer',          color:'rgba(255,255,255,0.06)', dot:'var(--text-3)' },
  { id:'progress', label:'Em Progresso',     color:'var(--blue-bg)',         dot:'var(--blue)'   },
  { id:'review',   label:'Em Revisão',       color:'var(--amber-bg)',        dot:'var(--amber)'  },
  { id:'done',     label:'Concluído',        color:'var(--green-bg)',        dot:'var(--green)'  },
  { id:'waiting',  label:'Aguardando',       color:'var(--purple-bg)',       dot:'var(--purple)' },
]

const BADGE: Record<Priority, string> = { Alta:'badge-red', Normal:'badge-amber', Baixa:'badge-gray' }
type Filter = 'Todas' | 'Atrasadas' | 'Hoje' | 'Próx. 3 dias'

function fmtDate(iso: string) {
  if (!iso) return '—'
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

function isLate(iso: string) {
  return iso ? new Date(iso + 'T00:00:00') < new Date(new Date().toDateString()) : false
}

function daysDiff(iso: string) {
  if (!iso) return Infinity
  const diff = new Date(iso + 'T00:00:00').getTime() - new Date(new Date().toDateString()).getTime()
  return Math.round(diff / 86400000)
}

export default function Demandas() {
  const [demands, setDemands] = useState<Demand[]>(INIT)
  const [filter, setFilter] = useState<Filter>('Todas')
  const [view, setView] = useState<'kanban'|'list'>('kanban')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Demand | null>(null)
  const [form, setForm] = useState({ title:'', client:'', priority:'Normal' as Priority, date:'', status:'todo' as Status, tags:'' })

  function applyFilter(d: Demand) {
    if (filter === 'Todas') return true
    const diff = daysDiff(d.date)
    if (filter === 'Atrasadas')   return isLate(d.date)
    if (filter === 'Hoje')        return diff === 0
    if (filter === 'Próx. 3 dias') return diff >= 0 && diff <= 3
    return true
  }

  function openNew() {
    setEditing(null)
    setForm({ title:'', client:'', priority:'Normal', date:'', status:'todo', tags:'' })
    setShowModal(true)
  }

  function openEdit(d: Demand) {
    setEditing(d)
    setForm({ title:d.title, client:d.client, priority:d.priority, date:d.date, status:d.status, tags:d.tags.join(', ') })
    setShowModal(true)
  }

  function save() {
    if (!form.title.trim()) return
    const tags = form.tags.split(',').map(t=>t.trim()).filter(Boolean)
    if (editing) {
      setDemands(prev => prev.map(d => d.id === editing.id ? { ...d, ...form, tags } : d))
    } else {
      setDemands(prev => [...prev, { id: Date.now(), ...form, tags }])
    }
    setShowModal(false)
  }

  function remove(id: number) {
    setDemands(prev => prev.filter(d => d.id !== id))
  }

  function moveStatus(d: Demand, s: Status) {
    setDemands(prev => prev.map(x => x.id === d.id ? { ...x, status: s } : x))
  }

  const filtered = demands.filter(applyFilter)

  return (
    <div style={{ padding:'28px 32px', height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h1 className="page-title">Demandas</h1>
          <p className="page-desc">{demands.length} demandas · {demands.filter(d=>d.status==='done').length} concluídas</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-secondary btn-sm" onClick={()=>setView(v=>v==='kanban'?'list':'kanban')}>
            {view==='kanban' ? '☰ Lista' : '⊞ Kanban'}
          </button>
          <button className="btn btn-primary" onClick={openNew}>+ Nova demanda</button>
        </div>
      </div>

      <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
        {(['Todas','Atrasadas','Hoje','Próx. 3 dias'] as Filter[]).map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:'5px 12px', borderRadius:99, fontSize:12, fontWeight:500,
            background: filter===f ? 'var(--brand)' : 'var(--bg-card)',
            color: filter===f ? '#fff' : 'var(--text-2)',
            border:`1px solid ${filter===f ? 'var(--brand)' : 'var(--border)'}`,
            boxShadow: filter===f ? '0 0 12px rgba(224,53,53,0.3)' : 'none',
            transition:'all 0.12s',
          }}>{f}</button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:12, color:'var(--text-3)', alignSelf:'center' }}>
          {filtered.length} exibindo
        </span>
      </div>

      {view === 'kanban' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, flex:1, overflow:'hidden' }}>
          {COLS.map(col => {
            const cards = filtered.filter(d => d.status === col.id)
            return (
              <div key={col.id} style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:col.dot, display:'inline-block', boxShadow:`0 0 6px ${col.dot}` }}/>
                    <span style={{ fontSize:11, fontWeight:600, color:'var(--text-2)' }}>{col.label}</span>
                  </div>
                  <span style={{ width:20, height:20, borderRadius:6, background:col.color, color:col.dot,
                    fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {cards.length}
                  </span>
                </div>

                <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:8 }}>
                  {cards.map(d => {
                    const late = isLate(d.date) && d.status !== 'done'
                    return (
                      <div key={d.id} className="card" style={{
                        padding:'12px 14px', cursor:'pointer', transition:'all 0.15s',
                        borderColor: late ? 'rgba(248,113,113,0.2)' : 'var(--border)',
                      }}
                      onClick={() => openEdit(d)}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)'}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-xs)'}
                      >
                        <div style={{ fontWeight:500, fontSize:13, marginBottom:5, lineHeight:1.3 }}>{d.title}</div>
                        {d.client && <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:8 }}>{d.client}</div>}
                        {d.tags.length > 0 && (
                          <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:8 }}>
                            {d.tags.map(t => <span key={t} className="badge badge-gray" style={{ fontSize:10 }}>{t}</span>)}
                          </div>
                        )}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <span className={`badge ${BADGE[d.priority]}`} style={{ fontSize:10 }}>{d.priority}</span>
                          {d.date && (
                            <span style={{ fontSize:11, fontWeight:500, color: late ? 'var(--red)' : 'var(--text-3)' }}>
                              {late && '⚠ '}{fmtDate(d.date)}
                            </span>
                          )}
                        </div>

                        {/* Quick move */}
                        <div style={{ display:'flex', gap:3, marginTop:8, flexWrap:'wrap' }}
                          onClick={e => e.stopPropagation()}>
                          {COLS.filter(c => c.id !== d.status).map(c => (
                            <button key={c.id} onClick={()=>moveStatus(d,c.id)} style={{
                              fontSize:9, padding:'2px 6px', borderRadius:5,
                              background:'var(--bg-subtle)', color:'var(--text-3)',
                              border:'1px solid var(--border)', cursor:'pointer',
                              transition:'all 0.1s',
                            }}
                            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.color=c.dot;(e.currentTarget as HTMLButtonElement).style.borderColor=c.dot}}
                            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.color='var(--text-3)';(e.currentTarget as HTMLButtonElement).style.borderColor='var(--border)'}}
                            >{c.label}</button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  {cards.length === 0 && (
                    <div style={{ border:'1.5px dashed var(--border)', borderRadius:10,
                      padding:'20px 12px', textAlign:'center', color:'var(--text-3)', fontSize:12 }}>
                      Vazio
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card" style={{ overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'var(--bg-subtle)' }}>
                {['Demanda','Cliente','Prioridade','Status','Prazo',''].map(h => (
                  <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600,
                    color:'var(--text-2)', letterSpacing:'0.04em', textTransform:'uppercase',
                    borderBottom:'1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const col = COLS.find(c => c.id === d.status)!
                const late = isLate(d.date) && d.status !== 'done'
                return (
                  <tr key={d.id} style={{ borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none',
                    transition:'background 0.1s', cursor:'pointer' }}
                    onClick={()=>openEdit(d)}
                    onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background='var(--bg-subtle)'}
                    onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background='transparent'}
                  >
                    <td style={{ padding:'12px 16px', fontWeight:500, fontSize:13 }}>{d.title}</td>
                    <td style={{ padding:'12px 16px', fontSize:12, color:'var(--text-2)' }}>{d.client || '—'}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span className={`badge ${BADGE[d.priority]}`}>{d.priority}</span>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:500, color:col.dot }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:col.dot }}/>
                        {col.label}
                      </span>
                    </td>
                    <td style={{ padding:'12px 16px', fontSize:12,
                      color: late ? 'var(--red)' : 'var(--text-2)', fontWeight: late ? 600 : 400 }}>
                      {late && '⚠ '}{fmtDate(d.date)}
                    </td>
                    <td style={{ padding:'12px 16px' }} onClick={e=>e.stopPropagation()}>
                      <button onClick={()=>remove(d.id)} style={{
                        fontSize:11, padding:'3px 8px', borderRadius:6,
                        background:'var(--red-bg)', color:'var(--red)', border:'none', cursor:'pointer',
                      }}>Excluir</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state"><p>Nenhuma demanda encontrada.</p></div>
          )}
        </div>
      )}

      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex',
          alignItems:'center', justifyContent:'center', zIndex:50, backdropFilter:'blur(4px)' }}
          onClick={()=>setShowModal(false)}>
          <div className="card" style={{ padding:28, width:460 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <h2 style={{ fontSize:16, fontWeight:700 }}>{editing ? 'Editar demanda' : 'Nova demanda'}</h2>
              <button style={{ color:'var(--text-3)', fontSize:18, lineHeight:1 }} onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label>Título *</label>
                <input type="text" value={form.title} placeholder="Ex: Reels de junho"
                  onChange={e=>setForm(p=>({...p,title:e.target.value}))} autoFocus />
              </div>
              <div><label>Cliente</label>
                <input type="text" value={form.client} placeholder="Nome do cliente"
                  onChange={e=>setForm(p=>({...p,client:e.target.value}))} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label>Prioridade</label>
                  <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value as Priority}))}>
                    <option>Alta</option><option>Normal</option><option>Baixa</option>
                  </select>
                </div>
                <div><label>Status</label>
                  <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value as Status}))}>
                    {COLS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div><label>Prazo</label>
                <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} />
              </div>
              <div><label>Tags (separadas por vírgula)</label>
                <input type="text" value={form.tags} placeholder="Ex: Vídeo, Design, Roteiro"
                  onChange={e=>setForm(p=>({...p,tags:e.target.value}))} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:22, justifyContent:'space-between' }}>
              {editing && (
                <button className="btn btn-secondary" style={{ color:'var(--red)', borderColor:'var(--red-bg)' }}
                  onClick={()=>{ remove(editing.id); setShowModal(false) }}>Excluir</button>
              )}
              <div style={{ display:'flex', gap:8, marginLeft:'auto' }}>
                <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={save} disabled={!form.title.trim()}>
                  {editing ? 'Salvar' : 'Criar demanda'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

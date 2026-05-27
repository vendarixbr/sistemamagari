import { useState } from 'react'

interface Creator {
  id: number; nome: string; especialidade: string
  email: string; ativas: number; entreguesPrazo: number
}

const ESPECIALIDADES = ['Editor de Vídeo','Designer / Stories','Copywriter','Storymaker','Social Media','Fotógrafo','Motion Designer','Outro']

const INIT: Creator[] = [
  { id:1, nome:'Ana Lima',    especialidade:'Editora de Vídeo',  email:'ana@studio.com',    ativas:3, entreguesPrazo:94 },
  { id:2, nome:'Bruno Melo',  especialidade:'Designer / Stories', email:'bruno@studio.com',  ativas:2, entreguesPrazo:88 },
  { id:3, nome:'Carla Dias',  especialidade:'Copywriter',         email:'carla@studio.com',  ativas:4, entreguesPrazo:100 },
  { id:4, nome:'Diego Souza', especialidade:'Storymaker',         email:'diego@studio.com',  ativas:1, entreguesPrazo:75 },
]

const GRAD_POOL = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#0e7490,#22d3ee)',
  'linear-gradient(135deg,#047857,#34d399)',
  'linear-gradient(135deg,#c2780a,#fbbf24)',
  'linear-gradient(135deg,#be185d,#f472b6)',
  'linear-gradient(135deg,#c81f1f,#ef4444)',
]

function initials(nome: string) {
  return nome.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()
}

export default function Creators() {
  const [creators, setCreators] = useState<Creator[]>(INIT)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Creator | null>(null)
  const [form, setForm] = useState({ nome:'', especialidade:'Editor de Vídeo', email:'', ativas:'0', entreguesPrazo:'100' })

  function openNew() {
    setEditing(null)
    setForm({ nome:'', especialidade:'Editor de Vídeo', email:'', ativas:'0', entreguesPrazo:'100' })
    setShowModal(true)
  }

  function openEdit(c: Creator) {
    setEditing(c)
    setForm({ nome:c.nome, especialidade:c.especialidade, email:c.email,
      ativas:String(c.ativas), entreguesPrazo:String(c.entreguesPrazo) })
    setShowModal(true)
  }

  function save() {
    if (!form.nome.trim()) return
    const data = {
      nome: form.nome.trim(), especialidade: form.especialidade,
      email: form.email.trim(),
      ativas: Number(form.ativas) || 0,
      entreguesPrazo: Math.min(100, Math.max(0, Number(form.entreguesPrazo) || 0)),
    }
    if (editing) {
      setCreators(prev => prev.map(c => c.id === editing.id ? { ...c, ...data } : c))
    } else {
      setCreators(prev => [...prev, { id: Date.now(), ...data }])
    }
    setShowModal(false)
  }

  function remove(id: number) {
    setCreators(prev => prev.filter(c => c.id !== id))
    setShowModal(false)
  }

  return (
    <div className="page-inner">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 className="page-title">Creators</h1>
          <p className="page-desc">{creators.length} membros na equipe</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Novo creator</button>
      </div>

      {creators.length === 0 && (
        <div className="card empty-state">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p>Nenhum creator cadastrado ainda.<br/>Clique em "+ Novo creator" para começar.</p>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
        {creators.map((c, i) => {
          const grad = GRAD_POOL[i % GRAD_POOL.length]
          const pct = c.entreguesPrazo
          const pctColor = pct >= 90 ? 'var(--green)' : pct >= 75 ? 'var(--amber)' : 'var(--red)'
          const pctBg   = pct >= 90 ? 'var(--green-bg)' : pct >= 75 ? 'var(--amber-bg)' : 'var(--red-bg)'
          return (
            <div key={c.id} className="card" style={{ padding:'20px 22px', cursor:'pointer', transition:'all 0.15s' }}
              onClick={()=>openEdit(c)}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.boxShadow='var(--shadow-sm)'}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.boxShadow='var(--shadow-xs)'}
            >
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{
                  width:46, height:46, borderRadius:12, background:grad,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:700, fontSize:14, color:'#fff', flexShrink:0,
                  boxShadow:`0 4px 12px rgba(0,0,0,0.3)`,
                }}>
                  {initials(c.nome)}
                </div>
                <div style={{ overflow:'hidden' }}>
                  <div style={{ fontWeight:600, fontSize:14, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.nome}</div>
                  <div style={{ fontSize:12, color:'var(--text-2)', marginTop:2 }}>{c.especialidade}</div>
                  {c.email && <div style={{ fontSize:10, color:'var(--text-3)', marginTop:1 }}>{c.email}</div>}
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                <div style={{ padding:'10px 12px', background:'var(--blue-bg)', borderRadius:8 }}>
                  <div style={{ fontSize:20, fontWeight:700, color:'var(--blue)', letterSpacing:'-0.03em' }}>{c.ativas}</div>
                  <div style={{ fontSize:11, color:'var(--text-2)', marginTop:2 }}>Ativas</div>
                </div>
                <div style={{ padding:'10px 12px', borderRadius:8, background:pctBg }}>
                  <div style={{ fontSize:20, fontWeight:700, letterSpacing:'-0.03em', color:pctColor }}>{pct}%</div>
                  <div style={{ fontSize:11, color:'var(--text-2)', marginTop:2 }}>No prazo</div>
                </div>
              </div>

              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:11, color:'var(--text-3)' }}>Taxa de entrega</span>
                  <span style={{ fontSize:11, fontWeight:600, color:pctColor }}>{pct}%</span>
                </div>
                <div style={{ height:5, background:'var(--border)', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:99, width:`${pct}%`,
                    background:pctColor, transition:'width 0.6s ease',
                    boxShadow:`0 0 8px ${pctColor}` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex',
          alignItems:'center', justifyContent:'center', zIndex:50, backdropFilter:'blur(4px)' }}
          onClick={()=>setShowModal(false)}>
          <div className="card" style={{ padding:28, width:440 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <h2 style={{ fontSize:16, fontWeight:700 }}>{editing ? 'Editar creator' : 'Novo creator'}</h2>
              <button style={{ color:'var(--text-3)', fontSize:18, lineHeight:1 }} onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label>Nome completo *</label>
                <input type="text" value={form.nome} placeholder="Ex: Ana Lima"
                  onChange={e=>setForm(p=>({...p,nome:e.target.value}))} autoFocus />
              </div>
              <div><label>Especialidade</label>
                <select value={form.especialidade} onChange={e=>setForm(p=>({...p,especialidade:e.target.value}))}>
                  {ESPECIALIDADES.map(e=><option key={e}>{e}</option>)}
                </select>
              </div>
              <div><label>E-mail</label>
                <input type="email" value={form.email} placeholder="creator@email.com"
                  onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label>Demandas ativas</label>
                  <input type="number" min="0" value={form.ativas}
                    onChange={e=>setForm(p=>({...p,ativas:e.target.value}))} />
                </div>
                <div><label>Taxa no prazo (%)</label>
                  <input type="number" min="0" max="100" value={form.entreguesPrazo}
                    onChange={e=>setForm(p=>({...p,entreguesPrazo:e.target.value}))} />
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:22, justifyContent:'space-between' }}>
              {editing && (
                <button className="btn btn-secondary" style={{ color:'var(--red)', borderColor:'var(--red-bg)' }}
                  onClick={()=>remove(editing.id)}>Remover</button>
              )}
              <div style={{ display:'flex', gap:8, marginLeft:'auto' }}>
                <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={save} disabled={!form.nome.trim()}>
                  {editing ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

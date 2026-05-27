import { useState } from 'react'

interface Cliente {
  id: number; nome: string; tipo: 'Mensal' | 'Avulso'
  valor: number; status: 'Ativo' | 'Pendente' | 'Inativo'
  noPrazo: number; atrasadas: number; totalPago: number
  inicioContrato: string; email: string; telefone: string
}

const INIT: Cliente[] = [
  { id:1, nome:'Studio Brava',   tipo:'Mensal', valor:1800, status:'Ativo',   noPrazo:72,  atrasadas:2, totalPago:9000, inicioContrato:'Jan/2025', email:'studio@brava.com', telefone:'(11) 99999-0001' },
  { id:2, nome:'Café Terral',    tipo:'Mensal', valor:1200, status:'Ativo',   noPrazo:88,  atrasadas:1, totalPago:6000, inicioContrato:'Mar/2025', email:'contato@cafeterral.com', telefone:'(11) 99999-0002' },
  { id:3, nome:'Moda Ritz',      tipo:'Mensal', valor:2200, status:'Ativo',   noPrazo:95,  atrasadas:0, totalPago:4400, inicioContrato:'Abr/2025', email:'ritz@moda.com', telefone:'(11) 99999-0003' },
  { id:4, nome:'Pizzaria Nosso', tipo:'Avulso', valor: 450, status:'Pendente',noPrazo:60,  atrasadas:3, totalPago: 900, inicioContrato:'Fev/2025', email:'nosso@pizza.com', telefone:'(11) 99999-0004' },
  { id:5, nome:'Clínica Vera',   tipo:'Avulso', valor: 800, status:'Inativo', noPrazo:100, atrasadas:0, totalPago:1600, inicioContrato:'Jan/2025', email:'vera@clinica.com', telefone:'(11) 99999-0005' },
]

const STATUS_STYLE: Record<string,string> = { Ativo:'badge-green', Pendente:'badge-amber', Inativo:'badge-gray' }

function gradForId(id: number) {
  const hue = (id * 67) % 360
  return `hsl(${hue},55%,35%)`
}
function bgForId(id: number) {
  const hue = (id * 67) % 360
  return `hsl(${hue},60%,16%)`
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>(INIT)
  const [tab, setTab] = useState<'Mensal'|'Avulso'>('Mensal')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [selected, setSelected] = useState<Cliente | null>(null)
  const [form, setForm] = useState({
    nome:'', tipo:'Mensal', valor:'', status:'Ativo',
    email:'', telefone:'', inicioContrato:'', noPrazo:'100', atrasadas:'0',
  })

  const filtered = clientes.filter(c => c.tipo === tab)
  const ativos = clientes.filter(c => c.status === 'Ativo')
  const mrr = ativos.filter(c => c.tipo === 'Mensal').reduce((a,c)=>a+c.valor, 0)

  function openNew() {
    setEditing(null)
    setForm({ nome:'', tipo:tab, valor:'', status:'Ativo', email:'', telefone:'',
      inicioContrato: new Date().toLocaleDateString('pt-BR',{month:'short',year:'numeric'}).replace('.',''),
      noPrazo:'100', atrasadas:'0',
    })
    setShowModal(true)
  }

  function openEdit(c: Cliente) {
    setSelected(null)
    setEditing(c)
    setForm({ nome:c.nome, tipo:c.tipo, valor:String(c.valor), status:c.status,
      email:c.email, telefone:c.telefone, inicioContrato:c.inicioContrato,
      noPrazo:String(c.noPrazo), atrasadas:String(c.atrasadas) })
    setShowModal(true)
  }

  function save() {
    if (!form.nome.trim()) return
    const data: Omit<Cliente,'id'|'totalPago'> = {
      nome: form.nome.trim(), tipo: form.tipo as 'Mensal'|'Avulso',
      valor: Number(form.valor) || 0, status: form.status as Cliente['status'],
      email: form.email, telefone: form.telefone, inicioContrato: form.inicioContrato,
      noPrazo: Number(form.noPrazo) || 0, atrasadas: Number(form.atrasadas) || 0,
    }
    if (editing) {
      setClientes(prev => prev.map(c => c.id === editing.id ? { ...c, ...data } : c))
    } else {
      setClientes(prev => [...prev, { id: Date.now(), totalPago: 0, ...data }])
    }
    setShowModal(false)
  }

  function remove(id: number) {
    setClientes(prev => prev.filter(c => c.id !== id))
    setShowModal(false); setSelected(null)
  }

  return (
    <div className="page-inner">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-desc">{ativos.length} ativos · MRR R$ {mrr.toLocaleString('pt-BR')}</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Novo cliente</button>
      </div>

      <div className="tabs">
        {(['Mensal','Avulso'] as const).map(t => (
          <button key={t} className={`tab${tab===t?' active':''}`} onClick={()=>setTab(t)}>{t}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.map(c => (
          <div key={c.id} className="card" style={{ padding:'18px 20px', cursor:'pointer', transition:'box-shadow 0.15s' }}
            onClick={()=>setSelected(c)}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.boxShadow='var(--shadow-sm)'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.boxShadow='var(--shadow-xs)'}
          >
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{
                  width:42, height:42, borderRadius:11, flexShrink:0,
                  background:bgForId(c.id), color:gradForId(c.id),
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:700, fontSize:15, border:`1px solid ${gradForId(c.id)}22`,
                }}>
                  {c.nome[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{c.nome}</div>
                  <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>desde {c.inicioContrato}</div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                <span className={`badge ${STATUS_STYLE[c.status]}`}>{c.status}</span>
                <span style={{ fontSize:17, fontWeight:700, letterSpacing:'-0.02em' }}>
                  R$ {c.valor.toLocaleString('pt-BR')}
                  <span style={{ fontSize:10, fontWeight:400, color:'var(--text-3)' }}>{c.tipo==='Mensal'?'/mês':''}</span>
                </span>
              </div>
            </div>

            <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'0 0 12px' }}/>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {[
                { label:'No prazo', value:`${c.noPrazo}%`, color: c.noPrazo>=80?'var(--green)':'var(--amber)' },
                { label:'Atrasadas', value:String(c.atrasadas), color: c.atrasadas>0?'var(--red)':'var(--text)' },
                { label:'Total pago', value:`R$ ${(c.totalPago/1000).toFixed(1)}k`, color:'var(--text)' },
                { label:'E-mail', value: c.email || '—', color:'var(--text-2)' },
              ].map(m => (
                <div key={m.label} style={{ textAlign:'center', padding:'8px 4px', background:'var(--bg-subtle)', borderRadius:7 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:m.color, letterSpacing:'-0.02em',
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.value}</div>
                  <div style={{ fontSize:10, color:'var(--text-3)', marginTop:2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card empty-state">
            <p>Nenhum cliente {tab.toLowerCase()} ainda. Clique em "+ Novo cliente".</p>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex',
          alignItems:'center', justifyContent:'center', zIndex:50, backdropFilter:'blur(4px)' }}
          onClick={()=>setSelected(null)}>
          <div className="card" style={{ padding:28, width:500 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:bgForId(selected.id),
                  color:gradForId(selected.id), display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:700, fontSize:16 }}>
                  {selected.nome[0].toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize:17, fontWeight:700 }}>{selected.nome}</h2>
                  <span className={`badge ${STATUS_STYLE[selected.status]}`} style={{ marginTop:3 }}>{selected.status}</span>
                </div>
              </div>
              <button style={{ color:'var(--text-3)', fontSize:18 }} onClick={()=>setSelected(null)}>✕</button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
              {[
                ['Tipo', selected.tipo],
                ['Valor', `R$ ${selected.valor.toLocaleString('pt-BR')}${selected.tipo==='Mensal'?'/mês':''}`],
                ['Início', selected.inicioContrato],
                ['Total pago', `R$ ${selected.totalPago.toLocaleString('pt-BR')}`],
                ['E-mail', selected.email || '—'],
                ['Telefone', selected.telefone || '—'],
                ['No prazo', `${selected.noPrazo}%`],
                ['Atrasadas', String(selected.atrasadas)],
              ].map(([l,v]) => (
                <div key={l} style={{ padding:'11px 14px', background:'var(--bg-subtle)', borderRadius:8 }}>
                  <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:2 }}>{l}</div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:8 }}>
              <button className="btn btn-secondary" style={{ flex:1 }} onClick={()=>setSelected(null)}>Fechar</button>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={()=>openEdit(selected)}>Editar</button>
            </div>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex',
          alignItems:'center', justifyContent:'center', zIndex:50, backdropFilter:'blur(4px)' }}
          onClick={()=>setShowModal(false)}>
          <div className="card" style={{ padding:28, width:480 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <h2 style={{ fontSize:16, fontWeight:700 }}>{editing ? 'Editar cliente' : 'Novo cliente'}</h2>
              <button style={{ color:'var(--text-3)', fontSize:18 }} onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div><label>Nome *</label>
                <input type="text" value={form.nome} placeholder="Nome do cliente"
                  onChange={e=>setForm(p=>({...p,nome:e.target.value}))} autoFocus />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label>Tipo</label>
                  <select value={form.tipo} onChange={e=>setForm(p=>({...p,tipo:e.target.value}))}>
                    <option>Mensal</option><option>Avulso</option>
                  </select>
                </div>
                <div><label>Status</label>
                  <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                    <option>Ativo</option><option>Pendente</option><option>Inativo</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label>Valor (R$)</label>
                  <input type="number" min="0" value={form.valor} placeholder="0,00"
                    onChange={e=>setForm(p=>({...p,valor:e.target.value}))} />
                </div>
                <div><label>Início contrato</label>
                  <input type="text" value={form.inicioContrato} placeholder="Ex: Jan/2025"
                    onChange={e=>setForm(p=>({...p,inicioContrato:e.target.value}))} />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label>E-mail</label>
                  <input type="email" value={form.email} placeholder="cliente@email.com"
                    onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
                </div>
                <div><label>Telefone</label>
                  <input type="text" value={form.telefone} placeholder="(11) 99999-0000"
                    onChange={e=>setForm(p=>({...p,telefone:e.target.value}))} />
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:20, justifyContent:'space-between' }}>
              {editing && (
                <button className="btn btn-secondary" style={{ color:'var(--red)', borderColor:'var(--red-bg)' }}
                  onClick={()=>remove(editing.id)}>Remover</button>
              )}
              <div style={{ display:'flex', gap:8, marginLeft:'auto' }}>
                <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={save} disabled={!form.nome.trim()}>
                  {editing ? 'Salvar' : 'Criar cliente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

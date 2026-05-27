import { useState } from 'react'

type Tipo = 'receita' | 'despesa' | 'fixo'
type StatusT = 'Pago' | 'Pendente'

interface Transacao {
  id: number; descricao: string; cliente: string
  valor: number; data: string; status: StatusT; tipo: Tipo
}

const INIT: Transacao[] = [
  { id:1, descricao:'Mensal Studio Brava',   cliente:'Studio Brava',  valor:1800, data:'2026-05-05', status:'Pago',    tipo:'receita' },
  { id:2, descricao:'Mensal Café Terral',    cliente:'Café Terral',   valor:1200, data:'2026-05-08', status:'Pago',    tipo:'receita' },
  { id:3, descricao:'Mensal Moda Ritz',      cliente:'Moda Ritz',     valor:2200, data:'2026-05-10', status:'Pago',    tipo:'receita' },
  { id:4, descricao:'Avulso stories pack',   cliente:'Pizzaria Nosso',valor: 450, data:'2026-05-18', status:'Pendente',tipo:'receita' },
  { id:5, descricao:'Adobe Creative Cloud',  cliente:'—',             valor: 300, data:'2026-05-01', status:'Pago',    tipo:'fixo'    },
  { id:6, descricao:'Capcut Pro',            cliente:'—',             valor: 120, data:'2026-05-01', status:'Pago',    tipo:'fixo'    },
  { id:7, descricao:'Spotify',               cliente:'—',             valor:  35, data:'2026-05-03', status:'Pago',    tipo:'fixo'    },
  { id:8, descricao:'HD Externo 2TB',        cliente:'—',             valor: 450, data:'2026-05-12', status:'Pago',    tipo:'despesa' },
  { id:9, descricao:'Microfone lapela',      cliente:'—',             valor: 280, data:'2026-05-14', status:'Pendente',tipo:'despesa' },
]

function LineChart({ transacoes }: { transacoes: Transacao[] }) {
  const W = 700, H = 140, PAD = 16
  const days = Array.from({length:31},(_,i)=>i+1)

  function cumulative(tipo: Tipo[], status?: StatusT) {
    return days.map(d => {
      return transacoes
        .filter(t => tipo.includes(t.tipo) && (!status || t.status===status))
        .filter(t => new Date(t.data).getDate() <= d)
        .reduce((a,t) => a+t.valor, 0)
    })
  }

  const revData = cumulative(['receita'], 'Pago')
  const expData = cumulative(['despesa','fixo'])
  const maxVal = Math.max(...revData, 1000)

  function toY(v: number) { return H - PAD - ((v / maxVal) * (H - PAD*2)) }
  function toX(i: number) { return PAD + (i/(days.length-1))*(W-PAD*2) }
  function path(vals: number[]) {
    return vals.map((v,i)=>`${i===0?'M':'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
  }

  const revPath = path(revData)
  const expPath = path(expData)

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id="rg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--green)" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="var(--green)" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="eg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--red)" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="var(--red)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0,0.25,0.5,0.75,1].map(p=>(
        <line key={p} x1={PAD} x2={W-PAD}
          y1={PAD+p*(H-PAD*2)} y2={PAD+p*(H-PAD*2)}
          stroke="var(--border)" strokeWidth="1"/>
      ))}
      <path d={`${revPath} L${toX(30)},${toY(0)} L${toX(0)},${toY(0)} Z`} fill="url(#rg)"/>
      <path d={revPath} stroke="var(--green)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      <path d={`${expPath} L${toX(30)},${toY(0)} L${toX(0)},${toY(0)} Z`} fill="url(#eg)"/>
      <path d={expPath} stroke="var(--red)" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeDasharray="4 3"/>
      {(() => {
        const idx = new Date().getDate()-1
        if (idx >= 0 && idx < days.length) {
          const x = toX(idx)
          return <line x1={x} x2={x} y1={PAD} y2={H-PAD} stroke="var(--brand)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7"/>
        }
        return null
      })()}
    </svg>
  )
}

type Tab = 'Receitas' | 'Despesas' | 'Custos fixos'

export default function Financeiro() {
  const [transacoes, setTransacoes] = useState<Transacao[]>(INIT)
  const [tab, setTab] = useState<Tab>('Receitas')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Transacao | null>(null)
  const [form, setForm] = useState({
    descricao:'', cliente:'', valor:'', data: new Date().toISOString().slice(0,10),
    status:'Pago' as StatusT, tipo:'receita' as Tipo,
  })

  const receita  = transacoes.filter(t=>t.tipo==='receita'&&t.status==='Pago').reduce((a,t)=>a+t.valor,0)
  const pendente = transacoes.filter(t=>t.tipo==='receita'&&t.status==='Pendente').reduce((a,t)=>a+t.valor,0)
  const despesas = transacoes.filter(t=>t.tipo==='despesa'||t.tipo==='fixo').reduce((a,t)=>a+t.valor,0)
  const lucro = receita - despesas

  const tabData: Record<Tab, Transacao[]> = {
    'Receitas':     transacoes.filter(t=>t.tipo==='receita'),
    'Despesas':     transacoes.filter(t=>t.tipo==='despesa'),
    'Custos fixos': transacoes.filter(t=>t.tipo==='fixo'),
  }

  const kpis = [
    { label:'Previsto',     value:`R$ ${(receita+pendente).toLocaleString('pt-BR')}`, color:'var(--blue)',   icon:<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>, stroke:'var(--blue)' },
    { label:'Recebido',     value:`R$ ${receita.toLocaleString('pt-BR')}`,            color:'var(--green)',  icon:<><polyline points="20 6 9 17 4 12"/></>, stroke:'var(--green)' },
    { label:'Em risco',     value:`R$ ${pendente.toLocaleString('pt-BR')}`,           color:'var(--amber)',  icon:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>, stroke:'var(--amber)' },
    { label:'Lucro do mês', value:`R$ ${lucro.toLocaleString('pt-BR')}`,              color: lucro>=0?'var(--green)':'var(--red)', icon:<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>, stroke: lucro>=0?'var(--green)':'var(--red)' },
  ]

  function openNew() {
    setEditing(null)
    setForm({ descricao:'', cliente:'', valor:'', data:new Date().toISOString().slice(0,10), status:'Pago', tipo:'receita' })
    setShowModal(true)
  }

  function openEdit(t: Transacao) {
    setEditing(t)
    setForm({ descricao:t.descricao, cliente:t.cliente, valor:String(t.valor), data:t.data, status:t.status, tipo:t.tipo })
    setShowModal(true)
  }

  function save() {
    if (!form.descricao.trim() || !form.valor) return
    const data = { ...form, valor: Number(form.valor), cliente: form.cliente || '—' }
    if (editing) {
      setTransacoes(prev => prev.map(t => t.id===editing.id ? { ...t, ...data } : t))
    } else {
      setTransacoes(prev => [...prev, { id:Date.now(), ...data }])
    }
    setShowModal(false)
  }

  function remove(id: number) {
    setTransacoes(prev => prev.filter(t => t.id !== id))
    setShowModal(false)
  }

  const mesAtual = new Date().toLocaleDateString('pt-BR',{month:'long',year:'numeric'})

  return (
    <div className="page-inner">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 className="page-title">Financeiro</h1>
          <p className="page-desc" style={{ textTransform:'capitalize' }}>{mesAtual}</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-secondary btn-sm" onClick={openNew}>+ Despesa</button>
          <button className="btn btn-primary" onClick={()=>{ setForm(p=>({...p,tipo:'receita'})); openNew() }}>+ Recebimento</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {kpis.map(k => (
          <div key={k.label} className="card" style={{ padding:'16px 18px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ fontSize:12, color:'var(--text-2)', fontWeight:500 }}>{k.label}</span>
              <span style={{ width:28, height:28, borderRadius:7,
                background:`${k.color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={k.stroke} strokeWidth="2.2" strokeLinecap="round">
                  {k.icon}
                </svg>
              </span>
            </div>
            <div style={{ fontSize:20, fontWeight:700, color:k.color, letterSpacing:'-0.04em' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding:'20px 24px', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <span style={{ fontWeight:600, fontSize:14 }}>Evolução do mês</span>
          <div style={{ display:'flex', gap:14 }}>
            {[{label:'Receita',color:'var(--green)',dash:false},{label:'Despesa',color:'var(--red)',dash:true}].map(l=>(
              <span key={l.label} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--text-2)' }}>
                <span style={{ width:16, height:2, background:l.color, borderRadius:2,
                  backgroundImage:l.dash?`repeating-linear-gradient(to right,${l.color} 0,${l.color} 4px,transparent 4px,transparent 7px)`:'none' }}/>
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <LineChart transacoes={transacoes} />
      </div>

      <div className="tabs">
        {(['Receitas','Despesas','Custos fixos'] as Tab[]).map(t => (
          <button key={t} className={`tab${tab===t?' active':''}`} onClick={()=>setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--bg-subtle)' }}>
              {['Descrição','Cliente','Valor','Data','Status',''].map(h=>(
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600,
                  color:'var(--text-2)', letterSpacing:'0.04em', textTransform:'uppercase',
                  borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabData[tab].map((t,i)=>(
              <tr key={t.id} style={{ borderBottom: i<tabData[tab].length-1?'1px solid var(--border)':'none',
                cursor:'pointer', transition:'background 0.1s' }}
                onClick={()=>openEdit(t)}
                onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background='var(--bg-subtle)'}
                onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background='transparent'}
              >
                <td style={{ padding:'12px 16px', fontWeight:500, fontSize:13 }}>{t.descricao}</td>
                <td style={{ padding:'12px 16px', fontSize:12, color:'var(--text-2)' }}>{t.cliente}</td>
                <td style={{ padding:'12px 16px', fontWeight:600, fontSize:13,
                  color: t.tipo==='receita'?'var(--green)':'var(--red)' }}>
                  {t.tipo==='receita'?'+':'-'} R$ {t.valor.toLocaleString('pt-BR')}
                </td>
                <td style={{ padding:'12px 16px', fontSize:12, color:'var(--text-2)' }}>
                  {new Date(t.data+'T12:00:00').toLocaleDateString('pt-BR')}
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <span className={`badge ${t.status==='Pago'?'badge-green':'badge-amber'}`}>{t.status}</span>
                </td>
                <td style={{ padding:'12px 16px' }} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>remove(t.id)} style={{
                    fontSize:11, padding:'3px 8px', borderRadius:6,
                    background:'var(--red-bg)', color:'var(--red)', border:'none', cursor:'pointer',
                  }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tabData[tab].length === 0 && (
          <div className="empty-state"><p>Nenhum lançamento nesta categoria.</p></div>
        )}
      </div>

      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex',
          alignItems:'center', justifyContent:'center', zIndex:50, backdropFilter:'blur(4px)' }}
          onClick={()=>setShowModal(false)}>
          <div className="card" style={{ padding:28, width:460 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <h2 style={{ fontSize:16, fontWeight:700 }}>{editing ? 'Editar lançamento' : 'Novo lançamento'}</h2>
              <button style={{ color:'var(--text-3)', fontSize:18 }} onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label>Tipo</label>
                <div style={{ display:'flex', gap:8 }}>
                  {([['receita','Receita','var(--green)'],['despesa','Despesa','var(--red)'],['fixo','Custo fixo','var(--purple)']] as const).map(([val,label,color])=>(
                    <button key={val} onClick={()=>setForm(p=>({...p,tipo:val}))} style={{
                      flex:1, padding:'8px', borderRadius:8, fontSize:12, fontWeight:600,
                      background: form.tipo===val ? `${color}18` : 'var(--bg-subtle)',
                      color: form.tipo===val ? color : 'var(--text-2)',
                      border:`1px solid ${form.tipo===val ? color : 'var(--border)'}`,
                      cursor:'pointer', transition:'all 0.12s',
                    }}>{label}</button>
                  ))}
                </div>
              </div>
              <div><label>Descrição *</label>
                <input type="text" value={form.descricao} placeholder="Ex: Mensal Studio Brava"
                  onChange={e=>setForm(p=>({...p,descricao:e.target.value}))} autoFocus />
              </div>
              <div><label>Cliente / Categoria</label>
                <input type="text" value={form.cliente} placeholder="Ex: Studio Brava"
                  onChange={e=>setForm(p=>({...p,cliente:e.target.value}))} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label>Valor (R$) *</label>
                  <input type="number" min="0" step="0.01" value={form.valor} placeholder="0,00"
                    onChange={e=>setForm(p=>({...p,valor:e.target.value}))} />
                </div>
                <div><label>Data</label>
                  <input type="date" value={form.data} onChange={e=>setForm(p=>({...p,data:e.target.value}))} />
                </div>
              </div>
              <div><label>Status</label>
                <div style={{ display:'flex', gap:8 }}>
                  {(['Pago','Pendente'] as StatusT[]).map(s=>(
                    <button key={s} onClick={()=>setForm(p=>({...p,status:s}))} style={{
                      flex:1, padding:'8px', borderRadius:8, fontSize:12, fontWeight:600,
                      background: form.status===s ? (s==='Pago'?'var(--green-bg)':'var(--amber-bg)') : 'var(--bg-subtle)',
                      color: form.status===s ? (s==='Pago'?'var(--green)':'var(--amber)') : 'var(--text-2)',
                      border:`1px solid ${form.status===s ? (s==='Pago'?'var(--green)':'var(--amber)') : 'var(--border)'}`,
                      cursor:'pointer', transition:'all 0.12s',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:22, justifyContent:'space-between' }}>
              {editing && (
                <button className="btn btn-secondary" style={{ color:'var(--red)' }}
                  onClick={()=>remove(editing.id)}>Excluir</button>
              )}
              <div style={{ display:'flex', gap:8, marginLeft:'auto' }}>
                <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={save}
                  disabled={!form.descricao.trim()||!form.valor}>
                  {editing ? 'Salvar' : 'Lançar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

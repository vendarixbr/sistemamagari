import { useState } from 'react'

/* ── tiny SVG icon ── */
function Ic({ d, size=15, color='currentColor', fill='none', sw='1.8' }:
  { d: string; size?: number; color?: string; fill?: string; sw?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d}/>
    </svg>
  )
}

/* ── week bar chart ── */
function WeekBars({ data, color }: { data:{label:string;v:number}[]; color:string }) {
  const max = Math.max(...data.map(d=>d.v), 1)
  return (
    <div style={{ display:'flex', gap:6, alignItems:'flex-end', height:64 }}>
      {data.map((d,i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
          <div style={{
            width:'100%', borderRadius:5, transition:'height 0.5s ease',
            height:`${Math.max((d.v/max)*52,4)}px`,
            background: d.v===max ? color : 'var(--border)',
            boxShadow: d.v===max ? `0 0 8px ${color}` : 'none',
          }}/>
          <span style={{ fontSize:9, color:'var(--text-3)', fontWeight:500 }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── donut ring ── */
function DonutRing({ pct, color, size=88, stroke=9 }: { pct:number; color:string; size?:number; stroke?:number }) {
  const r = (size-stroke)/2
  const circ = 2*Math.PI*r
  const offset = circ*(1-pct/100)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ filter:`drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  )
}

/* ── sparkline ── */
function Spark({ data, color, id }: { data:number[]; color:string; id:string }) {
  const W=300, H=48, P=4
  const max = Math.max(...data, 1)
  const pts = data.map((v,i)=>({
    x: P + (i/(data.length-1))*(W-P*2),
    y: H - P - (v/max)*(H-P*2),
  }))
  const line = pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length-1].x.toFixed(1)},${H-P} L${pts[0].x.toFixed(1)},${H-P} Z`
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`}/>
      <path d={line} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"/>
    </svg>
  )
}

/* ── goal item ── */
function GoalItem({ text, done, onToggle, onDelete }:
  { text:string; done:boolean; onToggle:()=>void; onDelete:()=>void }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0',
      borderBottom:'1px solid var(--border)' }}>
      <button onClick={onToggle} style={{
        width:18, height:18, borderRadius:5, flexShrink:0,
        border:`1.5px solid ${done?'var(--brand)':'var(--border)'}`,
        background: done?'var(--brand)':'transparent',
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all 0.15s', cursor:'pointer',
      }}>
        {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
      </button>
      <span style={{ flex:1, fontSize:13, color:done?'var(--text-3)':'var(--text)',
        textDecoration:done?'line-through':'none', transition:'all 0.15s' }}>
        {text}
      </span>
      <button onClick={onDelete} style={{ color:'var(--text-3)', fontSize:12, cursor:'pointer', padding:'0 2px',
        opacity:0, transition:'opacity 0.1s' }}
        onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.opacity='1'}
        onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.opacity='0'}
      >✕</button>
    </div>
  )
}

/* ── demand mini card ── */
function DemandCard({ title, client, status, color }:
  { title:string; client:string; status:string; color:string }) {
  return (
    <div className="card" style={{ padding:'14px 16px', minWidth:172, maxWidth:200, flexShrink:0 }}>
      <div style={{ width:28, height:28, borderRadius:8, background:`${color}18`,
        display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      </div>
      <div style={{ fontWeight:600, fontSize:13, lineHeight:1.35, marginBottom:4 }}>{title}</div>
      <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:10 }}>{client}</div>
      <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, fontWeight:600,
        color, padding:'2px 8px', borderRadius:99, background:`${color}15` }}>
        <span style={{ width:5, height:5, borderRadius:'50%', background:color, boxShadow:`0 0 4px ${color}` }}/>
        {status}
      </span>
    </div>
  )
}

/* ── client project card ── */
function ProjectCard({ nome, mrr, status, pct, color }:
  { nome:string; mrr:string; status:string; pct:number; color:string }) {
  return (
    <div className="card" style={{ flex:1, padding:'18px 20px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-24, right:-24, width:120, height:120, borderRadius:'50%',
        background:`radial-gradient(circle, ${color}18 0%, transparent 70%)`, pointerEvents:'none' }}/>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div style={{ fontWeight:700, fontSize:14, letterSpacing:'-0.02em' }}>{nome}</div>
        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <DonutRing pct={pct} color={color} size={40} stroke={5}/>
          <span style={{ position:'absolute', fontSize:9, fontWeight:700, color }}>{pct}%</span>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:8 }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:color, boxShadow:`0 0 5px ${color}` }}/>
        <span style={{ fontSize:11, color:'var(--text-2)' }}>{status}</span>
      </div>
      <div style={{ fontSize:20, fontWeight:800, color, letterSpacing:'-0.04em' }}>{mrr}</div>
      <div style={{ fontSize:10, color:'var(--text-3)', marginTop:1 }}>faturamento mensal</div>
    </div>
  )
}

/* ═══════════════ MAIN ═══════════════ */
interface Goal { id:number; text:string; done:boolean }

const INIT_GOALS: Goal[] = [
  { id:1, text:'Fechar 2 novos clientes', done:false },
  { id:2, text:'Entregar todos os reels de junho', done:true },
  { id:3, text:'Contratar 1 editor de vídeo', done:false },
  { id:4, text:'Revisar preços do pacote mensal', done:false },
]

const WEEK_DATA = [
  {label:'Seg',v:4},{label:'Ter',v:7},{label:'Qua',v:3},
  {label:'Qui',v:9},{label:'Sex',v:6},{label:'Sáb',v:2},{label:'Dom',v:1},
]

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>(INIT_GOALS)
  const [newGoal, setNewGoal] = useState('')

  function toggleGoal(id:number) { setGoals(p=>p.map(g=>g.id===id?{...g,done:!g.done}:g)) }
  function deleteGoal(id:number) { setGoals(p=>p.filter(g=>g.id!==id)) }
  function addGoal() {
    if (!newGoal.trim()) return
    setGoals(p=>[...p,{id:Date.now(),text:newGoal.trim(),done:false}])
    setNewGoal('')
  }

  const doneCount = goals.filter(g=>g.done).length
  const totalGoals = goals.length
  const goalPct = totalGoals > 0 ? Math.round(doneCount/totalGoals*100) : 0

  return (
    <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:18 }}>

      {/* ── ROW 1: hero + weekly + faturamento ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1.15fr 1fr 1fr', gap:16 }}>

        {/* Hero dark card */}
        <div className="card" style={{
          padding:'22px 24px',
          background:'linear-gradient(145deg,#0f0e1a 0%,#17152a 100%)',
          border:'1px solid rgba(255,255,255,0.07)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute',top:-40,right:-40,width:200,height:200,borderRadius:'50%',
            background:'radial-gradient(circle,rgba(224,53,53,0.12) 0%,transparent 70%)',pointerEvents:'none' }}/>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--text-2)' }}>Visão Geral</span>
            <span style={{ fontSize:10, color:'var(--text-3)', background:'rgba(255,255,255,0.05)',
              padding:'3px 8px', borderRadius:99, border:'1px solid var(--border)' }}>este mês</span>
          </div>

          <div style={{ display:'flex', gap:22, marginBottom:22 }}>
            <div>
              <div style={{ fontSize:42, fontWeight:800, letterSpacing:'-0.05em', lineHeight:1,
                background:'var(--grad-brand)', WebkitBackgroundClip:'text',
                WebkitTextFillColor:'transparent', backgroundClip:'text' }}>32</div>
              <div style={{ fontSize:11, color:'var(--text-3)', marginTop:5 }}>tarefas entregues</div>
            </div>
            <div style={{ width:'1px', background:'var(--border)', margin:'4px 0' }}/>
            <div>
              <div style={{ fontSize:42, fontWeight:800, letterSpacing:'-0.05em', lineHeight:1,
                color:'var(--amber)', textShadow:'0 0 20px rgba(251,191,36,0.4)' }}>5</div>
              <div style={{ fontSize:11, color:'var(--text-3)', marginTop:5 }}>em atraso</div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
            {[
              {label:'Projetos', value:'8',  color:'var(--blue)',  bg:'rgba(96,165,250,0.1)'},
              {label:'Andamento',value:'14', color:'var(--amber)', bg:'rgba(251,191,36,0.1)'},
              {label:'Concluído',value:'11', color:'var(--green)', bg:'rgba(52,211,153,0.1)'},
            ].map(s=>(
              <div key={s.label} style={{ padding:'10px 10px 8px', background:s.bg, borderRadius:10 }}>
                <div style={{ fontSize:22, fontWeight:800, color:s.color, letterSpacing:'-0.04em', lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:10, color:'var(--text-2)', marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly progress */}
        <div className="card" style={{ padding:'22px 24px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2 }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Progresso semanal</span>
            <Ic d="M3 3v18h18" color="var(--text-3)" size={14} sw="2"/>
          </div>
          <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:18 }}>entregas por dia</div>
          <WeekBars data={WEEK_DATA} color="var(--brand)"/>
          <div style={{ display:'flex', gap:16, marginTop:16 }}>
            {[{label:'Máx. dia',v:'9'},{label:'Média',v:'4.6'},{label:'Total',v:'32'}].map(s=>(
              <div key={s.label}>
                <div style={{ fontSize:16, fontWeight:700, color:'var(--text)', letterSpacing:'-0.02em' }}>{s.v}</div>
                <div style={{ fontSize:10, color:'var(--text-3)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Faturamento donut */}
        <div className="card" style={{ padding:'22px 24px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2 }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Faturamento</span>
            <span style={{ fontSize:11, fontWeight:600, color:'var(--green)',
              background:'var(--green-bg)', padding:'2px 8px', borderRadius:99 }}>+12%</span>
          </div>
          <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:16 }}>vs. mês anterior</div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <DonutRing pct={72} color="var(--brand)" size={88} stroke={9}/>
              <div style={{ position:'absolute', textAlign:'center' }}>
                <div style={{ fontSize:15, fontWeight:800, color:'var(--text)', letterSpacing:'-0.03em' }}>72%</div>
                <div style={{ fontSize:8, color:'var(--text-3)' }}>da meta</div>
              </div>
            </div>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
              {[
                {label:'Recebido',val:'R$ 5,2k',color:'var(--green)'},
                {label:'Pendente',val:'R$ 450', color:'var(--amber)'},
                {label:'Meta',    val:'R$ 7,2k',color:'var(--text-3)'},
              ].map(r=>(
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--text-2)' }}>
                    <span style={{ width:6,height:6,borderRadius:'50%',background:r.color }}/>
                    {r.label}
                  </span>
                  <span style={{ fontSize:12, fontWeight:700, color:r.color }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: metas + em andamento ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.7fr', gap:16 }}>

        {/* Metas do mês */}
        <div className="card" style={{ padding:'22px 24px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>Metas do mês</div>
              <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>{doneCount}/{totalGoals} concluídas</div>
            </div>
            <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="4"/>
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--brand)" strokeWidth="4"
                  strokeDasharray={`${Math.round(88*goalPct/100)} 88`} strokeLinecap="round"
                  transform="rotate(-90 18 18)" style={{ filter:'drop-shadow(0 0 4px var(--brand))' }}/>
              </svg>
              <span style={{ position:'absolute', fontSize:9, fontWeight:800, color:'var(--brand)' }}>{goalPct}%</span>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column' }}>
            {goals.map(g=>(
              <GoalItem key={g.id} text={g.text} done={g.done}
                onToggle={()=>toggleGoal(g.id)} onDelete={()=>deleteGoal(g.id)}/>
            ))}
            {goals.length === 0 && (
              <div style={{ color:'var(--text-3)', fontSize:12, padding:'16px 0', textAlign:'center' }}>
                Nenhuma meta. Adicione uma abaixo.
              </div>
            )}
          </div>

          <div style={{ display:'flex', gap:8, marginTop:14 }}>
            <input type="text" value={newGoal} placeholder="Adicionar meta..."
              onChange={e=>setNewGoal(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&addGoal()}
              style={{ flex:1, fontSize:12 }}/>
            <button className="btn btn-primary btn-sm" onClick={addGoal} disabled={!newGoal.trim()}>+</button>
          </div>
        </div>

        {/* Em andamento */}
        <div className="card" style={{ padding:'22px 24px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>Em andamento</div>
              <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>demandas ativas agora</div>
            </div>
            <span style={{ fontSize:12, fontWeight:600, color:'var(--blue)',
              background:'var(--blue-bg)', padding:'3px 10px', borderRadius:99 }}>3 tarefas</span>
          </div>

          <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:6 }}>
            <DemandCard title="Editar vídeo podcast"     client="Studio Brava" status="Em progresso" color="var(--blue)"/>
            <DemandCard title="Copy legenda lançamento"  client="Moda Ritz"    status="Em progresso" color="var(--amber)"/>
            <DemandCard title="Artes carrossel"          client="Café Terral"  status="Em revisão"   color="var(--purple)"/>
            <div style={{
              minWidth:130, borderRadius:16, cursor:'pointer', flexShrink:0,
              border:'1.5px dashed var(--border)',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              gap:8, padding:'20px 12px', color:'var(--text-3)', transition:'all 0.15s',
            }}
            onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='var(--brand)';(e.currentTarget as HTMLDivElement).style.color='var(--brand)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='var(--border)';(e.currentTarget as HTMLDivElement).style.color='var(--text-3)'}}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span style={{ fontSize:12, fontWeight:500 }}>Nova tarefa</span>
            </div>
          </div>

          <div style={{ marginTop:18 }}>
            <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:8 }}>volume dos últimos 7 dias</div>
            <Spark data={[2,5,3,8,4,6,3]} color="var(--brand)" id="dash-spark"/>
          </div>
        </div>
      </div>

      {/* ── ROW 3: últimos clientes ── */}
      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:700 }}>Últimos clientes</span>
          <button style={{ fontSize:12, color:'var(--text-3)', display:'flex', alignItems:'center', gap:4 }}>
            Ver todos
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
        <div style={{ display:'flex', gap:14 }}>
          <ProjectCard nome="Studio Brava" mrr="R$ 1.800" status="Ativo" pct={94} color="var(--brand)"/>
          <ProjectCard nome="Café Terral"  mrr="R$ 1.200" status="Ativo" pct={88} color="#22d3ee"/>
          <ProjectCard nome="Moda Ritz"    mrr="R$ 2.200" status="Ativo" pct={95} color="var(--purple)"/>
        </div>
      </div>

    </div>
  )
}

import { useState } from 'react'

const TIPOS = [
  { id:'Stories',       color:'#60a5fa' },
  { id:'Reels',         color:'#ef4444' },
  { id:'Feed',          color:'#34d399' },
  { id:'Carrossel',     color:'#fbbf24' },
  { id:'YouTube',       color:'#f87171' },
  { id:'Podcast',       color:'#a78bfa' },
  { id:'TikTok',        color:'#8b5cf6' },
  { id:'LinkedIn',      color:'#60a5fa' },
]

const NICHOS = ['Gastronomia','Moda e Beleza','Fitness e Saúde','Educação','Tecnologia','Lifestyle','Negócios','Outro']
const TONS   = ['Descontraído e informal','Profissional e sério','Inspirador e motivacional','Engraçado e criativo','Informativo e educacional']

function renderMd(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color:'var(--text)', fontWeight:600 }}>{p.slice(2,-2)}</strong>
      : <span key={i}>{p}</span>
  )
}

export default function Briefing() {
  const [tipo, setTipo]           = useState('')
  const [nicho, setNicho]         = useState('')
  const [tom, setTom]             = useState('')
  const [cliente, setCliente]     = useState('')
  const [objetivo, setObjetivo]   = useState('')
  const [diferenciais, setDif]    = useState('')
  const [cta, setCta]             = useState('')
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState('')
  const [copied, setCopied]       = useState(false)

  const canGenerate = tipo && objetivo.trim()

  async function gerar() {
    if (!canGenerate) return
    setLoading(true); setResult('')

    const prompt = `Você é um estrategista de conteúdo especialista em social media para creators e agências criativas.

Crie um briefing detalhado e profissional para o seguinte conteúdo:

- **Tipo de conteúdo:** ${tipo}
- **Nicho/segmento:** ${nicho || 'não informado'}
- **Tom de voz:** ${tom || 'não informado'}
- **Cliente/marca:** ${cliente || 'não informado'}
- **Objetivo da publicação:** ${objetivo}
- **Diferenciais/pontos principais:** ${diferenciais || 'não informado'}
- **CTA desejado:** ${cta || 'não informado'}

O briefing deve incluir:
1. **Conceito criativo** — ideia central e abordagem
2. **Roteiro / estrutura** — sequência do conteúdo (início, meio, fim)
3. **Diretrizes visuais** — referências de estilo, cores, elementos
4. **Texto/copy** — sugestão de legenda, hashtags e chamadas
5. **Métricas de sucesso** — o que acompanhar após a publicação

Seja específico, criativo e entregue algo que um profissional de conteúdo consiga executar imediatamente.`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'anthropic-version':'2023-06-01' },
        body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:1500, messages:[{role:'user',content:prompt}] }),
      })
      const data = await res.json()
      setResult(data.content?.find((c:{type:string})=>c.type==='text')?.text ?? 'Erro ao gerar briefing.')
    } catch {
      setResult('Erro de conexão. Verifique sua API key.')
    } finally { setLoading(false) }
  }

  function copy() { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false),2000) }

  return (
    <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28 }}>
        <div style={{
          width:44, height:44, borderRadius:13,
          background:'linear-gradient(135deg,#0e7490,#22d3ee)',
          boxShadow:'0 4px 16px rgba(14,116,144,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
          </svg>
        </div>
        <div>
          <h1 className="page-title">Gerador de Briefing</h1>
          <p className="page-desc">Crie briefings profissionais com IA em segundos</p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:20, flex:1, minHeight:0 }}>

        {/* ── Form ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="card" style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:16 }}>

            {/* Tipo de conteúdo */}
            <div>
              <label style={{ marginBottom:10, display:'block' }}>Tipo de conteúdo *</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {TIPOS.map(t => {
                  const sel = tipo === t.id
                  return (
                    <button key={t.id} onClick={()=>setTipo(sel?'':t.id)} style={{
                      padding:'9px 12px', borderRadius:10, textAlign:'left',
                      background: sel ? `${t.color}15` : 'var(--bg-subtle)',
                      border:`1px solid ${sel ? t.color : 'var(--border)'}`,
                      boxShadow: sel ? `0 0 12px ${t.color}20` : 'none',
                      color: sel ? t.color : 'var(--text-2)',
                      fontSize:13, fontWeight: sel ? 600 : 400,
                      transition:'all 0.13s', cursor:'pointer',
                    }}>
                      {t.id}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Nicho + Tom */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>
                <label>Nicho</label>
                <select value={nicho} onChange={e=>setNicho(e.target.value)}>
                  <option value="">Selecionar</option>
                  {NICHOS.map(n=><option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label>Tom de voz</label>
                <select value={tom} onChange={e=>setTom(e.target.value)}>
                  <option value="">Selecionar</option>
                  {TONS.map(t=><option key={t} value={t}>{t.split(' ')[0]}</option>)}
                </select>
              </div>
            </div>

            {/* Cliente */}
            <div>
              <label>Cliente / Marca <span style={{color:'var(--text-3)',fontWeight:400}}>(opcional)</span></label>
              <input type="text" value={cliente} onChange={e=>setCliente(e.target.value)}
                placeholder="Ex: Studio Brava" />
            </div>

            {/* Objetivo */}
            <div>
              <label>Objetivo da publicação *</label>
              <textarea value={objetivo} rows={2} onChange={e=>setObjetivo(e.target.value)}
                placeholder="Ex: Apresentar novo produto, gerar leads para evento..." />
            </div>

            {/* Diferenciais */}
            <div>
              <label>Diferenciais <span style={{color:'var(--text-3)',fontWeight:400}}>(opcional)</span></label>
              <textarea value={diferenciais} rows={2} onChange={e=>setDif(e.target.value)}
                placeholder="Ex: Preço especial, exclusividade, bastidores..." />
            </div>

            {/* CTA */}
            <div>
              <label>CTA desejado <span style={{color:'var(--text-3)',fontWeight:400}}>(opcional)</span></label>
              <input type="text" value={cta} onChange={e=>setCta(e.target.value)}
                placeholder="Ex: Salvar, seguir, link na bio..." />
            </div>
          </div>

          <button className="btn btn-primary" onClick={gerar}
            disabled={!canGenerate||loading}
            style={{ padding:'13px', fontSize:14, justifyContent:'center',
              opacity:(!canGenerate||loading)?0.5:1, width:'100%' }}>
            {loading ? (
              <><span style={{ display:'inline-block', width:14, height:14, border:'2px solid rgba(255,255,255,0.3)',
                borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/> Gerando briefing...</>
            ) : (
              <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg> Gerar briefing com IA</>
            )}
          </button>
        </div>

        {/* ── Result ── */}
        <div style={{ display:'flex', flexDirection:'column', minHeight:0 }}>
          {!result && !loading && (
            <div className="card" style={{ flex:1, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:14, color:'var(--text-3)', textAlign:'center' }}>
              <div style={{
                width:56, height:56, borderRadius:16,
                background:'linear-gradient(135deg,rgba(14,116,144,0.15),rgba(34,211,238,0.15))',
                border:'1px solid rgba(34,211,238,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:15, color:'var(--text-2)', marginBottom:6 }}>Pronto para criar</div>
                <div style={{ fontSize:13, maxWidth:260 }}>Preencha os campos ao lado e clique em Gerar</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="card" style={{ flex:1, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:16 }}>
              <div style={{ width:40, height:40, border:'3px solid var(--border)',
                borderTopColor:'#22d3ee', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:'var(--text-2)', marginBottom:4 }}>Gerando briefing...</div>
                <div style={{ fontSize:12, color:'var(--text-3)' }}>A IA está criando seu conteúdo</div>
              </div>
            </div>
          )}

          {result && (
            <div className="card" style={{ flex:1, display:'flex', flexDirection:'column', padding:'22px 26px', minHeight:0 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexShrink:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:'#22d3ee',
                    boxShadow:'0 0 8px #22d3ee' }}/>
                  <span style={{ fontWeight:600, fontSize:14 }}>Briefing gerado</span>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={copy}>
                    {copied ? (
                      <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copiado</>
                    ) : (
                      <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copiar</>
                    )}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={gerar}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                    Regenerar
                  </button>
                </div>
              </div>
              <div style={{ flex:1, overflowY:'auto', fontSize:13, lineHeight:1.85, whiteSpace:'pre-wrap', color:'var(--text)' }}>
                {renderMd(result)}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

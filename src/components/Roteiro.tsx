import { useState } from 'react'

const FORMATOS = [
  { id:'Reel (30-60s)',     label:'Reel',       sub:'30–60s',  color:'#ef4444' },
  { id:'TikTok (60-90s)',   label:'TikTok',     sub:'60–90s',  color:'#8b5cf6' },
  { id:'YouTube Shorts',   label:'Shorts',     sub:'< 60s',   color:'#f87171' },
  { id:'YouTube (5-10min)',  label:'YouTube',    sub:'5–10min', color:'#60a5fa' },
  { id:'YouTube (15-20min)', label:'YouTube',   sub:'15–20min',color:'#60a5fa' },
  { id:'Podcast',           label:'Podcast',    sub:'episódio',color:'#34d399' },
  { id:'IGTV',              label:'IGTV',       sub:'long',    color:'#fbbf24' },
]

const GANCHOS = [
  'Pergunta provocadora',
  'Fato surpreendente',
  'Erro comum do nicho',
  'Promessa de transformação',
  'Polêmica / contra-intuitivo',
]

function renderMd(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color:'var(--text)', fontWeight:600 }}>{p.slice(2,-2)}</strong>
      : <span key={i}>{p}</span>
  )
}

export default function Roteiro() {
  const [formato, setFormato] = useState('')
  const [tema, setTema]       = useState('')
  const [publico, setPublico] = useState('')
  const [gancho, setGancho]   = useState('')
  const [cta, setCta]         = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState('')
  const [copied, setCopied]   = useState(false)

  const canGenerate = formato && tema.trim()

  async function gerar() {
    if (!canGenerate) return
    setLoading(true); setResult('')

    const prompt = `Você é um roteirista especializado em conteúdo digital para creators e influenciadores.

Crie um roteiro completo e detalhado para o seguinte vídeo:

- **Formato:** ${formato}
- **Tema:** ${tema}
- **Público-alvo:** ${publico || 'não informado'}
- **Tipo de gancho:** ${gancho || 'livre'}
- **CTA desejado:** ${cta || 'curtir e seguir'}

O roteiro deve incluir:
1. **GANCHO (0-5s):** Frase exata de abertura + o que mostrar na tela
2. **DESENVOLVIMENTO:** Cada bloco com tempo, fala e visual
3. **TRANSIÇÕES:** Sugestão de corte ou efeito entre cenas
4. **CTA FINAL:** Frase exata de chamada para ação
5. **LEGENDA:** Sugestão de caption para o post
6. **HASHTAGS:** 10-15 hashtags relevantes

Seja específico, criativo e prático. O creator deve conseguir filmar com esse roteiro em mãos.`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:2000, messages:[{role:'user',content:prompt}] }),
      })
      const data = await res.json()
      setResult(data.content?.find((c: {type:string}) => c.type==='text')?.text ?? 'Erro ao gerar roteiro.')
    } catch {
      setResult('Erro de conexão. Verifique sua API key.')
    } finally {
      setLoading(false)
    }
  }

  function copy() { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false),2000) }

  return (
    <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28 }}>
        <div style={{
          width:44, height:44, borderRadius:13,
          background:'linear-gradient(135deg,#6d28d9,#c084fc)',
          boxShadow:'0 4px 16px rgba(109,40,217,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
          </svg>
        </div>
        <div>
          <h1 className="page-title">Gerador de Roteiro</h1>
          <p className="page-desc">Roteiros prontos para gravar com IA</p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:20, flex:1, minHeight:0 }}>

        {/* ── Form ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="card" style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:18 }}>

            {/* Formato chips */}
            <div>
              <label style={{ marginBottom:10, display:'block' }}>Formato do vídeo *</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
                {FORMATOS.map(f => {
                  const sel = formato === f.id
                  return (
                    <button key={f.id} onClick={()=>setFormato(sel ? '' : f.id)} style={{
                      padding:'9px 12px', borderRadius:10, textAlign:'left',
                      background: sel ? `${f.color}15` : 'var(--bg-subtle)',
                      border:`1px solid ${sel ? f.color : 'var(--border)'}`,
                      boxShadow: sel ? `0 0 14px ${f.color}25` : 'none',
                      transition:'all 0.13s', cursor:'pointer',
                      display:'flex', flexDirection:'column', gap:1,
                    }}>
                      <span style={{ fontSize:12, fontWeight:600, color: sel ? f.color : 'var(--text)' }}>{f.label}</span>
                      <span style={{ fontSize:10, color:'var(--text-3)' }}>{f.sub}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tema */}
            <div>
              <label>Tema / Assunto *</label>
              <input type="text" value={tema} onChange={e=>setTema(e.target.value)}
                placeholder="Ex: 3 erros em stories que matam o alcance" />
            </div>

            {/* Público + Gancho */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>
                <label>Público-alvo</label>
                <input type="text" value={publico} onChange={e=>setPublico(e.target.value)}
                  placeholder="Ex: Empreendedores" />
              </div>
              <div>
                <label>Tipo de gancho</label>
                <select value={gancho} onChange={e=>setGancho(e.target.value)}>
                  <option value="">IA escolhe</option>
                  {GANCHOS.map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {/* CTA */}
            <div>
              <label>CTA desejado <span style={{color:'var(--text-3)',fontWeight:400}}>(opcional)</span></label>
              <input type="text" value={cta} onChange={e=>setCta(e.target.value)}
                placeholder="Ex: Salvar, comentar, seguir..." />
            </div>
          </div>

          <button className="btn btn-primary" onClick={gerar}
            disabled={!canGenerate || loading}
            style={{ padding:'13px', fontSize:14, justifyContent:'center',
              opacity:(!canGenerate||loading)?0.5:1, width:'100%' }}>
            {loading ? (
              <><span style={{ display:'inline-block', width:14, height:14, border:'2px solid rgba(255,255,255,0.3)',
                borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/> Gerando roteiro...</>
            ) : (
              <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg> Gerar roteiro</>
            )}
          </button>

          {!canGenerate && (
            <p style={{ fontSize:11, color:'var(--text-3)', textAlign:'center' }}>
              Selecione o formato e preencha o tema
            </p>
          )}
        </div>

        {/* ── Result ── */}
        <div style={{ display:'flex', flexDirection:'column', minHeight:0 }}>
          {!result && !loading && (
            <div className="card" style={{ flex:1, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:14, color:'var(--text-3)', textAlign:'center' }}>
              <div style={{
                width:56, height:56, borderRadius:16,
                background:'linear-gradient(135deg,rgba(109,40,217,0.15),rgba(192,132,252,0.15))',
                border:'1px solid rgba(109,40,217,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:15, color:'var(--text-2)', marginBottom:6 }}>Pronto para rodar</div>
                <div style={{ fontSize:13, maxWidth:260 }}>Escolha o formato e o tema para gerar seu roteiro</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="card" style={{ flex:1, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:16 }}>
              <div style={{ width:40, height:40, border:'3px solid var(--border)',
                borderTopColor:'var(--purple)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:'var(--text-2)', marginBottom:4 }}>Roteirizando...</div>
                <div style={{ fontSize:12, color:'var(--text-3)' }}>A IA está criando seu roteiro</div>
              </div>
            </div>
          )}

          {result && (
            <div className="card" style={{ flex:1, display:'flex', flexDirection:'column', padding:'22px 26px', minHeight:0 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexShrink:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--purple)',
                    boxShadow:'0 0 8px var(--purple)' }}/>
                  <span style={{ fontWeight:600, fontSize:14 }}>Roteiro pronto</span>
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

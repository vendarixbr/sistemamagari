import { useState, useRef, useEffect } from 'react'

interface Message { role: 'user'|'assistant'; content: string }

const SUGESTOES = [
  'Como criar um gancho de stories irresistível?',
  'Qual a melhor estrutura de reel para um lançamento?',
  'Como cobrar mais caro pelos meus serviços?',
  'Quais métricas acompanhar para crescer no Instagram?',
  'Como fazer uma proposta comercial profissional?',
  'Qual frequência de postagem ideal para cada formato?',
]

const SYSTEM = `Você é um especialista em marketing digital e produção de conteúdo para creators, influenciadores e agências criativas.

Seu perfil:
- 10+ anos de experiência em social media e conteúdo digital
- Especialista em Instagram, YouTube, TikTok, Podcasts
- Domina copywriting, estratégias de crescimento e monetização
- Conhece profundamente o mercado brasileiro de conteúdo

Ao responder:
- Seja direto, prático e específico
- Use exemplos concretos e aplicáveis
- Formate as respostas com bullet points e negrito quando necessário
- Priorize soluções rápidas e implementáveis
- Fale como um mentor experiente, não como um manual`

export default function CentralIA() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  async function send(text?: string) {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    const newMsgs: Message[] = [...messages, { role:'user', content: msg }]
    setMessages(newMsgs)
    setLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM,
          messages: newMsgs.map(m => ({ role:m.role, content:m.content })),
        }),
      })
      const data = await res.json()
      const reply = data.content?.find((c: { type: string }) => c.type === 'text')?.text ?? 'Erro ao obter resposta.'
      setMessages(p => [...p, { role:'assistant', content: reply }])
    } catch {
      setMessages(p => [...p, { role:'assistant', content:'Erro de conexão. Verifique sua API key.' }])
    } finally {
      setLoading(false)
    }
  }

  function renderContent(text: string) {
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i}>{part.slice(2,-2)}</strong>
        : <span key={i}>{part}</span>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', padding:'28px 32px' }}>
      <div style={{ marginBottom:20 }}>
        <h1 className="page-title">Central IA</h1>
        <p className="page-desc">Especialista em conteúdo digital — pergunte qualquer coisa</p>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>
        {/* Chat area */}
        <div className="card" style={{ flex:1, overflowY:'auto', padding:'20px 24px', marginBottom:12, display:'flex', flexDirection:'column', gap:16 }}>
          {messages.length === 0 && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:48, marginBottom:8 }}>🤖</div>
                <div style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:4 }}>Como posso ajudar hoje?</div>
                <div style={{ fontSize:13, color:'var(--text-2)' }}>Especialista em conteúdo digital, estratégias e crescimento</div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, width:'100%', maxWidth:500 }}>
                {SUGESTOES.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    padding:'10px 12px', borderRadius:10, fontSize:12, fontWeight:500,
                    background:'var(--bg-subtle)', border:'1px solid var(--border)',
                    color:'var(--text-2)', textAlign:'left', lineHeight:1.4,
                    transition:'all 0.15s', cursor:'pointer',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='var(--brand)'; (e.currentTarget as HTMLButtonElement).style.color='var(--brand)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='var(--border)'; (e.currentTarget as HTMLButtonElement).style.color='var(--text-2)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start',
              flexDirection: m.role==='user' ? 'row-reverse' : 'row' }}>
              <div style={{
                width:32, height:32, borderRadius:8, flexShrink:0,
                background: m.role==='user' ? 'var(--brand)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:14, color:'#fff', fontWeight:600,
              }}>
                {m.role==='user' ? 'V' : '✦'}
              </div>
              <div style={{
                background: m.role==='user' ? 'var(--brand)' : 'var(--bg-subtle)',
                color: m.role==='user' ? '#fff' : 'var(--text)',
                borderRadius:12, padding:'10px 14px',
                maxWidth:'75%', fontSize:13, lineHeight:1.7,
                border: m.role==='assistant' ? '1px solid var(--border)' : 'none',
              }}>
                {renderContent(m.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:600 }}>✦</div>
              <div style={{ background:'var(--bg-subtle)', border:'1px solid var(--border)', borderRadius:12, padding:'12px 16px' }}>
                <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                  {[0,1,2].map(d => (
                    <div key={d} style={{
                      width:6, height:6, borderRadius:'50%', background:'var(--text-3)',
                      animation:`dot 1.2s ease-in-out ${d*0.2}s infinite`,
                    }}/>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div className="card" style={{ padding:'10px 14px', display:'flex', gap:8, alignItems:'flex-end' }}>
          <textarea value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()} }}
            placeholder="Pergunte sobre conteúdo, estratégias, crescimento..."
            rows={1}
            style={{
              flex:1, border:'none', background:'transparent', resize:'none',
              fontSize:13, color:'var(--text)', outline:'none', padding:'6px 0',
              minHeight:36, maxHeight:120,
              boxShadow:'none',
            }}
          />
          <button className="btn btn-primary" onClick={()=>send()} disabled={!input.trim()||loading}
            style={{ opacity:(!input.trim()||loading)?0.5:1, padding:'8px 16px', flexShrink:0 }}>
            {loading ? '...' : '↑ Enviar'}
          </button>
        </div>

        <p style={{ fontSize:11, color:'var(--text-3)', textAlign:'center', marginTop:8 }}>
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>

      <style>{`
        @keyframes dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

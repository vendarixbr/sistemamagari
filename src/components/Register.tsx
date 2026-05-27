import { useState } from 'react'

interface Props {
  onLogin: (user: { name: string; email: string }) => void
  onGoLogin: () => void
}

const PLANS = [
  { id:'solo', label:'Solo', desc:'1 usuário · até 5 clientes', price:'R$ 49/mês' },
  { id:'pro',  label:'Pro',  desc:'Até 3 usuários · clientes ilimitados', price:'R$ 129/mês', highlight: true },
  { id:'agency', label:'Agência', desc:'Usuários ilimitados · white-label', price:'R$ 299/mês' },
]

export default function Register({ onLogin, onGoLogin }: Props) {
  const [step, setStep] = useState<1|2>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [plan, setPlan] = useState('pro')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  function nextStep(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Informe seu nome.'); return }
    if (!email.includes('@')) { setError('E-mail inválido.'); return }
    if (password.length < 6) { setError('Senha deve ter ao menos 6 caracteres.'); return }
    if (password !== confirm) { setError('As senhas não coincidem.'); return }

    const raw = localStorage.getItem('creatorhub_users')
    const users: { name: string; email: string; password: string }[] = raw ? JSON.parse(raw) : []
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError('Este e-mail já está cadastrado.'); return
    }
    setStep(2)
  }

  function finish() {
    setLoading(true)
    setTimeout(() => {
      const raw = localStorage.getItem('creatorhub_users')
      const users: { name: string; email: string; password: string }[] = raw ? JSON.parse(raw) : []
      users.push({ name: name.trim(), email: email.toLowerCase(), password })
      localStorage.setItem('creatorhub_users', JSON.stringify(users))
      localStorage.setItem('creatorhub_session', JSON.stringify({ name: name.trim(), email: email.toLowerCase() }))
      onLogin({ name: name.trim(), email: email.toLowerCase() })
      setLoading(false)
    }, 700)
  }

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'var(--bg)',
      backgroundImage:'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 70%)',
    }}>
      <div style={{ position:'fixed', top:'20%', right:'5%', width:350, height:350, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(224,53,53,0.05) 0%, transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'15%', left:'4%', width:450, height:450, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth: step===2 ? 560 : 440, padding:'0 24px', position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:32 }}>
          <div style={{
            width:50, height:50, borderRadius:14,
            background:'var(--grad-brand)',
            boxShadow:'0 8px 32px rgba(200,31,31,0.5)',
            display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <div style={{ fontSize:21, fontWeight:800, color:'var(--text)', letterSpacing:'-0.04em' }}>Criar conta</div>
          <div style={{ fontSize:13, color:'var(--text-2)', marginTop:3 }}>
            {step===1 ? 'Seus dados de acesso' : 'Escolha seu plano'}
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display:'flex', gap:6, justifyContent:'center', marginBottom:24 }}>
          {[1,2].map(s => (
            <div key={s} style={{
              height:3, borderRadius:99,
              width: s===step ? 32 : 16,
              background: s<=step ? 'var(--brand)' : 'var(--border)',
              boxShadow: s===step ? '0 0 8px var(--brand)' : 'none',
              transition:'all 0.25s',
            }}/>
          ))}
        </div>

        <div className="card" style={{ padding:'28px 26px' }}>
          {step === 1 ? (
            <form onSubmit={nextStep} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label>Nome completo</label>
                <div style={{ position:'relative' }}>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)}
                    placeholder="Seu nome" autoComplete="name" style={{ paddingLeft:38 }}/>
                  <svg style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', opacity:0.4 }}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              </div>
              <div>
                <label>E-mail</label>
                <div style={{ position:'relative' }}>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                    placeholder="seu@email.com" autoComplete="email" style={{ paddingLeft:38 }}/>
                  <svg style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', opacity:0.4 }}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
              </div>
              <div>
                <label>Senha</label>
                <div style={{ position:'relative' }}>
                  <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres" autoComplete="new-password" style={{ paddingLeft:38, paddingRight:40 }}/>
                  <svg style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', opacity:0.4 }}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <button type="button" onClick={()=>setShowPass(p=>!p)} style={{
                    position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                    color:'var(--text-3)', display:'flex', padding:4,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPass
                        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                      }
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label>Confirmar senha</label>
                <div style={{ position:'relative' }}>
                  <input type={showPass?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)}
                    placeholder="Repita a senha" autoComplete="new-password" style={{ paddingLeft:38 }}/>
                  <svg style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', opacity:0.4 }}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
              </div>

              {error && (
                <div style={{
                  background:'var(--red-bg)', border:'1px solid rgba(248,113,113,0.2)',
                  borderRadius:10, padding:'9px 12px',
                  color:'var(--red)', fontSize:12, display:'flex', alignItems:'center', gap:8,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary"
                style={{ width:'100%', justifyContent:'center', padding:'11px 20px', fontSize:14, marginTop:4 }}>
                Continuar →
              </button>
            </form>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {PLANS.map(p => (
                  <button key={p.id} onClick={()=>setPlan(p.id)} style={{
                    padding:'14px 16px', borderRadius:12, textAlign:'left',
                    border:`1px solid ${plan===p.id ? 'var(--brand)' : 'var(--border)'}`,
                    background: plan===p.id
                      ? 'rgba(224,53,53,0.08)'
                      : p.highlight ? 'rgba(255,255,255,0.02)' : 'transparent',
                    boxShadow: plan===p.id ? '0 0 20px rgba(224,53,53,0.1)' : 'none',
                    transition:'all 0.15s', cursor:'pointer', position:'relative',
                  }}>
                    {p.highlight && (
                      <span style={{
                        position:'absolute', top:-9, right:12,
                        background:'var(--grad-brand)',
                        color:'#fff', fontSize:10, fontWeight:700,
                        padding:'2px 10px', borderRadius:99,
                        boxShadow:'0 2px 10px rgba(200,31,31,0.4)',
                      }}>Popular</span>
                    )}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{p.label}</div>
                        <div style={{ fontSize:12, color:'var(--text-2)', marginTop:2 }}>{p.desc}</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ fontSize:13, fontWeight:600, color: plan===p.id ? 'var(--brand-2)' : 'var(--text-2)' }}>{p.price}</div>
                        <div style={{
                          width:18, height:18, borderRadius:'50%', flexShrink:0,
                          border:`2px solid ${plan===p.id ? 'var(--brand)' : 'var(--border)'}`,
                          background: plan===p.id ? 'var(--brand)' : 'transparent',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          {plan===p.id && <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }}/>}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div style={{
                background:'var(--bg-subtle)', border:'1px solid var(--border)',
                borderRadius:10, padding:'10px 14px',
                display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--text-2)',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                14 dias grátis · sem cartão · cancele quando quiser
              </div>

              <div style={{ display:'flex', gap:10 }}>
                <button onClick={()=>{setStep(1);setError('')}} className="btn btn-secondary"
                  style={{ flex:1, justifyContent:'center', padding:'11px' }}>
                  ← Voltar
                </button>
                <button onClick={finish} className="btn btn-primary" disabled={loading}
                  style={{ flex:2, justifyContent:'center', padding:'11px', opacity:loading?0.7:1 }}>
                  {loading
                    ? <><span style={{ display:'inline-block', width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/> Criando conta...</>
                    : 'Criar minha conta'
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign:'center', fontSize:13, color:'var(--text-2)', marginTop:18 }}>
          Já tem conta?{' '}
          <button onClick={onGoLogin} style={{ color:'var(--brand-2)', fontWeight:600, fontSize:13 }}>
            Entrar
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

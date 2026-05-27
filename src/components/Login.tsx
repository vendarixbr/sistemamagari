import { useState } from 'react'

interface Props {
  onLogin: (user: { name: string; email: string }) => void
  onGoRegister: () => void
}

export default function Login({ onLogin, onGoRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Preencha todos os campos.'); return }

    setLoading(true)
    setTimeout(() => {
      const raw = localStorage.getItem('creatorhub_users')
      const users: { name: string; email: string; password: string }[] = raw ? JSON.parse(raw) : []
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
      if (found) {
        localStorage.setItem('creatorhub_session', JSON.stringify({ name: found.name, email: found.email }))
        onLogin({ name: found.name, email: found.email })
      } else {
        setError('E-mail ou senha incorretos.')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(224,53,53,0.18) 0%, transparent 70%)',
    }}>
      {/* Decorative orbs */}
      <div style={{ position:'fixed', top:'15%', left:'8%', width:400, height:400, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(224,53,53,0.06) 0%, transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'10%', right:'6%', width:500, height:500, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px', position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:36 }}>
          <div style={{
            width:52, height:52, borderRadius:15,
            background:'var(--grad-brand)',
            boxShadow:'0 8px 32px rgba(200,31,31,0.5)',
            display:'flex', alignItems:'center', justifyContent:'center',
            marginBottom:14,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:'var(--text)', letterSpacing:'-0.04em' }}>CreatorHub</div>
          <div style={{ fontSize:13, color:'var(--text-2)', marginTop:4 }}>Bem-vindo de volta</div>
        </div>

        {/* Card */}
        <div className="card" style={{ padding:'32px 28px' }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label>E-mail</label>
              <div style={{ position:'relative' }}>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="seu@email.com" autoComplete="email"
                  style={{ paddingLeft:38 }}
                />
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
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  style={{ paddingLeft:38, paddingRight:40 }}
                />
                <svg style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', opacity:0.4 }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <button type="button" onClick={()=>setShowPass(p=>!p)} style={{
                  position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                  color:'var(--text-3)', display:'flex', padding:4,
                }}>
                  {showPass
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
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

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width:'100%', justifyContent:'center', padding:'11px 20px', fontSize:14, marginTop:4, opacity:loading?0.7:1 }}>
              {loading
                ? <><span style={{ display:'inline-block', width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/> Entrando...</>
                : 'Entrar'
              }
            </button>
          </form>

          <div style={{ marginTop:20, textAlign:'center', fontSize:13, color:'var(--text-2)' }}>
            Não tem conta?{' '}
            <button onClick={onGoRegister} style={{ color:'var(--brand-2)', fontWeight:600, fontSize:13 }}>
              Criar agora
            </button>
          </div>
        </div>

        <p style={{ textAlign:'center', fontSize:11, color:'var(--text-3)', marginTop:20 }}>
          CreatorHub © 2025 — Workspace para creators
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

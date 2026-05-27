import { useState } from 'react'

interface Prompt {
  id: number; titulo: string; descricao: string
  categoria: string; conteudo: string
}

const CATS = ['Todos','Stories','Reels','YouTube','Podcast','Legendas','Copy','Hashtags','Roteiro','Estratégia']

const CAT_COLOR: Record<string,string> = {
  Stories:'var(--blue)', Reels:'var(--red)', YouTube:'var(--red)',
  Podcast:'var(--purple)', Roteiro:'var(--purple)',
  Legendas:'var(--green)', Copy:'var(--amber)', Hashtags:'var(--blue)', Estratégia:'var(--cyan,#22d3ee)',
}

const INIT_PROMPTS: Prompt[] = [
  { id:1, categoria:'Stories', titulo:'Hook de stories que para o scroll',
    descricao:'Abre o stories com uma provocação irresistível',
    conteudo:`Crie 5 hooks para stories que parem o scroll imediatamente.\nContexto: [NICHO/MARCA]\nObjetivo: [O QUE VENDER/COMUNICAR]\n\nOs hooks devem:\n- Gerar curiosidade nos primeiros 2 segundos\n- Ter no máximo 10 palavras\n- Usar gatilhos como: surpresa, segredo revelado, contra-intuitivo ou polêmico\n- Ser diretos e conversacionais\n\nFormato: cada hook em uma linha, numerado.` },
  { id:2, categoria:'Stories', titulo:'Sequência de stories de venda',
    descricao:'Estrutura completa de stories para converter seguidores',
    conteudo:`Crie uma sequência de 7 stories para vender [PRODUTO/SERVIÇO].\nPúblico: [DESCREVA O AVATAR]\nPreço: [VALOR]\nDor principal: [PROBLEMA QUE RESOLVE]\n\nEstrutura esperada:\n1. Hook de parada de scroll\n2. Identificação da dor\n3. Agitação do problema\n4. Apresentação da solução\n5. Prova social (depoimento/resultado)\n6. Quebra de objeção\n7. CTA com urgência` },
  { id:3, categoria:'Reels', titulo:'Roteiro de reel educativo viral',
    descricao:'Estrutura de reel que ensina e gera salvamentos',
    conteudo:`Crie um roteiro de reel educativo de 30-60 segundos sobre [TEMA].\nNicho: [NICHO]\nPúblico: [AVATAR]\n\nEstrutura:\n- Segundos 0-3: hook falado + visual impactante\n- Segundos 4-15: problema ou pergunta que gera identificação\n- Segundos 16-40: entrega de valor (3 pontos rápidos)\n- Segundos 41-55: CTA para salvar/comentar\n\nInclua: texto do narrador, sugestões de corte, texto na tela e sugestão de trilha.` },
  { id:4, categoria:'Reels', titulo:'Reel de bastidores que humaniza',
    descricao:'Roteiro para mostrar o processo criativo e gerar conexão',
    conteudo:`Crie um roteiro de reel de bastidores para [MARCA/CREATOR].\nTipo de trabalho: [O QUE FAZ]\nTom: autêntico, humanizado, sem filtros\n\nEstrutura:\n1. Abertura com frase do dia a dia do trabalho\n2. 3-4 cenas de bastidores mostrando o processo\n3. Momento de dificuldade real (gera conexão)\n4. Resultado final revelado\n5. Frase de encerramento reflexiva` },
  { id:5, categoria:'YouTube', titulo:'Roteiro de vídeo com alta retenção',
    descricao:'Estrutura completa para vídeos de 8-15 minutos',
    conteudo:`Crie um roteiro para vídeo YouTube sobre [TEMA] com duração de [X] minutos.\nCanal: [NOME DO CANAL]\nPúblico: [DESCREVA QUEM ASSISTE]\nObjetivo: [INFORMAR/VENDER/ENGAJAR]\n\nInclua:\n- Gancho nos primeiros 30 segundos\n- Mini-sumário\n- 3-5 blocos de conteúdo com transições\n- Pattern interrupts a cada 2-3 minutos\n- CTA mid-roll e end-roll\n- Sugestão de thumbnail e título` },
  { id:6, categoria:'YouTube', titulo:'Descrição SEO para vídeo',
    descricao:'Descrição completa com palavras-chave e CTAs',
    conteudo:`Escreva uma descrição completa para um vídeo YouTube sobre [TEMA].\nPalavra-chave principal: [KEYWORD]\nPalavras secundárias: [KEYWORD 2, KEYWORD 3]\n\nA descrição deve ter:\n- Parágrafo de abertura (150 caracteres) com keyword principal\n- Resumo do conteúdo em bullets\n- Timestamps (crie 5-7 marcações de tempo)\n- Links úteis mencionados no vídeo\n- CTA para inscrição e playlist relacionada\n- Hashtags (3-5 relevantes)` },
  { id:7, categoria:'Legendas', titulo:'Legenda com storytelling',
    descricao:'Estrutura de legenda longa para posts de feed',
    conteudo:`Escreva uma legenda de storytelling para um post sobre [TEMA/MOMENTO].\nMarca/Creator: [NOME]\nTom: [TOM DE VOZ]\nCTA desejado: [AÇÃO QUE QUER]\n\nEstrutura:\n1. Primeira linha que para o scroll (sem emojis de abertura)\n2. Desenvolvimento em 3-4 parágrafos curtos\n3. Virada ou aprendizado\n4. Conexão com o seguidor\n5. Pergunta ou CTA para comentário\n\nMáximo 2200 caracteres.` },
  { id:8, categoria:'Legendas', titulo:'Legenda de lançamento de produto',
    descricao:'Copy persuasivo para anunciar novidade',
    conteudo:`Escreva 3 versões de legenda para lançamento de [PRODUTO/SERVIÇO].\nPúblico: [AVATAR]\nBenefício principal: [BENEFÍCIO]\nPreço: [VALOR]\n\nVersão 1: Emocional (storytelling)\nVersão 2: Racional (benefícios e features)\nVersão 3: Urgência (escassez/prazo)\n\nCada versão: hook, corpo e CTA. Máx 300 palavras cada.` },
  { id:9, categoria:'Copy', titulo:'Bio do Instagram que converte',
    descricao:'Reescreva a bio para atrair o público certo',
    conteudo:`Reescreva a bio do Instagram para [NOME/MARCA].\nO que faz: [SERVIÇO/PRODUTO]\nPara quem: [PÚBLICO-ALVO]\nResultado que entrega: [TRANSFORMAÇÃO]\n\nCrie 3 versões de bio (máx 150 caracteres cada):\n1. Focada em resultado\n2. Focada em identidade\n3. Focada em CTA` },
  { id:10, categoria:'Copy', titulo:'Pitch de venda no direct',
    descricao:'Mensagem de apresentação no DM sem parecer spam',
    conteudo:`Crie uma mensagem para enviar no direct para [TIPO DE PROSPECTO].\nServiço que oferece: [SEU SERVIÇO]\nDor que resolve: [PROBLEMA DO CLIENTE]\n\nA mensagem deve:\n- Começar com algo personalizado sobre o perfil deles\n- Apresentar uma observação, não um produto\n- Gerar curiosidade para continuar a conversa\n- Ter no máximo 5 linhas\n\nCrie 3 variações com abordagens diferentes.` },
  { id:11, categoria:'Hashtags', titulo:'Estratégia de hashtags por nicho',
    descricao:'Conjuntos equilibrados para alcance máximo',
    conteudo:`Crie uma estratégia de hashtags para posts de [NICHO].\nConta: [TAMANHO] com [X seguidores]\nTipo de post: [TIPO]\nObjetivo: [ALCANCE/ENGAJAMENTO/VENDAS]\n\nEntregue 3 conjuntos de 15-20 hashtags cada:\n1. Mix para alcance\n2. Foco em nicho\n3. Trending/evento` },
  { id:12, categoria:'Hashtags', titulo:'Hashtags para Reels viralizarem',
    descricao:'Tags específicas para aumentar o alcance de reels',
    conteudo:`Liste as melhores hashtags para um Reel sobre [TEMA] no nicho de [NICHO].\n\nOrganize em categorias:\n- 5 hashtags do nicho (alta conversão)\n- 5 hashtags do conteúdo (tema específico)\n- 5 hashtags de alcance (trending)\n- 3 hashtags da comunidade (engajamento)\n\nPara cada uma: por que usar e volume estimado.` },
  { id:13, categoria:'Roteiro', titulo:'Roteiro de podcast (entrevista)',
    descricao:'Estrutura completa para episódio com convidado',
    conteudo:`Crie um roteiro de episódio de podcast com entrevista sobre [TEMA].\nPodcast: [NOME]\nConvidado: [QUEM É, O QUE FAZ]\nDuração: [X minutos]\n\nEstrutura:\n1. Abertura e apresentação do podcast (30s)\n2. Apresentação do convidado com gancho (1min)\n3. 5-7 perguntas principais com follow-ups\n4. Pergunta polêmica/surpresa\n5. Takeaway final\n6. Encerramento com CTA` },
  { id:14, categoria:'Roteiro', titulo:'Script de apresentação de produto',
    descricao:'Roteiro para vídeo de demonstração/review',
    conteudo:`Crie um script de 3-5 minutos para apresentação de [PRODUTO/SERVIÇO].\nFormato: [VÍDEO CURTO/LONGO/STORIES]\nObjeção principal do cliente: [OBJEÇÃO]\n\nScript com:\n- Problema que o produto resolve (20s)\n- Apresentação visual (30s)\n- 3 benefícios demonstrados (90s)\n- Prova social (30s)\n- Comparação com alternativas (30s)\n- Preço e como comprar (30s)\n- CTA final urgente (20s)` },
  { id:15, categoria:'Estratégia', titulo:'Calendário editorial 30 dias',
    descricao:'Planejamento completo de conteúdo para um mês',
    conteudo:`Crie um calendário editorial de 30 dias para [PERFIL/MARCA].\nNicho: [NICHO]\nObjetivo do mês: [META]\nFrequência: [X posts/semana]\n\nOrganize por semanas com:\n- Tema da semana\n- Posts planejados (tipo, assunto, objetivo)\n- Dia e horário sugerido\n- Formato\n- Chamada para ação\n\nInclua datas importantes e sazonalidades.` },
  { id:16, categoria:'Estratégia', titulo:'Análise de concorrentes',
    descricao:'Framework para analisar e se diferenciar',
    conteudo:`Me ajude a analisar meu posicionamento em relação à concorrência.\nMeu nicho: [NICHO]\nMeu diferencial: [O QUE ME DIFERE]\nConcorrentes principais: [LISTE 3-5]\n\nAnalise:\n1. O que eles fazem bem\n2. Lacunas e oportunidades\n3. Tom de voz predominante no nicho\n4. Formatos mais engajados\n\nSugira: posicionamento único, 5 pilares de conteúdo, formato de destaque.` },
  { id:17, categoria:'Podcast', titulo:'Abertura de episódio que prende',
    descricao:'Script de intro com gancho para não pular',
    conteudo:`Crie uma abertura de 60-90 segundos para um episódio sobre [TEMA].\nPodcast: [NOME]\nEstilo: [EDUCATIVO/ENTREVISTA/SOLO]\n\nA abertura deve ter:\n- Teaser do melhor momento (10s)\n- Pergunta que gera curiosidade (15s)\n- Apresentação do tema de forma não óbvia (20s)\n- Por que esse episódio é diferente (20s)\n- Chamada para seguir/assinar (15s)\n\nEscreva em tom natural de fala.` },
  { id:18, categoria:'Stories', titulo:'Enquete estratégica que qualifica leads',
    descricao:'Sequência de enquetes para aumentar interação',
    conteudo:`Crie uma sequência de 5 stories com enquetes para [MARCA/CREATOR].\nObjetivo: [ENGAJAMENTO/PESQUISA/VENDA]\n\nPara cada story:\n- Pergunta/enquete\n- Opções de resposta (estratégicas)\n- O que fazer com quem responde cada opção\n- Como levar para o próximo story\n\nA sequência deve criar um fluxo que qualifica o lead sem parecer pesquisa.` },
  { id:19, categoria:'YouTube', titulo:'Título e thumbnail com alta CTR',
    descricao:'Fórmulas de títulos que geram cliques',
    conteudo:`Crie 10 opções de título para um vídeo sobre [TEMA].\nCanal: [NICHO DO CANAL]\nPalavra-chave principal: [KEYWORD]\n\nFórmulas a usar:\n- Curiosity gap: "Por que [X] nunca funcionou (até agora)"\n- Listicle: "X [itens] para [resultado]"\n- Contra-intuitivo: "Pare de fazer [X] se quiser [Y]"\n- Pessoal: "Eu [AÇÃO] por [TEMPO] e aqui está o resultado"\n- Polêmico: "A verdade sobre [TEMA]"\n\nPara cada título: conceito de thumbnail.` },
  { id:20, categoria:'Copy', titulo:'Reativação de leads frios',
    descricao:'Mensagem para reengajar contatos inativos',
    conteudo:`Crie uma sequência de 3 mensagens para reativar leads frios de [SERVIÇO].\nTempo que sumiram: [PERÍODO]\nMotivo provável: [HIPÓTESE]\n\nMensagem 1 (dia 1): Retomada sem pressão\nMensagem 2 (dia 4): Entrega de valor gratuito\nMensagem 3 (dia 8): Oferta com escassez real\n\nCada mensagem deve ter máx 100 palavras e parecer completamente humana.` },
  { id:21, categoria:'Estratégia', titulo:'Estratégia de lançamento de produto',
    descricao:'Planejamento de conteúdo pré e pós-lançamento',
    conteudo:`Crie uma estratégia de conteúdo para lançamento de [PRODUTO/SERVIÇO].\nData do lançamento: [DATA]\nPreço: [VALOR]\nPlataformas: [INSTAGRAM/YOUTUBE/ETC]\n\nFASE 1 - Aquecimento (14 dias antes):\n- Conteúdo para curiosidade e audiência\n\nFASE 2 - Lançamento (3-5 dias):\n- Sequência de posts dia a dia com urgência\n\nFASE 3 - Pós-lançamento (7 dias):\n- Prova social, upsell e retenção` },
  { id:22, categoria:'Reels', titulo:'Trend adaptada para o nicho',
    descricao:'Como adaptar áudios virais para qualquer segmento',
    conteudo:`Sugira como adaptar o trend [NOME DO TREND/ÁUDIO] para o nicho de [NICHO].\nMarca: [NOME]\nTom: [SÉRIO/ENGRAÇADO/INSPIRADOR]\n\nEntregue:\n1. Conceito criativo adaptado\n2. Roteiro em 5-7 cenas de 3-5 segundos\n3. Texto na tela por cena\n4. Sugestão de efeitos/transições\n5. Legenda (máx 150 chars + hashtags)` },
]

export default function Prompts() {
  const [allPrompts, setAllPrompts] = useState<Prompt[]>(INIT_PROMPTS)
  const [cat, setCat]       = useState('Todos')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<number|null>(null)
  const [selected, setSelected] = useState<Prompt|null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState({ titulo:'', categoria:'Stories', descricao:'', conteudo:'' })

  const filtered = allPrompts.filter(p =>
    (cat==='Todos' || p.categoria===cat) &&
    (p.titulo.toLowerCase().includes(search.toLowerCase()) ||
     p.descricao.toLowerCase().includes(search.toLowerCase()))
  )

  function copy(p: Prompt) {
    navigator.clipboard.writeText(p.conteudo)
    setCopied(p.id); setTimeout(()=>setCopied(null), 2000)
  }

  function saveNew() {
    if (!newForm.titulo.trim() || !newForm.conteudo.trim()) return
    setAllPrompts(prev => [...prev, { id: Date.now(), ...newForm }])
    setNewForm({ titulo:'', categoria:'Stories', descricao:'', conteudo:'' })
    setShowNew(false)
  }

  function catColor(c: string) { return CAT_COLOR[c] || 'var(--text-3)' }

  return (
    <div style={{ padding:'28px 32px' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{
            width:44, height:44, borderRadius:13,
            background:'linear-gradient(135deg,#c2780a,#fbbf24)',
            boxShadow:'0 4px 16px rgba(194,120,10,0.4)',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <h1 className="page-title">Biblioteca de Prompts</h1>
            <p className="page-desc">{allPrompts.length} prompts profissionais para creators</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowNew(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Salvar prompt
        </button>
      </div>

      {/* Search + filters */}
      <div style={{ display:'flex', gap:12, marginBottom:18, alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, maxWidth:320 }}>
          <svg style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', opacity:0.4, pointerEvents:'none' }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="search" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Buscar prompt..." style={{ paddingLeft:34 }} />
        </div>
        <span style={{ fontSize:12, color:'var(--text-3)' }}>{filtered.length} encontrados</span>
      </div>

      {/* Category tabs */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:22 }}>
        {CATS.map(c => (
          <button key={c} onClick={()=>setCat(c)} style={{
            padding:'5px 13px', borderRadius:99, fontSize:12, fontWeight:500, cursor:'pointer',
            background: cat===c ? 'var(--brand)' : 'var(--bg-card)',
            color: cat===c ? '#fff' : 'var(--text-2)',
            border:`1px solid ${cat===c ? 'var(--brand)' : 'var(--border)'}`,
            boxShadow: cat===c ? '0 0 12px rgba(224,53,53,0.3)' : 'none',
            transition:'all 0.12s',
          }}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:12 }}>
        {filtered.map(p => {
          const color = catColor(p.categoria)
          return (
            <div key={p.id} className="card" style={{
              padding:'18px 20px', cursor:'pointer', transition:'all 0.15s',
              display:'flex', flexDirection:'column',
            }}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.boxShadow='var(--shadow-sm)'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.boxShadow='var(--shadow-xs)'}
            onClick={()=>setSelected(p)}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{
                  fontSize:10, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase',
                  color, padding:'3px 8px', borderRadius:99, background:`${color}15`,
                  border:`1px solid ${color}22`,
                }}>{p.categoria}</span>
                <button onClick={e=>{e.stopPropagation();copy(p)}} style={{
                  display:'flex', alignItems:'center', gap:5,
                  fontSize:11, fontWeight:500, padding:'4px 10px', borderRadius:7, cursor:'pointer',
                  background: copied===p.id ? 'var(--green-bg)' : 'var(--bg-subtle)',
                  color: copied===p.id ? 'var(--green)' : 'var(--text-2)',
                  border:`1px solid ${copied===p.id ? 'var(--green)' : 'var(--border)'}`,
                  transition:'all 0.12s',
                }}>
                  {copied===p.id ? (
                    <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copiado</>
                  ) : (
                    <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copiar</>
                  )}
                </button>
              </div>

              <div style={{ fontWeight:600, fontSize:13.5, marginBottom:5, lineHeight:1.3 }}>{p.titulo}</div>
              <div style={{ fontSize:12, color:'var(--text-2)', lineHeight:1.5, flex:1 }}>{p.descricao}</div>

              <div style={{
                marginTop:12, padding:'8px 10px', borderRadius:8,
                background:'var(--bg-subtle)', border:'1px solid var(--border)',
                fontSize:11, color:'var(--text-3)', fontFamily:'monospace',
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              }}>
                {p.conteudo.slice(0,72)}…
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn:'1/-1' }}>
            <div className="card empty-state">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>Nenhum prompt encontrado{search ? ` para "${search}"` : ''}.</p>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',
          alignItems:'center',justifyContent:'center',zIndex:50,padding:24,backdropFilter:'blur(4px)' }}
          onClick={()=>setSelected(null)}>
          <div className="card" style={{ padding:28,width:'100%',maxWidth:580,maxHeight:'80vh',
            overflow:'hidden',display:'flex',flexDirection:'column' }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16 }}>
              <div>
                <span style={{ fontSize:10,fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase',
                  color:catColor(selected.categoria),padding:'3px 8px',borderRadius:99,
                  background:`${catColor(selected.categoria)}15`,marginBottom:8,display:'inline-block' }}>
                  {selected.categoria}
                </span>
                <h2 style={{ fontSize:16,fontWeight:700,marginTop:4 }}>{selected.titulo}</h2>
                <p style={{ fontSize:12,color:'var(--text-2)',marginTop:4 }}>{selected.descricao}</p>
              </div>
              <button onClick={()=>setSelected(null)} style={{ color:'var(--text-3)',fontSize:18,lineHeight:1,
                padding:'2px 6px',borderRadius:6,cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ flex:1,overflowY:'auto',background:'var(--bg-subtle)',borderRadius:10,
              padding:'16px 18px',fontSize:12.5,lineHeight:1.85,color:'var(--text)',
              whiteSpace:'pre-wrap',fontFamily:'monospace',border:'1px solid var(--border)' }}>
              {selected.conteudo}
            </div>
            <div style={{ display:'flex',gap:8,marginTop:16 }}>
              <button className="btn btn-primary" style={{ flex:1,justifyContent:'center' }} onClick={()=>copy(selected)}>
                {copied===selected.id ? (
                  <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copiado!</>
                ) : (
                  <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copiar prompt completo</>
                )}
              </button>
              <button className="btn btn-secondary" onClick={()=>setSelected(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Save new prompt modal */}
      {showNew && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',
          alignItems:'center',justifyContent:'center',zIndex:50,backdropFilter:'blur(4px)' }}
          onClick={()=>setShowNew(false)}>
          <div className="card" style={{ padding:28,width:480 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22 }}>
              <h2 style={{ fontSize:16,fontWeight:700 }}>Salvar prompt</h2>
              <button onClick={()=>setShowNew(false)} style={{ color:'var(--text-3)',fontSize:18,cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              <div><label>Título *</label>
                <input type="text" value={newForm.titulo} placeholder="Nome do prompt"
                  onChange={e=>setNewForm(p=>({...p,titulo:e.target.value}))} autoFocus/>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                <div><label>Categoria</label>
                  <select value={newForm.categoria} onChange={e=>setNewForm(p=>({...p,categoria:e.target.value}))}>
                    {CATS.filter(c=>c!=='Todos').map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label>Descrição</label>
                  <input type="text" value={newForm.descricao} placeholder="Breve descrição"
                    onChange={e=>setNewForm(p=>({...p,descricao:e.target.value}))}/>
                </div>
              </div>
              <div><label>Prompt *</label>
                <textarea rows={6} value={newForm.conteudo} placeholder="Cole ou escreva seu prompt aqui..."
                  onChange={e=>setNewForm(p=>({...p,conteudo:e.target.value}))}/>
              </div>
            </div>
            <div style={{ display:'flex',gap:8,marginTop:20,justifyContent:'flex-end' }}>
              <button className="btn btn-secondary" onClick={()=>setShowNew(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={saveNew}
                disabled={!newForm.titulo.trim()||!newForm.conteudo.trim()}>Salvar prompt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

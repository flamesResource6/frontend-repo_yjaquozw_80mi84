import React, { useState } from 'react'
import Spline from '@splinetool/react-spline'
import VoiceOrchestrator from './components/VoiceOrchestrator'
import { Login, Signup } from './components/Auth'
import History from './components/History'

function Waveform({ active }) {
  return (
    <div className="flex items-end gap-1 h-12 mt-4" aria-hidden>
      {[...Array(24)].map((_, i) => (
        <div key={i} className="w-1 bg-yellow-400 rounded" style={{ height: active ? `${6 + (Math.sin((Date.now()/200)+(i*0.5))*10 + 10)}px` : '6px', transition: 'height 120ms linear' }} />
      ))}
    </div>
  )
}

function PokemonCard({ result }) {
  if (!result) return null
  return (
    <div className="relative bg-white rounded-3xl shadow-xl p-6 border-4" style={{ borderColor: '#3B4CCA' }}>
      <div className="absolute -top-5 -left-5 w-16 h-16 rounded-full border-4" style={{ background:'#FFCB05', borderColor:'#3B4CCA' }} />
      <div className="text-slate-900">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-extrabold" style={{color:'#3B4CCA'}}>{result.card_name}</h3>
          <span className="text-sm px-2 py-1 rounded-full" style={{background:'#FFCB05', color:'#3B4CCA'}}>UK</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-slate-500 text-sm">Last sold (GBP)</p>
            <p className="text-xl font-bold">{result.last_sold_price ? `£${result.last_sold_price}` : '—'}</p>
            <p className="text-xs text-slate-500">{result.last_sold_date || ''}</p>
          </div>
          <div>
            <p className="text-slate-500 text-sm">Median (10)</p>
            <p className="text-xl font-bold">{result.median_sold_price ? `£${result.median_sold_price}` : '—'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-sm">Average (10)</p>
            <p className="text-xl font-bold">{result.average_sold_price ? `£${result.average_sold_price}` : '—'}</p>
          </div>
          <div>
            <p className="text-slate-500 text-sm">Confidence</p>
            <p className="text-xl font-bold capitalize">{result.confidence_score}</p>
          </div>
        </div>
        {result.top_listing_url && (
          <a className="mt-4 inline-block text-blue-600 underline" href={result.top_listing_url} target="_blank" rel="noreferrer">Top listing</a>
        )}
      </div>
    </div>
  )
}

function MicButton({ onClick, active }) {
  return (
    <button onClick={onClick} className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-transform ${active ? 'scale-95' : 'scale-100'}`} aria-label="Tap to talk" style={{ background: '#EE1515' }}>
      <div className="absolute inset-0 rounded-full" style={{ boxShadow: active ? '0 0 0 12px rgba(238,21,21,0.3)' : '0 0 0 8px rgba(255,203,5,0.4)'}}></div>
      <div className="w-10 h-10 bg-white rounded-full border-4" style={{ borderColor:'#3B4CCA' }}></div>
      <div className="absolute w-20 h-20 rounded-full border-8" style={{ borderColor:'#3B4CCA' }}></div>
    </button>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [active, setActive] = useState(true) // auto-start
  const [result, setResult] = useState(null)

  return (
    <div className="min-h-screen relative overflow-hidden" style={{background:'#0b1020'}}>
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{backgroundImage:'radial-gradient(circle at 20% 20%, rgba(59,76,202,0.25), transparent 40%), radial-gradient(circle at 80% 30%, rgba(255,203,5,0.2), transparent 40%), radial-gradient(circle at 50% 80%, rgba(238,21,21,0.18), transparent 40%)'}}></div>

      <header className="relative z-10 text-center pt-8">
        <h1 className="text-5xl font-black tracking-tight" style={{color:'#FFCB05'}}>PokéValue UK</h1>
        <p className="mt-2 text-white/80">Real-time voice assistant for UK Pokémon card prices</p>
      </header>

      <section className="relative z-0 h-[380px] w-full mt-6">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1020]/30 to-[#0b1020] pointer-events-none"></div>
      </section>

      <main className="relative z-10 flex flex-col items-center px-6 pb-20">
        <div className="flex flex-col md:flex-row gap-6 items-start w-full max-w-5xl">
          <div className="flex-1 flex flex-col items-center">
            <MicButton onClick={()=>setActive(v=>!v)} active={active} />
            <Waveform active={active} />
            <div className="mt-6 w-full max-w-xl">
              <PokemonCard result={result} />
            </div>
            <p className="mt-4 text-white/70 text-sm">Ask: “How much is Charizard VMAX PSA 10 worth?”</p>
          </div>
          <div className="w-full md:w-[340px] space-y-4">
            {!user && (
              <>
                <Login onAuthed={setUser} />
                <Signup onAuthed={setUser} />
              </>
            )}
            {user && <History user={user} />}
          </div>
        </div>
        {/* Orchestrator handles voice session and API bridge via DataChannel */}
        <VoiceOrchestrator setResult={setResult} user={user} />
      </main>

      <footer className="relative z-10 text-center text-white/60 pb-6">
        Source: eBay UK sold listings via Perplexity • Voice by ChatGPT Realtime
      </footer>
    </div>
  )
}

import React, { useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Test(){
  const [card, setCard] = useState('Charizard VMAX PSA 10')
  const [res, setRes] = useState(null)

  const run = async ()=>{
    const r = await fetch(`${BACKEND_URL}/api/price`,{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ card })
    })
    const j = await r.json()
    setRes(j)
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-6">API Test</h1>
      <div className="space-x-2">
        <input className="px-3 py-2 rounded bg-white/10" value={card} onChange={e=>setCard(e.target.value)} />
        <button className="px-3 py-2 rounded bg-blue-600" onClick={run}>Fetch</button>
      </div>
      <pre className="mt-6 text-xs bg-black/40 p-4 rounded">{JSON.stringify(res,null,2)}</pre>
    </div>
  )
}

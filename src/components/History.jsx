import React, { useEffect, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function History({ user }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function run(){
      setLoading(true)
      try {
        const res = await fetch(`${BACKEND_URL}/api/history?user_id=${encodeURIComponent(user?.id||'')}`)
        if (res.ok){
          const json = await res.json()
          setItems(json)
        }
      } catch(e){
        console.error(e)
      } finally { setLoading(false) }
    }
    if (user) run()
  },[user])

  if (!user) return null

  return (
    <div className="mt-10 w-full max-w-3xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-white font-semibold text-lg">My Searches</h3>
      {loading && <p className="text-white/60 text-sm mt-2">Loading…</p>}
      <div className="mt-3 space-y-2">
        {items.map((it, idx)=> (
          <div key={idx} className="grid grid-cols-5 gap-3 text-white/90 text-sm">
            <div className="col-span-2 truncate">{it.card_name}</div>
            <div>£{it.last_sold_price ?? '—'}</div>
            <div>£{it.median ?? '—'}</div>
            <div>£{it.average ?? '—'}</div>
          </div>
        ))}
        {!items.length && !loading && <p className="text-white/60 text-sm">No searches yet.</p>}
      </div>
    </div>
  )
}

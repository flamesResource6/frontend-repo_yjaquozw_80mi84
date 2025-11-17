import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_PUBLIC_KEY || 'YOUR_SUPABASE_KEY'
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY)

export function Login({ onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      onAuthed(data.session?.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white/10 border border-white/10 rounded-2xl p-6 w-full max-w-sm">
      <h3 className="text-white text-xl font-semibold mb-4">Log in</h3>
      <input className="w-full mb-3 px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full mb-3 px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <button disabled={loading} className="w-full py-2 rounded font-semibold" style={{background:'#FFCB05', color:'#3B4CCA'}}>{loading ? 'Signing in…' : 'Sign In'}</button>
    </form>
  )
}

export function Signup({ onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      onAuthed(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white/10 border border-white/10 rounded-2xl p-6 w-full max-w-sm">
      <h3 className="text-white text-xl font-semibold mb-4">Sign up</h3>
      <input className="w-full mb-3 px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full mb-3 px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/40" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <button disabled={loading} className="w-full py-2 rounded font-semibold" style={{background:'#EE1515', color:'#FFFFFF'}}>{loading ? 'Creating…' : 'Create Account'}</button>
    </form>
  )
}

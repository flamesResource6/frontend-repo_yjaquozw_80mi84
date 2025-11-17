import React, { useEffect, useRef } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function VoiceOrchestrator({ setResult, user }){
  const pcRef = useRef(null)
  const dcRef = useRef(null)

  useEffect(()=>{
    // Auto-start voice on mount for a seamless experience
    (async ()=>{
      try {
        const tokenRes = await fetch(`${BACKEND_URL}/api/realtime/token`)
        if (!tokenRes.ok) throw new Error('Voice token error')
        const data = await tokenRes.json()

        const pc = new RTCPeerConnection()
        pcRef.current = pc

        const audioEl = document.createElement('audio')
        audioEl.autoplay = true
        pc.ontrack = (e)=>{ audioEl.srcObject = e.streams[0] }

        const ms = await navigator.mediaDevices.getUserMedia({ audio: true })
        ms.getTracks().forEach(t => pc.addTrack(t, ms))

        const dc = pc.createDataChannel('oai-events')
        dcRef.current = dc
        dc.onopen = ()=>{
          // Provide quick hello to model
          dc.send(JSON.stringify({ type:'hello', user:"web" }))
        }
        dc.onmessage = async (evt)=>{
          try {
            const msg = JSON.parse(evt.data)
            if (msg.type === 'price_query' && msg.card){
              const res = await fetch(`${BACKEND_URL}/api/price`,{
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ card: msg.card, user_id: user?.id || null })
              })
              const payload = await res.json()
              setResult(payload)
              // Send back to model so it can speak
              dc.send(JSON.stringify({ type:'price_result', payload }))
            }
          } catch {}
        }

        const baseUrl = 'https://api.openai.com/v1/realtime'
        const url = `${baseUrl}?model=${encodeURIComponent(data.model || 'gpt-4o-realtime-preview-2024-12-17')}`
        const offer = await pc.createOffer({ offerToReceiveAudio: true })
        await pc.setLocalDescription(offer)
        const sdpResponse = await fetch(url, {
          method: 'POST', headers: { Authorization: `Bearer ${data.client_secret?.value}`, 'Content-Type': 'application/sdp' }, body: offer.sdp
        })
        const answer = await sdpResponse.text()
        await pc.setRemoteDescription({ type: 'answer', sdp: answer })

      } catch (e) {
        console.error('Voice start error', e)
      }
    })()

    return ()=>{ try { pcRef.current?.close() } catch {} }
  }, [user])

  return null
}

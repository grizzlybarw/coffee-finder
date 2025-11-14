'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AddShopPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const defaultCity = sp.get('city') || ''

  const [form, setForm] = useState({ name: '', address: '', city: defaultCity, rating_avg: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'pick-a-strong-string' // replaced below
        },
        body: JSON.stringify({
          name: form.name.trim(),
          address: form.address.trim() || null,
          city: form.city.trim() || null,
          rating_avg: form.rating_avg ? Number(form.rating_avg) : null
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      router.push(`/shops/${json.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Add a coffee shop</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Name *</span>
          <input className="w-full border rounded px-3 py-2" required
            value={form.name} onChange={e=>setForm(f=>({ ...f, name: e.target.value }))}/>
        </label>
        <label className="block">
          <span className="text-sm">Address</span>
          <input className="w-full border rounded px-3 py-2"
            value={form.address} onChange={e=>setForm(f=>({ ...f, address: e.target.value }))}/>
        </label>
        <label className="block">
          <span className="text-sm">City</span>
          <input className="w-full border rounded px-3 py-2" placeholder="San Diego"
            value={form.city} onChange={e=>setForm(f=>({ ...f, city: e.target.value }))}/>
        </label>
        <label className="block">
          <span className="text-sm">Rating (0–5)</span>
          <input className="w-full border rounded px-3 py-2" type="number" min="0" max="5" step="0.1"
            value={form.rating_avg} onChange={e=>setForm(f=>({ ...f, rating_avg: e.target.value }))}/>
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">
          {loading ? 'Saving…' : 'Save'}
        </button>
      </form>
    </main>
  )
}

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: Request) {
  // simple auth: send x-admin-token header that matches env var
  const token = req.headers.get('x-admin-token')
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, address, city, rating_avg } = await req.json()

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'name required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('shops')
    .insert([{ name, address: address || null, city: city || null, rating_avg: rating_avg ?? null }])
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // ensure a vibes row exists
  await supabaseAdmin.from('vibes').insert({
    shop_id: data.id,
    tags: [],
    summary: '',
    last_refreshed_at: new Date().toISOString()
  })

  return NextResponse.json({ ok: true, id: data.id })
}

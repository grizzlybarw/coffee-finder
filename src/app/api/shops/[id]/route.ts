import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, address, city, rating_avg } = body ?? {}

  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('shops')
    .insert([{ name, address, city, rating_avg }])
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // create an empty vibes row so detail page has something
  await supabaseAdmin.from('vibes').insert({
    shop_id: data.id,
    tags: [],
    summary: '',
    last_refreshed_at: new Date().toISOString()
  })

  return NextResponse.json({ ok: true, id: data.id })
}

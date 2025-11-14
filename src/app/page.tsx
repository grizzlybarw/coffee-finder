// src/app/page.tsx
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type SearchParams = Promise<{ city?: string }>

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { city } = await searchParams

  let query = supabase.from('shops')
    .select('id, name, address, city, rating_avg')
    .order('rating_avg', { ascending: false })
    .limit(40)

  if (city) query = query.eq('city', city)

  const { data: shops, error } = await query
  if (error) console.error(error)

  const cities = Array.from(new Set((shops ?? []).map(s => s.city).filter(Boolean) as string[]))

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Find great coffee near you</h1>

      {/* tiny city filter */}
      <form method="GET" className="flex items-center gap-2">
  <label className="text-sm" htmlFor="city">City</label>
  <select
    id="city"
    name="city"
    defaultValue={city ?? ''}
    className="border rounded px-2 py-1 text-sm"
  >
    <option value="">All</option>
    {(['San Diego','Los Angeles','Seattle'] as string[])
      .concat(cities)
      .filter((v,i,a)=>a.indexOf(v)===i)
      .map(c => <option key={c} value={c}>{c}</option>)}
  </select>
  <button type="submit" className="border rounded px-3 py-1 text-sm">Apply</button>
</form>

      {(!shops || shops.length === 0) && (
        <div className="text-gray-600">
          No shops yet{city ? ` in ${city}` : ''}. Add some below.
        </div>
      )}

      <ul className="divide-y">
        {shops?.map((s) => (
          <li key={s.id} className="py-3">
            <Link href={`/shops/${s.id}`} className="font-medium hover:underline">
              {s.name}
            </Link>
            <div className="text-sm text-gray-600">
              {s.address} {s.city ? `• ${s.city}` : ''}
            </div>
            {s.rating_avg != null && (
              <div className="text-sm">Rating: {Number(s.rating_avg).toFixed(1)}</div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}

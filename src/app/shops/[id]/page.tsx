// src/app/shops/[id]/page.tsx
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default async function ShopPage({
  params,
}: {
  // 👇 params is now a Promise; unwrap it
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: shop, error: shopErr } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (shopErr || !shop) {
    return (
      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <Link href="/" className="text-blue-600 hover:underline">← Back</Link>
        <p>Shop not found.</p>
        {shopErr && (
          <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(shopErr, null, 2)}
          </pre>
        )}
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">← Back</Link>
      <h1 className="text-3xl font-bold">{shop.name}</h1>
      <div className="text-gray-600">
        {shop.address} {shop.city ? `• ${shop.city}` : ''}
      </div>
      {shop.rating_avg != null && <p>Rating: {Number(shop.rating_avg).toFixed(1)}</p>}
    </main>
  )
}

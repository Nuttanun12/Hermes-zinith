import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = parseInt(searchParams.get('page') || '0')
  const limit = parseInt(searchParams.get('limit') || '12')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || 'all'
  const lang = searchParams.get('lang') || 'en'

  const from = page * limit
  const to = from + limit - 1

  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  // Apply category filter
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  // Apply search filter — search across localized title and description
  if (search) {
    const searchLower = `%${search}%`
    const titleField = `title_${lang}`
    const descField = `description_${lang}`

    query = query.or(
      `title_en.ilike.${searchLower},title_th.ilike.${searchLower},title_zh.ilike.${searchLower},description_en.ilike.${searchLower},${titleField}.ilike.${searchLower},${descField}.ilike.${searchLower}`
    )
  }

  // Apply pagination
  query = query.range(from, to)

  const { data: products, error, count } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({
    products: products || [],
    totalCount: count || 0,
    hasMore: (count || 0) > from + limit,
    page,
  })
}

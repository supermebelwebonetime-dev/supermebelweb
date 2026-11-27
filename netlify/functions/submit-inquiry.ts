import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  })

const text = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export default async (req: Request, context: { ip?: string }) => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' })

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const salt = process.env.INQUIRY_SALT
  if (!url || !key || !salt) return json(500, { error: 'not_configured' })

  // Если задан SITE_URL, принимаем запросы только с него (защита от чужих форм).
  const site = process.env.SITE_URL?.replace(/\/$/, '')
  const origin = req.headers.get('origin')
  if (site && origin && origin !== site) return json(403, { error: 'forbidden_origin' })

  if (!(req.headers.get('content-type') ?? '').includes('application/json')) return json(415, { error: 'unsupported_type' })
  const raw = await req.text()
  if (raw.length > 8000) return json(413, { error: 'too_large' })

  let body: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json(400, { error: 'bad_json' })
    body = parsed as Record<string, unknown>
  } catch {
    return json(400, { error: 'bad_json' })
  }

  // Ловушка для ботов: человек это поле не видит и не заполняет.
  if (typeof body.website === 'string' && body.website.length > 0) return json(200, { ok: true })

  const name = text(body.name, 100)
  const phone = text(body.phone, 32)
  const description = text(body.description, 2000)
  const furnitureType = text(body.furnitureType, 60)
  const locale = body.locale === 'kk' ? 'kk' : 'ru'

  const digits = phone.replace(/\D/g, '')
  if (!name) return json(400, { error: 'name' })
  if (!/^\+?[0-9\s()\-]{7,32}$/.test(phone) || digits.length < 10 || digits.length > 15) return json(400, { error: 'phone' })
  if (furnitureType && !/^[a-z0-9-]{2,60}$/.test(furnitureType)) return json(400, { error: 'type' })

  const ip = context.ip ?? req.headers.get('x-nf-client-connection-ip') ?? 'unknown'
  const ipHash = createHash('sha256').update(`${salt}:${ip}`).digest('hex')

  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

  // Ограничение частоты: не больше 5 заявок в час и 20 в сутки с одного адреса.
  const count = async (sinceMs: number) => {
    const { count: n, error } = await db
      .from('inquiries')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', new Date(Date.now() - sinceMs).toISOString())
    if (error) throw error
    return n ?? 0
  }
  try {
    if ((await count(3600_000)) >= 5 || (await count(86_400_000)) >= 20) return json(429, { error: 'rate_limited' })
  } catch {
    return json(500, { error: 'server_error' })
  }

  // Если запрос пришёл с токеном вошедшего клиента, привязываем заявку к его аккаунту.
  let userId: string | null = null
  const auth = req.headers.get('authorization')
  if (auth?.startsWith('Bearer ')) {
    const { data } = await db.auth.getUser(auth.slice(7))
    userId = data.user?.id ?? null
  }

  const { error } = await db.from('inquiries').insert({
    user_id: userId,
    customer_name: name,
    phone,
    furniture_type: furnitureType || null,
    description,
    locale,
    ip_hash: ipHash,
    status: 'new'
  })
  if (error) return json(500, { error: 'server_error' })
  return json(200, { ok: true })
}

export const config = { path: '/api/inquiry' }

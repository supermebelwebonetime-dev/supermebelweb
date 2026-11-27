import { useEffect, useState } from 'react'
import { fallbackCategories, type Category } from '../data/fallbackCategories'
import { supabase } from './supabase'

export function useCategories() {
  const [items, setItems] = useState<Category[]>(fallbackCategories)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase
      .from('categories')
      .select('id, slug, name_ru, name_kk, description_ru, description_kk, image_path, sort_order')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!alive) return
        if (error) setFailed(true)
        else if (data && data.length > 0) setItems(data as Category[])
      })
    return () => {
      alive = false
    }
  }, [])

  return { items, failed }
}

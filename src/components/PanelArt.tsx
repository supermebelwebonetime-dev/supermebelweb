import type { CSSProperties } from 'react'

type Kind = 'kitchen' | 'tall' | 'grid' | 'low'

const kindBySlug: Record<string, Kind> = {
  kitchens: 'kitchen',
  wardrobes: 'tall',
  'dressing-rooms': 'tall',
  hallways: 'tall',
  bedrooms: 'low',
  'living-rooms': 'low',
  office: 'grid',
  kids: 'grid'
}

export function kindFor(slug: string): Kind {
  return kindBySlug[slug] ?? 'grid'
}

interface Props {
  kind: Kind
  color: string
  label?: string
  className?: string
}

/** Условная фасадная композиция: цветные плоскости с зазорами. Не чертёж и не реальная работа. */
export default function PanelArt({ kind, color, label, className }: Props) {
  const style = { '--facade': color } as CSSProperties
  return (
    <svg
      className={`panel-art ${className ?? ''}`}
      style={style}
      viewBox="0 0 240 180"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      preserveAspectRatio="xMidYMax meet"
    >
      <rect className="pa-wall" x="0" y="0" width="240" height="180" />
      <rect className="pa-floor" x="0" y="160" width="240" height="20" />
      {kind === 'kitchen' && (
        <>
          <rect className="pa-door" x="24" y="30" width="46" height="46" />
          <rect className="pa-door" x="74" y="30" width="46" height="46" />
          <rect className="pa-door" x="124" y="30" width="46" height="46" />
          <rect className="pa-top" x="18" y="92" width="204" height="7" />
          <rect className="pa-door" x="24" y="99" width="62" height="61" />
          <rect className="pa-door" x="90" y="99" width="62" height="61" />
          <rect className="pa-door" x="156" y="99" width="62" height="61" />
          <rect className="pa-door pa-tall" x="176" y="30" width="46" height="62" />
        </>
      )}
      {kind === 'tall' && (
        <>
          <rect className="pa-door" x="40" y="16" width="52" height="144" />
          <rect className="pa-door" x="96" y="16" width="52" height="144" />
          <rect className="pa-door" x="152" y="16" width="52" height="144" />
          <rect className="pa-handle" x="86" y="86" width="2" height="22" />
          <rect className="pa-handle" x="100" y="86" width="2" height="22" />
        </>
      )}
      {kind === 'low' && (
        <>
          <rect className="pa-door" x="28" y="96" width="60" height="64" />
          <rect className="pa-door" x="92" y="96" width="60" height="64" />
          <rect className="pa-door" x="156" y="96" width="60" height="64" />
          <rect className="pa-top" x="22" y="88" width="196" height="8" />
          <rect className="pa-shelf" x="40" y="44" width="160" height="5" />
          <rect className="pa-shelf" x="40" y="66" width="160" height="5" />
        </>
      )}
      {kind === 'grid' && (
        <>
          <rect className="pa-door" x="40" y="24" width="76" height="62" />
          <rect className="pa-door" x="120" y="24" width="80" height="62" />
          <rect className="pa-door" x="40" y="90" width="76" height="70" />
          <rect className="pa-door" x="120" y="90" width="80" height="70" />
        </>
      )}
    </svg>
  )
}

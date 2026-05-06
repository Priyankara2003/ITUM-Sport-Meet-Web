'use client'

import { useHouses } from '@/hooks/use-houses'
import { HouseCard } from './house-card'

export function HouseRankings() {
  const { houses, loading, error } = useHouses()

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading house rankings...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        Error loading rankings: {error}
      </div>
    )
  }

  const podium = houses.slice(0, 4)
  const rest = houses.slice(4)

  const podiumOrder = [1, 0, 2, 3].filter((index) => podium[index])

  const podiumMeta = {
    1: {
      label: 'CHAMPION',
      accent: '#d4af37',
      ring: 'shadow-[0_0_40px_rgba(212,175,55,0.25)]',
      height: 'md:min-h-[360px] md:-translate-y-4',
    },
    2: {
      label: 'RUNNER UP',
      accent: '#c0c0c0',
      ring: 'shadow-[0_0_30px_rgba(192,192,192,0.2)]',
      height: 'md:min-h-[320px]',
    },
    3: {
      label: '3RD PLACE',
      accent: '#cd7f32',
      ring: 'shadow-[0_0_30px_rgba(205,127,50,0.2)]',
      height: 'md:min-h-[320px]',
    },
    4: {
      label: '4TH PLACE',
      accent: '#8b5cf6',
      ring: 'shadow-[0_0_30px_rgba(139,92,246,0.18)]',
      height: 'md:min-h-[300px]',
    },
  } as const

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        {podiumOrder.map((podiumIndex) => {
          const house = podium[podiumIndex]
          const rank = podiumIndex + 1
          const meta = podiumMeta[rank as 1 | 2 | 3 | 4]

          return (
            <div
              key={house.id}
              className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-black/40 via-card to-black/70 p-6 text-center ${meta.ring} ${meta.height}`}
              style={{ borderColor: meta.accent }}
            >
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at top, ${meta.accent}33, transparent 65%)` }} />
              <div className="relative space-y-6">
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border text-lg font-black"
                  style={{ borderColor: meta.accent, color: meta.accent }}
                >
                  #{rank}
                </div>
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-black"
                  style={{ backgroundColor: `${meta.accent}22`, color: meta.accent }}
                >
                  {house.display_name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground">
                    {meta.label}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-foreground">
                    {house.display_name}
                  </h3>
                </div>
                <div
                  className="mx-auto w-fit rounded-full border px-5 py-2 text-sm font-bold"
                  style={{ borderColor: meta.accent, color: meta.accent }}
                >
                  {house.total_points.toLocaleString()} PTS
                </div>
                <div className="text-xs text-muted-foreground">
                  {house.trophies_won} trophies • {house.members_count} members
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rest.map((house, idx) => (
            <HouseCard key={house.id} house={house} rank={idx + 5} />
          ))}
        </div>
      )}
    </div>
  )
}

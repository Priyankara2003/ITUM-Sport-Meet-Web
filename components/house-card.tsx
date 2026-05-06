'use client'

import { House } from '@/hooks/use-houses'

interface HouseCardProps {
  house: House
  rank: number
  className?: string
  style?: React.CSSProperties
  dataAnimate?: string
}

export function HouseCard({
  house,
  rank,
  className,
  style,
  dataAnimate,
}: HouseCardProps) {
  return (
    <div
      data-animate={dataAnimate}
      className={`rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-shadow ${className ?? ''}`}
      style={{ borderLeft: `4px solid ${house.color}`, ...style }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            #{rank}
          </div>
          <h3 className="text-xl font-bold text-foreground">
            {house.display_name}
          </h3>
        </div>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: house.color }}
        >
          {house.display_name[0]}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Points</span>
          <span className="font-bold text-foreground">
            {house.total_points.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Trophies</span>
          <span className="font-bold text-foreground">{house.trophies_won}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Members</span>
          <span className="font-bold text-foreground">
            {house.members_count}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div
          className="h-2 rounded-full overflow-hidden bg-muted"
          style={{
            backgroundImage: `linear-gradient(90deg, ${house.color}20, ${house.color})`,
          }}
        >
          <div
            className="h-full transition-all"
            style={{
              width: `${Math.min((house.total_points / 3000) * 100, 100)}%`,
              backgroundColor: house.color,
            }}
          />
        </div>
      </div>
    </div>
  )
}

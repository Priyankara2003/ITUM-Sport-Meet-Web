'use client'

import { useMatches } from '@/hooks/use-matches'
import { useEvents } from '@/hooks/use-events'
import { useHouses } from '@/hooks/use-houses'

export function LiveTicker() {
  const { events: ongoingEvents, loading: eventsLoading } = useEvents('ongoing')
  const { houses, loading: housesLoading } = useHouses()

  if (eventsLoading || housesLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading live data...
      </div>
    )
  }

  // db එකේ අන්තිමට අපි ඇතුලත් කරපු 5 පේන්න (Sort by latest created)
  const latestEvents = [...ongoingEvents]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left 3/4: Latest Updates (News feed style) */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-primary uppercase tracking-wider flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          Latest Updates
        </h2>
        {latestEvents.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
            No recent updates available.
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {latestEvents.map((event) => (
              <TickerItem key={event.id} event={event} houses={houses} />
            ))}
          </div>
        )}
      </div>

      {/* Right 1/4: House Scores (2x2 Grid) */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-primary uppercase tracking-wider flex items-center justify-center gap-2">
          House Points
        </h2>
        {houses.length === 0 ? (
          <div className="text-muted-foreground text-sm text-center">No house data.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {houses.map((house) => (
              <div 
                key={house.id} 
                className="aspect-square rounded-xl flex flex-col items-center justify-center p-3 shadow-lg text-white hover:scale-105 transition-transform relative overflow-hidden"
                style={{ backgroundColor: house.color }}
              >
                {house.logo_url ? (
                  <img src={house.logo_url} alt={house.name} className="w-8 h-8 md:w-10 md:h-10 object-contain mb-1 drop-shadow-md opacity-90 z-10" />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 mb-1 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm z-10 shadow-inner border border-white/30">
                    <span className="text-sm font-bold drop-shadow-md">{house.display_name.charAt(0)}</span>
                  </div>
                )}
                <p className="font-bold text-sm text-center line-clamp-1 mb-1 drop-shadow-md z-10">
                  {house.display_name}
                </p>
                <div className="text-3xl font-black drop-shadow-md z-10">
                  {house.total_points}
                </div>
                {/* Subtle background decoration */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TickerItem({
  event,
  houses,
}: {
  event: any
  houses: any[]
}) {
  const { matches, loading } = useMatches(event.id)

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 text-gray-500 shadow-sm border-l-4 border-l-primary/50">
        Loading update...
      </div>
    )
  }

  const sortedMatches = [...matches].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  )

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col border-l-4 border-l-primary">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
            {event.name}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded flex-shrink-0">
            Live Update
          </span>
        </div>
        
        {event.description && (
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap leading-relaxed">
            {event.description}
          </p>
        )}
      </div>

      <div className="divide-y divide-gray-100 bg-white">
        {sortedMatches.length === 0 ? (
          <div className="px-5 py-4 text-sm text-gray-500">No score details available yet.</div>
        ) : (
          sortedMatches.map((match, idx) => {
            const house = houses.find((h) => h.id === match.house_id)
            if (!house) return null

            return (
              <div key={match.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="font-bold text-sm text-gray-400 w-6">
                  #{idx + 1}
                </div>
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-inner"
                  style={{ backgroundColor: house.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-700 text-sm truncate">
                    {house.display_name}
                  </p>
                </div>
                <div className="text-lg font-black text-gray-900">
                  {match.score}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

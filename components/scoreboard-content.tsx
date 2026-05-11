'use client'

import { useState } from 'react'
import { useEvents } from '@/hooks/use-events'
import { useMatches } from '@/hooks/use-matches'
import { useHouses } from '@/hooks/use-houses'
import { SportEvent } from '@/hooks/use-events'

export function ScoreboardContent() {
  const { events, loading: eventsLoading } = useEvents()
  const { houses } = useHouses()
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const selectedEvent =
    selectedEventId && events.length > 0
      ? events.find((e) => e.id === selectedEventId)
      : events.length > 0
        ? events[0]
        : null

  if (eventsLoading || events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading events...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 h-fit">
        <h2 className="text-lg font-bold text-foreground mb-4">All Events</h2>
        <div className="space-y-2">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedEvent?.id === event.id
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border hover:border-primary'
              }`}
            >
              <div className="font-medium text-sm">{event.name}</div>
              <div className="text-xs opacity-75 mt-1">{event.sport_type}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3">
        {selectedEvent && (
          <EventScoreboard event={selectedEvent} houses={houses} />
        )}
      </div>
    </div>
  )
}

function EventScoreboard({
  event,
  houses,
}: {
  event: SportEvent
  houses: any[]
}) {
  const { matches, loading } = useMatches(event.id)

  const statusColors = {
    scheduled: 'bg-blue-50 text-blue-700',
    ongoing: 'bg-green-50 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
  }

  const sortedMatches = [...matches].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  )

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading scores...
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {event.name}
            </h2>
            <p className="text-muted-foreground">{event.sport_type}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg text-sm font-medium ${statusColors[event.status]}`}>
            {event.status === 'scheduled'
              ? 'Scheduled'
              : event.status === 'ongoing'
                ? 'Live'
                : 'Completed'}
          </span>
        </div>
        {event.location && (
          <p className="text-sm text-muted-foreground">
            Location: {event.location}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                House
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                Score
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedMatches.map((match, idx) => {
              const house = houses.find((h) => h.id === match.house_id)
              if (!house) return null

              const statusBadges = {
                pending: 'bg-gray-100 text-gray-600',
                competing: 'bg-yellow-50 text-yellow-700',
                finished: 'bg-green-50 text-green-700',
              }

              return (
                <tr key={match.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-muted-foreground">
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: house.color }}
                      />
                      <span className="font-medium text-foreground">
                        {house.display_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-2xl font-bold text-foreground">
                      {match.score}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadges[match.status]}`}
                    >
                      {match.status === 'pending'
                        ? 'Pending'
                        : match.status === 'competing'
                          ? 'Competing'
                          : 'Finished'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {event.description && (
        <div className="px-6 py-4 border-t border-border bg-background">
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </div>
      )}
    </div>
  )
}

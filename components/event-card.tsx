'use client'

import { SportEvent } from '@/hooks/use-events'
import { formatDate } from '@/lib/utils'

interface EventCardProps {
  event: SportEvent
}

export function EventCard({ event }: EventCardProps) {
  const statusColors = {
    scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    ongoing: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-gray-50 text-gray-600 border-gray-200',
  }

  const statusLabels = {
    scheduled: 'Scheduled',
    ongoing: 'Live',
    completed: 'Completed',
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-foreground flex-1">{event.name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[event.status]}`}
        >
          {statusLabels[event.status]}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sport:</span>
          <span className="text-sm font-medium text-foreground">
            {event.sport_type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Date:</span>
          <span className="text-sm font-medium text-foreground">
            {formatDate(event.event_date)}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Location:</span>
            <span className="text-sm font-medium text-foreground">
              {event.location}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          {event.points_available} pts available
        </span>
        {event.description && (
          <span className="text-xs text-muted-foreground line-clamp-1">
            {event.description}
          </span>
        )}
      </div>
    </div>
  )
}

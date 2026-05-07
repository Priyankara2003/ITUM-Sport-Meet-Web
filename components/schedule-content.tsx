'use client'

import { useState } from 'react'
import { useEvents } from '@/hooks/use-events'
import { formatDate } from '@/lib/utils'

export function ScheduleContent() {
  const { events, loading, error } = useEvents()
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'scheduled' | 'ongoing' | 'completed'
  >('all')

  const filteredEvents =
    selectedStatus === 'all'
      ? events
      : events.filter((e) => e.status === selectedStatus)

  // Group events by date
  const groupedEvents = filteredEvents.reduce(
    (acc, event) => {
      const date = new Date(event.event_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      if (!acc[date]) acc[date] = []
      acc[date].push(event)
      return acc
    },
    {} as Record<string, typeof events>
  )

  const sortedDates = Object.keys(groupedEvents).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading schedule...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        Error loading schedule: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedStatus === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border hover:border-primary'
          }`}
        >
          All Events ({events.length})
        </button>
        <button
          onClick={() => setSelectedStatus('scheduled')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedStatus === 'scheduled'
              ? 'bg-blue-500 text-white'
              : 'bg-card border border-border hover:border-blue-500'
          }`}
        >
          Scheduled (
          {events.filter((e) => e.status === 'scheduled').length})
        </button>
        <button
          onClick={() => setSelectedStatus('ongoing')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedStatus === 'ongoing'
              ? 'bg-green-500 text-white'
              : 'bg-card border border-border hover:border-green-500'
          }`}
        >
          Live ({events.filter((e) => e.status === 'ongoing').length})
        </button>
        <button
          onClick={() => setSelectedStatus('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedStatus === 'completed'
              ? 'bg-gray-500 text-white'
              : 'bg-card border border-border hover:border-gray-500'
          }`}
        >
          Completed (
          {events.filter((e) => e.status === 'completed').length})
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No events found
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-xl font-bold text-foreground mb-4 px-4 py-2 rounded-lg bg-background border-l-4 border-primary">
                {date}
              </h3>
              <div className="space-y-3 ml-4">
                {groupedEvents[date].map((event) => (
                  <EventTimelineItem key={event.id} event={event} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface Event {
  id: string
  name: string
  sport_type: string
  description?: string | null
  event_date: string
  location?: string
  points_available: number
  status: 'scheduled' | 'ongoing' | 'completed'
}

function EventTimelineItem({ event }: { event: Event }) {
  const eventTime = new Date(event.event_date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const statusColors = {
    scheduled:
      'bg-blue-50 border-blue-200 text-blue-700 before:bg-blue-500',
    ongoing:
      'bg-green-50 border-green-200 text-green-700 before:bg-green-500',
    completed:
      'bg-gray-50 border-gray-200 text-gray-600 before:bg-gray-400',
  }

  const statusLabels = {
    scheduled: 'Scheduled',
    ongoing: 'Live',
    completed: 'Completed',
  }

  return (
    <div className={`relative pl-6 pb-6 border-l border-border group`}>
      <div
        className={`absolute -left-3 top-0 w-6 h-6 rounded-full border-4 border-background ${statusColors[event.status].split(' ')[0]} group-hover:scale-125 transition-transform`}
      />

      <div
        className={`rounded-lg border p-4 ${statusColors[event.status]} transition-colors hover:opacity-90`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-foreground text-lg">
              {event.name}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {event.sport_type}
            </p>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {event.description}
              </p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-medium mb-2">{eventTime}</div>
            <span className={`inline-block px-2 py-1 rounded text-xs font-bold opacity-100`}>
              {statusLabels[event.status]}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-black/10 text-xs text-muted-foreground space-y-1">
          {event.location && <p>Location: {event.location}</p>}
          <p>Points Available: {event.points_available}</p>
        </div>
      </div>
    </div>
  )
}

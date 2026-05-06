'use client'

import { useEvents } from '@/hooks/use-events'
import { EventCard } from './event-card'
import { cubicBezier, motion } from 'framer-motion'

export function UpcomingEvents() {
  const { events, loading, error } = useEvents('scheduled')

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading upcoming events...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        Error loading events: {error}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No upcoming events scheduled
      </div>
    )
  }

  const easeOut = cubicBezier(0.22, 1, 0.36, 1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.slice(0, 3).map((event, idx) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: easeOut, delay: idx * 0.08, type: 'tween' }}
          whileHover={{ y: -4 }}
        >
          <EventCard event={event} />
        </motion.div>
      ))}
    </div>
  )
}

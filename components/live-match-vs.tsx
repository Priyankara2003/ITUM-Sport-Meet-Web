'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useEvents } from '@/hooks/use-events'
import { useHouses } from '@/hooks/use-houses'
import { motion } from 'framer-motion'

export function LiveMatchVS() {
  const { events: ongoingEvents, loading: eventsLoading } = useEvents('ongoing')
  const { houses, loading: housesLoading } = useHouses()
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const currentEvent = ongoingEvents[0]

  // Fetch match participants and auto-refresh every 5 seconds
  useEffect(() => {
    if (!currentEvent) {
      setLoading(false)
      return
    }

    const fetchMatches = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('match_participants')
        .select('*')
        .eq('event_id', currentEvent.id)
        .order('score', { ascending: false })

      if (data) setMatches(data)
      setLoading(false)
    }

    fetchMatches()
    const interval = setInterval(fetchMatches, 5000)
    return () => clearInterval(interval)
  }, [currentEvent?.id])

  if (eventsLoading || housesLoading || loading) return null
  if (!currentEvent || matches.length < 2) return null

  const getHouse = (houseId: string) => houses.find((h) => h.id === houseId)
  const houseA = getHouse(matches[0].house_id)
  const houseB = getHouse(matches[1].house_id)

  if (!houseA || !houseB) return null

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Match header */}
      <div className="bg-primary/5 border-b border-border px-4 py-3 flex items-center justify-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Live Now
        </span>
        <span className="text-xs text-muted-foreground mx-1">•</span>
        <span className="text-xs font-semibold text-foreground truncate">
          {currentEvent.name}
        </span>
      </div>

      {/* VS Layout */}
      <div className="flex items-center justify-center py-6 sm:py-8 px-4">
        {/* House A */}
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
          {houseA.logo_url ? (
            <img
              src={houseA.logo_url}
              alt={houseA.display_name}
              className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 object-contain drop-shadow-lg"
            />
          ) : (
            <div
              className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg"
              style={{ backgroundColor: houseA.color }}
            >
              {houseA.display_name.charAt(0)}
            </div>
          )}
          <p className="font-bold text-foreground text-xs sm:text-sm text-center truncate max-w-full">
            {houseA.display_name}
          </p>
          <motion.p
            key={matches[0].score}
            className="text-3xl sm:text-4xl md:text-5xl font-black tabular-nums"
            style={{ color: houseA.color }}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {matches[0].score}
          </motion.p>
        </div>

        {/* VS Divider */}
        <div className="flex flex-col items-center gap-1 mx-3 sm:mx-6">
          <div className="w-px h-6 bg-border" />
          <span className="text-xl sm:text-2xl font-black text-muted-foreground/30 select-none">
            VS
          </span>
          <div className="w-px h-6 bg-border" />
        </div>

        {/* House B */}
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
          {houseB.logo_url ? (
            <img
              src={houseB.logo_url}
              alt={houseB.display_name}
              className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 object-contain drop-shadow-lg"
            />
          ) : (
            <div
              className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg"
              style={{ backgroundColor: houseB.color }}
            >
              {houseB.display_name.charAt(0)}
            </div>
          )}
          <p className="font-bold text-foreground text-xs sm:text-sm text-center truncate max-w-full">
            {houseB.display_name}
          </p>
          <motion.p
            key={matches[1].score}
            className="text-3xl sm:text-4xl md:text-5xl font-black tabular-nums"
            style={{ color: houseB.color }}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {matches[1].score}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

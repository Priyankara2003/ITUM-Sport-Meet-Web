'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useEvents } from '@/hooks/use-events'
import { useHouses } from '@/hooks/use-houses'
import { motion } from 'framer-motion'

// 1. ප්‍රධාන Component එක: මේකෙන් ongoing events ඔක්කොම අරන් map කරනවා
export function LiveMatches() {
  const { events: ongoingEvents, loading: eventsLoading } = useEvents('ongoing')
  const { houses, loading: housesLoading } = useHouses()

  if (eventsLoading || housesLoading) return null
  if (!ongoingEvents || ongoingEvents.length === 0) return null

  return (
    // මැච් කීපයක් තියෙනවා නම් Grid එකක් විදිහට ලස්සනට පෙන්නන්න
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4">
      {ongoingEvents.map((event) => (
        <SingleMatchCard key={event.id} event={event} houses={houses} />
      ))}
    </div>
  )
}

// 2. එක මැච් එකක් පෙන්නන Component එක
function SingleMatchCard({ event, houses }: { event: any, houses: any[] }) {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('match_participants')
        .select('*')
        .eq('event_id', event.id)
        .order('score', { ascending: false })

      if (data) setMatches(data)
      setLoading(false)
    }

    fetchMatches()
    const interval = setInterval(fetchMatches, 5000)
    return () => clearInterval(interval)
  }, [event.id])

  if (loading || matches.length < 2) return null

  const getHouse = (houseId: string) => houses.find((h) => h.id === houseId)
  const houseA = getHouse(matches[0].house_id)
  const houseB = getHouse(matches[1].house_id)

  if (!houseA || !houseB) return null

  // ඔයාගේ පරණ UI එකම තමයි මේ තියෙන්නේ
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Match header */}
      <div className="bg-primary/5 border-b border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Live Now
          </span>
        </div>
        <span className="hidden sm:inline text-xs text-muted-foreground">•</span>
        
        {/* 'truncate' අයින් කරලා text එක wrap වෙන්න හැදුවා. එතකොට A team, B team විස්තරේ සම්පූර්ණයෙන් පේනවා */}
        <span className="text-xs sm:text-sm font-bold text-foreground">
          {event.name}
        </span>
      </div>  

      {/* VS Layout */}
      <div className="flex items-center justify-center py-6 px-4">
        {/* House A */}
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
          {houseA.logo_url ? (
            <img src={houseA.logo_url} alt={houseA.display_name} className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-lg" />
          ) : (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-xl font-black shadow-lg" style={{ backgroundColor: houseA.color }}>
              {houseA.display_name.charAt(0)}
            </div>
          )}
          <p className="font-bold text-foreground text-xs sm:text-sm text-center truncate w-full">{houseA.display_name}</p>
          <motion.p
            key={matches[0].score}
            className="text-3xl sm:text-4xl font-black tabular-nums"
            style={{ color: houseA.color }}
            initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          >
            {matches[0].score}
          </motion.p>
        </div>

        {/* VS Divider */}
        <div className="flex flex-col items-center gap-1 mx-2 sm:mx-4">
          <div className="w-px h-6 bg-border" />
          <span className="text-lg sm:text-xl font-black text-muted-foreground/30 select-none">VS</span>
          <div className="w-px h-6 bg-border" />
        </div>

        {/* House B */}
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
          {houseB.logo_url ? (
            <img src={houseB.logo_url} alt={houseB.display_name} className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-lg" />
          ) : (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-xl font-black shadow-lg" style={{ backgroundColor: houseB.color }}>
              {houseB.display_name.charAt(0)}
            </div>
          )}
          <p className="font-bold text-foreground text-xs sm:text-sm text-center truncate w-full">{houseB.display_name}</p>
          <motion.p
            key={matches[1].score}
            className="text-3xl sm:text-4xl font-black tabular-nums"
            style={{ color: houseB.color }}
            initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          >
            {matches[1].score}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}
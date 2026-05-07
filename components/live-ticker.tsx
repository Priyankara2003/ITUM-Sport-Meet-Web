'use client'

import { useEffect, useState } from 'react'
import { cubicBezier, motion, type Variants } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useEvents } from '@/hooks/use-events'
import { useHouses } from '@/hooks/use-houses'

export function LiveTicker() {
  const { events: ongoingEvents, loading: eventsLoading } = useEvents('ongoing')
  const { houses, loading: housesLoading } = useHouses()
  
  const [news, setNews] = useState<any[]>([])
  const [newsLoading, setNewsLoading] = useState(true)

  // Fetch news and auto-update every 10 seconds
  useEffect(() => {
    const fetchNews = async () => {
      const supabase = createClient()
      // Try to fetch with is_pinned sorting first
      const { data, error } = await supabase
        .from('news_updates')
        .select('*')
        .order('is_pinned', { ascending: false, nullsLast: true })
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) {
        // Fallback if is_pinned column doesn't exist in the database yet
        const fallback = await supabase
          .from('news_updates')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
        if (fallback.data) setNews(fallback.data)
      } else if (data) {
        setNews(data)
      }
      setNewsLoading(false)
    }

    fetchNews()
    const interval = setInterval(fetchNews, 60000)
    return () => clearInterval(interval)
  }, [])

  if (eventsLoading || housesLoading || newsLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading live data...
      </div>
    )
  }

  const currentEvent = ongoingEvents[0]

  const easeOut = cubicBezier(0.22, 1, 0.36, 1)
  const panelVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: easeOut,
        delay: index * 0.1,
      },
    }),
  }
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        delay: index * 0.05,
      },
    }),
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left 3/4: Latest News Updates */}
      <motion.div
        className="lg:col-span-3 flex flex-col h-[400px] lg:h-[500px] bg-card border border-border rounded-2xl p-6 shadow-sm"
        custom={0}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={panelVariants}
      >
        <h2 className="text-lg font-bold text-primary uppercase tracking-wider flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          Live News Updates
        </h2>
        {news.length === 0 ? (
          <div className="text-center text-muted-foreground flex-1 flex items-center justify-center py-8">
            No recent news available.
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-track]:bg-transparent">
            {news.map((item, idx) => (
              <motion.div
                key={item.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white border border-border rounded-xl p-6 shadow-sm flex flex-col gap-2 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-foreground flex items-center gap-2 text-base sm:text-lg">
                    {item.is_pinned && (
                      <span className="shrink-0" title="Pinned News">📌</span>
                    )}
                    {item.title}
                  </h3>
                  <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    item.is_pinned 
                      ? 'text-blue-700 bg-blue-50 border border-blue-100' 
                      : 'text-gray-600 bg-gray-100 border border-gray-200'
                  }`}>
                    {item.is_pinned ? 'PINNED' : 'UPDATE'}
                  </span>
                </div>
                <p className="text-sm md:text-base text-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                  {item.content}
                </p>
                <div className="text-[10px] text-muted-foreground/60 mt-2 text-right font-medium">
                  {new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Right 1/4: Current Match Scores */}
      <motion.div
        className="lg:col-span-1 flex flex-col h-[400px] lg:h-[500px] bg-card border border-border rounded-2xl p-6 shadow-sm"
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={panelVariants}
      >
        <h2 className="text-lg font-bold text-primary uppercase tracking-wider flex items-center justify-center gap-2 text-center mb-4">
          Live Scores
        </h2>
        {!currentEvent ? (
          <div className="text-muted-foreground text-sm text-center flex-1 flex items-center justify-center py-8">
            No match ongoing right now.
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <LiveMatchScores event={currentEvent} houses={houses} />
          </div>
        )}
      </motion.div>
    </div>
  )
}

function LiveMatchScores({ event, houses }: { event: any; houses: any[] }) {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const easeOut = cubicBezier(0.22, 1, 0.36, 1)

  // Fetch match scores and auto-update every 5 seconds
  useEffect(() => {
    const fetchScores = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('match_participants')
        .select('*')
        .eq('event_id', event.id)
        // Sort nulls to bottom, higher scores top
        .order('score', { ascending: false, nullsFirst: false })
      
      if (data) setMatches(data)
      setLoading(false)
    }

    fetchScores()
    const interval = setInterval(fetchScores, 60000)
    return () => clearInterval(interval)
  }, [event.id])

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-xl p-6 text-muted-foreground text-center text-sm shadow-sm">
        Loading live scores...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center mb-2 shadow-sm">
        <h3 className="font-bold text-primary text-sm line-clamp-1">{event.name}</h3>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Current Match</p>
      </div>
      
      {matches.length === 0 ? (
        <div className="text-muted-foreground text-sm text-center">Scores not updated yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-track]:bg-transparent pb-2">
          {matches.map((match, idx) => {
            const house = houses.find((h) => h.id === match.house_id)
            if (!house) return null

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: easeOut, delay: idx * 0.06 }}
                whileHover={{ y: -3 }}
                className="bg-white border border-border rounded-xl p-3 flex items-center gap-3 relative overflow-hidden shadow-sm hover:border-primary/40 transition-colors"
              >
                {/* House Color Bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: house.color }}
                />
                
                {/* House Icon */}
                {house.logo_url ? (
                  <img src={house.logo_url} alt={house.name} className="w-8 h-8 object-contain ml-1 drop-shadow-md" />
                ) : (
                  <div 
                    className="w-8 h-8 ml-1 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-inner"
                    style={{ backgroundColor: house.color }}
                  >
                    {house.display_name.charAt(0)}
                  </div>
                )}
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate drop-shadow-sm">{house.display_name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Rank #{idx + 1}</p>
                </div>
                
                {/* Score */}
                <div className="text-2xl font-black text-primary">
                  {match.score || 0}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

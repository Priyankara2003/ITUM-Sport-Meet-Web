'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, cubicBezier } from 'framer-motion'
import { Play, FastForward, Clock, MapPin, Loader2, Info } from 'lucide-react'

interface AgendaItem {
  id: string
  title: string
  start_time: string
  event_type: 'event' | 'ceremony' | 'break'
  location: string
}

export function EventTimeline() {
  const [agenda, setAgenda] = useState<AgendaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchAgenda = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('agenda')
        .select('*')
        .order('start_time', { ascending: true })
      
      if (data) setAgenda(data)
      setLoading(false)
    }

    fetchAgenda()
    const interval = setInterval(fetchAgenda, 30000) 
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
  if (agenda.length === 0) return null

  // Happening Now
  const happeningNow = [...agenda]
    .reverse()
    .find(item => new Date(item.start_time) <= currentTime)

  // Up Next
  const upNext = agenda
    .filter(item => new Date(item.start_time) > currentTime)
    .slice(0, 2)

  const easeOut = cubicBezier(0.22, 1, 0.36, 1)

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      
      {/* Title Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-foreground mb-3 uppercase tracking-tight">
          LIVE TIMELINE
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 sm:w-24 h-px bg-gradient-to-r from-transparent to-primary"></div>
          <p className="text-muted-foreground tracking-widest text-sm uppercase">Full Program Schedule</p>
          <div className="w-12 sm:w-24 h-px bg-gradient-to-l from-transparent to-primary"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🔥 Happening Now Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="lg:col-span-2 bg-[#f2eded] border border-border/40 rounded-3xl p-8 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[300px]"
        >
          {/* Status Badge based on type */}
          <div className={`absolute top-6 right-8 flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border shadow-sm ${
            happeningNow?.event_type === 'ceremony' 
            ? 'bg-blue-50 text-blue-600 border-blue-200' 
            : 'bg-green-50 text-green-700 border-green-200'
          }`}>
             <span className={`w-2 h-2 rounded-full animate-pulse ${happeningNow?.event_type === 'ceremony' ? 'bg-blue-500' : 'bg-green-500'}`} />
             {happeningNow?.event_type === 'ceremony' ? 'CEREMONY' : 'ONGOING'}
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-primary/70 uppercase tracking-[0.2em]">Happening Now</p>
            <h3 className="text-3xl md:text-5xl font-black text-foreground leading-[1.1]">
              {happeningNow ? happeningNow.title : "Waiting to start..."}
            </h3>
            
            <div className="flex flex-wrap gap-4 pt-4 text-muted-foreground font-semibold text-sm">
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl border border-white/20">
                <Clock size={18} className="text-primary" />
                {happeningNow ? new Date(happeningNow.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--"}
              </div>
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl border border-white/20">
                <MapPin size={18} className="text-primary" />
                {happeningNow ? happeningNow.location.split(',')[0] : "Stadium"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ⏩ Up Next Sidebar */}
        <div className="space-y-6">
          <h4 className="text-sm font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
            <FastForward size={20} /> Up Next
          </h4>
          
          <div className="flex flex-col gap-4">
            {upNext.length > 0 ? upNext.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm hover:border-primary/30 transition-all group cursor-default"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                    item.event_type === 'ceremony' ? 'bg-blue-50 text-blue-600' : 'bg-primary/5 text-primary'
                  }`}>
                    {item.event_type}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">{new Date(item.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <h5 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h5>
              </motion.div>
            )) : (
              <div className="bg-muted/5 border border-dashed border-border/50 rounded-3xl p-10 text-center">
                <Info className="mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">End of the Day</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
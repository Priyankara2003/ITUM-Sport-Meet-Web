'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Crown, Star, Medal, Trophy } from 'lucide-react'

interface House {
  display_name: string
  total_points: number
  color: string
  logo_url: string | null
}

export default function FinalChampionshipResult() {
  const [results, setResults] = useState<House[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFinalResults = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('houses')
        .select('display_name, total_points, color, logo_url')
        .order('total_points', { ascending: false })

      if (data) {
        setResults(data)
        // Champion reveal එකේදී Confetti පත්තු කරනවා
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
          colors: [data[0].color, '#FFD700', '#FFFFFF']
        })
      }
      setLoading(false)
    }

    fetchFinalResults()
  }, [])

  if (loading || results.length < 3) return null

  // Podium එකේ පෝලිම: [2nd Place, 1st Place, 3rd Place]
  const podiumData = [results[1], results[0], results[2]]

  return (
    <section className="w-full min-h-screen bg-[#f5f2f2] py-20 px-4 flex flex-col items-center">
      
      {/* 🏆 Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">🏃‍♂️</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground">
                OVERALL CHAMPIONSHIP
            </h2>
        </div>
        <p className="text-muted-foreground font-bold tracking-widest text-sm">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • DIYAGAMA 2026
        </p>
      </motion.div>

      {/* 🏟️ PODIUM DESIGN (Matching image_ff804e.png) */}
      <div className="relative w-full max-w-5xl flex items-end justify-center gap-2 md:gap-6 mt-20 mb-20">
        
        {podiumData.map((house, index) => {
          const isFirst = index === 1;
          const isSecond = index === 0;
          const isThird = index === 2;

          return (
            <motion.div
              key={house.display_name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="flex flex-col items-center w-full max-w-[280px]"
            >
              {/* House Icon/Logo */}
              <div className="relative mb-4">
                {isFirst && (
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 text-yellow-500"
                  >
                    <Crown size={48} fill="currentColor" className="drop-shadow-lg" />
                  </motion.div>
                )}
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl shadow-xl border-4 flex items-center justify-center overflow-hidden transition-transform hover:scale-110" style={{ borderColor: house.color }}>
                   {house.logo_url ? (
                     <img src={house.logo_url} alt={house.display_name} className="object-contain p-2" />
                   ) : (
                     <Star size={32} style={{ color: house.color }} fill="currentColor" />
                   )}
                </div>
              </div>

              {/* Podium Block */}
              <div 
                className={`w-full relative flex flex-col items-center justify-center rounded-t-[32px] p-6 text-center border-x-2 border-t-2 shadow-2xl
                ${isFirst ? 'h-[280px] bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-200' : ''}
                ${isSecond ? 'h-[200px] bg-gradient-to-b from-slate-50 to-slate-100 border-slate-200' : ''}
                ${isThird ? 'h-[160px] bg-gradient-to-b from-orange-50 to-orange-100 border-orange-200' : ''}`}
              >
                <span className={`text-5xl md:text-7xl font-black mb-2 opacity-40 
                  ${isFirst ? 'text-yellow-600' : ''}
                  ${isSecond ? 'text-slate-600' : ''}
                  ${isThird ? 'text-orange-600' : ''}`}
                >
                  {isFirst ? '1' : isSecond ? '2' : '3'}
                </span>
                
                <h3 className="text-sm md:text-xl font-black text-foreground uppercase tracking-tighter leading-none mb-2">
                  {house.display_name}
                </h3>

                <div className={`px-4 py-1.5 rounded-full font-black text-sm md:text-lg bg-white/60 border border-white shadow-sm`} style={{ color: house.color }}>
                    {house.total_points} PTS
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 📋 Remaining Houses List (Professional Table) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full max-w-3xl bg-white/40 backdrop-blur-md border border-white/50 rounded-[32px] p-8"
      >
        <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 text-center">
            Complete Final Standings
        </h4>
        <div className="space-y-4">
          {results.map((house, idx) => (
            <div key={house.display_name} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-white shadow-sm hover:translate-x-2 transition-transform">
              <div className="flex items-center gap-4">
                <span className="font-black text-lg w-6 text-muted-foreground italic">#{idx + 1}</span>
                <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: house.color }} />
                <span className="font-black text-foreground uppercase tracking-tight">{house.display_name}</span>
              </div>
              <div className="font-black text-xl text-primary">{house.total_points}</div>
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy, X, PartyPopper, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client' // ඔයාගේ supabase client එක import කරගන්න

interface WinnerData {
  display_name: string
  total_points: number
  color: string
  logo_url: string | null
}

export default function VictoryModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [winner, setWinner] = useState<WinnerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWinner = async () => {
      const supabase = createClient()
      
      // වැඩිම ලකුණු තියෙන නිවස (Winner) ලබා ගැනීම
      const { data, error } = await supabase
        .from('houses')
        .select('display_name, total_points, color, logo_url')
        .order('total_points', { ascending: false })
        .limit(1)
        .single()

      if (data && !error) {
        setWinner(data)
        // දත්ත ලැබුණු පසු Modal එක පෙන්වා Confetti පත්තු කිරීම
        setTimeout(() => {
          setIsOpen(true)
          fireConfetti(data.color)
        }, 1000)
      }
      setLoading(false)
    }

    fetchWinner()
  }, [])

  const fireConfetti = (houseColor: string) => {
    const duration = 4 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)

      const particleCount = 50 * (timeLeft / duration)
      // නිවසේ පාටට ගැලපෙන Confetti වැස්සක්
      confetti({ ...defaults, particleCount, colors: [houseColor, '#ffffff', '#FFD700'], origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, colors: [houseColor, '#ffffff', '#FFD700'], origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)
  }

  if (loading || !winner) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{ borderColor: winner.color }} // නිවසේ පාටින් Border එක
            className="relative bg-white rounded-[40px] p-8 md:p-12 max-w-lg w-full text-center shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] border-4"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X size={20} className="text-muted-foreground" />
            </button>

            <div className="space-y-6">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="inline-block"
              >
                {/* නිවසේ Logo එක තිබේ නම් එය පෙන්වයි, නැතිනම් Trophy එක */}
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center bg-muted/30 rounded-3xl overflow-hidden border-2 border-border/20 shadow-inner">
                  {winner.logo_url ? (
                    <img src={winner.logo_url} alt={winner.display_name} className="w-full h-full object-contain p-4" />
                  ) : (
                    <Trophy size={64} style={{ color: winner.color }} className="drop-shadow-lg" />
                  )}
                </div>
              </motion.div>

              <div className="space-y-2">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.4em]">Overall Champions 2026</h3>
                <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter leading-none">
                  CONGRATULATIONS <br />
                  <span style={{ color: winner.color }} className="drop-shadow-sm">
                    {winner.display_name}!
                  </span>
                </h2>
              </div>

              <div className="bg-muted/30 p-8 rounded-[32px] border border-border/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: winner.color }} />
                <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] mb-2">Championship Score</p>
                <div className="flex items-center justify-center gap-2">
                   <span className="text-6xl font-black text-foreground tabular-nums">{winner.total_points}</span>
                   <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest pt-4">Points</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  style={{ backgroundColor: winner.color }}
                  className="text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-sm"
                >
                  View Final Standings
                </button>
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 flex items-center justify-center gap-2">
                  <PartyPopper size={12} /> Celebrating the Spirit of ITUM
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
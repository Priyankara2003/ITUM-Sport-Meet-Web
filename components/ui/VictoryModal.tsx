'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy, X, PartyPopper } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
      const { data, error } = await supabase
        .from('houses')
        .select('display_name, total_points, color, logo_url')
        .order('total_points', { ascending: false })
        .limit(1)
        .single()

      if (data && !error) {
        setWinner(data)
        const timer = setTimeout(() => {
          setIsOpen(true)
          fireConfetti(data.color)
        }, 1000)
        return () => clearTimeout(timer)
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
      confetti({ ...defaults, particleCount, colors: [houseColor, '#ffffff', '#FFD700'], origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, colors: [houseColor, '#ffffff', '#FFD700'], origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)
  }

  if (loading || !winner) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
          {/* Overlay animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{ borderColor: winner.color }}
            className="relative bg-white rounded-[30px] sm:rounded-[40px] p-6 sm:p-10 md:p-12 max-w-lg w-full text-center shadow-2xl border-4 my-auto"
          >
            {/* Close Button - More accessible on mobile */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-muted/50 hover:bg-muted rounded-full transition-colors z-20"
            >
              <X size={20} className="text-muted-foreground" />
            </button>

            <div className="space-y-5 sm:space-y-8">
              {/* Winner Icon/Logo */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="inline-block"
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto flex items-center justify-center bg-muted/20 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-border/10 shadow-inner">
                  {winner.logo_url ? (
                    <img src={winner.logo_url} alt={winner.display_name} className="w-full h-full object-contain p-3 sm:p-4" />
                  ) : (
                    <Trophy className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-md" style={{ color: winner.color }} />
                  )}
                </div>
              </motion.div>

              {/* Text Content */}
              <div className="space-y-2 sm:space-y-4">
                <h3 className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-[0.3em] sm:tracking-[0.4em]">Overall Champions 2026</h3>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter leading-tight">
                  CONGRATULATIONS <br />
                  <span style={{ color: winner.color }} className="break-words">
                    {winner.display_name}!
                  </span>
                </h2>
              </div>

              {/* Score Display */}
              <div className="bg-muted/30 p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-border/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: winner.color }} />
                <p className="text-muted-foreground font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2">Final Scoreboard</p>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                   <span className="text-5xl sm:text-6xl md:text-7xl font-black text-foreground tabular-nums leading-none">
                     {winner.total_points}
                   </span>
                   <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest self-end pb-1 sm:pb-2">
                     Points
                   </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:gap-4">
                <button 
                  onClick={() => setIsOpen(false)}
                  style={{ backgroundColor: winner.color }}
                  className="w-full text-white font-black py-4 sm:py-5 rounded-2xl uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:brightness-95 active:scale-95 transition-all shadow-lg text-xs sm:text-sm"
                >
                  View Standings
                </button>
                <div className="flex items-center justify-center gap-2 text-muted-foreground opacity-60">
                   <PartyPopper size={14} className="hidden xs:block" />
                   <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-center">
                      Celebrating the Excellence of ITUM
                   </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
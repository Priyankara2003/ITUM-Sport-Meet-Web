'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cubicBezier, motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export function HeroCountdown() {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  const [nextEvent, setNextEvent] = useState<{
    title: string
    event_date: string
    location: string
  } | null>(null)

  useEffect(() => {
    const fetchCountdownEvent = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('hero_countdown')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: true })
        .limit(1)
        .single()

      if (!error && data) {
        setNextEvent(data)
      }
    }

    fetchCountdownEvent()
  }, [])

  useEffect(() => {
    if (!nextEvent) return

    const timer = setInterval(() => {
      const countdownDate = new Date(nextEvent.event_date).getTime()
      const now = new Date().getTime()
      const distance = countdownDate - now

      if (distance > 0) {
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)))
        setHours(
          Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        )
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000))
      } else {
        setDays(0)
        setHours(0)
        setMinutes(0)
        setSeconds(0)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [nextEvent])

  const easeOut = cubicBezier(0.22, 1, 0.36, 1)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-8">
      <motion.div
        className="relative overflow-hidden rounded-xl border border-primary/30 bg-card/40 p-4 backdrop-blur-sm sm:p-8"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: easeOut, type: 'tween' }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-secondary/5" />

        <div className="relative">
            <h3 className="text-center text-xs sm:text-sm font-mono tracking-widest text-muted-foreground/90 mb-6 sm:mb-8 uppercase">
              Next Championship Battle
            </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { value: days, label: 'Days' },
              { value: hours, label: 'Hours' },
              { value: minutes, label: 'Minutes' },
              { value: seconds, label: 'Seconds' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="relative group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: easeOut, delay: idx * 0.08, type: 'tween' }}
              >
                <div className="absolute inset-0 rounded-lg bg-linear-to-br from-accent/20 to-accent/0 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative rounded-lg border border-primary/40 bg-linear-to-br from-background to-card p-4 text-center transition-colors duration-300 hover:border-accent/70">
                  <div className="text-3xl font-black text-primary md:text-4xl">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground md:text-sm">
                    {item.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="mb-2 text-sm font-semibold text-primary uppercase tracking-wide">
              {nextEvent ? `${nextEvent.title}` : 'Upcoming Event'}
            </p>
            <p className="text-xs text-muted-foreground">
              {nextEvent
                ? `${new Date(nextEvent.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${nextEvent.location}`
                : 'Fetching details...'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75, ease: easeOut, delay: 0.1, type: 'tween' }}
      >
        <motion.div
          className="w-full sm:w-auto"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.4, ease: easeOut, type: 'tween' }}
        >
          <Link
            href="/scoreboard"
            className="mx-auto block w-full max-w-65 rounded-lg border border-primary/60 bg-primary px-8 py-3 text-center text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(207,6,30,0.45)] sm:mx-0 sm:min-w-50 sm:w-auto"
          >
            <span>View Live Scores</span>
          </Link>
        </motion.div>
        <motion.div
          className="w-full sm:w-auto"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.4, ease: easeOut, type: 'tween' }}
        >
          <Link
            href="/gallery"
            className="mx-auto block w-full max-w-65 rounded-lg border border-primary/60 bg-primary px-8 py-3 text-center text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(207,6,30,0.45)] sm:mx-0 sm:min-w-50 sm:w-auto"
          >
            <span>Explore Gallery</span>
          </Link>
        </motion.div>
        <motion.div
          className="w-full sm:w-auto"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.4, ease: easeOut, type: 'tween' }}
        >
          <Link
            href="/schedule"
            className="mx-auto block w-full max-w-65 rounded-lg border border-primary/60 bg-primary px-8 py-3 text-center text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(207,6,30,0.45)] sm:mx-0 sm:min-w-50 sm:w-auto"
          >
            <span>Full Schedule</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

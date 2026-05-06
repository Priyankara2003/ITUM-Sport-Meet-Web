'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function HeroSection() {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  const [nextEvent, setNextEvent] = useState<{
    title: string;
    event_date: string;
    location: string;
  } | null>(null);

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

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-16 pb-20">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Title Section */}
        <div className="text-center mb-16 px-2">
          <div className="mb-4 inline-block">
            <div className="text-xs sm:text-sm font-mono tracking-widest text-primary/70 mb-2">WELCOME TO</div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-primary mb-2 text-balance drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              SPORT MEET
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-secondary tracking-wider">
              ITUM
            </h2>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-2 text-balance mt-4 sm:mt-6">
            Inter-House Championship of Valor
          </p>
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4">
            <div className="hidden sm:block w-12 h-px bg-gradient-to-r from-transparent to-primary/50"></div>
            <p className="text-[10px] sm:text-xs text-primary/60 uppercase tracking-widest text-center">Compete. Conquer. Celebrate</p>
            <div className="hidden sm:block w-12 h-px bg-gradient-to-l from-transparent to-primary/50"></div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="relative rounded-xl overflow-hidden mb-12 backdrop-blur-sm bg-card/40 border border-primary/30 p-4 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>

          <div className="relative">
            <h3 className="text-center text-xs sm:text-sm font-mono tracking-widest text-primary/80 mb-6 sm:mb-8 uppercase">
              Next Championship Battle
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                { value: days, label: 'Days' },
                { value: hours, label: 'Hours' },
                { value: minutes, label: 'Minutes' },
                { value: seconds, label: 'Seconds' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                  <div className="relative bg-gradient-to-br from-background to-card border border-primary/40 rounded-lg p-4 text-center hover:border-primary/70 transition-colors duration-300">
                    <div className="text-3xl md:text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-primary mb-2">
                {nextEvent ? `${nextEvent.title}` : 'Upcoming Event'}
              </p>
              <p className="text-xs text-muted-foreground">
                {nextEvent
                  ? `${new Date(nextEvent.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${nextEvent.location}`
                  : 'Fetching details...'}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/scoreboard"
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 border border-primary/50 hover:border-primary text-center group"
          >
            <span>View Live Scores</span>
          </Link>
          <Link
            href="/gallery"
            className="px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_20px_rgba(201,169,97,0.4)] transition-all duration-300 border border-secondary/50 hover:border-secondary text-center group"
          >
            <span>Explore Gallery</span>
          </Link>
          <Link
            href="/schedule"
            className="px-8 py-3 rounded-lg border border-primary/50 text-primary font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 hover:bg-primary/10 text-center"
          >
            <span>Full Schedule</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
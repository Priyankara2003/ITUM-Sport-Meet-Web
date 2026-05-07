'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cubicBezier, motion } from 'framer-motion'
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

  const heroImageUrl =
    'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/hero-f1.png'

  const houseLogos = [
    'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(5).png',
    'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(7).png',
    'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(8).png',
    'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(9).png',
  ]

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

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  }

  const easeOut = cubicBezier(0.22, 1, 0.36, 1)

  return (
    <div className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background pt-10 pb-18">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-8">
        {/* Title Section */}
        <div className="mb-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div
              className="text-center lg:text-left"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ duration: 0.95, ease: easeOut, type: 'tween' }}
            >
              <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
                <span className="block text-foreground/90">THIS IS YOUR</span>
                <span className="block text-foreground/70">MOMENT.</span>
                <span className="block text-foreground/55">MAKE IT</span>
                <span className="block text-foreground/40">COUNT.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base md:text-md text-muted-foreground">
                Four houses. Hundreds of athletes. One unforgettable sports meet, live at ITUM,
                right now.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                {houseLogos.map((logoUrl, index) => (
                  <motion.div
                    key={logoUrl}
                    className="relative h-14 w-18 opacity-90"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 0.9, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, ease: easeOut, delay: index * 0.08, type: 'tween' }}
                  >
                    <Image
                      src={logoUrl}
                      alt={`House logo ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.95, ease: easeOut, delay: 0.12, type: 'tween' }}
            >
              <motion.div
                className="relative w-full max-w-md"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.45, ease: easeOut, type: 'tween' }}
              >
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/15 via-transparent to-transparent blur-2xl"></div>
                <div className="relative rounded-3xl bg-card/10 p-0 overflow-hidden mt-[-1vh]">
                  <Image
                    src={heroImageUrl}
                    alt="Hero athlete"
                    width={520}
                    height={280}
                    loading="eager"
                    className="h-auto w-md"
                  />
                </div>
              </motion.div>
              {/* <Link
                href="/scoreboard"
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_20px_rgba(207,6,30,0.35)] transition-all duration-300 border border-primary/60 hover:border-primary text-center"
              >
                <span>Show Scoreboard</span>
              </Link> */}
            </motion.div>
          </div>
        </div>

        {/* Countdown Timer */}
        <motion.div
          className="relative rounded-xl overflow-hidden mb-12 backdrop-blur-sm bg-card/40 border border-primary/30 p-4 sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.85, ease: easeOut, delay: 0.12, type: 'tween' }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-secondary/5"></div>

          <div className="relative">
            <h3 className="text-center text-xs sm:text-sm font-mono tracking-widest text-muted-foreground/90 mb-6 sm:mb-8 uppercase">
              Next Championship Battle
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
                  transition={{ duration: 0.6, ease: easeOut, delay: idx * 0.1, type: 'tween' }}
                >
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                  <div className="relative bg-linear-to-br from-background to-card border border-primary/40 rounded-lg p-4 text-center hover:border-primary/70 transition-colors duration-300">
                    <div className="text-3xl md:text-4xl font-black text-primary/80">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                </motion.div>
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
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, ease: easeOut, delay: 0.12, type: 'tween' }}
        >
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, ease: easeOut, type: 'tween' }}
          >
            <Link
              href="/scoreboard"
              className="mx-auto block w-full max-w-[260px] px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_20px_rgba(207,6,30,0.45)] transition-all duration-300 border border-primary/60 hover:border-primary text-center group sm:mx-0 sm:min-w-[200px] sm:w-auto"
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
              className="mx-auto block w-full max-w-[260px] px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_20px_rgba(207,6,30,0.45)] transition-all duration-300 border border-primary/60 hover:border-primary text-center group sm:mx-0 sm:min-w-[200px] sm:w-auto"
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
              className="mx-auto block w-full max-w-[260px] px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_20px_rgba(207,6,30,0.45)] transition-all duration-300 border border-primary/60 hover:border-primary text-center group sm:mx-0 sm:min-w-[200px] sm:w-auto"
            >
              <span>Full Schedule</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
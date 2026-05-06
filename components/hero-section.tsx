'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function HeroSection() {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  const heroImageUrl =
    'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/hero-f1.png'

  const houseLogos = [
    'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(5).png',
    'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(7).png',
    'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(8).png',
    'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(9).png',
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      const countdownDate = new Date('2026-05-25').getTime()
      const now = new Date().getTime()
      const distance = countdownDate - now

      if (distance > 0) {
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)))
        setHours(
          Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        )
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-10 pb-18">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-8">
        {/* Title Section */}
        <div className="mb-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="text-center lg:text-left">
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
                  <div
                    key={logoUrl}
                    className="relative h-14 w-18 opacity-90"
                  >
                    <Image
                      src={logoUrl}
                      alt={`House logo ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-transparent blur-2xl"></div>
                <div className="relative rounded-3xl bg-card/10 p-0 overflow-hidden mt-[-1vh]">
                  <Image
                    src={heroImageUrl}
                    alt="Hero athlete"
                    width={520}
                    height={280}
                    className="h-auto w-md"
                  />
                </div>
              </div>
              {/* <Link
                href="/scoreboard"
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_20px_rgba(193,35,44,0.35)] transition-all duration-300 border border-primary/60 hover:border-primary text-center"
              >
                <span>Show Scoreboard</span>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="relative rounded-xl overflow-hidden mb-12 backdrop-blur-sm bg-card/40 border border-primary/30 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
          
          <div className="relative">
            <h3 className="text-center text-sm font-mono tracking-widest text-primary/80 mb-8 uppercase">
              Next Championship Battle
            </h3>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
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
              <p className="text-sm font-semibold text-primary mb-2">Cricket Match Championship</p>
              <p className="text-xs text-muted-foreground">May 25, 2026 • Central Ground</p>
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

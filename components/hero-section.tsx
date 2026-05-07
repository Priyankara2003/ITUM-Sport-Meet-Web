'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, cubicBezier, motion } from 'framer-motion'

export function HeroSection() {
  const [sliderIndex, setSliderIndex] = useState(0)

  const sliderImages = [
    '/images/hero-slider/001.jpg',
    '/images/hero-slider/002.jpg',
    '/images/hero-slider/017.jpg',
    '/images/hero-slider/027.jpg',
    '/images/hero-slider/DSC06115%20(1).jpg',
  ]

  const houseLogos = [
    {
      name: 'Phoenix',
      logoUrl: 'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(5).png',
    },
    {
      name: 'Draghar',
      logoUrl: 'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(7).png',
    },
    {
      name: 'Griffin',
      logoUrl: 'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(8).png',
    },
    {
      name: 'Horus',
      logoUrl: 'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(9).png',
    },
  ]


  useEffect(() => {
    if (sliderImages.length <= 1) return

    const sliderTimer = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderImages.length)
    }, 5000)

    return () => clearInterval(sliderTimer)
  }, [sliderImages.length])

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  }

  const easeOut = cubicBezier(0.22, 1, 0.36, 1)

  return (
    <div className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background pt-10 pb-14">
      {/* Background slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={sliderImages[sliderIndex]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.8, ease: [0.33, 1, 0.68, 1] }}
          >
            <Image
              src={sliderImages[sliderIndex]}
              alt="Hero background"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 z-10 opacity-10">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-8 mt-4">
        {/* Title Section */}
        <div className="mb-16">
          <div className="grid items-center gap-10">
            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ duration: 0.95, ease: easeOut, type: 'tween' }}
            >
              <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
                <span className="block text-foreground">THIS IS YOUR</span>
                <span className="block text-foreground">MOMENT.</span>
                <span className="block text-foreground">MAKE IT</span>
                <span className="block text-foreground">COUNT.</span>
              </h1>
              <p className="mt-6 mx-auto max-w-xl text-base md:text-md text-muted-foreground/70">
                Four houses. Hundreds of athletes. One unforgettable sports meet, live at ITUM,
                right now.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
                {houseLogos.map((house, index) => (
                  <motion.div
                    key={house.logoUrl}
                    className="group relative flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 0.9, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, ease: easeOut, delay: index * 0.08, type: 'tween' }}
                  >
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-primary bg-linear-to-br from-primary/35 via-primary/15 to-black/70 p-2 shadow-lg shadow-primary/40 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-primary/60">
                      <Image
                        src={house.logoUrl}
                        alt={`${house.name} logo`}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <span className="min-h-4 max-w-20 text-center text-[11px] font-light uppercase tracking-[0.18em] text-foreground/0 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-foreground">
                      {house.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  )
}
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, cubicBezier, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function HeroSection() {
  const [sliderIndex, setSliderIndex] = useState(0)

  const slides = [
    {
      image: '/images/hero-slider/001.jpg',
      title: 'FOUR HOUSES. ONE ULTIMATE GLORY.',
      subtitle: 'WITNESS THE BATTLE FOR THE 2026 CHAMPIONSHIP',
      description: 'From the strength of Horus to the fire of Phoenix, every house is ready to leave its mark. Track the live scoreboard and see which house will rise to claim the prestigious overall trophy this year.',
      buttonText: 'VIEW SCOREBOARD',
      link: '/scoreboard'
    },
    {
      image: '/images/hero-slider/002.jpg',
      title: 'REDEFINING THE LIMITS OF SPEED',
      subtitle: 'A SHOWCASE OF ELITE STUDENT ATHLETICISM',
      description: 'Precision, power, and performance take center stage. Join us at the Mahinda Rajapaksa Stadium to support our student-athletes as they break records and set new benchmarks for sporting excellence.',
      buttonText: 'SEE SCHEDULE',
      link: '/schedule'
    },
    {
      image: '/images/hero-slider/017.jpg',
      title: 'BUILDING LEGACIES BEYOND ACADEMICS',
      subtitle: 'STRENGTHENING BONDS THROUGH COMPETITIVE SPORT',
      description: 'The ITUM Sports Meet is more than a competition; it is a celebration of teamwork and leadership. Be part of the tradition that brings together students, staff, and alumni in the spirit of sportsmanship.',
      buttonText: 'BROWSE GALLERY',
      link: '/gallery'
    },
    {
      image: '/images/hero-slider/027.jpg',
      title: 'THE ARENA OF GREATNESS AWAITS',
      subtitle: 'WHERE DREAMS COLLIDE WITH DETERMINATION',
      description: 'The wait is over. The field is ready. Dive into the heart of the action as the next generation of leaders competes for the highest sporting honors in the institute’s history.',
      buttonText: 'READ MORE',
      link: '#'
    },
    {
      image: '/images/hero-slider/DSC06115 (1).jpg',
      title: 'UNLEASH THE SPIRIT OF CHAMPIONS',
      subtitle: 'AT THE ANNUAL ITUM INTER-HOUSE SPORTS MEET',
      description: 'Experience a day where talent meets tenacity. Watch as our four houses compete in a thrilling display of track and field excellence, celebrating the unity and athletic prowess of the ITUM community.',
      buttonText: 'EXPLORE EVENTS',
      link: '/events'
    },
  ]

  useEffect(() => {
    if (slides.length <= 1) return
    const sliderTimer = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(sliderTimer)
  }, [slides.length])

  const goToPrevious = () => {
    setSliderIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setSliderIndex((prev) => (prev + 1) % slides.length)
  }

  const easeOut = cubicBezier(0.22, 1, 0.36, 1)

  return (
    <div className="relative overflow-hidden bg-background w-full">
      
      {/* 1. Background slider (Z-0) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={slides[sliderIndex].image}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.8, ease: [0.33, 1, 0.68, 1] }}
          >
            <Image
              src={slides[sliderIndex].image}
              alt="Hero background"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/40 md:hidden" />
      </div>

      {/* 2. NAVIGATION ARROWS (Z-40) - Pinned to absolute sides and middle */}
      <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Previous image"
          className="pointer-events-auto rounded-full border border-white/20 bg-black/30 p-3 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-black/70 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        
        <button
          type="button"
          onClick={goToNext}
          aria-label="Next image"
          className="pointer-events-auto rounded-full border border-white/20 bg-black/30 p-3 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-black/70 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      {/* 3. CONTENT SECTION (Z-20) - Max-width constrained */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 md:px-16 h-150 md:h-175 flex items-center">
        <div className="w-full md:w-2/3 lg:w-1/2 pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={sliderIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.6, ease: easeOut }}
              className="flex flex-col gap-4"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg uppercase">
                {slides[sliderIndex].title}
              </h1>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary tracking-wide drop-shadow-md">
                {slides[sliderIndex].subtitle}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-200 line-clamp-3 md:line-clamp-none drop-shadow-md max-w-lg leading-relaxed">
                {slides[sliderIndex].description}
              </p>
              
              <div className="mt-6">
                <Link
                  href={slides[sliderIndex].link}
                  className="inline-block bg-black hover:bg-white hover:text-black text-white font-bold tracking-wider uppercase text-sm px-8 py-3 rounded-sm transition-all border border-white/20"
                >
                  {slides[sliderIndex].buttonText}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
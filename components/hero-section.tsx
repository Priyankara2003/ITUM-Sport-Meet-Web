'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, cubicBezier, motion } from 'framer-motion'

export function HeroSection() {
  const [sliderIndex, setSliderIndex] = useState(0)

  const slides = [
    {
      image: '/images/hero-slider/001.jpg',
      title: 'VANGUARD RACING MAKES HISTORY',
      subtitle: 'AT THE INAUGURAL GRIDX STEM MOTORSPORT CHALLENGE',
      description: "The GridX STEM Motorsport Challenge 2025, Sri Lanka's first-ever STEM competition of its kind, concluded with roaring success.",
      buttonText: 'READ MORE',
      link: '#'
    },
    {
      image: '/images/hero-slider/002.jpg',
      title: 'THE ULTIMATE SHOWDOWN BEGINS',
      subtitle: 'INTER-HOUSE CHAMPIONSHIP 2026',
      description: 'Witness the glory as four houses battle for the ultimate championship title. The passion, the drive, and the victory await.',
      buttonText: 'READ MORE',
      link: '#'
    },
    {
      image: '/images/hero-slider/017.jpg',
      title: 'ATHLETES READY FOR GLORY',
      subtitle: 'PUSHING THE LIMITS OF HUMAN POTENTIAL',
      description: 'Months of rigorous training come down to this moment. Who will emerge victorious and claim the ultimate prize?',
      buttonText: 'READ MORE',
      link: '#'
    },
    {
      image: '/images/hero-slider/027.jpg',
      title: 'A CELEBRATION OF SPORTSMANSHIP',
      subtitle: 'UNITING STUDENTS THROUGH COMPETITION',
      description: 'Beyond the medals and trophies lies the true spirit of sportsmanship. A day of unity, passion, and unforgettable memories.',
      buttonText: 'READ MORE',
      link: '#'
    },
    {
      image: '/images/hero-slider/DSC06115%20(1).jpg',
      title: 'BREAKING RECORDS, MAKING HISTORY',
      subtitle: 'A NEW ERA OF EXCELLENCE AT ITUM',
      description: 'The track is set, the crowds are cheering. Prepare to witness history in the making at the grand finale.',
      buttonText: 'READ MORE',
      link: '#'
    },
  ]

  const houseLogos = [
    {
      name: 'Phoenix',
      logoUrl: 'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(5).png',
      color: '#cf061e',
    },
    {
      name: 'Draghar',
      logoUrl: 'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(7).png',
      color: '#1d4ed8',
    },
    {
      name: 'Griffin',
      logoUrl: 'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(8).png',
      color: '#15803d',
    },
    {
      name: 'Horus',
      logoUrl: 'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/Neww%20(9).png',
      color: '#eab308',
    },
  ]


  useEffect(() => {
    if (slides.length <= 1) return

    const sliderTimer = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(sliderTimer)
  }, [slides.length])

  const easeOut = cubicBezier(0.22, 1, 0.36, 1)

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background slider */}
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
        
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/40 md:hidden" /> {/* Extra dark for mobile */}
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-6 md:px-8 h-[600px] md:h-[700px] flex items-center">
        {/* Text Section */}
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
                  className="inline-block bg-black hover:bg-black/85 text-white font-bold tracking-wider uppercase text-sm px-8 py-3 rounded-sm transition-all border border-black"
                >
                  {slides[sliderIndex].buttonText}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* House Logos */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-wrap justify-center md:justify-end md:right-8 md:left-auto gap-4 sm:gap-6 px-4">
          {houseLogos.map((house, index) => (
            <motion.div
              key={house.logoUrl}
              className="group relative flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.5 + index * 0.08, type: 'tween' }}
            >
              <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border-2 border-white/20 bg-black/40 backdrop-blur-md shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-black/60">
                <div 
                  className="absolute inset-[-2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    boxShadow: `0 0 20px ${house.color}66`,
                    borderColor: house.color,
                    borderWidth: '2px',
                    borderStyle: 'solid'
                  }}
                />
                <Image
                  src={house.logoUrl}
                  alt={`${house.name} logo`}
                  fill
                  className="object-contain p-2.5 md:p-3 drop-shadow-md z-10"
                />
              </div>
              <span 
                className="absolute -top-8 text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-white bg-black/80 px-3 py-1.5 rounded-md backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100 shadow-lg"
                style={{ borderBottom: `2px solid ${house.color}` }}
              >
                {house.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
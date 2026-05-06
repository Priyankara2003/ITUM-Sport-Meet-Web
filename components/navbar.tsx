'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type WeatherState = {
  location: string
  tempC: number
  condition: string
  iconUrl: string | null
}

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [weather, setWeather] = useState<WeatherState | null>(null)
  const [weatherError, setWeatherError] = useState(false)

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/scoreboard', label: 'SCOREBOARD' },
    { href: '/schedule', label: 'SCHEDULE' },
    { href: '/gallery', label: 'GALLERY' },
  ]

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY

    if (!apiKey) {
      setWeatherError(true)
      return
    }

    let isCancelled = false

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Diyagama&aqi=no`,
        )

        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }

        const data = await response.json()
        const icon = data?.current?.condition?.icon ?? null

        if (!isCancelled) {
          setWeather({
            location: data?.location?.name ?? 'Diyagama',
            tempC: data?.current?.temp_c ?? 0,
            condition: data?.current?.condition?.text ?? 'Unknown',
            iconUrl: icon ? (icon.startsWith('//') ? `https:${icon}` : icon) : null,
          })
        }
      } catch {
        if (!isCancelled) {
          setWeatherError(true)
        }
      }
    }

    fetchWeather()

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <nav className="sticky top-0 z-50">
      {/* Glassmorphism backdrop */}
      <div className="absolute inset-0 backdrop-blur-md bg-background/80 border-b border-primary/20"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 flex items-center justify-between h-20">
        {/* Logo/Branding */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-300"
        >
          <Image
            src="https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/meet%20logo.png"
            alt="Sport Meet ITUM"
            width={72}
            height={72}
            className="h-16 w-auto"
            priority
          />
          <span className="sr-only">Sport Meet ITUM</span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2 font-semibold text-xs tracking-widest transition-all duration-300 group ${
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {item.label}
              {/* Gold underline on active */}
              {isActive(item.href) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              )}
              {/* Hover effect */}
              {!isActive(item.href) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Weather */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
            <div className="flex items-center gap-2 text-xs text-primary/80 font-mono tracking-wide">
              {weather?.iconUrl ? (
                <Image
                  src={weather.iconUrl}
                  alt={weather.condition}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-primary/20" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {weather?.location ?? 'Diyagama'}
              </span>
              <span className="font-semibold">
                {weather ? `${Math.round(weather.tempC)}°C` : '--°C'}
              </span>
              <span className="hidden sm:inline text-primary/60">
                {weather
                  ? weather.condition
                  : weatherError
                    ? 'Weather unavailable'
                    : 'Loading weather'}
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative text-primary hover:text-primary/80 transition-colors p-1 w-8 h-8 flex items-center justify-center overflow-hidden"
              aria-label="Toggle menu"
            >
              <div
                className={`absolute transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
                }`}
              >
                <Menu size={24} />
              </div>
              <div
                className={`absolute transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'
                }`}
              >
                <X size={24} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute left-0 right-0 bg-background/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(212,175,55,0.1)] transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[400px] opacity-100 border-b border-primary/20' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`relative px-4 py-3 text-sm font-bold tracking-widest transition-all duration-300 rounded-lg ${
                isActive(item.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="px-4 pb-4 text-xs text-primary/70 font-mono tracking-wide">
          {weather
            ? `Diyagama · ${Math.round(weather.tempC)}°C · ${weather.condition}`
            : weatherError
              ? 'Weather unavailable'
              : 'Loading weather...'}
        </div>
      </div>
    </nav>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/scoreboard', label: 'SCOREBOARD' },
    { href: '/schedule', label: 'SCHEDULE' },
    { href: '/gallery', label: 'GALLERY' },
  ]

  if (isAdminRoute) {
    return null
  }

  return (
    <nav className="fixed w-full top-0 z-50">
      {/* Background with scroll effect */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${isScrolled
          ? 'bg-[#961300]/85 backdrop-blur-md shadow-md'
          : 'bg-linear-to-r from-[#961300] via-[#4a0a00] to-black shadow-none'
          }`}
      ></div>

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
            width={90}
            height={90}
            className="h-20 w-auto scale-125 origin-left"
            priority
          />
          <span className="sr-only">Sport Meet ITUM</span>
        </Link>

        {/* Right Side: Navigation & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 font-semibold text-xs tracking-widest transition-all duration-300 group ${isActive(item.href)
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
                  }`}
              >
                {item.label}
                {/* White underline on active */}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                )}
                {/* Hover effect */}
                {!isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative text-white hover:text-white/80 transition-colors p-1 w-8 h-8 flex items-center justify-center overflow-hidden"
              aria-label="Toggle menu"
            >
              <div
                className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
                  }`}
              >
                <Menu size={24} />
              </div>
              <div
                className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'
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
        className={`md:hidden absolute left-0 right-0 bg-background/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(207,6,30,0.1)] transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-100 opacity-100 border-b border-primary/20' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`relative px-4 py-3 text-sm font-bold tracking-widest transition-all duration-300 rounded-lg ${isActive(item.href)
                ? 'text-[#961300] bg-[#961300]/10'
                : 'text-muted-foreground hover:text-[#961300] hover:bg-[#961300]/5'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

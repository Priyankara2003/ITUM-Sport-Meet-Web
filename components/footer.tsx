import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-800 bg-black py-12 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
          
          {/* Left Column: Contact Info (Address Only) */}
          <div className="flex flex-col items-center md:items-start space-y-4 order-2 md:order-1">
            <h3 className="text-[#961300] font-bold text-lg mb-2 tracking-wide uppercase">Contact Info</h3>
            <div className="text-sm text-neutral-400 space-y-1">
              <p className="font-bold text-white">INSTITUTE OF TECHNOLOGY</p>
              <p>University of Moratuwa,</p>
              <p>Diyagama,</p>
              <p>Homagama,</p>
              <p>Sri Lanka.</p>
            </div>
          </div>

          {/* Middle Column: Brand & Credits */}
          <div className="flex flex-col items-center text-center space-y-4 order-1 md:order-2">
            <div>
              <p className="text-[#961300] font-black text-2xl">
                SPORT MEET - ITUM
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#961300]/50"></div>
              <p className="text-xs text-neutral-400 uppercase tracking-widest">Inter-House Championship</p>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#961300]/50"></div>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm">
              Celebrating athletic excellence, house pride, and the pursuit of glory
            </p>
            
            {/* 2 Columns for Developers (23 Batch & 24 Batch) */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 text-xs font-semibold text-[#961300]/90 w-full max-w-md">
              {/* 23 Batch Column */}
              <div className="flex flex-col items-center md:items-start space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Dev</span>
                  <span className="blink-dot text-[#961300]">•</span>
                  <span>Dhanushka (83)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Dev</span>
                  <span className="blink-dot text-[#961300]">•</span>
                  <span>Vihara (84)</span>
                </div>
              </div>

              {/* 24 Batch Column */}
              <div className="flex flex-col items-center md:items-start space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Dev</span>
                  <span className="blink-dot text-[#961300]">•</span>
                  <a href="https://www.linkedin.com/in/srinath-priyankara" target="_blank" rel="noopener noreferrer" className="text-[#961300] hover:underline">
                    Srinath
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Dev</span>
                  <span className="blink-dot text-[#961300]">•</span>
                  <a href="https://www.dhanushka.live" target="_blank" rel="noopener noreferrer" className="text-[#961300] hover:underline">
                    Dhanushka
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Social Icons */}
          <div className="flex flex-col items-center md:items-end space-y-4 order-3">
            <h3 className="text-[#961300] font-bold text-lg mb-2 tracking-wide uppercase">Connect With Us</h3>
            <div className="flex gap-2 justify-center md:justify-end">
              <Link 
                href="https://www.facebook.com/profile.php?id=61576624917667" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-neutral-700/40 text-neutral-400 rounded hover:bg-[#961300]/20 hover:text-[#961300] transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} strokeWidth={2.5} />
              </Link>
              <Link 
                href="https://www.instagram.com/itum.mrt.ac.lk/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-neutral-700/40 text-neutral-400 rounded hover:bg-[#961300]/20 hover:text-[#961300] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} strokeWidth={2.5} />
              </Link>
              <Link 
                href="https://x.com/itumlk" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-neutral-700/40 text-neutral-400 rounded hover:bg-[#961300]/20 hover:text-[#961300] transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={20} strokeWidth={2.5} />
              </Link>
              <Link 
                href="https://www.youtube.com/channel/UCeGA6J0404xYDFMFnNkjZDg" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-neutral-700/40 text-neutral-400 rounded hover:bg-[#961300]/20 hover:text-[#961300] transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={20} strokeWidth={2.5} />
              </Link>
              <Link 
                href="https://www.linkedin.com/company/institute-of-technology-university-of-moratuwa/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-neutral-700/40 text-neutral-400 rounded hover:bg-[#961300]/20 hover:text-[#961300] transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-neutral-700 text-center">
          <p className="text-xs text-neutral-500 tracking-wider">
            Copyright © ITUM 2026. All rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
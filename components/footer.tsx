import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-32 border-t border-primary/20 backdrop-blur-sm bg-card/30 py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Changed items-start to items-center to vertically center everything */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
          
          {/* Left Column: Contact Info (Address Only) */}
          <div className="flex flex-col items-center md:items-start space-y-4 order-2 md:order-1">
            <h3 className="text-primary font-bold text-lg mb-2 tracking-wide uppercase">Contact Info</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-bold text-foreground">INSTITUTE OF TECHNOLOGY</p>
              <p>University of Moratuwa,</p>
              <p>Diyagama,</p>
              <p>Homagama,</p>
              <p>Sri Lanka.</p>
            </div>
          </div>

          {/* Middle Column: Brand & Credits */}
          <div className="flex flex-col items-center text-center space-y-4 order-1 md:order-2">
            <div>
              <p className="text-primary font-black text-2xl drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                SPORT MEET - ITUM
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/50"></div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Inter-House Championship</p>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/50"></div>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm">
              Celebrating athletic excellence, house pride, and the pursuit of glory
            </p>
            
            {/* 2 Columns for Developers (23 Batch & 24 Batch) */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 text-xs font-semibold text-primary/90 w-full max-w-md">
              {/* 23 Batch Column */}
              <div className="flex flex-col items-center md:items-end space-y-2">
                <div className="text-neutral-400 mb-1 border-b border-primary/20 pb-1 uppercase tracking-wider text-[10px]">23 Batch</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Dev</span>
                  <span className="blink-dot text-primary">•</span>
                  <span>[Name 1]</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Dev</span>
                  <span className="blink-dot text-primary">•</span>
                  <span>[Name 2]</span>
                </div>
              </div>

              {/* 24 Batch Column */}
              <div className="flex flex-col items-center md:items-start space-y-2">
                <div className="text-neutral-400 mb-1 border-b border-primary/20 pb-1 uppercase tracking-wider text-[10px]">24 Batch</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Dev</span>
                  <span className="blink-dot text-primary">•</span>
                  <span>Srinath</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Dev</span>
                  <span className="blink-dot text-primary">•</span>
                  <span>Dhanushka</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Social Icons */}
          <div className="flex flex-col items-center md:items-end space-y-4 order-3">
            <h3 className="text-primary font-bold text-lg mb-2 tracking-wide uppercase">Connect With Us</h3>
            <div className="flex gap-2 justify-center md:justify-end">
              <Link 
                href="https://www.facebook.com/profile.php?id=61576624917667" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-neutral-500/20 text-muted-foreground rounded hover:bg-primary/20 hover:text-primary transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} strokeWidth={2.5} />
              </Link>
              <Link 
                href="#" 
                className="p-2.5 bg-neutral-500/20 text-muted-foreground rounded hover:bg-primary/20 hover:text-primary transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} strokeWidth={2.5} />
              </Link>
              <Link 
                href="#" 
                className="p-2.5 bg-neutral-500/20 text-muted-foreground rounded hover:bg-primary/20 hover:text-primary transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={20} strokeWidth={2.5} />
              </Link>
              <Link 
                href="#" 
                className="p-2.5 bg-neutral-500/20 text-muted-foreground rounded hover:bg-primary/20 hover:text-primary transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={20} strokeWidth={2.5} />
              </Link>
              <Link 
                href="#" 
                className="p-2.5 bg-neutral-500/20 text-muted-foreground rounded hover:bg-primary/20 hover:text-primary transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-primary/10 text-center">
          <p className="text-xs text-muted-foreground/50 tracking-wider">
            Copyright © ITUM 2026. All rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
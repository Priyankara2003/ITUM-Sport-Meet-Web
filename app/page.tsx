import Link from 'next/link'
import { HeroSection } from '@/components/hero-section'
import { LiveTicker } from '@/components/live-ticker'
import { HouseRankings } from '@/components/house-rankings'
import { UpcomingEvents } from '@/components/upcoming-events'
import { MotionItem, MotionSection } from '@/components/motion-section'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />

      <div className="mx-auto max-w-7xl px-4 py-16 space-y-24">
        {/* Live Ticker Section */}
        <MotionSection className="relative z-10" delay={0.05}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              LIVE ACTION
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-linear-to-r from-transparent to-primary"></div>
              <p className="text-muted-foreground tracking-widest text-sm uppercase">Real-time Updates</p>
              <div className="w-12 h-px bg-linear-to-l from-transparent to-primary"></div>
            </div>
          </div>
          <LiveTicker />
        </MotionSection>

        {/* House Rankings Section */}
        <MotionSection className="relative z-10" delay={0.1}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              HOUSE STANDINGS
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-linear-to-r from-transparent to-primary"></div>
              <p className="text-muted-foreground tracking-widest text-sm uppercase">Championship Rankings</p>
              <div className="w-12 h-px bg-linear-to-l from-transparent to-primary"></div>
            </div>
          </div>
          <HouseRankings />
          <div className="text-center mt-8">
            <Link
              href="/scoreboard"
              className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold tracking-wider uppercase text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 border border-primary/50"
            >
              View All Scores
            </Link>
          </div>
        </MotionSection>

        {/* Upcoming Events Section */}
        <MotionSection className="relative z-10" delay={0.15}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              UPCOMING BATTLES
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-linear-to-r from-transparent to-primary"></div>
              <p className="text-muted-foreground tracking-widest text-sm uppercase">Next Events</p>
              <div className="w-12 h-px bg-linear-to-l from-transparent to-primary"></div>
            </div>
          </div>
          <UpcomingEvents />
          <div className="text-center mt-8">
            <Link
              href="/schedule"
              className="inline-block px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-bold tracking-wider uppercase text-sm hover:shadow-[0_0_20px_rgba(201,169,97,0.4)] transition-all duration-300 border border-secondary/50"
            >
              Full Schedule
            </Link>
          </div>
        </MotionSection>

        {/* Featured Sections */}
        <MotionSection className="relative z-10" delay={0.2}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              DISCOVER
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-linear-to-r from-transparent to-primary"></div>
              <p className="text-muted-foreground tracking-widest text-sm uppercase">Explore More</p>
              <div className="w-12 h-px bg-linear-to-l from-transparent to-primary"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MotionItem delay={0.05} className="h-full">
              <Link
                href="/gallery"
                className="group relative flex h-full min-h-45 flex-col overflow-hidden rounded-xl p-6 backdrop-blur-sm bg-card/50 border border-primary/30 hover:border-primary/70 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/5 group-hover:to-primary/15 transition-all duration-300"></div>
                <div className="relative">
                  <h3 className="font-black text-2xl text-primary mb-2 uppercase tracking-wider">Gallery</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Witness the glory. View photos from epic battles and house celebrations
                  </p>
                </div>
              </Link>
            </MotionItem>
            <MotionItem delay={0.12} className="h-full">
              <Link
                href="/scoreboard"
                className="group relative flex h-full min-h-45 flex-col overflow-hidden rounded-xl p-6 backdrop-blur-sm bg-card/50 border border-secondary/30 hover:border-secondary/70 transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,169,97,0.2)]"
              >
                <div className="absolute inset-0 bg-linear-to-br from-secondary/0 to-secondary/5 group-hover:to-secondary/15 transition-all duration-300"></div>
                <div className="relative">
                  <h3 className="font-black text-2xl text-secondary mb-2 uppercase tracking-wider">Scoreboard</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Track the battle. Check detailed scores and compete for supremacy
                  </p>
                </div>
              </Link>
            </MotionItem>
            <MotionItem delay={0.18} className="h-full">
              <Link
                href="/schedule"
                className="group relative flex h-full min-h-45 flex-col overflow-hidden rounded-xl p-6 backdrop-blur-sm bg-card/50 border border-primary/30 hover:border-primary/70 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/5 group-hover:to-primary/15 transition-all duration-300"></div>
                <div className="relative">
                  <h3 className="font-black text-2xl text-primary mb-2 uppercase tracking-wider">Schedule</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Plan your conquest. Find upcoming events and prepare for glory
                  </p>
                </div>
              </Link>
            </MotionItem>
          </div>
        </MotionSection>
      </div>

      {/* Footer */}
      <footer className="mt-32 border-t border-primary/20 backdrop-blur-sm bg-card/30 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mb-4">
            <p className="text-primary font-black text-2xl drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
              SPORT MEET - ITUM
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-linear-to-r from-transparent to-primary/50"></div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Inter-House Championship</p>
            <div className="w-12 h-px bg-linear-to-l from-transparent to-primary/50"></div>
          </div>
          <p className="text-xs text-muted-foreground">
            Celebrating athletic excellence, house pride, and the pursuit of glory
          </p>
        </div>
      </footer>
    </main>
  )
}

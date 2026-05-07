import Link from 'next/link'
import { ScoreboardContent } from '@/components/scoreboard-content'
import { MotionItem, MotionSection } from '@/components/motion-section'

export const metadata = {
  title: 'Live Scoreboard - VarsityPulse',
  description: 'Real-time scores and standings for all inter-house sports events',
}

export default function ScoreboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <MotionItem className="mx-auto max-w-7xl px-4 py-6" delay={0.05}>
          <Link
            href="/"
            className="text-muted-foreground mb-4 inline-block text-sm"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Live Scoreboard</h1>
          <p className="text-muted-foreground mt-2">
            Real-time scores and standings
          </p>
        </MotionItem>
      </header>

      <MotionSection className="mx-auto max-w-7xl px-4 py-12" delay={0.1}>
        <ScoreboardContent />
      </MotionSection>
    </main>
  )
}

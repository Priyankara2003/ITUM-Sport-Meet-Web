import Link from 'next/link'
import { ScheduleContent } from '@/components/schedule-content'
import { MotionItem, MotionSection } from '@/components/motion-section'

export const metadata = {
  title: 'Event Schedule - VarsityPulse',
  description: 'Calendar view of all upcoming and past inter-house sports events',
}

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <MotionItem className="mx-auto max-w-7xl px-4 py-6" delay={0.05}>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Event Schedule</h1>
          <p className="text-muted-foreground mt-2">
            All upcoming and past events
          </p>
        </MotionItem>
      </header>

      <MotionSection className="mx-auto max-w-7xl px-4 py-12" delay={0.1}>
        <ScheduleContent />
      </MotionSection>
    </main>
  )
}

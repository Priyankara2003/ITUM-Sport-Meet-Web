import Link from 'next/link'
import { GalleryContent } from '@/components/gallery-content'

export const metadata = {
  title: 'Gallery & Wall of Fame - VarsityPulse',
  description: 'Explore photos from events and celebrate our champions in the Wall of Fame Gallery.',
}

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-foreground">
            Wall of Fame Gallery
          </h1>
          <p className="text-muted-foreground mt-2">
            Celebrate athletic achievements and memorable moments
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 space-y-16">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Event Photos
          </h2>
          <GalleryContent />
        </section>
      </div>

      <footer className="mt-24 border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>Honoring excellence and celebrating our champions</p>
        </div>
      </footer>
    </main>
  )
}

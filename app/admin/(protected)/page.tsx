import Link from 'next/link'

const cards = [
  {
    title: 'Events',
    description: 'Create schedules, manage match details, and update statuses.',
    href: '/admin/events',
  },
  {
    title: 'Matches',
    description: 'Update live scores and ranks for each event.',
    href: '/admin/matches',
  },
  {
    title: 'Athletics Results',
    description: 'Publish Track & Field podium results and history.',
    href: '/admin/athletics-results',
  },
  {
    title: 'Houses',
    description: 'Adjust house data, colors, and totals in real time.',
    href: '/admin/houses',
  },
  {
    title: 'Gallery',
    description: 'Manage galleries and feature event images.',
    href: '/admin/gallery',
  },
  {
    title: 'Hero Countdown',
    description: 'Control the headline event and countdown display.',
    href: '/admin/hero-countdown',
  },
  {
    title: 'News Updates',
    description: 'Publish live ticker announcements.',
    href: '/admin/news',
  },
  {
    title: 'Admins',
    description: 'Add or remove admin access securely.',
    href: '/admin/admins',
  },
  {
    title: 'Championship',
    description: 'Update house points and publish final standings.',
    href: '/admin/championship',
  }
]

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Control every public feature from this admin workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-2xl border border-border/60 bg-card/40 p-5 transition-shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

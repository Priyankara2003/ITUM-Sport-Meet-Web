'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/matches', label: 'Matches' },
  { href: '/admin/live-score', label: '⚡ Live Score' },
  { href: '/admin/athletics-results', label: 'Athletics Results' },
  { href: '/admin/houses', label: 'Houses' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/hero-countdown', label: 'Hero Countdown' },
  { href: '/admin/news', label: 'News Updates' },
  { href: '/admin/admins', label: 'Admins' },
]

export function AdminNav({
  onNavigate,
}: {
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  return (
    <aside className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Manage
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="pt-2">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </aside>
  )
}

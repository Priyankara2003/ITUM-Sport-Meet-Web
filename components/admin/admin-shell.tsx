'use client'

import { useState, type ReactNode } from 'react'
import { AdminNav } from './admin-nav'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              ITUM Sports Meet
            </p>
            <h1 className="text-2xl font-bold text-foreground">Admin Control Center</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <AdminNav />
        </div>
        <main className="min-w-0">{children}</main>
      </div>

      <div
        className={
          mobileOpen
            ? 'fixed inset-0 z-50 lg:hidden'
            : 'pointer-events-none fixed inset-0 z-50 lg:hidden'
        }
      >
        <button
          type="button"
          className={
            mobileOpen
              ? 'absolute inset-0 bg-background/80 transition-opacity'
              : 'absolute inset-0 bg-background/80 opacity-0 transition-opacity'
          }
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
        <div
          className={
            mobileOpen
              ? 'absolute left-0 top-0 h-full w-[min(80vw,320px)] translate-x-0 border-r border-border/60 bg-card/95 p-4 shadow-xl transition-transform'
              : 'absolute left-0 top-0 h-full w-[min(80vw,320px)] -translate-x-full border-r border-border/60 bg-card/95 p-4 shadow-xl transition-transform'
          }
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Admin Menu</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-4" />
            </Button>
          </div>
          <AdminNav onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>
    </div>
  )
}

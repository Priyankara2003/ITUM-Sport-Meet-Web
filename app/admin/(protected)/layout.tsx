import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/admin-shell'
import { getAdminStatus } from '@/lib/supabase/admin'

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, isAdmin } = await getAdminStatus()

  if (!user) {
    redirect('/admin/login')
  }

  if (!isAdmin) {
    redirect('/admin/login?reason=not-admin')
  }

  return <AdminShell>{children}</AdminShell>
}

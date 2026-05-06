'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface AdminUser {
  user_id: string
  email: string | null
  created_at: string
}

const emptyForm = {
  user_id: '',
  email: '',
}

export default function AdminAdminsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  const fetchAdmins = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      setAdmins([])
    } else {
      setAdmins(data || [])
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm('Remove admin access?')
    if (!confirmed) return

    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('user_id', userId)

    if (error) {
      setError(error.message)
      return
    }

    fetchAdmins()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      user_id: form.user_id.trim(),
      email: form.email.trim() || null,
    }

    if (!payload.user_id) {
      setError('User ID is required.')
      setSaving(false)
      return
    }

    const { error } = await supabase.from('admin_users').insert(payload)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    setSaving(false)
    setForm({ ...emptyForm })
    fetchAdmins()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Admins</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only admins can add or remove admin access.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="user_id">User ID (UUID)</Label>
            <Input
              id="user_id"
              value={form.user_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, user_id: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Add admin'}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </form>

      <div className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Admin list</h3>
          <span className="text-sm text-muted-foreground">
            {admins.length} total
          </span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading admins...</p>
        ) : admins.length === 0 ? (
          <p className="text-sm text-muted-foreground">No admins yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-2 py-2">User ID</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Created</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {admins.map((admin) => (
                  <tr key={admin.user_id}>
                    <td className="px-2 py-3 text-muted-foreground">
                      {admin.user_id}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {admin.email || 'Not set'}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {new Date(admin.created_at).toLocaleString()}
                    </td>
                    <td className="px-2 py-3 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(admin.user_id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

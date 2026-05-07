'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface HeroCountdown {
  id: string
  title: string
  event_date: string
  location: string
  is_active: boolean
}

const emptyForm = {
  title: '',
  event_date: '',
  location: '',
  is_active: false,
}

function toLocalInputValue(value: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (num: number) => String(num).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function AdminHeroCountdownPage() {
  const supabase = useMemo(() => createClient(), [])
  const [entries, setEntries] = useState<HeroCountdown[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  const fetchEntries = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('hero_countdown')
      .select('*')
      .order('event_date', { ascending: true })

    if (error) {
      setError(error.message)
      setEntries([])
    } else {
      setEntries(data || [])
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const handleEdit = (entry: HeroCountdown) => {
    setEditingId(entry.id)
    setForm({
      title: entry.title,
      event_date: toLocalInputValue(entry.event_date),
      location: entry.location ?? '',
      is_active: entry.is_active,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  const handleDelete = async (entryId: string) => {
    const confirmed = window.confirm('Delete this countdown entry?')
    if (!confirmed) return

    const { error } = await supabase
      .from('hero_countdown')
      .delete()
      .eq('id', entryId)

    if (error) {
      setError(error.message)
      return
    }

    fetchEntries()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      title: form.title.trim(),
      event_date: form.event_date
        ? new Date(form.event_date).toISOString()
        : null,
      location: form.location.trim(),
      is_active: form.is_active,
    }

    if (payload.is_active) {
      await supabase
        .from('hero_countdown')
        .update({ is_active: false })
        .neq('id', editingId || '00000000-0000-0000-0000-000000000000')
    }

    if (editingId) {
      const { error } = await supabase
        .from('hero_countdown')
        .update(payload)
        .eq('id', editingId)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('hero_countdown').insert(payload)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    handleCancel()
    fetchEntries()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Hero Countdown</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Control the headline countdown displayed on the homepage.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event_date">Event date</Label>
            <Input
              id="event_date"
              type="datetime-local"
              value={form.event_date}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, event_date: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, location: event.target.value }))
              }
            />
          </div>
          <div className="flex items-end gap-2">
            <input
              id="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, is_active: event.target.checked }))
              }
            />
            <Label htmlFor="is_active">Set as active countdown</Label>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving
              ? 'Saving...'
              : editingId
                ? 'Update countdown'
                : 'Create countdown'}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </form>

      <div className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">All entries</h3>
          <span className="text-sm text-muted-foreground">
            {entries.length} total
          </span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading entries...</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No entries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Active</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-2 py-3 text-muted-foreground">
                      {entry.title}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {new Date(entry.event_date).toLocaleString()}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {entry.is_active ? 'Yes' : 'No'}
                    </td>
                    <td className="px-2 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(entry)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                        >
                          Delete
                        </Button>
                      </div>
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

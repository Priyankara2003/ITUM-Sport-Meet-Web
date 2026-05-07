'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'

interface SportEvent {
  id: string
  name: string
  sport_type: string
  event_date: string
  location: string
  status: 'scheduled' | 'ongoing' | 'completed'
  points_available: number
  description: string | null
  created_at: string
  updated_at: string
}

const emptyForm = {
  name: '',
  sport_type: '',
  event_date: '',
  location: '',
  status: 'scheduled' as SportEvent['status'],
  points_available: 0,
  description: '',
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

export default function AdminEventsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [events, setEvents] = useState<SportEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('sports_events')
      .select('*')
      .order('event_date', { ascending: true })

    if (error) {
      setError(error.message)
      setEvents([])
    } else {
      setEvents(data || [])
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleEdit = (event: SportEvent) => {
    setEditingId(event.id)
    setForm({
      name: event.name,
      sport_type: event.sport_type,
      event_date: toLocalInputValue(event.event_date),
      location: event.location ?? '',
      status: event.status,
      points_available: event.points_available,
      description: event.description ?? '',
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm('Delete this event?')
    if (!confirmed) return

    const { error } = await supabase
      .from('sports_events')
      .delete()
      .eq('id', eventId)

    if (error) {
      setError(error.message)
      return
    }

    fetchEvents()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      name: form.name.trim(),
      sport_type: form.sport_type.trim(),
      event_date: form.event_date
        ? new Date(form.event_date).toISOString()
        : null,
      location: form.location.trim(),
      status: form.status,
      points_available: Number(form.points_available) || 0,
      description: form.description.trim() || null,
    }

    if (editingId) {
      const { error } = await supabase
        .from('sports_events')
        .update(payload)
        .eq('id', editingId)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('sports_events').insert(payload)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    handleCancel()
    fetchEvents()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Events</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage schedule entries and event metadata.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Event name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sport_type">Sport type</Label>
            <Input
              id="sport_type"
              value={form.sport_type}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, sport_type: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event_date">Date and time</Label>
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
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  status: event.target.value as SportEvent['status'],
                }))
              }
            >
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="points_available">Points available</Label>
            <Input
              id="points_available"
              type="number"
              min={0}
              value={form.points_available}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  points_available: Number(event.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update event' : 'Create event'}
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
          <h3 className="text-lg font-semibold text-foreground">All events</h3>
          <span className="text-sm text-muted-foreground">
            {events.length} total
          </span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Points</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-2 py-3">
                      <p className="font-medium text-foreground">
                        {event.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.sport_type}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {new Date(event.event_date).toLocaleString()}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {event.status}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {event.points_available}
                    </td>
                    <td className="px-2 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
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

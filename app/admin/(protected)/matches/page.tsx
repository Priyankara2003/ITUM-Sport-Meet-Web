'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface SportEvent {
  id: string
  name: string
}

interface House {
  id: string
  display_name: string
}

interface MatchParticipant {
  id: string
  event_id: string
  house_id: string
  score: number
  rank: number | null
  status: 'pending' | 'competing' | 'finished'
}

const emptyForm = {
  event_id: '',
  house_id: '',
  score: 0,
  rank: 0,
  status: 'pending' as MatchParticipant['status'],
}

export default function AdminMatchesPage() {
  const supabase = useMemo(() => createClient(), [])
  const [matches, setMatches] = useState<MatchParticipant[]>([])
  const [events, setEvents] = useState<SportEvent[]>([])
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  const fetchMatches = async () => {
    setLoading(true)
    const [{ data: matchData, error: matchError }, eventRes, houseRes] =
      await Promise.all([
        supabase.from('match_participants').select('*').order('created_at'),
        supabase.from('sports_events').select('id,name').order('event_date'),
        supabase.from('houses').select('id,display_name').order('display_name'),
      ])

    if (matchError) {
      setError(matchError.message)
      setMatches([])
    } else {
      setMatches(matchData || [])
      setError(null)
    }

    setEvents(eventRes.data || [])
    setHouses(houseRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  const handleEdit = (match: MatchParticipant) => {
    setEditingId(match.id)
    setForm({
      event_id: match.event_id,
      house_id: match.house_id,
      score: match.score ?? 0,
      rank: match.rank ?? 0,
      status: match.status,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  const handleDelete = async (matchId: string) => {
    const confirmed = window.confirm('Delete this match entry?')
    if (!confirmed) return

    const { error } = await supabase
      .from('match_participants')
      .delete()
      .eq('id', matchId)

    if (error) {
      setError(error.message)
      return
    }

    fetchMatches()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      event_id: form.event_id,
      house_id: form.house_id,
      score: Number(form.score) || 0,
      rank: Number(form.rank) || null,
      status: form.status,
    }

    if (!payload.event_id || !payload.house_id) {
      setError('Event and house are required.')
      setSaving(false)
      return
    }

    if (editingId) {
      const { error } = await supabase
        .from('match_participants')
        .update(payload)
        .eq('id', editingId)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('match_participants')
        .insert(payload)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    handleCancel()
    fetchMatches()
  }

  const eventLookup = useMemo(() => {
    return new Map(events.map((event) => [event.id, event.name]))
  }, [events])

  const houseLookup = useMemo(() => {
    return new Map(houses.map((house) => [house.id, house.display_name]))
  }, [houses])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Matches</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update scores and rankings for each event.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="event_id">Event</Label>
            <select
              id="event_id"
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              value={form.event_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, event_id: event.target.value }))
              }
            >
              <option value="">Select event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="house_id">House</Label>
            <select
              id="house_id"
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              value={form.house_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, house_id: event.target.value }))
              }
            >
              <option value="">Select house</option>
              {houses.map((house) => (
                <option key={house.id} value={house.id}>
                  {house.display_name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="score">Score</Label>
            <Input
              id="score"
              type="number"
              value={form.score}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  score: Number(event.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rank">Rank</Label>
            <Input
              id="rank"
              type="number"
              value={form.rank}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  rank: Number(event.target.value),
                }))
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
                  status: event.target.value as MatchParticipant['status'],
                }))
              }
            >
              <option value="pending">Pending</option>
              <option value="competing">Competing</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving
              ? 'Saving...'
              : editingId
                ? 'Update match'
                : 'Create match'}
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
          <h3 className="text-lg font-semibold text-foreground">All matches</h3>
          <span className="text-sm text-muted-foreground">
            {matches.length} total
          </span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading matches...</p>
        ) : matches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No matches yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-2 py-2">Event</th>
                  <th className="px-2 py-2">House</th>
                  <th className="px-2 py-2">Score</th>
                  <th className="px-2 py-2">Rank</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {matches.map((match) => (
                  <tr key={match.id}>
                    <td className="px-2 py-3 text-muted-foreground">
                      {eventLookup.get(match.event_id) || 'Unknown'}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {houseLookup.get(match.house_id) || 'Unknown'}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">{match.score}</td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {match.rank ?? 'N/A'}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {match.status}
                    </td>
                    <td className="px-2 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(match)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(match.id)}
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

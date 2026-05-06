'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface House {
  id: string
  name: string
  display_name: string
  color: string
  logo_url: string | null
  total_points: number
  trophies_won: number
  members_count: number
  created_at: string
}

const emptyForm = {
  name: '',
  display_name: '',
  color: '#000000',
  logo_url: '',
  total_points: 0,
  trophies_won: 0,
  members_count: 0,
}

export default function AdminHousesPage() {
  const supabase = useMemo(() => createClient(), [])
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  const fetchHouses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('houses')
      .select('*')
      .order('total_points', { ascending: false })

    if (error) {
      setError(error.message)
      setHouses([])
    } else {
      setHouses(data || [])
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchHouses()
  }, [])

  const handleEdit = (house: House) => {
    setEditingId(house.id)
    setForm({
      name: house.name,
      display_name: house.display_name,
      color: house.color,
      logo_url: house.logo_url ?? '',
      total_points: house.total_points,
      trophies_won: house.trophies_won,
      members_count: house.members_count,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  const handleDelete = async (houseId: string) => {
    const confirmed = window.confirm('Delete this house?')
    if (!confirmed) return

    const { error } = await supabase.from('houses').delete().eq('id', houseId)

    if (error) {
      setError(error.message)
      return
    }

    fetchHouses()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      name: form.name.trim(),
      display_name: form.display_name.trim(),
      color: form.color.trim(),
      logo_url: form.logo_url.trim() || null,
      total_points: Number(form.total_points) || 0,
      trophies_won: Number(form.trophies_won) || 0,
      members_count: Number(form.members_count) || 0,
    }

    if (editingId) {
      const { error } = await supabase
        .from('houses')
        .update(payload)
        .eq('id', editingId)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('houses').insert(payload)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    handleCancel()
    fetchHouses()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Houses</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage house branding, points, and totals.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Internal name</Label>
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
            <Label htmlFor="display_name">Display name</Label>
            <Input
              id="display_name"
              value={form.display_name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, display_name: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">House color</Label>
            <Input
              id="color"
              type="text"
              value={form.color}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, color: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              value={form.logo_url}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, logo_url: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_points">Total points</Label>
            <Input
              id="total_points"
              type="number"
              min={0}
              value={form.total_points}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  total_points: Number(event.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trophies_won">Trophies won</Label>
            <Input
              id="trophies_won"
              type="number"
              min={0}
              value={form.trophies_won}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  trophies_won: Number(event.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="members_count">Members count</Label>
            <Input
              id="members_count"
              type="number"
              min={0}
              value={form.members_count}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  members_count: Number(event.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update house' : 'Create house'}
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
          <h3 className="text-lg font-semibold text-foreground">All houses</h3>
          <span className="text-sm text-muted-foreground">
            {houses.length} total
          </span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading houses...</p>
        ) : houses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No houses yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Points</th>
                  <th className="px-2 py-2">Members</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {houses.map((house) => (
                  <tr key={house.id}>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: house.color }}
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {house.display_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {house.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {house.total_points}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {house.members_count}
                    </td>
                    <td className="px-2 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(house)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(house.id)}
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

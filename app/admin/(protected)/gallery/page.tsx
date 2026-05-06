'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'

interface GalleryImage {
  id: string
  title: string
  description: string | null
  image_url: string
  category: string
  event_id: string | null
  house_id: string | null
  uploaded_by: string | null
  upload_date: string
  created_at: string
}

interface SportEvent {
  id: string
  name: string
}

interface House {
  id: string
  display_name: string
}

const emptyForm = {
  title: '',
  description: '',
  image_url: '',
  category: '',
  event_id: '',
  house_id: '',
  uploaded_by: '',
  upload_date: '',
}

function toLocalDate(value: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().split('T')[0]
}

export default function AdminGalleryPage() {
  const supabase = useMemo(() => createClient(), [])
  const [images, setImages] = useState<GalleryImage[]>([])
  const [events, setEvents] = useState<SportEvent[]>([])
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  const fetchImages = async () => {
    setLoading(true)
    const [imageRes, eventRes, houseRes] = await Promise.all([
      supabase.from('gallery_images').select('*').order('created_at', {
        ascending: false,
      }),
      supabase.from('sports_events').select('id,name').order('event_date'),
      supabase.from('houses').select('id,display_name').order('display_name'),
    ])

    if (imageRes.error) {
      setError(imageRes.error.message)
      setImages([])
    } else {
      setImages(imageRes.data || [])
      setError(null)
    }

    setEvents(eventRes.data || [])
    setHouses(houseRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleEdit = (image: GalleryImage) => {
    setEditingId(image.id)
    setForm({
      title: image.title,
      description: image.description ?? '',
      image_url: image.image_url,
      category: image.category,
      event_id: image.event_id ?? '',
      house_id: image.house_id ?? '',
      uploaded_by: image.uploaded_by ?? '',
      upload_date: toLocalDate(image.upload_date),
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  const handleDelete = async (imageId: string) => {
    const confirmed = window.confirm('Delete this image entry?')
    if (!confirmed) return

    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', imageId)

    if (error) {
      setError(error.message)
      return
    }

    fetchImages()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim(),
      category: form.category.trim(),
      event_id: form.event_id || null,
      house_id: form.house_id || null,
      uploaded_by: form.uploaded_by.trim() || null,
      upload_date: form.upload_date
        ? new Date(form.upload_date).toISOString()
        : new Date().toISOString(),
    }

    if (editingId) {
      const { error } = await supabase
        .from('gallery_images')
        .update(payload)
        .eq('id', editingId)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('gallery_images')
        .insert(payload)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    handleCancel()
    fetchImages()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Gallery</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload and categorize gallery images.
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
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={form.category}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, category: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={form.image_url}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, image_url: event.target.value }))
              }
              required
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
          <div className="space-y-2">
            <Label htmlFor="event_id">Event (optional)</Label>
            <select
              id="event_id"
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              value={form.event_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, event_id: event.target.value }))
              }
            >
              <option value="">No event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="house_id">House (optional)</Label>
            <select
              id="house_id"
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              value={form.house_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, house_id: event.target.value }))
              }
            >
              <option value="">No house</option>
              {houses.map((house) => (
                <option key={house.id} value={house.id}>
                  {house.display_name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="uploaded_by">Uploaded by</Label>
            <Input
              id="uploaded_by"
              value={form.uploaded_by}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  uploaded_by: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload_date">Upload date</Label>
            <Input
              id="upload_date"
              type="date"
              value={form.upload_date}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  upload_date: event.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update image' : 'Create image'}
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
          <h3 className="text-lg font-semibold text-foreground">All images</h3>
          <span className="text-sm text-muted-foreground">
            {images.length} total
          </span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="text-sm text-muted-foreground">No gallery images yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Category</th>
                  <th className="px-2 py-2">Preview</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {images.map((image) => (
                  <tr key={image.id}>
                    <td className="px-2 py-3 text-muted-foreground">
                      {image.title}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {image.category}
                    </td>
                    <td className="px-2 py-3">
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="h-10 w-16 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-2 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(image)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(image.id)}
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

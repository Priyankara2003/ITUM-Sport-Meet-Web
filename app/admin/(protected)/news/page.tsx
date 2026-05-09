'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'

interface NewsUpdate {
  id: string
  title: string
  content: string
  created_at: string
  is_pinned?: boolean
}

const emptyForm = {
  title: '',
  content: '',
  is_pinned: false,
}

export default function AdminNewsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [news, setNews] = useState<NewsUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  const fetchNews = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('news_updates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      setNews([])
    } else {
      setNews(data || [])
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleEdit = (entry: NewsUpdate) => {
    setEditingId(entry.id)
    setForm({
      title: entry.title,
      content: entry.content,
      is_pinned: entry.is_pinned || false,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  const handleDelete = async (entryId: string) => {
    const confirmed = window.confirm('Delete this update?')
    if (!confirmed) return

    const { error } = await supabase
      .from('news_updates')
      .delete()
      .eq('id', entryId)

    if (error) {
      setError(error.message)
      return
    }

    fetchNews()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      is_pinned: form.is_pinned,
    }

    if (editingId) {
      const { error } = await supabase
        .from('news_updates')
        .update(payload)
        .eq('id', editingId)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('news_updates').insert(payload)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    handleCancel()
    fetchNews()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">News Updates</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish and update live ticker announcements.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm"
      >
        <div className="grid gap-4">
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
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={form.content}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, content: event.target.value }))
              }
              required
            />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="is_pinned"
              checked={form.is_pinned}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, is_pinned: checked === true }))
              }
            />
            <Label
              htmlFor="is_pinned"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Pin this news update
            </Label>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update news' : 'Create news'}
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
          <h3 className="text-lg font-semibold text-foreground">All updates</h3>
          <span className="text-sm text-muted-foreground">
            {news.length} total
          </span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading updates...</p>
        ) : news.length === 0 ? (
          <p className="text-sm text-muted-foreground">No updates yet.</p>
        ) : (
          <div className="space-y-3">
            {news.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-border/60 bg-background/40 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      {entry.is_pinned && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold tracking-wider">
                          📌 PINNED
                        </span>
                      )}
                      {entry.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(entry.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                </div>
                <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

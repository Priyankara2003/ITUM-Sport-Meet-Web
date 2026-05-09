'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Minus, Plus, RotateCcw } from 'lucide-react'

interface SportEvent {
  id: string
  name: string
  status: string
}

interface House {
  id: string
  display_name: string
  color: string
  logo_url: string | null
}

interface MatchParticipant {
  id: string
  event_id: string
  house_id: string
  score: number
  status: string
}

export default function AdminLiveScorePage() {
  const supabase = useMemo(() => createClient(), [])
  const [events, setEvents] = useState<SportEvent[]>([])
  const [houses, setHouses] = useState<House[]>([])
  const [matches, setMatches] = useState<MatchParticipant[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Fetch events and houses on mount
  useEffect(() => {
    const fetchData = async () => {
      const [eventRes, houseRes] = await Promise.all([
        supabase.from('sports_events').select('id,name,status').order('event_date', { ascending: false }),
        supabase.from('houses').select('id,display_name,color,logo_url').order('display_name'),
      ])

      const allEvents = eventRes.data || []
      setEvents(allEvents)
      setHouses(houseRes.data || [])

      // Auto-select the first ongoing event if available
      const ongoingEvent = allEvents.find((e) => e.status === 'ongoing')
      if (ongoingEvent) {
        setSelectedEventId(ongoingEvent.id)
      } else if (allEvents.length > 0) {
        setSelectedEventId(allEvents[0].id)
      }

      setLoading(false)
    }

    fetchData()
  }, [supabase])

  // Fetch matches for the selected event
  useEffect(() => {
    if (!selectedEventId) return

    const fetchMatches = async () => {
      const { data } = await supabase
        .from('match_participants')
        .select('*')
        .eq('event_id', selectedEventId)
        .order('score', { ascending: false })

      setMatches(data || [])
    }

    fetchMatches()
    const interval = setInterval(fetchMatches, 5000)
    return () => clearInterval(interval)
  }, [selectedEventId, supabase])

  const updateScore = async (matchId: string, delta: number) => {
    setUpdating(matchId)
    setError(null)

    const match = matches.find((m) => m.id === matchId)
    if (!match) return

    const newScore = Math.max(0, match.score + delta)

    const { error: updateError } = await supabase
      .from('match_participants')
      .update({ score: newScore })
      .eq('id', matchId)

    if (updateError) {
      setError(updateError.message)
    } else {
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, score: newScore } : m))
      )
      // Brief success feedback
      const house = houses.find((h) => h.id === match.house_id)
      setSuccessMsg(`${house?.display_name || 'House'}: ${newScore}`)
      setTimeout(() => setSuccessMsg(null), 1500)
    }

    setUpdating(null)
  }

  const resetScores = async () => {
    if (!window.confirm('Reset all scores for this match to 0?')) return

    setError(null)
    const matchIds = matches.map((m) => m.id)

    for (const id of matchIds) {
      await supabase
        .from('match_participants')
        .update({ score: 0 })
        .eq('id', id)
    }

    setMatches((prev) => prev.map((m) => ({ ...m, score: 0 })))
    setSuccessMsg('All scores reset to 0')
    setTimeout(() => setSuccessMsg(null), 2000)
  }

  const getHouse = (houseId: string) => houses.find((h) => h.id === houseId)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Live Score Controller</h2>
          <p className="mt-1 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">⚡ Live Score Controller</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Quickly update scores during a live match. Changes reflect instantly on the home page.
        </p>
      </div>

      {/* Event selector */}
      <div className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm">
        <label className="block text-sm font-semibold text-foreground mb-2">
          Select Match / Event
        </label>
        <select
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="">Choose an event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.status === 'ongoing' ? '🔴 ' : ''}{event.name} ({event.status})
            </option>
          ))}
        </select>
      </div>

      {/* Status messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 font-semibold text-center animate-pulse">
          ✓ {successMsg}
        </div>
      )}

      {/* Score cards */}
      {selectedEventId && matches.length === 0 && (
        <div className="rounded-2xl border border-border/60 bg-card/40 p-8 shadow-sm text-center">
          <p className="text-muted-foreground">
            No participants found for this event. Add match participants in the{' '}
            <a href="/admin/matches" className="text-primary underline font-medium">Matches</a>{' '}
            tab first.
          </p>
        </div>
      )}

      {matches.length > 0 && (
        <>
          {/* VS Display for 2-team matches */}
          {matches.length === 2 && (
            <div className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm">
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                {/* Team A */}
                {(() => {
                  const house = getHouse(matches[0].house_id)
                  return (
                    <div className="flex flex-col items-center gap-3 flex-1">
                      {house?.logo_url ? (
                        <img src={house.logo_url} alt={house.display_name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg" />
                      ) : (
                        <div
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white text-2xl font-black"
                          style={{ backgroundColor: house?.color || '#333' }}
                        >
                          {house?.display_name?.charAt(0) || '?'}
                        </div>
                      )}
                      <p className="font-bold text-foreground text-sm sm:text-base text-center">{house?.display_name}</p>
                      <p className="text-4xl sm:text-5xl font-black" style={{ color: house?.color }}>{matches[0].score}</p>
                    </div>
                  )
                })()}

                {/* VS */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-muted-foreground/40">VS</span>
                  <div className="w-px h-8 bg-border"></div>
                </div>

                {/* Team B */}
                {(() => {
                  const house = getHouse(matches[1].house_id)
                  return (
                    <div className="flex flex-col items-center gap-3 flex-1">
                      {house?.logo_url ? (
                        <img src={house.logo_url} alt={house.display_name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg" />
                      ) : (
                        <div
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white text-2xl font-black"
                          style={{ backgroundColor: house?.color || '#333' }}
                        >
                          {house?.display_name?.charAt(0) || '?'}
                        </div>
                      )}
                      <p className="font-bold text-foreground text-sm sm:text-base text-center">{house?.display_name}</p>
                      <p className="text-4xl sm:text-5xl font-black" style={{ color: house?.color }}>{matches[1].score}</p>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Score Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matches.map((match) => {
              const house = getHouse(match.house_id)
              const isUpdating = updating === match.id

              return (
                <div
                  key={match.id}
                  className="rounded-2xl border-2 p-6 shadow-sm bg-card/40 flex flex-col items-center gap-4"
                  style={{ borderColor: house?.color || '#e5e5e5' }}
                >
                  {/* House info */}
                  <div className="flex items-center gap-3">
                    {house?.logo_url ? (
                      <img src={house.logo_url} alt={house.display_name} className="w-10 h-10 object-contain" />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: house?.color || '#333' }}
                      >
                        {house?.display_name?.charAt(0) || '?'}
                      </div>
                    )}
                    <span className="font-bold text-foreground text-lg">{house?.display_name}</span>
                  </div>

                  {/* Score display */}
                  <div
                    className="text-6xl sm:text-7xl font-black tabular-nums"
                    style={{ color: house?.color || '#111' }}
                  >
                    {match.score}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-14 h-14 rounded-xl text-xl font-black"
                      onClick={() => updateScore(match.id, -1)}
                      disabled={isUpdating || match.score <= 0}
                    >
                      <Minus size={24} />
                    </Button>
                    <Button
                      size="lg"
                      className="w-14 h-14 rounded-xl text-xl font-black"
                      style={{ backgroundColor: house?.color || '#961300' }}
                      onClick={() => updateScore(match.id, 1)}
                      disabled={isUpdating}
                    >
                      <Plus size={24} />
                    </Button>
                  </div>

                  {/* Quick add buttons */}
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {[2, 3, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => updateScore(match.id, n)}
                        disabled={isUpdating}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border hover:bg-primary/10 hover:border-primary/40 transition-colors disabled:opacity-40"
                      >
                        +{n}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Reset button */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={resetScores} className="gap-2">
              <RotateCcw size={16} />
              Reset All Scores
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

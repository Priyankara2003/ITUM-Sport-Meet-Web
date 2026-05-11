'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2, Trophy, Medal } from 'lucide-react'

// ── Interfaces ────────────────────────────────────────────────────────
interface SportEvent {
  id: string
  name: string
}

interface House {
  id: string
  display_name: string
  color: string
}

interface AthleticsResult {
  id: string
  event_id: string
  first_place_house_id: string
  second_place_house_id: string
  third_place_house_id: string
  created_at: string
}

export default function AthleticsAdminPage() {
  const supabase = createClient()
  
  // Data States
  const [events, setEvents] = useState<SportEvent[]>([])
  const [houses, setHouses] = useState<House[]>([])
  const [results, setResults] = useState<AthleticsResult[]>([])
  
  // Form States
  const [selectedEvent, setSelectedEvent] = useState('')
  const [firstPlace, setFirstPlace] = useState('')
  const [secondPlace, setSecondPlace] = useState('')
  const [thirdPlace, setThirdPlace] = useState('')
  
  // UI States
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // 1. Fetch Initial Data (Events, Houses, and existing Results)
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch Sports Events
    const { data: eventsData } = await supabase
      .from('sports_events')
      .select('id, name')
      // You can add a filter like .eq('status', 'ongoing') here if needed
      .order('name')
      
    // Fetch Houses
    const { data: housesData } = await supabase
      .from('houses')
      .select('id, display_name, color')
      
    // Fetch already published Results
    const { data: resultsData } = await supabase
      .from('athletics_results')
      .select('*')
      .order('created_at', { ascending: false })

    if (eventsData) setEvents(eventsData)
    if (housesData) setHouses(housesData)
    if (resultsData) setResults(resultsData)
    
    setLoading(false)
  }

  // 2. Handle Form Submission
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!selectedEvent || !firstPlace || !secondPlace || !thirdPlace) {
      setError('Please enter all data (Event & all 3 places).')
      return
    }

    setSubmitting(true)

    const { error: insertError } = await supabase
      .from('athletics_results')
      .insert([
        {
          event_id: selectedEvent,
          first_place_house_id: firstPlace,
          second_place_house_id: secondPlace,
          third_place_house_id: thirdPlace,
        }
      ])

    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess('Result published successfully! 🏆')
      // Reset form
      setSelectedEvent('')
      setFirstPlace('')
      setSecondPlace('')
      setThirdPlace('')
      // Refresh the table
      fetchData()
    }
    
    setSubmitting(false)
  }

  // 3. Handle Delete Result
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return

    const { error } = await supabase
      .from('athletics_results')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchData() // Refresh table
    } else {
      alert('Error deleting result: ' + error.message)
    }
  }

  // Helper function to get names for the table
  const getEventName = (id: string) => events.find(e => e.id === id)?.name || 'Unknown Event'
  const getHouseName = (id: string) => houses.find(h => h.id === id)?.display_name || '-'

  if (loading) return <div className="p-8 text-muted-foreground">Loading data...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-6">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Trophy className="text-yellow-500" /> 
          Publish Athletics Results
        </h2>
        <p className="text-muted-foreground mt-2">
          Results entered here will appear on the public scoreboard via the Mini-Podium UI.
        </p>
      </div>

      {/* Messages */}
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 font-semibold">{success}</div>}

      {/* Publish Form */}
      <form onSubmit={handlePublish} className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* Event Selection */}
        <div>
          <label className="block text-sm font-bold mb-2">Select Event</label>
          <select 
            value={selectedEvent} 
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border bg-background"
          >
            <option value="">-- Select an event --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
        </div>

        {/* Podium Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
          
          {/* 1st Place */}
          <div className="space-y-2 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <label className="flex items-center gap-2 font-bold text-yellow-700">
              <span className="text-xl">🥇</span> 1st Place
            </label>
            <select 
              value={firstPlace} 
              onChange={(e) => setFirstPlace(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border bg-background"
            >
              <option value="">-- House --</option>
              {houses.map(house => <option key={house.id} value={house.id}>{house.display_name}</option>)}
            </select>
          </div>

          {/* 2nd Place */}
          <div className="space-y-2 p-4 bg-gray-400/10 rounded-xl border border-gray-400/20">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              <span className="text-xl">🥈</span> 2nd Place
            </label>
            <select 
              value={secondPlace} 
              onChange={(e) => setSecondPlace(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border bg-background"
            >
              <option value="">-- House --</option>
              {houses.map(house => <option key={house.id} value={house.id}>{house.display_name}</option>)}
            </select>
          </div>

          {/* 3rd Place */}
          <div className="space-y-2 p-4 bg-orange-700/10 rounded-xl border border-orange-700/20">
            <label className="flex items-center gap-2 font-bold text-orange-800">
              <span className="text-xl">🥉</span> 3rd Place
            </label>
            <select 
              value={thirdPlace} 
              onChange={(e) => setThirdPlace(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border bg-background"
            >
              <option value="">-- House --</option>
              {houses.map(house => <option key={house.id} value={house.id}>{house.display_name}</option>)}
            </select>
          </div>

        </div>

        <Button type="submit" disabled={submitting} className="w-full h-12 text-lg font-bold">
          {submitting ? 'Publishing...' : '🚀 Publish Result'}
        </Button>
      </form>

      {/* Published Results History Table */}
      <div className="pt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Medal size={20} /> Published History
        </h3>
        
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary/5 border-b">
                <tr>
                  <th className="p-4 font-bold">Event Name</th>
                  <th className="p-4 font-bold">🥇 1st Place</th>
                  <th className="p-4 font-bold">🥈 2nd Place</th>
                  <th className="p-4 font-bold">🥉 3rd Place</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No results published yet.
                    </td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <tr key={result.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-semibold">{getEventName(result.event_id)}</td>
                      <td className="p-4 text-yellow-700 font-bold">{getHouseName(result.first_place_house_id)}</td>
                      <td className="p-4 text-gray-700 font-bold">{getHouseName(result.second_place_house_id)}</td>
                      <td className="p-4 text-orange-800 font-bold">{getHouseName(result.third_place_house_id)}</td>
                      <td className="p-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(result.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
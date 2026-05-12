'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Save, Trophy, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch' // Shadcn Switch එක
import { toast } from 'sonner' // Notification එකක් දාන්න

interface House {
  id: string
  display_name: string
  total_points: number
  color: string
}

export default function ManageChampionship() {
  const [houses, setHouses] = useState<House[]>([])
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    // 1. Fetch houses
    const { data: housesData } = await supabase
      .from('houses')
      .select('id, display_name, total_points, color') //
      .order('total_points', { ascending: false })

    // 2. Fetch publish status
    const { data: settings } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'show_final_results')
      .single()

    if (housesData) setHouses(housesData)
    if (settings) setIsPublished(settings.value === 'true')
    setLoading(false)
  }

  // Individual Points Update
  const handlePointChange = (id: string, newPoints: number) => {
    setHouses(prev => prev.map(h => h.id === id ? { ...h, total_points: newPoints } : h))
  }

  // Save all points to DB
  const savePoints = async () => {
    setUpdating(true)
    for (const house of houses) {
      await supabase
        .from('houses')
        .update({ total_points: house.total_points }) //
        .eq('id', house.id)
    }
    setUpdating(false)
    toast.success("Points updated successfully!")
  }

  // Toggle Reveal Switch
  const togglePublish = async (val: boolean) => {
    setIsPublished(val)
    const { error } = await supabase
      .from('site_settings')
      .update({ value: val.toString() })
      .eq('key', 'show_final_results')

    if (!error) {
      toast.success(val ? "Final results are now LIVE!" : "Final results hidden.")
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* 🟢 Master Reveal Control */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isPublished ? 'bg-green-500/10 text-green-600' : 'bg-slate-500/10 text-slate-600'}`}>
            {isPublished ? <Eye size={24} /> : <EyeOff size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-foreground">Publish Final Championship</h3>
            <p className="text-xs text-muted-foreground">Turn this ON only during the final award ceremony.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <span className={`text-[10px] font-black uppercase tracking-widest ${isPublished ? 'text-green-600' : 'text-slate-400'}`}>
                {isPublished ? 'Live' : 'Hidden'}
            </span>
            <Switch checked={isPublished} onCheckedChange={togglePublish} />
        </div>
      </div>

      {/* 📊 Points Management Table */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <Trophy size={16} className="text-yellow-500" /> House Points Leaderboard
            </h3>
            <Button variant="ghost" size="sm" onClick={fetchData} className="h-8 w-8 p-0">
                <RefreshCw size={14} />
            </Button>
        </div>

        <div className="divide-y divide-border">
          {houses.map((house) => (
            <div key={house.id} className="p-4 flex items-center justify-between group hover:bg-muted/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: house.color }} /> {/* */}
                <span className="font-bold text-foreground">{house.display_name}</span> {/* */}
              </div>
              
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={house.total_points} //
                  onChange={(e) => handlePointChange(house.id, parseInt(e.target.value) || 0)}
                  className="w-24 bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-center font-black text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Points</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-muted/10 border-t border-border flex justify-end">
          <Button 
            onClick={savePoints} 
            disabled={updating}
            className="flex items-center gap-2 font-bold"
          >
            {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Update All Points
          </Button>
        </div>
      </div>

    </div>
  )
}
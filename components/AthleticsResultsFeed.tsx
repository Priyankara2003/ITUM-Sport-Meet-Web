'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, cubicBezier, type Variants } from 'framer-motion'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MotionSection } from './motion-section'

interface House {
  id: string
  display_name: string
  color: string
  logo_url: string | null
}

interface AthleticsResult {
  id: string
  created_at: string
  event_name: string
  first_place_house: House
  second_place_house: House
  third_place_house: House
}

export function AthleticsResultsFeed() {
  const [results, setResults] = useState<AthleticsResult[]>([])
  const [loading, setLoading] = useState(true)

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 4

  useEffect(() => {
    const fetchResults = async () => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('athletics_results')
        .select(`
          id,
          created_at,
          sports_events:event_id(name),
          first_place_house:first_place_house_id(id, display_name, color, logo_url),
          second_place_house:second_place_house_id(id, display_name, color, logo_url),
          third_place_house:third_place_house_id(id, display_name, color, logo_url)
        `)
        .order('created_at', { ascending: false })

      if (data && !error) {
        const formatted = data.map((item: any) => ({
          id: item.id,
          created_at: item.created_at,
          event_name: item.sports_events?.name || 'Unknown Event',
          first_place_house: item.first_place_house,
          second_place_house: item.second_place_house,
          third_place_house: item.third_place_house,
        }))
        setResults(formatted)
      }
      setLoading(false)
    }

    fetchResults()
    const interval = setInterval(fetchResults, 10000)
    return () => clearInterval(interval)
  }, [])

  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult)
  const totalPages = Math.ceil(results.length / resultsPerPage)

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const easeOut = cubicBezier(0.22, 1, 0.36, 1)
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        delay: index * 0.05,
      },
    }),
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        Loading results...
      </div>
    )
  }

  if (results.length === 0) {
    return null
      
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-8">
      
    

      
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-black text-foreground mb-3">
                              ATHLETICS RESULTS

                  </h2>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-px bg-linear-to-r from-transparent to-primary"></div>
                    <p className="text-muted-foreground tracking-widest text-sm uppercase">Track & Field Winners</p>
                    <div className="w-12 h-px bg-linear-to-l from-transparent to-primary"></div>
                  </div>
                </div>
             
             
            
      
      {/* 2-Column Grid for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {currentResults.map((result, index) => (
          <motion.div
            key={result.id}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="h-[340px] bg-[#f2eded] border border-border/40 rounded-2xl p-5 shadow-sm flex flex-col justify-between overflow-hidden relative hover:border-primary/30 transition-colors"
          >
            {/* Header: Event Name & Time */}
            <div className="text-center z-10 flex flex-col items-center">
              <h3 
                className="font-bold text-foreground text-base sm:text-lg line-clamp-2 leading-tight"
                title={result.event_name}
              >
                🏃‍♂️ {result.event_name}
              </h3>
              <p className="text-[10px] text-muted-foreground/80 font-medium mt-1 uppercase tracking-wider">
                {new Date(result.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Podium Container */}
            <div className="flex-1 w-full flex items-end justify-between gap-2 mt-4 z-10">
              
              {/* 🥈 2nd Place (Silver) */}
              <div className="flex flex-col items-center justify-end w-1/3 h-full pb-0">
                {result.second_place_house?.logo_url ? (
                  <img src={result.second_place_house.logo_url} alt="2nd" className="w-10 h-10 object-contain mb-2 drop-shadow-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold mb-2 shadow-sm" style={{backgroundColor: result.second_place_house?.color || '#cbd5e1'}}>{result.second_place_house?.display_name?.charAt(0)}</div>
                )}
                <div className="w-full h-24 bg-gradient-to-t from-slate-200 to-slate-50/50 border border-slate-200/60 rounded-t-xl flex flex-col items-center justify-start pt-2 shadow-sm">
                  <span className="text-xl font-bold text-slate-400 drop-shadow-sm">2</span>
                  <span className="text-[10px] font-bold text-slate-600 mt-1 uppercase truncate w-full text-center px-1">{result.second_place_house?.display_name}</span>
                </div>
              </div>

              {/* 🥇 1st Place (Gold) */}
              <div className="flex flex-col items-center justify-end w-1/3 h-full pb-0 relative">
                <span className="absolute top-4 sm:top-2 text-2xl animate-bounce drop-shadow-md z-30">👑</span>
                {result.first_place_house?.logo_url ? (
                  <img src={result.first_place_house.logo_url} alt="1st" className="w-14 h-14 object-contain mb-2 drop-shadow-md z-20" />
                ) : (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2 shadow-md z-20" style={{backgroundColor: result.first_place_house?.color || '#fbbf24'}}>{result.first_place_house?.display_name?.charAt(0)}</div>
                )}
                <div className="w-full h-32 bg-gradient-to-t from-yellow-200 to-yellow-50/50 border border-yellow-300/60 rounded-t-xl flex flex-col items-center justify-start pt-2 shadow-sm transform scale-105 z-10">
                  <span className="text-2xl font-bold text-yellow-600 drop-shadow-sm">1</span>
                  <span className="text-[11px] font-bold text-yellow-700 mt-1 uppercase truncate w-full text-center px-1">{result.first_place_house?.display_name}</span>
                </div>
              </div>

              {/* 🥉 3rd Place (Bronze) */}
              <div className="flex flex-col items-center justify-end w-1/3 h-full pb-0">
                {result.third_place_house?.logo_url ? (
                  <img src={result.third_place_house.logo_url} alt="3rd" className="w-8 h-8 object-contain mb-2 drop-shadow-sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-base font-bold mb-2 shadow-sm" style={{backgroundColor: result.third_place_house?.color || '#fdba74'}}>{result.third_place_house?.display_name?.charAt(0)}</div>
                )}
                <div className="w-full h-16 bg-gradient-to-t from-orange-200 to-orange-50/50 border border-orange-200/60 rounded-t-xl flex flex-col items-center justify-start pt-1.5 shadow-sm">
                  <span className="text-lg font-bold text-orange-500 drop-shadow-sm">3</span>
                  <span className="text-[9px] font-bold text-orange-700 mt-1 uppercase truncate w-full text-center px-1">{result.third_place_house?.display_name}</span>
                </div>
              </div>

            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1 font-bold bg-[#f2eded] hover:bg-[#e5e0e0] border-transparent shadow-sm"
          >
            <ChevronLeft size={16} /> Prev
          </Button>
          
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider bg-[#f2eded] px-4 py-2 rounded-lg shadow-sm border border-transparent">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 font-bold bg-[#f2eded] hover:bg-[#e5e0e0] border-transparent shadow-sm"
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Radio, Info } from 'lucide-react'

interface YouTubeLiveProps {
  videoId?: string 
}

export function YouTubeLive({ videoId = "jfKfPfyJRdk" }: YouTubeLiveProps) {
  
  // Video ID එකක් නැත්නම් මුකුත්ම පෙන්නන්නේ නෑ
  if (!videoId) return null; 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-5xl mx-auto bg-card border border-border rounded-3xl overflow-hidden shadow-lg flex flex-col"
    >
      {/* 🔴 Header Section */}
      <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <Radio className="relative z-10 text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-black uppercase text-foreground tracking-tight">
            ITUM Sports Meet - Live Action
          </h2>
        </div>
        
        {/* Pulsing Live Badge */}
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold tracking-widest border border-red-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          LIVE NOW
        </div>
      </div>

      {/* 📺 Full Width Video Player */}
      <div className="w-full aspect-video bg-black relative">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
          title="ITUM Sports Meet Live Stream"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      
      {/* 📝 Footer Note */}
      <div className="p-3 sm:p-4 bg-muted/20 flex items-center justify-center gap-2 border-t border-border">
        <Info size={16} className="text-muted-foreground" />
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Watching the official live broadcast of the ITUM Sports Meet 2026.
        </p>
      </div>
    </motion.div>
  )
}
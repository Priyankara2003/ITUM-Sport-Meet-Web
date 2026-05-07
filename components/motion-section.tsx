'use client'

import type { ReactNode } from 'react'
import { cubicBezier, motion } from 'framer-motion'

interface MotionSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  amount?: number
}

interface MotionItemProps {
  children: ReactNode
  className?: string
  delay?: number
  amount?: number
}

const easeOut = cubicBezier(0.22, 1, 0.36, 1)

export function MotionSection({
  children,
  className,
  delay = 0,
  amount = 0.2,
}: MotionSectionProps) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.85, ease: easeOut, delay, type: 'tween' }}
    >
      {children}
    </motion.section>
  )
}

export function MotionItem({
  children,
  className,
  delay = 0,
  amount = 0.2,
}: MotionItemProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, ease: easeOut, delay, type: 'tween' }}
    >
      {children}
    </motion.div>
  )
}

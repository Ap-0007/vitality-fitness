'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Plus, 
  Dumbbell, 
  Flame, 
  Timer, 
  ChevronRight,
  Calculator,
  Loader2
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from '@/lib/supabase'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function WorkoutList() {
  const [workouts, setWorkouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .order('date', { ascending: false })
        
        if (error) throw error
        setWorkouts(data || [])
      } catch (err) {
        console.error('Error fetching workouts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
      </div>
    )
  }

  if (workouts.length === 0) {
    return (
      <div className="glass p-10 rounded-3xl text-center border-white/5">
        <Dumbbell className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Workouts Yet</h3>
        <p className="text-white/40 mb-6">Start your journey by logging your first session.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {workouts.map((w, i) => (
        <motion.div 
          key={w.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass p-5 rounded-2xl flex items-center gap-6 hover:bg-white/5 transition-all group border-white/5"
        >
          <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-white group-hover:text-neon-green transition-colors">{w.name || 'Untitled Workout'}</h4>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider">{w.type}</span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span className="text-xs text-white/40 font-medium">
                {new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 pr-4">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-white/80 font-bold">
                <Timer className="w-4 h-4 text-neon-blue" />
                {w.duration_minutes} min
              </div>
              <span className="text-[10px] text-white/30 uppercase font-bold">Duration</span>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-white/80 font-bold">
                <Flame className="w-4 h-4 text-orange-400" />
                {w.calories_burned || 0}
              </div>
              <span className="text-[10px] text-white/30 uppercase font-bold">Burned</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-all" />
        </motion.div>
      ))}
    </div>
  )
}

export function LogWorkoutModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const duration = parseInt(formData.get('duration') as string)
    const notes = formData.get('notes') as string

    try {
      const { error } = await supabase
        .from('workouts')
        .insert([{ 
          name, 
          type, 
          duration_minutes: duration, 
          notes,
          user_id: (await supabase.auth.getUser()).data.user?.id || '00000000-0000-0000-0000-000000000000' // Handle guest mode for now
        }])

      if (error) throw error
      onClose()
      window.location.reload() // Simple refresh to show new data
    } catch (err) {
      console.error('Error saving workout:', err)
      alert('Failed to save workout. Make sure you have set up Supabase correctly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass p-8 rounded-3xl z-[101] border-white/10"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white">Log Workout</h3>
                <p className="text-white/40 text-sm">Record your latest training session</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6 text-white/40" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60 ml-1">Workout Name</label>
                <input 
                  name="name"
                  type="text" 
                  required
                  placeholder="e.g. Chest & Triceps" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-green/50 transition-colors text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Type</label>
                  <select name="type" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-green/50 transition-colors text-white appearance-none">
                    <option>Weightlifting</option>
                    <option>Cardio</option>
                    <option>Flexibility</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Duration (min)</label>
                  <input 
                    name="duration"
                    type="number" 
                    required
                    placeholder="45" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-green/50 transition-colors text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60 ml-1">Notes (Optional)</label>
                <textarea 
                  name="notes"
                  placeholder="How did it feel?" 
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-neon-green/50 transition-colors text-white resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl font-bold text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,135,0.3)] disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
                Save Workout
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

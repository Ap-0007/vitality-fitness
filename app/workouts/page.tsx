'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { WorkoutList, LogWorkoutModal } from '@/components/workouts'

export default function WorkoutsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-neon-green font-medium tracking-wide mb-1 uppercase text-sm">
            Training
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Workouts
          </h2>
          <p className="text-white/40 font-medium">
            Track and manage your training history
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center text-neon-green group-hover:bg-neon-green group-hover:text-black transition-all">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-bold text-white">Log Workout</span>
        </button>
      </section>

      {/* Stats Summary */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-2xl border-white/5">
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Total This Week</p>
          <p className="text-xl font-bold">5 Sessions</p>
        </div>
        <div className="glass p-4 rounded-2xl border-white/5">
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Total Duration</p>
          <p className="text-xl font-bold">245 min</p>
        </div>
        <div className="glass p-4 rounded-2xl border-white/5">
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Avg Intensity</p>
          <p className="text-xl font-bold text-neon-green">High</p>
        </div>
        <div className="glass p-4 rounded-2xl border-white/5">
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Calories Burned</p>
          <p className="text-xl font-bold text-neon-blue">1,820</p>
        </div>
      </section>

      {/* List */}
      <section className="pb-10">
        <WorkoutList />
      </section>

      <LogWorkoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

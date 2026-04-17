import React from 'react'
import { MacroChart, MealLog } from '@/components/nutrition'

export default function NutritionPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <p className="text-neon-blue font-medium tracking-wide mb-1 uppercase text-sm">
          Fueling
        </p>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Nutrition
        </h2>
        <p className="text-white/40 font-medium">
          Monitor your intake and macro balance
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Macro Summary */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-white">Daily Macro Split</h3>
          <MacroChart />
          <div className="grid grid-cols-3 gap-2">
            <div className="glass p-3 rounded-xl border-white/5 text-center">
              <div className="w-2 h-2 rounded-full bg-neon-green mx-auto mb-1 shadow-[0_0_5px_#00ff87]" />
              <p className="text-[10px] text-white/40 font-bold">PROTEIN</p>
              <p className="text-sm font-bold">145g</p>
            </div>
            <div className="glass p-3 rounded-xl border-white/5 text-center">
              <div className="w-2 h-2 rounded-full bg-neon-blue mx-auto mb-1 shadow-[0_0_5px_#60efff]" />
              <p className="text-[10px] text-white/40 font-bold">CARBS</p>
              <p className="text-sm font-bold">210g</p>
            </div>
            <div className="glass p-3 rounded-xl border-white/5 text-center">
              <div className="w-2 h-2 rounded-full bg-neon-purple mx-auto mb-1 shadow-[0_0_5px_#bf5af2]" />
              <p className="text-[10px] text-white/40 font-bold">FAT</p>
              <p className="text-sm font-bold">65g</p>
            </div>
          </div>
        </div>

        {/* Meal Log */}
        <div className="lg:col-span-2">
          <MealLog />
        </div>
      </div>
    </div>
  )
}

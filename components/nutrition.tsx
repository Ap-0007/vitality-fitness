'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts'
import { 
  Utensils, 
  Coffee, 
  Moon, 
  Star,
  Plus,
  Loader2
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from '@/lib/supabase'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const macroData = [
  { name: 'Protein', value: 30, color: '#00ff87' },
  { name: 'Carbs', value: 45, color: '#60efff' },
  { name: 'Fat', value: 25, color: '#bf5af2' },
]

export function MacroChart() {
  return (
    <div className="glass p-6 rounded-2xl h-[300px] flex flex-col items-center justify-center relative border-white/5">
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Remaining</p>
        <p className="text-3xl font-bold">840</p>
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">kcal</p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={macroData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {macroData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MealLog() {
  const [meals, setMeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMeals() {
      try {
        const { data, error } = await supabase
          .from('nutrition')
          .select('*')
          .order('time', { ascending: false })
          .limit(10)
        
        if (error) throw error
        setMeals(data || [])
      } catch (err) {
        console.error('Error fetching meals:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMeals()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 text-neon-blue animate-spin" />
      </div>
    )
  }

  const getMealIcon = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('breakfast') || n.includes('coffee')) return Coffee
    if (n.includes('dinner') || n.includes('night')) return Moon
    if (n.includes('snack')) return Star
    return Utensils
  }

  const getMealColor = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('breakfast')) return 'text-orange-400'
    if (n.includes('dinner')) return 'text-neon-purple'
    if (n.includes('snack')) return 'text-neon-blue'
    return 'text-neon-green'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-white">Daily Meals</h3>
        <button className="text-neon-green hover:bg-neon-green/10 p-2 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      {meals.length === 0 ? (
        <div className="glass p-8 rounded-xl text-center border-white/5">
          <p className="text-white/40 text-sm italic">No meals logged today yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meals.map((meal, i) => {
            const Icon = getMealIcon(meal.meal_name || '')
            return (
              <motion.div 
                key={meal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-4 rounded-xl flex items-center gap-4 border-white/5"
              >
                <div className={cn("p-2 rounded-lg bg-white/5", getMealColor(meal.meal_name || ''))}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{meal.meal_name || 'Generic Meal'}</h4>
                  <p className="text-xs text-white/40">
                    {new Date(meal.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <p className="font-bold text-sm">{meal.calories_in} kcal</p>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, Zap, Clock, Flame, Loader2 } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from '@/lib/supabase'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function StatCard({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  color = 'green' 
}: { 
  label: string, 
  value: string | number, 
  unit?: string, 
  icon: LucideIcon, 
  trend?: string,
  color?: 'green' | 'blue' | 'purple'
}) {
  const colors = {
    green: 'border-neon-green/20 text-neon-green shadow-neon-green/5',
    blue: 'border-neon-blue/20 text-neon-blue shadow-neon-blue/5',
    purple: 'border-neon-purple/20 text-neon-purple shadow-neon-purple/5'
  }

  const bgColors = {
    green: 'bg-neon-green/10',
    blue: 'bg-neon-blue/10',
    purple: 'bg-neon-purple/10'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass p-5 rounded-2xl flex flex-col gap-3", colors[color])}
    >
      <div className="flex justify-between items-start">
        <div className={cn("p-2 rounded-lg", bgColors[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium text-white/60">
            <TrendingUp className="w-3 h-3 text-neon-green" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-white/60 text-sm font-medium">{label}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
          {unit && <span className="text-xs text-white/40">{unit}</span>}
        </div>
      </div>
    </motion.div>
  )
}

export function WeeklyChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchWeeklyData() {
      try {
        // Fetch last 7 days of biometrics for steps/calories
        const { data: bioData, error } = await supabase
          .from('biometrics')
          .select('date, steps') // In a real app we'd join or calculate calories too
          .order('date', { ascending: true })
          .limit(7)
        
        if (error) throw error
        
        const formatted = (bioData || []).map(d => ({
          name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
          steps: d.steps,
          calories: (d.steps || 0) * 0.04 // Approximation
        }))
        
        setData(formatted)
      } catch (err) {
        console.error('Error fetching weekly chart:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchWeeklyData()
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-6 rounded-2xl h-[350px] flex flex-col gap-4 border-white/5"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-white">Weekly Activity</h3>
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Steps / Calories</span>
      </div>
      <div className="flex-1 w-full min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-white/10" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/20 italic text-sm">
            Log some biometrics to see your weekly trend.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff87" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff87" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#ffffff60', fontSize: 12 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e1e1e', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#00ff87' }}
              />
              <Area 
                type="monotone" 
                dataKey="calories" 
                stroke="#00ff87" 
                fillOpacity={1} 
                fill="url(#colorCal)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}

export function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRecent() {
      try {
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .order('date', { ascending: false })
          .limit(5)
        
        if (error) throw error
        setActivities(data || [])
      } catch (err) {
        console.error('Error fetching recent activity:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecent()
  }, [])

  const getTypeIcon = (type: string) => {
    if (type === 'Cardio') return Zap
    if (type === 'Flexibility') return Clock
    return Flame
  }

  const getTypeColor = (type: string) => {
    if (type === 'Cardio') return 'text-neon-blue'
    if (type === 'Flexibility') return 'text-neon-purple'
    return 'text-neon-green'
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-white px-1">Recent Activity</h3>
      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="glass h-20 rounded-xl animate-pulse" />)
        ) : activities.length === 0 ? (
          <p className="text-white/20 text-sm italic px-1">No recent workouts logged.</p>
        ) : (
          activities.map((act, i) => {
            const Icon = getTypeIcon(act.type)
            return (
              <motion.div 
                key={act.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer border-white/5"
              >
                <div className={cn("p-2 rounded-lg bg-white/5", getTypeColor(act.type))}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-white">{act.name || 'Workout'}</h4>
                  <p className="text-xs text-white/40">{act.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-white">{act.duration_minutes}m</p>
                  <p className="text-[10px] text-white/30">
                    {new Date(act.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { 
  Scale, 
  Moon, 
  Footprints, 
  HeartPulse,
  Loader2 
} from 'lucide-react'
import { createClient } from '@/lib/supabase'

export function MetricChart({ type = 'weight' }: { type: 'weight' | 'sleep' }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  
  const isWeight = type === 'weight'
  const color = isWeight ? '#60efff' : '#bf5af2'
  const dataKey = isWeight ? 'weight' : 'sleep_hours'

  useEffect(() => {
    async function fetchTrends() {
      try {
        const { data: trendData, error } = await supabase
          .from('biometrics')
          .select('date, weight, sleep_hours')
          .order('date', { ascending: true })
          .limit(30)
        
        if (error) throw error
        
        const formatted = (trendData || []).map(d => ({
          ...d,
          date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }))
        
        setData(formatted)
      } catch (err) {
        console.error('Error fetching biometrics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
  }, [type])

  return (
    <div className="glass p-6 rounded-2xl h-[300px] border-white/5 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-white uppercase tracking-tight text-sm">
          {isWeight ? 'Weight Trend (kg)' : 'Sleep Analysis (hrs)'}
        </h4>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
           <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Trend</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-white/20" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/20 text-xs italic">
            No biometric data logged yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#ffffff30', fontSize: 10 }}
              />
              <YAxis 
                 domain={['dataMin - 1', 'dataMax + 1']} 
                 hide 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#grad-${type})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export function BiometricGrid() {
  const [latest, setLatest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchLatest() {
      try {
        const { data, error } = await supabase
          .from('biometrics')
          .select('*')
          .order('date', { ascending: false })
          .limit(1)
        
        if (error) throw error
        if (data && data.length > 0) setLatest(data[0])
      } catch (err) {
        console.error('Error fetching latest biometrics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLatest()
  }, [])

  const metrics = [
    { label: 'Current Weight', value: latest?.weight || '--', unit: 'kg', icon: Scale, color: 'text-neon-blue' },
    { label: 'Sleep', value: latest?.sleep_hours || '--', unit: 'hrs', icon: Moon, color: 'text-neon-purple' },
    { label: 'Latest Steps', value: latest?.steps?.toLocaleString() || '--', unit: 'steps', icon: Footprints, color: 'text-neon-green' },
    { label: 'Resting HR', value: latest?.avg_heart_rate || '--', unit: 'bpm', icon: HeartPulse, color: 'text-red-400' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="glass p-6 rounded-2xl border-white/5 flex items-center gap-4"
        >
          <div className={`p-3 rounded-xl bg-white/5 ${m.color}`}>
            <m.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{m.label}</p>
            <p className="text-2xl font-bold">
              {loading ? '...' : m.value} <span className="text-xs text-white/20">{m.unit}</span>
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

'use client'

import { 
  Flame, 
  Zap, 
  Target, 
  Heart 
} from 'lucide-react'
import { 
  StatCard, 
  WeeklyChart, 
  RecentActivity 
} from '@/components/dashboard'

export default function Home() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <p className="text-neon-green font-medium tracking-wide mb-1 uppercase text-sm">
          Overview
        </p>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Hello, Vitality User
        </h2>
        <p className="text-white/40 font-medium">
          {today}
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Calories Burned" 
          value="1,240" 
          unit="kcal" 
          icon={Flame} 
          trend="+12%" 
          color="green"
        />
        <StatCard 
          label="Steps Taken" 
          value="8,432" 
          unit="steps" 
          icon={Zap} 
          trend="-5%" 
          color="blue"
        />
        <StatCard 
          label="Daily Goal" 
          value="75" 
          unit="%" 
          icon={Target} 
          color="purple"
        />
        <StatCard 
          label="Avg Heart Rate" 
          value="72" 
          unit="bpm" 
          icon={Heart} 
          color="green"
        />
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WeeklyChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}

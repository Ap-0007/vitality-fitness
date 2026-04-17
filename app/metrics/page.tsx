import React from 'react'
import { MetricChart, BiometricGrid } from '@/components/metrics'

export default function MetricsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <p className="text-neon-purple font-medium tracking-wide mb-1 uppercase text-sm">
          Analytics
        </p>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Metrics & Biometrics
        </h2>
        <p className="text-white/40 font-medium">
          Long-term health trends and physiological data
        </p>
      </section>

      {/* Grid Summary */}
      <BiometricGrid />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-white ml-1">Weight Tracking</h3>
          <MetricChart type="weight" />
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-white ml-1">Sleep Quality</h3>
          <MetricChart type="sleep" />
        </div>
      </div>

      {/* Goals / Insights */}
      <section className="glass p-8 rounded-3xl border-neon-green/10 bg-gradient-to-br from-neon-green/5 to-transparent">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Monthly Milestone Achieved! 🏆</h3>
            <p className="text-white/60">
              You've consistently tracked your biometrics for 20 days straight. Your weight trend shows a steady -0.2kg/week decline, which is perfect for sustainable fat loss.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-neon-green">2.4kg</p>
              <p className="text-[10px] text-white/40 font-bold uppercase">Total Loss</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-neon-blue">88%</p>
              <p className="text-[10px] text-white/40 font-bold uppercase">Goal Progress</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

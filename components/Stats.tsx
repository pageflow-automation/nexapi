import { Activity, Clock, Cpu, BarChart3 } from 'lucide-react'

const stats = [
  { icon: Activity, label: 'Uptime', value: '99.97%', description: 'Over the last 12 months' },
  { icon: Clock, label: 'Avg Response', value: '<120ms', description: 'P95 latency worldwide' },
  { icon: Cpu, label: 'AI Models', value: '200+', description: 'Across all categories' },
  { icon: BarChart3, label: 'Requests/mo', value: '50M+', description: 'Processed reliably' },
]

export default function Stats() {
  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gradient-border rounded-2xl p-8 sm:p-12 glow">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 mb-4">
                  <stat.icon className="w-6 h-6 text-accent-blue" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-slate-300 mb-0.5">{stat.label}</div>
                <div className="text-xs text-slate-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

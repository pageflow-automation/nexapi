import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20" />
          <div className="absolute inset-0 bg-navy-900/60" />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent-purple/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-blue/30 rounded-full blur-[100px]" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Start Building Today
            </h2>
            <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
              Join thousands of developers using NexAPI to power their AI applications.
              Get started for free — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/marketplace"
                className="px-8 py-3.5 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Get Your API Key
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/docs"
                className="px-8 py-3.5 text-base font-semibold text-slate-300 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
              >
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

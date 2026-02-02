import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-[128px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--navy-900)_70%)]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-purple/30 bg-accent-purple/5 text-sm text-accent-purple mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Now serving 50M+ requests/month
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            One API for{' '}
            <span className="gradient-text">Every AI Model</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Access the world&apos;s best AI models through a single, unified API.
            Video generation, image creation, music composition, and LLM chat &mdash;
            all with one API key.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/marketplace"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity flex items-center justify-center gap-2 glow"
            >
              Explore Marketplace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-300 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Read the Docs
            </Link>
          </div>

          {/* Floating code preview */}
          <div className="mt-16 relative">
            <div className="gradient-border rounded-2xl p-6 text-left glow max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-slate-500">api-request.py</span>
              </div>
              <pre className="text-sm overflow-x-auto">
                <code>
                  <span className="text-accent-purple">import</span>{' '}
                  <span className="text-accent-blue">nexapi</span>{'\n\n'}
                  <span className="text-slate-500"># Generate an image with one line</span>{'\n'}
                  <span className="text-slate-300">result</span>{' '}
                  <span className="text-accent-purple">=</span>{' '}
                  <span className="text-accent-blue">nexapi</span>
                  <span className="text-slate-300">.</span>
                  <span className="text-green-400">generate</span>
                  <span className="text-slate-300">(</span>{'\n'}
                  {'    '}
                  <span className="text-orange-400">model</span>
                  <span className="text-accent-purple">=</span>
                  <span className="text-green-300">&quot;stable-diffusion-xl&quot;</span>
                  <span className="text-slate-300">,</span>{'\n'}
                  {'    '}
                  <span className="text-orange-400">prompt</span>
                  <span className="text-accent-purple">=</span>
                  <span className="text-green-300">&quot;A futuristic city at sunset&quot;</span>{'\n'}
                  <span className="text-slate-300">)</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

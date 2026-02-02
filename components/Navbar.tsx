'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react'

const navLinks = [
  { href: '/marketplace', label: 'API Marketplace' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Nex<span className="gradient-text">API</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/docs"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/marketplace"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity"
            >
              Get API Key
            </Link>
          </div>

          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-navy-800 border-b border-white/5">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-slate-400 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/marketplace"
              className="block w-full text-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue"
              onClick={() => setMobileOpen(false)}
            >
              Get API Key
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

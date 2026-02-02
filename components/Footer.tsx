import Link from 'next/link'
import { Zap, Github, Twitter } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'API Marketplace', href: '/marketplace' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Changelog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'SLA', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Nex<span className="gradient-text">API</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 mb-4">
              Unified API access to the world&apos;s best AI models.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-slate-600">
          &copy; {new Date().getFullYear()} NexAPI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

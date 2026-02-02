'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, ChevronDown, ArrowRight } from 'lucide-react'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for testing and hobby projects.',
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For developers and growing teams.',
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale production workloads.',
    cta: 'Contact Sales',
    highlighted: false,
  },
]

const features = [
  { name: 'Monthly requests', free: '1,000', pro: '100,000', enterprise: 'Unlimited' },
  { name: 'Available models', free: '50+', pro: '200+', enterprise: '200+ & early access' },
  { name: 'Rate limit', free: '10 req/min', pro: '100 req/min', enterprise: 'Custom' },
  { name: 'Support', free: 'Community', pro: 'Priority (4h)', enterprise: 'Dedicated (1h)' },
  { name: 'Webhook notifications', free: false, pro: true, enterprise: true },
  { name: 'Usage analytics', free: false, pro: true, enterprise: true },
  { name: 'Team management', free: false, pro: false, enterprise: true },
  { name: 'SSO / SAML', free: false, pro: false, enterprise: true },
  { name: 'Custom SLA', free: false, pro: false, enterprise: true },
  { name: 'On-premise deployment', free: false, pro: false, enterprise: true },
  { name: 'Overage protection', free: 'Hard cap', pro: 'Pay-as-you-go', enterprise: 'Custom' },
  { name: 'Concurrent requests', free: '2', pro: '20', enterprise: 'Custom' },
]

const billingFaqs = [
  {
    q: 'What happens when I exceed my monthly limit?',
    a: 'On the Free plan, your API key is paused until the next billing cycle. On Pro, you can continue with pay-as-you-go pricing at standard rates. Enterprise customers have custom arrangements.',
  },
  {
    q: 'Can I upgrade or downgrade at any time?',
    a: 'Yes! You can upgrade instantly and the cost is prorated. When downgrading, your current plan continues until the end of the billing period.',
  },
  {
    q: 'Do unused requests roll over?',
    a: 'No, monthly request allowances reset each billing cycle. We recommend the Pro plan if you need consistent higher volumes.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes! Pro comes with a 14-day free trial. No credit card required to start. You get full access to all Pro features during the trial.',
  },
  {
    q: 'How are tokens counted for LLM models?',
    a: 'Token counting follows each model provider\'s standard. Input and output tokens are counted separately. Our dashboard shows real-time token usage per request.',
  },
]

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-green-400 mx-auto" />
    ) : (
      <X className="w-5 h-5 text-slate-600 mx-auto" />
    )
  }
  return <span className="text-sm text-slate-300">{value}</span>
}

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent-purple/10 rounded-full blur-[128px]" />
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-accent-blue/10 rounded-full blur-[128px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-6 transition-all duration-300 ${
                tier.highlighted
                  ? 'bg-gradient-to-b from-accent-purple/10 to-accent-blue/10 border-2 border-accent-purple/30 glow relative'
                  : 'gradient-border'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r from-accent-purple to-accent-blue">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-white mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-slate-500">{tier.period}</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">{tier.description}</p>
              <Link
                href="/marketplace"
                className={`block w-full text-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  tier.highlighted
                    ? 'text-white bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90'
                    : 'text-slate-300 border border-white/10 hover:bg-white/5'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Feature Comparison</h2>
        <div className="gradient-border rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-sm font-medium text-slate-400">Feature</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-400 text-center">Free</th>
                <th className="px-6 py-4 text-sm font-medium text-accent-blue text-center">Pro</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-400 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr key={feature.name} className={i < features.length - 1 ? 'border-b border-white/5' : ''}>
                  <td className="px-6 py-4 text-sm text-slate-300">{feature.name}</td>
                  <td className="px-6 py-4 text-center"><FeatureValue value={feature.free} /></td>
                  <td className="px-6 py-4 text-center bg-accent-blue/[0.02]"><FeatureValue value={feature.pro} /></td>
                  <td className="px-6 py-4 text-center"><FeatureValue value={feature.enterprise} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Billing FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Billing FAQ</h2>
        <div className="space-y-3">
          {billingFaqs.map((faq, i) => (
            <div key={i} className="gradient-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex items-center justify-between w-full p-5 text-left"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="gradient-border rounded-2xl p-8 sm:p-12 text-center glow">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Start with the free plan and upgrade when you need more power. No credit card required.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity"
          >
            Get Your API Key
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for testing and hobby projects.',
    features: [
      '1,000 requests/month',
      'Access to 50+ models',
      'Community support',
      '10 req/min rate limit',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For developers and growing teams.',
    features: [
      '100,000 requests/month',
      'Access to all 200+ models',
      'Priority support',
      '100 req/min rate limit',
      'Webhook notifications',
      'Usage analytics dashboard',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale production workloads.',
    features: [
      'Unlimited requests',
      'All models + early access',
      'Dedicated support & SLA',
      'Custom rate limits',
      'SSO & team management',
      'On-premise deployment option',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export default function PricingPreview() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Pay only for what you use. Start free and scale as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
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

        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-sm text-accent-blue hover:text-accent-purple transition-colors"
          >
            Compare all features
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

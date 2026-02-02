'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What AI models does NexAPI support?',
    a: 'NexAPI provides access to over 200 AI models across four categories: Video Generation (Runway, Pika, Kling), Image Generation (DALL-E, Stable Diffusion, Flux), Music & Audio (Suno, Udio, ElevenLabs), and LLM/Chat (GPT-4o, Claude, Llama, Gemini). We continuously add new models as they become available.',
  },
  {
    q: 'How does billing work?',
    a: 'We offer both monthly subscription plans and pay-as-you-go pricing. Each model has a per-request cost that is deducted from your monthly credit allowance. Free tier users get 1,000 requests/month. Pro users get 100,000 requests/month with the option to purchase additional credits.',
  },
  {
    q: 'Is there a rate limit?',
    a: 'Yes, rate limits depend on your plan. Free: 10 requests/min, Pro: 100 requests/min, Enterprise: custom limits. Rate limits are applied per API key and can be increased upon request for Enterprise customers.',
  },
  {
    q: 'Do you offer an SLA?',
    a: 'Enterprise customers receive a 99.9% uptime SLA with dedicated support channels. Our historical uptime across all services is 99.97%. Pro users receive priority support with a 4-hour response time guarantee.',
  },
  {
    q: 'Can I switch models without changing my code?',
    a: 'Yes! That is one of the core benefits of NexAPI. Our unified API format means you can switch between models (e.g., from DALL-E to Stable Diffusion) by simply changing the model parameter. No code refactoring needed.',
  },
  {
    q: 'How do I get started?',
    a: 'Sign up for a free account, grab your API key from the dashboard, and make your first API call in under 2 minutes. We provide SDKs for Python and Node.js, plus a REST API that works with any language.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-400">
            Everything you need to know about NexAPI.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="gradient-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between w-full p-5 text-left"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { Video, Image, Music, MessageSquare, ExternalLink, Zap } from 'lucide-react'

const categories = [
  { id: 'all', label: 'All', icon: Zap },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'music', label: 'Music & Audio', icon: Music },
  { id: 'llm', label: 'LLM / Chat', icon: MessageSquare },
]

const apis = [
  {
    name: 'Runway Gen-3 Alpha',
    category: 'video',
    description: 'State-of-the-art video generation from text and image prompts. Create cinematic-quality clips up to 10 seconds.',
    price: '$0.05',
    unit: 'per second',
    badge: 'Popular',
  },
  {
    name: 'Pika Labs v1.5',
    category: 'video',
    description: 'Fast, creative video generation with excellent motion quality and style control.',
    price: '$0.03',
    unit: 'per second',
    badge: null,
  },
  {
    name: 'Kling AI',
    category: 'video',
    description: 'High-quality video generation with realistic motion and physics understanding.',
    price: '$0.04',
    unit: 'per second',
    badge: 'New',
  },
  {
    name: 'Luma Dream Machine',
    category: 'video',
    description: 'Fast video generation model with strong coherence and natural motion.',
    price: '$0.03',
    unit: 'per second',
    badge: null,
  },
  {
    name: 'DALL-E 3',
    category: 'image',
    description: 'OpenAI\'s most advanced image generation model with excellent text rendering and prompt following.',
    price: '$0.04',
    unit: 'per image',
    badge: 'Popular',
  },
  {
    name: 'Stable Diffusion XL',
    category: 'image',
    description: 'Open-source image generation with fine-grained control. Supports ControlNet and LoRA.',
    price: '$0.01',
    unit: 'per image',
    badge: null,
  },
  {
    name: 'Flux Pro 1.1',
    category: 'image',
    description: 'Next-generation image model with photorealistic output and superior prompt adherence.',
    price: '$0.03',
    unit: 'per image',
    badge: 'New',
  },
  {
    name: 'Midjourney v6',
    category: 'image',
    description: 'Industry-leading aesthetic quality with powerful style control and upscaling.',
    price: '$0.05',
    unit: 'per image',
    badge: 'Popular',
  },
  {
    name: 'Suno v3.5',
    category: 'music',
    description: 'Full song generation from text prompts. Supports multiple genres, vocals, and instrumentals.',
    price: '$0.10',
    unit: 'per song',
    badge: 'Popular',
  },
  {
    name: 'Udio',
    category: 'music',
    description: 'High-fidelity music generation with excellent vocal quality and genre versatility.',
    price: '$0.08',
    unit: 'per song',
    badge: null,
  },
  {
    name: 'Stable Audio 2.0',
    category: 'music',
    description: 'Generate music and sound effects up to 3 minutes long. Great for game audio and podcasts.',
    price: '$0.05',
    unit: 'per track',
    badge: null,
  },
  {
    name: 'ElevenLabs',
    category: 'music',
    description: 'Realistic text-to-speech and voice cloning. 29 languages supported with emotional control.',
    price: '$0.001',
    unit: 'per char',
    badge: 'Popular',
  },
  {
    name: 'GPT-4o',
    category: 'llm',
    description: 'OpenAI\'s flagship multimodal model. Excellent at reasoning, coding, and creative tasks.',
    price: '$0.005',
    unit: 'per 1K tokens',
    badge: 'Popular',
  },
  {
    name: 'Claude 3.5 Sonnet',
    category: 'llm',
    description: 'Anthropic\'s balanced model with strong reasoning, coding, and instruction-following capabilities.',
    price: '$0.003',
    unit: 'per 1K tokens',
    badge: 'Popular',
  },
  {
    name: 'Llama 3.1 405B',
    category: 'llm',
    description: 'Meta\'s largest open-source model. Competitive with proprietary models at lower cost.',
    price: '$0.001',
    unit: 'per 1K tokens',
    badge: null,
  },
  {
    name: 'Gemini Pro 1.5',
    category: 'llm',
    description: 'Google\'s multimodal model with a 1M token context window. Excellent for long documents.',
    price: '$0.004',
    unit: 'per 1K tokens',
    badge: 'New',
  },
]

const badgeColors: Record<string, string> = {
  Popular: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  New: 'bg-green-500/10 text-green-400 border-green-500/20',
}

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? apis
    : apis.filter((a) => a.category === activeCategory)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent-purple/10 rounded-full blur-[128px]" />
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-accent-blue/10 rounded-full blur-[128px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 text-center">
            API <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-lg text-slate-400 text-center max-w-2xl mx-auto">
            Browse and integrate 200+ AI models. One API key, unified format, instant access.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-accent-purple to-accent-blue text-white'
                  : 'text-slate-400 border border-white/10 hover:bg-white/5'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* API grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((api) => (
            <div
              key={api.name}
              className="gradient-border rounded-xl p-5 flex flex-col transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold text-white">{api.name}</h3>
                {api.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${badgeColors[api.badge]}`}>
                    {api.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-4 flex-1">{api.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-white">{api.price}</span>
                  <span className="text-xs text-slate-500 ml-1">{api.unit}</span>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent-blue border border-accent-blue/30 rounded-lg hover:bg-accent-blue/10 transition-colors">
                  Try it <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

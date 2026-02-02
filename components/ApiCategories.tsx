import { Video, Image, Music, MessageSquare } from 'lucide-react'

const categories = [
  {
    icon: Video,
    title: 'Video Generation',
    description: 'Create stunning videos from text prompts or images with state-of-the-art models.',
    models: ['Runway Gen-3', 'Pika Labs', 'Kling AI', 'Luma Dream Machine'],
    color: 'from-pink-500 to-rose-500',
    borderColor: 'border-pink-500/20 hover:border-pink-500/40',
  },
  {
    icon: Image,
    title: 'Image Generation',
    description: 'Generate, edit, and upscale images with the most advanced diffusion models.',
    models: ['DALL-E 3', 'Stable Diffusion XL', 'Midjourney', 'Flux Pro'],
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
  },
  {
    icon: Music,
    title: 'Music & Audio',
    description: 'Compose music, generate sound effects, and clone voices with AI audio models.',
    models: ['Suno v3', 'Udio', 'Stable Audio', 'ElevenLabs'],
    color: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-500/20 hover:border-green-500/40',
  },
  {
    icon: MessageSquare,
    title: 'LLM / Chat',
    description: 'Access top language models for chat, code generation, reasoning, and more.',
    models: ['GPT-4o', 'Claude 3.5', 'Llama 3.1', 'Gemini Pro'],
    color: 'from-purple-500 to-violet-500',
    borderColor: 'border-purple-500/20 hover:border-purple-500/40',
  },
]

export default function ApiCategories() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Every AI Model, <span className="gradient-text">One API</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Browse our growing collection of AI models across four major categories.
            Integrate any model with a single API call.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className={`gradient-border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${cat.borderColor}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0`}>
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{cat.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{cat.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.models.map((model) => (
                      <span
                        key={model}
                        className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-slate-300 border border-white/5"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

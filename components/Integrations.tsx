'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const tabs = [
  {
    label: 'Python',
    lang: 'python',
    code: `import nexapi

client = nexapi.Client(api_key="your-api-key")

# Generate an image
image = client.images.generate(
    model="stable-diffusion-xl",
    prompt="A cyberpunk cityscape at night",
    size="1024x1024"
)

print(image.url)`,
  },
  {
    label: 'Node.js',
    lang: 'javascript',
    code: `import NexAPI from 'nexapi';

const client = new NexAPI({ apiKey: 'your-api-key' });

// Generate an image
const image = await client.images.generate({
  model: 'stable-diffusion-xl',
  prompt: 'A cyberpunk cityscape at night',
  size: '1024x1024',
});

console.log(image.url);`,
  },
  {
    label: 'cURL',
    lang: 'bash',
    code: `curl -X POST https://api.nexapi.ai/v1/images/generate \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "stable-diffusion-xl",
    "prompt": "A cyberpunk cityscape at night",
    "size": "1024x1024"
  }'`,
  },
]

const exampleResponse = `{
  "id": "img_abc123",
  "object": "image",
  "created": 1709251200,
  "model": "stable-diffusion-xl",
  "data": {
    "url": "https://cdn.nexapi.ai/img_abc123.png",
    "revised_prompt": "A cyberpunk cityscape...",
    "width": 1024,
    "height": 1024
  },
  "usage": {
    "credits_used": 0.04
  }
}`

export default function Integrations() {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(tabs[activeTab].code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Integrate in <span className="gradient-text">Minutes</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get started with just a few lines of code. We provide SDKs for Python,
            Node.js, and a REST API for any language.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code tabs */}
          <div className="gradient-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 px-4">
              <div className="flex">
                {tabs.map((tab, i) => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(i)}
                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === i
                        ? 'text-white'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                    {activeTab === i && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-purple to-accent-blue" />
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm leading-relaxed">
                <code className="text-slate-300">{tabs[activeTab].code}</code>
              </pre>
            </div>
          </div>

          {/* Response preview */}
          <div className="gradient-border rounded-2xl overflow-hidden">
            <div className="flex items-center border-b border-white/5 px-4 py-3">
              <span className="text-sm font-medium text-slate-400">Response</span>
              <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-500/10 text-green-400 border border-green-500/20">
                200 OK
              </span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm leading-relaxed">
                <code className="text-slate-300">{exampleResponse}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Supported models strip */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 mb-4">Supported models include</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              'GPT-4o', 'Claude 3.5', 'Llama 3.1', 'Gemini Pro',
              'DALL-E 3', 'Stable Diffusion XL', 'Flux Pro', 'Midjourney',
              'Suno v3', 'Runway Gen-3', 'ElevenLabs', 'Kling AI',
            ].map((model) => (
              <span
                key={model}
                className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-slate-400 border border-white/5"
              >
                {model}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

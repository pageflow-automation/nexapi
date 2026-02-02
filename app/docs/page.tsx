'use client'

import { useState } from 'react'
import { Copy, Check, BookOpen, Key, Code2, Zap } from 'lucide-react'

const sections = [
  { id: 'quickstart', label: 'Quickstart', icon: Zap },
  { id: 'auth', label: 'Authentication', icon: Key },
  { id: 'reference', label: 'API Reference', icon: Code2 },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  return (
    <div className="relative gradient-border rounded-xl overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-xs text-slate-500">{lang}</span>
      </div>
      <CopyButton text={code} />
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm leading-relaxed">
          <code className="text-slate-300">{code}</code>
        </pre>
      </div>
    </div>
  )
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('quickstart')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent-purple/10 rounded-full blur-[128px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-accent-blue" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              <span className="gradient-text">Documentation</span>
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Everything you need to integrate NexAPI into your application.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[240px_1fr] gap-12">
          {/* Sidebar nav */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === s.id
                      ? 'bg-accent-blue/10 text-accent-blue'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile tabs */}
          <div className="lg:hidden flex gap-2 mb-8 overflow-x-auto pb-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === s.id
                    ? 'bg-gradient-to-r from-accent-purple to-accent-blue text-white'
                    : 'text-slate-400 border border-white/10'
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="min-w-0">
            {activeSection === 'quickstart' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Quickstart</h2>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Get up and running with NexAPI in under 2 minutes. This guide walks you through
                  installing the SDK, authenticating, and making your first API call.
                </p>

                <h3 className="text-lg font-semibold text-white mb-3 mt-8">1. Install the SDK</h3>
                <p className="text-sm text-slate-400 mb-3">Choose your preferred language:</p>
                <CodeBlock lang="bash" code="pip install nexapi" />
                <CodeBlock lang="bash" code="npm install nexapi" />

                <h3 className="text-lg font-semibold text-white mb-3 mt-8">2. Set your API key</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Set your API key as an environment variable or pass it directly to the client.
                </p>
                <CodeBlock lang="bash" code='export NEXAPI_KEY="your-api-key-here"' />

                <h3 className="text-lg font-semibold text-white mb-3 mt-8">3. Make your first request</h3>
                <CodeBlock
                  lang="python"
                  code={`import nexapi

client = nexapi.Client()

# Generate an image
result = client.images.generate(
    model="stable-diffusion-xl",
    prompt="A mountain landscape at golden hour",
    size="1024x1024"
)

print(result.url)  # URL to the generated image
print(result.usage)  # Credits used for this request`}
                />

                <CodeBlock
                  lang="javascript"
                  code={`import NexAPI from 'nexapi';

const client = new NexAPI();

// Generate an image
const result = await client.images.generate({
  model: 'stable-diffusion-xl',
  prompt: 'A mountain landscape at golden hour',
  size: '1024x1024',
});

console.log(result.url);
console.log(result.usage);`}
                />

                <h3 className="text-lg font-semibold text-white mb-3 mt-8">4. Explore more models</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Switch between models by changing the <code className="px-1.5 py-0.5 rounded bg-white/10 text-accent-blue text-xs">model</code> parameter.
                  All models follow the same request/response format.
                </p>
                <CodeBlock
                  lang="python"
                  code={`# Switch to a different model — same code, different model
result = client.images.generate(
    model="dall-e-3",  # Just change the model name
    prompt="A mountain landscape at golden hour",
    size="1024x1024"
)

# Use an LLM
chat = client.chat.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "Explain quantum computing simply"}
    ]
)
print(chat.choices[0].message.content)

# Generate music
song = client.audio.generate(
    model="suno-v3",
    prompt="An upbeat electronic track with synths"
)
print(song.url)`}
                />

                <div className="mt-8 p-4 rounded-xl bg-accent-blue/5 border border-accent-blue/20">
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Tip:</strong> Check out the{' '}
                    <button
                      onClick={() => setActiveSection('reference')}
                      className="text-accent-blue hover:underline"
                    >
                      API Reference
                    </button>{' '}
                    for all available endpoints and parameters.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'auth' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Authentication</h2>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  All API requests require authentication using an API key. You can create
                  and manage API keys from your dashboard.
                </p>

                <h3 className="text-lg font-semibold text-white mb-3 mt-8">API Keys</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Pass your API key in the <code className="px-1.5 py-0.5 rounded bg-white/10 text-accent-blue text-xs">Authorization</code> header:
                </p>
                <CodeBlock
                  lang="http"
                  code="Authorization: Bearer your-api-key-here"
                />

                <h3 className="text-lg font-semibold text-white mb-3 mt-8">Environment Variable</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Our SDKs automatically detect the <code className="px-1.5 py-0.5 rounded bg-white/10 text-accent-blue text-xs">NEXAPI_KEY</code> environment variable:
                </p>
                <CodeBlock
                  lang="bash"
                  code='export NEXAPI_KEY="nex_sk_..."'
                />

                <h3 className="text-lg font-semibold text-white mb-3 mt-8">Key Scopes</h3>
                <p className="text-sm text-slate-400 mb-4">
                  API keys can be scoped to specific permissions:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Scope</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4"><code className="text-accent-blue text-xs">images:generate</code></td>
                        <td className="py-3 px-4">Generate and edit images</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4"><code className="text-accent-blue text-xs">chat:create</code></td>
                        <td className="py-3 px-4">Create chat completions</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4"><code className="text-accent-blue text-xs">audio:generate</code></td>
                        <td className="py-3 px-4">Generate music and audio</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4"><code className="text-accent-blue text-xs">video:generate</code></td>
                        <td className="py-3 px-4">Generate video content</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4"><code className="text-accent-blue text-xs">*</code></td>
                        <td className="py-3 px-4">Full access (default)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                  <p className="text-sm text-slate-300">
                    <strong className="text-yellow-400">Security:</strong> Never expose your API key in client-side code.
                    Always make API calls from your backend server.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'reference' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">API Reference</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  The NexAPI REST API is organized around resource types. All requests use
                  the base URL <code className="px-1.5 py-0.5 rounded bg-white/10 text-accent-blue text-xs">https://api.nexapi.ai/v1</code>.
                </p>

                {/* Images endpoint */}
                <div className="gradient-border rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-green-500/10 text-green-400 border border-green-500/20">
                      POST
                    </span>
                    <code className="text-sm text-white">/v1/images/generate</code>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Generate an image from a text prompt.</p>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Parameters</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Name</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Type</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Required</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-white/5">
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">model</code></td>
                          <td className="py-2 px-3">string</td>
                          <td className="py-2 px-3">Yes</td>
                          <td className="py-2 px-3">Model ID (e.g. &quot;stable-diffusion-xl&quot;)</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">prompt</code></td>
                          <td className="py-2 px-3">string</td>
                          <td className="py-2 px-3">Yes</td>
                          <td className="py-2 px-3">Text description of the desired image</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">size</code></td>
                          <td className="py-2 px-3">string</td>
                          <td className="py-2 px-3">No</td>
                          <td className="py-2 px-3">Image dimensions (default: &quot;1024x1024&quot;)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">n</code></td>
                          <td className="py-2 px-3">integer</td>
                          <td className="py-2 px-3">No</td>
                          <td className="py-2 px-3">Number of images to generate (default: 1)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Chat endpoint */}
                <div className="gradient-border rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-green-500/10 text-green-400 border border-green-500/20">
                      POST
                    </span>
                    <code className="text-sm text-white">/v1/chat/completions</code>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Create a chat completion using an LLM model.</p>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Parameters</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Name</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Type</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Required</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-white/5">
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">model</code></td>
                          <td className="py-2 px-3">string</td>
                          <td className="py-2 px-3">Yes</td>
                          <td className="py-2 px-3">Model ID (e.g. &quot;gpt-4o&quot;)</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">messages</code></td>
                          <td className="py-2 px-3">array</td>
                          <td className="py-2 px-3">Yes</td>
                          <td className="py-2 px-3">Array of message objects with role and content</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">temperature</code></td>
                          <td className="py-2 px-3">float</td>
                          <td className="py-2 px-3">No</td>
                          <td className="py-2 px-3">Sampling temperature (0-2, default: 1)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">max_tokens</code></td>
                          <td className="py-2 px-3">integer</td>
                          <td className="py-2 px-3">No</td>
                          <td className="py-2 px-3">Maximum tokens in response</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Audio endpoint */}
                <div className="gradient-border rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-green-500/10 text-green-400 border border-green-500/20">
                      POST
                    </span>
                    <code className="text-sm text-white">/v1/audio/generate</code>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Generate music or audio from a text prompt.</p>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Parameters</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Name</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Type</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Required</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-white/5">
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">model</code></td>
                          <td className="py-2 px-3">string</td>
                          <td className="py-2 px-3">Yes</td>
                          <td className="py-2 px-3">Model ID (e.g. &quot;suno-v3&quot;)</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">prompt</code></td>
                          <td className="py-2 px-3">string</td>
                          <td className="py-2 px-3">Yes</td>
                          <td className="py-2 px-3">Description of the desired audio</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">duration</code></td>
                          <td className="py-2 px-3">integer</td>
                          <td className="py-2 px-3">No</td>
                          <td className="py-2 px-3">Duration in seconds (model-dependent)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Video endpoint */}
                <div className="gradient-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-green-500/10 text-green-400 border border-green-500/20">
                      POST
                    </span>
                    <code className="text-sm text-white">/v1/video/generate</code>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Generate a video from a text prompt or image.</p>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Parameters</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Name</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Type</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Required</th>
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-white/5">
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">model</code></td>
                          <td className="py-2 px-3">string</td>
                          <td className="py-2 px-3">Yes</td>
                          <td className="py-2 px-3">Model ID (e.g. &quot;runway-gen3&quot;)</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">prompt</code></td>
                          <td className="py-2 px-3">string</td>
                          <td className="py-2 px-3">Yes</td>
                          <td className="py-2 px-3">Text description of the desired video</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3"><code className="text-accent-blue text-xs">duration</code></td>
                          <td className="py-2 px-3">integer</td>
                          <td className="py-2 px-3">No</td>
                          <td className="py-2 px-3">Duration in seconds (default: 4)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

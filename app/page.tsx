'use client'

import { useState } from 'react'

interface VideoIdea {
  title: string
  hook: string
  script: string
  hashtags: string[]
  viralityScore: number
  reasoning: string
}

export default function Home() {
  const [niche, setNiche] = useState('')
  const [trend, setTrend] = useState('')
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<VideoIdea[]>([])
  const [error, setError] = useState('')

  const generateIdeas = async () => {
    if (!niche.trim()) {
      setError('Please enter a niche or topic')
      return
    }

    setLoading(true)
    setError('')
    setIdeas([])

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ niche, trend }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate ideas')
      }

      const data = await response.json()
      setIdeas(data.ideas)
    } catch (err) {
      setError('Failed to generate ideas. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            🎬 Viral Shorts Agent
          </h1>
          <p className="text-xl text-gray-300">
            AI-powered YouTube Shorts ideas that are scientifically designed to go viral
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Niche / Topic *
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., Tech Reviews, Cooking, Fitness, Comedy..."
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Current Trend (Optional)
              </label>
              <input
                type="text"
                value={trend}
                onChange={(e) => setTrend(e.target.value)}
                placeholder="e.g., AI Tools, Viral Challenge, Breaking News..."
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
                {error}
              </div>
            )}

            <button
              onClick={generateIdeas}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Viral Ideas...
                </span>
              ) : (
                '✨ Generate Viral Ideas'
              )}
            </button>
          </div>
        </div>

        {ideas.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">
              🔥 Your Viral Video Ideas
            </h2>
            {ideas.map((idea, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-purple-300 flex-1">
                    {idea.title}
                  </h3>
                  <div className="flex items-center bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-full ml-4">
                    <span className="text-sm font-bold">
                      🎯 {idea.viralityScore}% Viral Score
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">
                      🎣 HOOK (First 3 seconds)
                    </h4>
                    <p className="text-gray-200 bg-black/30 p-3 rounded-lg">
                      {idea.hook}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">
                      📝 FULL SCRIPT
                    </h4>
                    <p className="text-gray-200 bg-black/30 p-3 rounded-lg whitespace-pre-wrap">
                      {idea.script}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">
                      🧠 WHY THIS WILL GO VIRAL
                    </h4>
                    <p className="text-gray-300 text-sm bg-black/30 p-3 rounded-lg">
                      {idea.reasoning}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">
                      #️⃣ HASHTAGS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {idea.hashtags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-purple-500/30 px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="text-center mt-16 text-gray-400 text-sm">
          <p>
            💡 Powered by AI • Generate unlimited viral video ideas • Stand out on YouTube Shorts
          </p>
        </footer>
      </div>
    </main>
  )
}

import { NextResponse } from 'next/server'

export const runtime = 'edge'

interface VideoIdea {
  title: string
  hook: string
  script: string
  hashtags: string[]
  viralityScore: number
  reasoning: string
}

const VIRAL_HOOKS = [
  "Wait until you see what happens...",
  "You won't believe this...",
  "This changed everything...",
  "Nobody talks about this...",
  "I tried this for 30 days...",
  "This is actually insane...",
  "POV: You just discovered...",
  "The secret that nobody tells you...",
]

const VIRAL_ELEMENTS = [
  "Controversy or debate",
  "Surprising facts or statistics",
  "Quick transformation or before/after",
  "Relatable everyday situations",
  "Life hacks or tips",
  "Breaking down complex topics simply",
  "Emotional storytelling",
  "Trending audio or challenge",
]

export async function POST(request: Request) {
  try {
    const { niche, trend } = await request.json()

    if (!niche) {
      return NextResponse.json(
        { error: 'Niche is required' },
        { status: 400 }
      )
    }

    // Generate ideas using Claude via Anthropic API
    const ideas = await generateViralIdeas(niche, trend)

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('Error generating ideas:', error)
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    )
  }
}

async function generateViralIdeas(niche: string, trend?: string): Promise<VideoIdea[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY

  if (!apiKey) {
    // Fallback to mock data if no API key
    return generateMockIdeas(niche, trend)
  }

  try {
    // Try Anthropic first
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: generatePrompt(niche, trend),
            },
          ],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.content[0].text
        return parseAIResponse(content)
      }
    }

    // Try OpenAI if Anthropic fails
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'user',
              content: generatePrompt(niche, trend),
            },
          ],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices[0].message.content
        return parseAIResponse(content)
      }
    }
  } catch (error) {
    console.error('API Error:', error)
  }

  // Fallback to mock data
  return generateMockIdeas(niche, trend)
}

function generatePrompt(niche: string, trend?: string): string {
  return `You are a viral YouTube Shorts expert. Generate 3 highly viral video ideas for the niche: "${niche}"${trend ? ` with the current trend: "${trend}"` : ''}.

For each idea, provide:
1. A catchy, clickbait-worthy title (under 60 characters)
2. A powerful hook for the first 3 seconds that stops scrolling
3. A complete 30-45 second script with pacing notes
4. 5-7 relevant hashtags
5. A virality score (70-95%)
6. Reasoning explaining why this will go viral

Format your response as JSON array:
[
  {
    "title": "...",
    "hook": "...",
    "script": "...",
    "hashtags": ["tag1", "tag2", ...],
    "viralityScore": 85,
    "reasoning": "..."
  }
]

Make the ideas:
- Attention-grabbing from the first second
- Easy to produce (no complex equipment needed)
- Emotionally engaging or surprising
- Shareable and relatable
- Optimized for the vertical 9:16 format
- Under 60 seconds total duration`
}

function parseAIResponse(content: string): VideoIdea[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error)
  }

  // Fallback to empty array if parsing fails
  return []
}

function generateMockIdeas(niche: string, trend?: string): VideoIdea[] {
  const trendText = trend ? ` + ${trend}` : ''

  return [
    {
      title: `The ${niche} Secret Nobody Tells You${trendText}`,
      hook: `Wait... this ${niche} trick actually works?!`,
      script: `[0-3s] Wait... this ${niche} trick actually works?!

[3-10s] So I discovered something crazy about ${niche} that professionals don't want you to know.

[10-25s] Here's what I found: ${trend || 'the most effective technique'} completely changes the game. I tested this for 30 days and the results were insane.

[25-35s] The key is doing THIS instead of what everyone else does. It's counterintuitive but it works.

[35-40s] Try it and let me know what happens!

[Visual: Fast cuts, dynamic text overlays, trending audio]`,
      hashtags: [niche.toLowerCase().replace(/\s+/g, ''), 'viral', 'shorts', 'fyp', 'tutorial', 'lifehack', 'mindblown'],
      viralityScore: 87,
      reasoning: `This video leverages curiosity gaps, promises insider knowledge, and uses pattern interrupts. The "nobody tells you" angle creates FOMO. Fast pacing and visual variety keeps retention high. The ${niche} niche is searchable and the format is proven to drive engagement.`,
    },
    {
      title: `I Tried ${niche} For 30 Days... 🤯`,
      hook: `Day 1 vs Day 30 of ${niche}... I can't believe this`,
      script: `[0-3s] Day 1 vs Day 30 of ${niche}... I can't believe this

[3-8s] At first, I was terrible. Like really bad.

[8-15s] But then I learned THIS one technique ${trend ? `involving ${trend}` : 'that changed everything'}.

[15-28s] By day 15, I saw massive improvements. By day 30? I'm not even the same person. The transformation was wild.

[28-38s] Here's exactly what I did: [Quick 3-step breakdown with text overlay]

[38-45s] Comment "DAY 1" if you're starting today!

[Visual: Split screen before/after, progress montage, upbeat music]`,
      hashtags: [niche.toLowerCase().replace(/\s+/g, ''), 'transformation', '30daychallenge', 'beforeandafter', 'progress', 'motivated', 'results'],
      viralityScore: 92,
      reasoning: `Transformation content performs exceptionally well. The day 1 vs day 30 format creates immediate visual interest. Viewers stay to see the results. The CTA to comment increases engagement signals, boosting algorithmic reach. Progress stories are inherently shareable.`,
    },
    {
      title: `Why Everyone Gets ${niche} Wrong`,
      hook: `If you do ${niche} like this, STOP immediately`,
      script: `[0-3s] If you do ${niche} like this, STOP immediately

[3-9s] 99% of people make this mistake and wonder why they fail.

[9-18s] They do [common mistake] when they should be doing [correct method]${trend ? ` especially with ${trend}` : ''}.

[18-30s] I wasted 2 years doing it wrong. Then I learned the right way and everything clicked. Now I'm gonna save you years of frustration.

[30-40s] Here's the RIGHT way: [Clear demonstration or explanation]

[40-45s] Share this with someone who needs to see it!

[Visual: Red X over wrong method, green checkmark over right method, clear comparisons]`,
      hashtags: [niche.toLowerCase().replace(/\s+/g, ''), 'mistakes', 'tutorial', 'tips', 'howto', 'educational', 'learn'],
      viralityScore: 89,
      reasoning: `"Everyone gets X wrong" creates instant curiosity and taps into loss aversion - people want to avoid making mistakes. The educational angle provides value while the confrontational tone stops scrollers. Clear visual comparisons enhance understanding and shareability.`,
    },
  ]
}

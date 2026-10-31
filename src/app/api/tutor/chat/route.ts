import { NextResponse } from 'next/server';
import { groqClient } from '@/services/ai/groq';

const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

const systemPrompt = `You are the Agentic IQ AI Tutor — an expert in LLMs, AI agents, prompt engineering, and the broader landscape of Agentic AI systems.

Your role is to:
- Explain concepts clearly and concisely, using analogies and examples where helpful.
- Identify and gently correct misconceptions in a student's questions.
- Encourage deeper reasoning and critical thinking.
- Keep responses focused and educational; avoid unnecessary filler.

You are tutoring students in an adaptive AI education platform. They are learning about:
- LLM foundations (tokens, embeddings, context windows, attention, hallucinations)
- AI agent architectures (planning loops, tool use, goal-directed decision making)
- Memory systems (short-term context, long-term retrieval, RAG)
- Multi-agent coordination patterns
- Prompt engineering techniques

Respond in clear, concise paragraphs. Do not use markdown headers. You may use bold text for key terms.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      // Fallback mock response if API key not configured
      return NextResponse.json({
        message: 'That is a great question! When considering AI agents, it is crucial to remember that they are more than just LLMs. While LLMs provide the reasoning capability, the agentic architecture — incorporating memory, planning, and tool use — is what enables them to act autonomously toward a goal. Unlike a basic LLM that responds to a single prompt, an agent can break down complex tasks, use external tools, and iteratively refine its approach.',
      });
    }

    const completion = await groqClient.chat.completions.create({
      model: groqModel,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.5,
      max_tokens: 600,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from AI');
    }

    return NextResponse.json({ message: content });
  } catch (err: any) {
    console.error('Tutor chat error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to get tutor response' },
      { status: 500 }
    );
  }
}

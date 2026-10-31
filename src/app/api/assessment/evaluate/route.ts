import { NextResponse } from 'next/server';
import { evaluateReasoningWithGroq } from '@/services/ai/groq';

export async function POST(request: Request) {
  try {
    const { conceptTitle, questionPrompt, userResponse } = await request.json();

    if (!conceptTitle || !questionPrompt || !userResponse) {
      return NextResponse.json(
        { error: 'Missing required fields: conceptTitle, questionPrompt, userResponse' },
        { status: 400 }
      );
    }

    const evaluation = await evaluateReasoningWithGroq({
      conceptTitle,
      questionPrompt,
      userResponse,
    });

    return NextResponse.json({ evaluation });
  } catch (err: any) {
    console.error('Groq evaluation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to evaluate reasoning' },
      { status: 500 }
    );
  }
}
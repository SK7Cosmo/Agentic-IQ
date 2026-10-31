import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { assessmentId, conceptTitle, questionPrompt, userResponse, score, evaluation } = await request.json();

    if (!conceptTitle || !userResponse || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: conceptTitle, userResponse, score' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If user is authenticated, persist the result
    if (user) {
      await supabase.from('assessment_results').insert({
        user_id: user.id,
        concept_title: conceptTitle,
        question_prompt: questionPrompt,
        user_response: userResponse,
        score,
        evaluation: evaluation ?? null,
        assessed_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Assessment submit error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to submit assessment' },
      { status: 500 }
    );
  }
}

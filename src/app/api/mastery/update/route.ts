import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Backend mastery update logic.
 * AI provides evaluation evidence; backend owns the mastery calculation.
 * Weighting: reasoning (70%), MCQ (30%).
 * Skipped/uncertain evaluations do NOT lower mastery.
 */
export async function POST(request: Request) {
  try {
    const {
      conceptId,
      conceptTitle,
      assessmentType, // 'reasoning' | 'mcq'
      newScore,       // 0-100 from AI or MCQ correctness
      confidence,     // 0-1 from AI evaluation
      misconceptions, // Array of misconception objects
      evaluationStatus, // 'completed' | 'skipped' | 'uncertain'
    } = await request.json();

    if (!conceptTitle || newScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: conceptTitle, newScore' },
        { status: 400 }
      );
    }

    // Skipped or uncertain evaluations do NOT update mastery
    if (evaluationStatus === 'skipped' || evaluationStatus === 'uncertain') {
      return NextResponse.json({
        success: true,
        message: 'Mastery not updated for skipped or uncertain evaluation',
        masteryUpdated: false,
      });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Weight based on assessment type
    const weight = assessmentType === 'reasoning' ? 0.7 : 0.3;

    // Fetch existing mastery for this concept
    let conceptIdToUse = conceptId;

    // If no conceptId, try to find by title
    if (!conceptIdToUse && conceptTitle) {
      const { data: concept } = await supabase
        .from('concepts')
        .select('id')
        .ilike('title', conceptTitle)
        .single();
      conceptIdToUse = concept?.id;
    }

    let previousScore = 0;
    let existingMastery = null;

    if (conceptIdToUse) {
      const { data: masteryData } = await supabase
        .from('learner_mastery')
        .select('*')
        .eq('user_id', user.id)
        .eq('concept_id', conceptIdToUse)
        .single();

      existingMastery = masteryData;
      previousScore = masteryData?.score ?? 0;
    }

    // Weighted mastery update: blend previous with new score
    // Formula: new_mastery = prev * (1 - weight) + new_score * weight
    // Also apply confidence factor: uncertain scores have less impact
    const confidenceFactor = typeof confidence === 'number' ? Math.max(0.5, confidence) : 1.0;
    const effectiveWeight = weight * confidenceFactor;
    const updatedScore = Math.round(
      previousScore * (1 - effectiveWeight) + newScore * effectiveWeight
    );

    // Ensure score stays in 0-100 range
    const finalScore = Math.min(100, Math.max(0, updatedScore));

    // Determine mastery level
    const masteryLevel =
      finalScore >= 80
        ? 'mastered'
        : finalScore >= 60
        ? 'proficient'
        : finalScore >= 30
        ? 'developing'
        : 'beginner';

    // Upsert mastery record (only if we have a conceptId)
    if (conceptIdToUse) {
      if (existingMastery) {
        await supabase
          .from('learner_mastery')
          .update({
            score: finalScore,
            level: masteryLevel,
            last_assessed_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('concept_id', conceptIdToUse);
      } else {
        await supabase.from('learner_mastery').insert({
          user_id: user.id,
          concept_id: conceptIdToUse,
          score: finalScore,
          level: masteryLevel,
          last_assessed_at: new Date().toISOString(),
        });
      }

      // Schedule revision if score is below proficient
      if (finalScore < 60) {
        const intervalDays = finalScore < 30 ? 1 : finalScore < 60 ? 3 : 7;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + intervalDays);

        // Upsert revision schedule
        const { data: existingRevision } = await supabase
          .from('revision_schedule')
          .select('id')
          .eq('user_id', user.id)
          .eq('concept_id', conceptIdToUse)
          .eq('status', 'pending')
          .single();

        if (!existingRevision) {
          await supabase.from('revision_schedule').insert({
            user_id: user.id,
            concept_id: conceptIdToUse,
            due_date: dueDate.toISOString(),
            interval_days: intervalDays,
            status: 'pending',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      masteryUpdated: true,
      previousScore,
      finalScore,
      masteryLevel,
      conceptId: conceptIdToUse,
    });
  } catch (err: unknown) {
    console.error('Mastery update error:', err);
    const message = err instanceof Error ? err.message : 'Failed to update mastery';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

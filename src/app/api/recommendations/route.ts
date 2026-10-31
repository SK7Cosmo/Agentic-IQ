import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Adaptive recommendations endpoint.
 * Based on concept mastery levels and prerequisites, recommends next learning activities.
 */
export async function GET(request: Request) {
  try {
    let supabase;
    try {
      supabase = await createClient();
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch learner mastery with concept details
    const { data: mastery } = await supabase
      .from('learner_mastery')
      .select('*, concepts(id, title, description, module_id, order_index)')
      .eq('user_id', user.id);

    // Fetch all concepts for unassessed detection
    const { data: allConcepts } = await supabase
      .from('concepts')
      .select('id, title, description, module_id, order_index')
      .order('order_index');

    const masteryMap = new Map(mastery?.map((m) => [m.concept_id, m]) ?? []);

    const recommendations: {
      type: 'new' | 'revisit' | 'practice' | 'fast-track';
      conceptId: string;
      conceptTitle: string;
      reason: string;
      priority: number;
    }[] = [];

    for (const concept of allConcepts ?? []) {
      const conceptMastery = masteryMap.get(concept.id);

      if (!conceptMastery) {
        // Unassessed concept — recommend as new
        recommendations.push({
          type: 'new',
          conceptId: concept.id,
          conceptTitle: concept.title,
          reason: 'Start fresh — this concept has not been assessed yet.',
          priority: 3,
        });
      } else if (conceptMastery.score < 30) {
        // Beginner — recommend revisit
        recommendations.push({
          type: 'revisit',
          conceptId: concept.id,
          conceptTitle: concept.title,
          reason: `Your score of ${conceptMastery.score}% indicates foundational gaps. Revisit core ideas.`,
          priority: 5,
        });
      } else if (conceptMastery.score < 60) {
        // Developing — recommend practice
        recommendations.push({
          type: 'practice',
          conceptId: concept.id,
          conceptTitle: concept.title,
          reason: `You're developing in this concept (${conceptMastery.score}%). Additional practice will solidify understanding.`,
          priority: 4,
        });
      } else if (conceptMastery.score >= 80) {
        // Mastered — optionally fast-track
        recommendations.push({
          type: 'fast-track',
          conceptId: concept.id,
          conceptTitle: concept.title,
          reason: `Strong mastery (${conceptMastery.score}%). You can fast-track advanced topics here.`,
          priority: 1,
        });
      }
    }

    // Sort by priority (5 = highest)
    recommendations.sort((a, b) => b.priority - a.priority);

    return NextResponse.json({
      recommendations: recommendations.slice(0, 5),
      totalConcepts: allConcepts?.length ?? 0,
      assessedConcepts: mastery?.length ?? 0,
    });
  } catch (err: unknown) {
    console.error('Recommendations error:', err);
    const message = err instanceof Error ? err.message : 'Failed to generate recommendations';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

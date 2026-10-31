import OpenAI from 'openai';

const groqApiKey = process.env.GROQ_API_KEY || '';
const groqBaseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

// Server-side only — never expose to browser
if (typeof window !== 'undefined') {
  throw new Error('groq.ts must only be imported in server-side code');
}

export const groqClient = new OpenAI({
  apiKey: groqApiKey || 'placeholder_key_for_build',
  baseURL: groqBaseUrl,
});

function validateEvaluation(raw: unknown): asserts raw is {
  concept: string;
  score: number;
  confidence: number;
  understanding_level: string;
  correct_points: string[];
  missing_points: string[];
  misconceptions: Array<{ statement: string; explanation: string }>;
  feedback: string;
  recommended_action: string;
} {
  if (typeof raw !== 'object' || raw === null) throw new Error('Invalid evaluation: not an object');
  const obj = raw as Record<string, unknown>;
  if (typeof obj.score !== 'number' || obj.score < 0 || obj.score > 100)
    throw new Error('Invalid evaluation: score out of range');
  if (typeof obj.confidence !== 'number' || obj.confidence < 0 || obj.confidence > 1)
    throw new Error('Invalid evaluation: confidence out of range');
  if (!['beginner', 'developing', 'proficient', 'mastered'].includes(obj.understanding_level as string))
    throw new Error('Invalid evaluation: unknown understanding_level');
  if (!Array.isArray(obj.correct_points)) throw new Error('Invalid evaluation: correct_points not array');
  if (!Array.isArray(obj.missing_points)) throw new Error('Invalid evaluation: missing_points not array');
  if (!Array.isArray(obj.misconceptions)) throw new Error('Invalid evaluation: misconceptions not array');
  if (typeof obj.feedback !== 'string') throw new Error('Invalid evaluation: feedback missing');
  if (typeof obj.recommended_action !== 'string') throw new Error('Invalid evaluation: recommended_action missing');
}

async function callGroqEvaluate(
  conceptTitle: string,
  questionPrompt: string,
  userResponse: string,
  attempt = 1
): Promise<unknown> {
  const systemPrompt = `You are an expert AI learning evaluator for Agentic IQ, an adaptive AI education platform.
Evaluate the learner's explanation of the concept based on conceptual correctness, depth of reasoning, missing elements, and misconceptions.
Be direct, educational, and constructive. Identify specific misconceptions with clear corrections.
You MUST respond with ONLY valid JSON matching this exact structure — no markdown, no extra text:
{
  "concept": "${conceptTitle}",
  "score": <integer 0-100>,
  "confidence": <decimal 0.0-1.0>,
  "understanding_level": "<beginner|developing|proficient|mastered>",
  "correct_points": ["..."],
  "missing_points": ["..."],
  "misconceptions": [{"statement": "...", "explanation": "..."}],
  "feedback": "...",
  "recommended_action": "..."
}`;

  const systemPromptRetry = `${systemPrompt}
IMPORTANT: Your previous response was unclear. Please provide a definitive, high-confidence evaluation now. Be specific and thorough.`;

  const completion = await groqClient.chat.completions.create({
    model: groqModel,
    messages: [
      { role: 'system', content: attempt > 1 ? systemPromptRetry : systemPrompt },
      { role: 'user', content: `Concept: ${conceptTitle}\nQuestion: ${questionPrompt}\nLearner Response: ${userResponse}` },
    ],
    response_format: { type: 'json_object' },
    temperature: attempt > 1 ? 0.1 : 0.2,
    max_tokens: 800,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from Groq API');

  return JSON.parse(content);
}

export async function evaluateReasoningWithGroq({
  conceptTitle,
  questionPrompt,
  userResponse,
}: {
  conceptTitle: string;
  questionPrompt: string;
  userResponse: string;
}) {
  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  let raw: unknown;

  try {
    raw = await callGroqEvaluate(conceptTitle, questionPrompt, userResponse, 1);
  } catch (err) {
    throw new Error('Groq API request failed: ' + (err as Error).message);
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = raw as Record<string, unknown>;
    validateEvaluation(parsed);
  } catch {
    // Retry once with a stricter prompt
    try {
      raw = await callGroqEvaluate(conceptTitle, questionPrompt, userResponse, 2);
      parsed = raw as Record<string, unknown>;
      validateEvaluation(parsed);
    } catch {
      // Mark as uncertain rather than failing completely
      return {
        concept: conceptTitle,
        score: 0,
        confidence: 0.1,
        understanding_level: 'beginner',
        correct_points: [],
        missing_points: [],
        misconceptions: [],
        feedback: 'The evaluation could not be completed with sufficient confidence. Please rephrase your explanation and try again.',
        recommended_action: 'Review the concept and rephrase your explanation.',
        status: 'uncertain',
      };
    }
  }

  // Low confidence: retry once
  if ((parsed as { confidence: number }).confidence < 0.5) {
    try {
      const retried = await callGroqEvaluate(conceptTitle, questionPrompt, userResponse, 2) as Record<string, unknown>;
      validateEvaluation(retried);
      return retried;
    } catch {
      // Return original with uncertain marker
      return { ...parsed, status: 'uncertain' };
    }
  }

  return parsed;
}

export async function generateTutorResponse(messages: Array<{ role: string; content: string }>): Promise<string> {
  if (!groqApiKey) throw new Error('GROQ_API_KEY is not configured');

  const completion = await groqClient.chat.completions.create({
    model: groqModel,
    messages: messages as Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    temperature: 0.5,
    max_tokens: 600,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from AI');
  return content;
}
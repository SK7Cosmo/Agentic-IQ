'use client';

import { use, Suspense, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Award,
  Clock,
  Volume2,
  Bot,
  Sparkles,
  Layers,
  Lightbulb,
  Compass
} from 'lucide-react';
import { useVoiceOutput } from '@/hooks/useVoiceOutput';
import { VoiceSpeakerButton } from '@/components/VoiceSpeakerButton';

interface LessonContent {
  title: string;
  stage: string;
  readingTimeMins: number;
  analogy: string;
  body: string[];
  keyPoints: string[];
}

const lessonData: Record<string, LessonContent> = {
  c1: {
    title: 'Tokens and Embeddings',
    stage: 'Stage 01 · LLM Foundations',
    readingTimeMins: 15,
    analogy:
      'Think of tokens like syllables in language, and embeddings like GPS coordinates in a vast conceptual universe. Words with similar meanings have coordinates situated physically close together.',
    body: [
      'Large Language Models do not process raw text characters or full words directly. Instead, text is first converted into discrete integer tokens using algorithms such as Byte-Pair Encoding (BPE). A token can represent a whole word, a subword fragment, or even a single whitespace character.',
      'Once tokenized, each token is mapped into a high-dimensional continuous vector space—an embedding. In this geometric space, semantic relationships translate into spatial vectors. The vector distance between "king" and "queen" mirrors the vector distance between "man" and "woman", giving the model its foundation for mathematical reasoning over human language.',
      'In agentic workflows, embeddings are also the cornerstone of episodic memory. By converting external documentation or conversation transcripts into embeddings, an autonomous agent can perform cosine similarity lookups to retrieve relevant context on demand.',
    ],
    keyPoints: [
      'Text is tokenized into numerical IDs before feeding into neural weights.',
      'Embeddings map tokens to continuous geometric manifolds (typically 1,536 to 4,096 dimensions).',
      'Spatial proximity in embedding space directly reflects semantic equivalence.',
      'Vector databases use these embeddings to enable long-term memory retrieval for agents.',
    ],
  },
  c2: {
    title: 'Context Windows & KV-Cache',
    stage: 'Stage 01 · LLM Foundations',
    readingTimeMins: 10,
    analogy:
      'The context window is like an agent’s short-term working memory on a physical whiteboard. When the whiteboard fills up, older notes must be erased to make room for new thoughts.',
    body: [
      'Every LLM operates with a strict context window constraint—a finite capacity of total input plus output tokens it can attend to in a single forward pass.',
      'As an agent executes multi-step plans, its conversation history, tool definitions, and tool output observations all consume context window budget. If unmanaged, context truncation occurs, and the model loses track of its original objective.',
      'Production agent architectures solve this using hierarchical memory management: summarizing past steps, offloading raw data to vector stores, and injecting only curated context into the active prompt.',
    ],
    keyPoints: [
      'Context windows represent hard token bounds (e.g., 8k, 32k, 128k tokens).',
      'Tokens beyond the window are permanently invisible to the model.',
      'Agentic loops require memory compression to prevent context exhaustion over long runs.',
    ],
  },
  c3: {
    title: 'Self-Attention Mechanics',
    stage: 'Stage 01 · LLM Foundations',
    readingTimeMins: 25,
    analogy:
      'Imagine reading a sentence where each word shines a spotlight on every other word to decide how much attention it deserves in context.',
    body: [
      'Self-attention allows each token in a sequence to dynamically weigh its relevance against every other token. This eliminates the recurrent bottleneck of older RNN architectures.',
      'Computationally, each token is projected into Query (Q), Key (K), and Value (V) matrices. The dot product between Query and Key determines the attention weight score, normalized via softmax, which then weights the Value vectors.',
      'Multi-Head Attention runs multiple sets of Q, K, V projections in parallel, enabling the network to simultaneously attend to syntactic agreements, semantic roles, and long-range dependencies.',
    ],
    keyPoints: [
      'Attention scores are computed as scaled dot-products between Queries and Keys.',
      'Softmax normalization creates a probability distribution of relevance.',
      'Multi-Head Attention captures diverse linguistic relationships simultaneously.',
    ],
  },
};

function LessonInner({ params }: { params: Promise<{ moduleId: string; lessonId: string }> }) {
  const { moduleId, lessonId } = use(params);
  const lesson = lessonData[lessonId] || lessonData['c1'];
  const { speak, stop: stopSpeaking, isSpeaking } = useVoiceOutput();

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Top Breadcrumb & Audio Narration Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color pb-5">
        <Link
          href={`/curriculum/${moduleId}`}
          className="inline-flex items-center gap-2 text-text-muted hover:text-deep-ink font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Atlas Module</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-text-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {lesson.readingTimeMins} min read
          </span>
          <VoiceSpeakerButton
            isSpeaking={isSpeaking}
            onToggle={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speak(`${lesson.title}. ${lesson.body.join(' ')}`);
              }
            }}
            size="md"
          />
        </div>
      </div>

      {/* Editorial Lesson Header */}
      <div className="space-y-3">
        <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20 text-[9px]">
          {lesson.stage}
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-deep-ink tracking-tight">
          {lesson.title}
        </h1>
      </div>

      {/* Intuitive Analogy Callout Box */}
      {lesson.analogy && (
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Intuitive Mental Model</span>
          </div>
          <p className="text-xs md:text-sm text-charcoal leading-relaxed italic">
            &ldquo;{lesson.analogy}&rdquo;
          </p>
        </div>
      )}

      {/* Lesson Body Paragraphs */}
      <div className="studio-card rounded-3xl p-8 md:p-10 bg-white space-y-6">
        {lesson.body.map((para, i) => (
          <p key={i} className="text-sm md:text-base text-charcoal leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Key Takeaways Section */}
      <div className="p-8 rounded-3xl bg-soft-neutral/70 border border-border-color space-y-4">
        <h3 className="font-bold text-deep-ink text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Core Takeaways</span>
        </h3>
        <ul className="space-y-2.5">
          {lesson.keyPoints.map((pt, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-charcoal">
              <span className="text-electric-indigo font-bold shrink-0">•</span>
              <span className="leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contextual Action Cards: AI Tutor + Reasoning Studio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Contextual Socratic Tutor Card */}
        <div className="studio-card rounded-2xl p-6 bg-white flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-electric-indigo">
              <Bot className="w-4 h-4" />
              <span>Socratic Studio Companion</span>
            </div>
            <h4 className="text-base font-bold text-deep-ink">Have questions on this concept?</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Ask your AI tutor to clarify mathematical projections or generate code examples.
            </p>
          </div>
          <Link
            href="/tutor"
            className="w-full py-3 rounded-xl bg-soft-neutral hover:bg-neutral-200 text-deep-ink text-xs font-bold transition-all border border-border-color flex items-center justify-center gap-2"
          >
            <span>Consult Studio Tutor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Reasoning Studio Verification Card */}
        <div className="studio-card-elevated rounded-2xl p-6 bg-white flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Verify Your Understanding</span>
            </div>
            <h4 className="text-base font-bold text-deep-ink">Test Your Reasoning</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Explain this concept verbally in the Reasoning Studio to calibrate your mastery score.
            </p>
          </div>
          <Link
            href="/assessment/diagnostic"
            className="w-full py-3 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <span>Launch Reasoning Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-10 text-xs text-text-muted">Loading lesson laboratory...</div>}>
      <LessonInner params={params} />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Brain,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Volume2,
  RotateCcw,
  Layers,
  Activity,
  Check,
  Compass
} from 'lucide-react';
import Link from 'next/link';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useVoiceOutput } from '@/hooks/useVoiceOutput';
import { VoiceMicButton } from '@/components/VoiceMicButton';
import { VoiceSpeakerButton } from '@/components/VoiceSpeakerButton';

type AssessmentStep = 'mcq' | 'reasoning' | 'evaluating' | 'result';

interface EvaluationResult {
  concept: string;
  score: number;
  confidence: number;
  understanding_level: string;
  correct_points: string[];
  missing_points: string[];
  misconceptions: Array<{ statement: string; explanation: string }>;
  feedback: string;
  recommended_action: string;
  status?: string;
}

interface MasteryUpdate {
  masteryUpdated: boolean;
  previousScore: number;
  finalScore: number;
  masteryLevel: string;
}

const MCQ = {
  question: 'Which of the following BEST distinguishes an autonomous AI Agent from a standard Large Language Model?',
  options: [
    'An AI agent has direct internet access and executes web browser searches.',
    'An AI agent utilizes goal-directed reasoning loops, autonomous tool invocation, and multi-step plan execution.',
    'An AI agent generates significantly longer, higher-token responses.',
    'An AI agent is pre-trained on larger datasets than general-purpose LLMs.',
  ],
  correctIndex: 1,
};

const REASONING_QUESTION = {
  concept: 'LLM vs AI Agent',
  module: 'Agent Fundamentals',
  prompt: 'Why does an autonomous AI agent require tools and decision-making capabilities, rather than relying solely on next-token text prediction?',
};

export default function DiagnosticAssessmentPage() {
  const [step, setStep] = useState<AssessmentStep>('mcq');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mcqSubmitted, setMcqSubmitted] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [masteryUpdate, setMasteryUpdate] = useState<MasteryUpdate | null>(null);
  const [error, setError] = useState('');

  const { speak, stop: stopSpeaking, isSpeaking } = useVoiceOutput();
  const {
    isListening,
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
  } = useVoiceInput({
    onTranscript: (spoken) => {
      setUserResponse((prev) => (prev ? `${prev} ${spoken}` : spoken));
    },
  });

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSimulateVoiceDictation = () => {
    setUserResponse(
      'An LLM by itself is an open-loop token generator with a fixed knowledge cutoff and cannot execute actions in the physical world. An agent requires tool access to query real-time external state and perform mutations. Most importantly, an agent requires a closed-loop reasoning cycle—such as ReAct—so it can evaluate the result of an action, decide if it succeeded, and correct its trajectory autonomously.'
    );
  };

  const handleMcqSubmit = () => {
    if (selectedOption === null) return;
    setMcqSubmitted(true);
    setTimeout(() => setStep('reasoning'), 1200);
  };

  const handleReasoningSubmit = async () => {
    if (!userResponse.trim()) return;
    if (isListening) stopListening();
    setStep('evaluating');
    setError('');

    try {
      // Step 1: Evaluate reasoning with Groq AI
      const evalRes = await fetch('/api/assessment/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptTitle: REASONING_QUESTION.concept,
          questionPrompt: REASONING_QUESTION.prompt,
          userResponse,
        }),
      });

      const evalData = await evalRes.json();
      if (!evalRes.ok) throw new Error(evalData.error || 'Evaluation failed');

      const evalResult = evalData.evaluation;
      setEvaluation(evalResult);

      // Step 2: Update mastery via backend
      if (evalResult?.status !== 'uncertain') {
        const masteryRes = await fetch('/api/mastery/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conceptTitle: REASONING_QUESTION.concept,
            assessmentType: 'reasoning',
            newScore: evalResult.score,
            confidence: evalResult.confidence,
            misconceptions: evalResult.misconceptions || [],
            evaluationStatus: evalResult.status || 'completed',
          }),
        });

        if (masteryRes.ok) {
          const mData = await masteryRes.json();
          setMasteryUpdate(mData);
        }
      }

      // Step 3: Record attempt
      await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptTitle: REASONING_QUESTION.concept,
          questionPrompt: REASONING_QUESTION.prompt,
          userResponse,
          score: evalResult.score,
          evaluation: evalResult,
        }),
      });

      setStep('result');
    } catch (err: any) {
      console.error('Assessment evaluation error:', err);
      setError(err.message || 'Evaluation failed. Please try again.');
      setStep('reasoning');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700';
    if (score >= 60) return 'text-electric-indigo';
    if (score >= 40) return 'text-amber-700';
    return 'text-coral';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Studio Header & Workflow Tracker */}
      <div className="border-b border-border-color pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20 text-[9px]">
                Reasoning Studio
              </span>
              <span className="text-xs font-mono font-bold text-text-muted">STAGE 02 · DRILL</span>
            </div>
            <h1 className="text-3xl font-black text-deep-ink tracking-tight mt-1">
              Cognitive Diagnostic Evaluation
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {['Probe', 'Explanation', 'Analysis', 'Report'].map((label, idx) => {
              const stepMap: Record<AssessmentStep, number> = {
                mcq: 0,
                reasoning: 1,
                evaluating: 2,
                result: 3,
              };
              const isCurrent = stepMap[step] === idx;
              const isDone = stepMap[step] > idx;

              return (
                <div key={label} className="flex items-center gap-1.5 text-xs">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-electric-indigo text-white ring-2 ring-electric-indigo/20'
                        : 'bg-soft-neutral text-text-muted border border-border-color'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`hidden sm:inline font-medium text-[11px] ${
                      isCurrent ? 'text-deep-ink font-bold' : 'text-text-muted'
                    }`}
                  >
                    {label}
                  </span>
                  {idx < 3 && <span className="text-border-color">·</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 1: INITIAL COGNITIVE PROBE (MCQ) */}
      {step === 'mcq' && (
        <div className="studio-card rounded-3xl p-8 md:p-10 space-y-8 bg-white">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Step 1 of 2 · Cognitive Calibration
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-deep-ink leading-relaxed">
              {MCQ.question}
            </h2>
            <p className="text-xs text-text-muted">
              Select the response that represents your current understanding. You will be asked to explain your reasoning verbally in the next step.
            </p>
          </div>

          <div className="space-y-3">
            {MCQ.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === MCQ.correctIndex;

              let style =
                'bg-white border-border-color hover:border-electric-indigo/40 hover:bg-soft-neutral/40 text-charcoal';
              if (mcqSubmitted) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                } else if (isSelected) {
                  style = 'bg-coral/10 border-coral text-coral font-bold';
                }
              } else if (isSelected) {
                style =
                  'bg-electric-indigo/5 border-electric-indigo text-electric-indigo font-bold ring-2 ring-electric-indigo/15';
              }

              return (
                <button
                  key={i}
                  disabled={mcqSubmitted}
                  onClick={() => setSelectedOption(i)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm transition-all flex items-start gap-3.5 ${style}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg font-mono text-xs flex items-center justify-center shrink-0 font-bold ${
                      isSelected
                        ? 'bg-electric-indigo text-white'
                        : 'bg-soft-neutral text-text-muted border border-border-color'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleMcqSubmit}
              disabled={selectedOption === null || mcqSubmitted}
              className="px-7 py-3.5 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark disabled:opacity-40 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
            >
              <span>{mcqSubmitted ? 'Advancing to Verbal Reasoning...' : 'Confirm & Proceed'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: VOICE-FIRST REASONING STUDIO */}
      {step === 'reasoning' && (
        <div className="studio-card rounded-3xl p-8 md:p-10 space-y-8 bg-white">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Step 2 of 2 · Verbal Explanation Studio
              </span>
              <span className="studio-pill bg-amber-500/10 text-amber-800 border border-amber-500/20 text-[9px]">
                Open-Ended Evaluation
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-soft-neutral/70 border border-border-color space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-electric-indigo">
                Core Concept: {REASONING_QUESTION.concept}
              </span>
              <p className="text-lg font-bold text-deep-ink leading-relaxed">
                {REASONING_QUESTION.prompt}
              </p>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Do not worry about rehearsed jargon. Explain the causal relationships in your own words.
              You can dictate directly with your microphone or type your response below.
            </p>
          </div>

          {/* Voice Waveform Recording Console */}
          <div className="p-5 rounded-2xl bg-soft-neutral/50 border border-border-color space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <VoiceMicButton
                  isListening={isListening}
                  onToggle={handleToggleMic}
                  isSupported={isVoiceSupported}
                  label={isListening ? 'Stop Recording' : 'Dictate with Voice'}
                  size="md"
                />
                <button
                  type="button"
                  onClick={handleSimulateVoiceDictation}
                  className="text-xs font-bold text-electric-indigo hover:text-indigo-700 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Simulate Voice Input (Demo)
                </button>
              </div>

              {isListening && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1" />
                  <span>Listening... Speak clearly</span>
                </div>
              )}
            </div>

            {/* Simulated Audio Waveform Visualizer */}
            {isListening && (
              <div className="h-10 flex items-center justify-center gap-1.5 px-4 bg-white rounded-xl border border-rose-200">
                {[12, 24, 18, 28, 14, 20, 32, 16, 26, 12, 30, 22, 14, 26, 18].map((h, idx) => (
                  <span
                    key={idx}
                    className="w-1 bg-rose-500 rounded-full waveform-bar"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${idx * 0.08}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Editable Studio Transcription Area */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                Your Reasoning Transcript (Editable before submission)
              </label>
              <textarea
                rows={6}
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Speak into your microphone or type your conceptual explanation here..."
                className="w-full bg-white border border-border-color rounded-xl p-4 text-xs md:text-sm text-deep-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-electric-indigo/20 focus:border-electric-indigo transition-all resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-coral/10 border border-coral/20 rounded-xl text-coral text-xs font-bold flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleReasoningSubmit}
                className="text-electric-indigo underline font-bold"
              >
                Retry
              </button>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-text-muted">
              Evaluated in real-time by Groq LLaMA 3.3 70B
            </span>
            <button
              onClick={handleReasoningSubmit}
              disabled={!userResponse.trim()}
              className="px-8 py-3.5 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark disabled:opacity-40 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
            >
              <span>Submit for Cognitive Evaluation</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: NEURAL COGNITIVE EVALUATION STATE */}
      {step === 'evaluating' && (
        <div className="studio-card rounded-3xl p-16 text-center space-y-6 bg-white">
          <div className="w-16 h-16 rounded-2xl bg-electric-indigo/10 text-electric-indigo flex items-center justify-center mx-auto animate-pulse">
            <Brain className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-deep-ink">Auditing Conceptual Depth</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Evaluating causal logic, identifying latent misconceptions, and grading against rubric models.
            </p>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-electric-indigo mx-auto" />
        </div>
      )}

      {/* STEP 4: EDITORIAL AI EVALUATION REPORT */}
      {step === 'result' && evaluation && (
        <div className="space-y-8">
          {/* Main Intelligence Report Card */}
          <div className="studio-card-elevated rounded-3xl p-8 md:p-10 bg-white space-y-8">
            {/* Report Header: Confidence vs Mastery Score */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border-color pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20 text-[9px]">
                    Cognitive Audit Report
                  </span>
                  <VoiceSpeakerButton
                    isSpeaking={isSpeaking}
                    onToggle={() => {
                      if (isSpeaking) {
                        stopSpeaking();
                      } else {
                        speak(`${evaluation.understanding_level}. ${evaluation.feedback}`);
                      }
                    }}
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-deep-ink capitalize tracking-tight">
                  Status: <span className="text-electric-indigo">{evaluation.understanding_level}</span>
                </h2>
                <p className="text-xs text-text-muted max-w-md">{evaluation.feedback}</p>
              </div>

              {/* Distinguished Confidence vs Mastery Metrics */}
              <div className="flex items-center gap-6 shrink-0 bg-soft-neutral/50 p-4 rounded-2xl border border-border-color">
                <div className="text-center px-2">
                  <span className="text-[10px] uppercase font-bold text-text-muted block">
                    Mastery Score
                  </span>
                  <span className={`text-4xl font-black font-mono ${getScoreColor(evaluation.score)}`}>
                    {evaluation.score}%
                  </span>
                </div>
                <div className="h-10 w-px bg-border-color" />
                <div className="text-center px-2">
                  <span className="text-[10px] uppercase font-bold text-text-muted block">
                    AI Confidence
                  </span>
                  <span className="text-4xl font-black font-mono text-charcoal">
                    {Math.round((evaluation.confidence || 0.9) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Cognitive Pillars Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Correct Points */}
              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Valid Mental Models Confirmed</span>
                </div>
                <ul className="space-y-2 text-xs text-charcoal">
                  {(evaluation.correct_points || []).map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Points */}
              <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Reasoning Gaps to Address</span>
                </div>
                <ul className="space-y-2 text-xs text-charcoal">
                  {(evaluation.missing_points || []).map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Misconception Diagnostic if detected */}
            {evaluation.misconceptions && evaluation.misconceptions.length > 0 && (
              <div className="p-6 rounded-2xl bg-coral/5 border border-coral/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-coral">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Diagnosed Cognitive Misconception</span>
                </div>
                {evaluation.misconceptions.map((m, i) => (
                  <div key={i} className="text-xs space-y-2">
                    <p className="text-deep-ink font-semibold">&ldquo;{m.statement}&rdquo;</p>
                    <div className="bg-white p-3.5 rounded-xl border border-coral/15 text-charcoal leading-relaxed">
                      <strong className="text-coral block mb-0.5">Correct Understanding:</strong>
                      {m.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Concept Mastery Delta Update */}
            {masteryUpdate && masteryUpdate.masteryUpdated && (
              <div className="p-5 rounded-2xl bg-electric-indigo/5 border border-electric-indigo/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-electric-indigo/10 text-electric-indigo flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-electric-indigo">
                      Concept Mastery Calibrated
                    </span>
                    <h4 className="text-sm font-bold text-deep-ink">
                      {REASONING_QUESTION.concept}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-text-muted">
                    {masteryUpdate.previousScore}%
                  </span>
                  <span className="text-electric-indigo font-bold">→</span>
                  <span className="text-emerald-700 font-bold text-base">
                    {masteryUpdate.finalScore}%
                  </span>
                  <span className="studio-pill bg-electric-indigo text-white text-[9px]">
                    {masteryUpdate.masteryLevel}
                  </span>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border-color">
              <button
                onClick={() => {
                  setStep('reasoning');
                  setUserResponse('');
                  setEvaluation(null);
                  setMasteryUpdate(null);
                }}
                className="text-xs font-bold text-text-muted hover:text-deep-ink flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Drill</span>
              </button>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-5 py-3 rounded-xl bg-soft-neutral hover:bg-neutral-200 text-deep-ink text-xs font-bold transition-all border border-border-color"
                >
                  Return to Command Center
                </Link>
                <Link
                  href="/roadmap"
                  className="px-6 py-3 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <span>View in Constellation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

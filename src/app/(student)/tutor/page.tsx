'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Brain,
  Send,
  Loader2,
  RotateCcw,
  Sparkles,
  Bot,
  Lightbulb,
  Compass,
  Award,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useVoiceOutput } from '@/hooks/useVoiceOutput';
import { VoiceMicButton } from '@/components/VoiceMicButton';
import { VoiceSpeakerButton } from '@/components/VoiceSpeakerButton';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: 'assistant',
  content:
    'Welcome to the Socratic Studio Companion. I am here to help you deconstruct the causal mechanisms of Agentic AI. Rather than giving rote answers, I can test your assumptions, suggest analogies, and help you prepare for the Reasoning Studio drills. What concept would you like to explore today?',
};

const CONCEPT_PILLARS = [
  { label: 'ReAct Cycle', prompt: 'Walk me through the difference between an open-loop LLM call and the Thought-Action-Observation ReAct cycle.' },
  { label: 'Vector Memory', prompt: 'How does an agent use embedding similarity to retrieve long-term memories when context windows overflow?' },
  { label: 'Cascading Errors', prompt: 'Why do autonomous agents suffer from cascading failure loops when a tool returns ambiguous output?' },
  { label: 'Agent vs Function', prompt: 'What specifically makes an architecture an autonomous agent rather than a deterministic pipeline of API calls?' },
];

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { speak, stop: stopSpeaking, isSpeaking } = useVoiceOutput();

  const {
    isListening,
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
  } = useVoiceInput({
    onTranscript: (spoken) => {
      setInput((prev) => (prev ? `${prev} ${spoken}` : spoken));
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!isSpeaking) {
      setActiveSpeakingId(null);
    }
  }, [isSpeaking]);

  const handleToggleSpeak = (msgId: string, content: string) => {
    if (activeSpeakingId === msgId && isSpeaking) {
      stopSpeaking();
      setActiveSpeakingId(null);
    } else {
      setActiveSpeakingId(msgId);
      speak(content);
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const sendMessage = async (overridePrompt?: string) => {
    const textToSend = (overridePrompt ?? input).trim();
    if (!textToSend || loading) return;

    if (isListening) stopListening();

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get tutor response');

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.message,
      };
      setMessages([...updatedMessages, assistantMsg]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetConversation = () => {
    stopSpeaking();
    if (isListening) stopListening();
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-electric-indigo/10 border border-electric-indigo/20 text-electric-indigo flex items-center justify-center shadow-2xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl text-deep-ink tracking-tight">
                Socratic Studio Companion
              </h1>
              <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20 text-[8px] py-0">
                Voice Active
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Cognitive Guidance · Powered by Groq LLaMA 3.3 70B
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetConversation}
            className="text-text-muted hover:text-deep-ink text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-soft-neutral transition-all flex items-center gap-1.5 border border-border-color"
            title="Reset discussion"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Context</span>
          </button>
        </div>
      </div>

      {/* Socratic Topics Ribbon */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
          Socratic Investigation Pillars
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {CONCEPT_PILLARS.map((col, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(col.prompt)}
              className="p-3 text-left rounded-xl bg-white border border-border-color hover:border-electric-indigo/40 hover:bg-soft-neutral/30 transition-all text-xs font-medium text-charcoal group"
            >
              <div className="font-bold text-deep-ink group-hover:text-electric-indigo flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-electric-indigo" />
                <span>{col.label}</span>
              </div>
              <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                {col.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread Canvas */}
      <div className="studio-card rounded-3xl p-6 md:p-8 bg-white min-h-[420px] max-h-[580px] overflow-y-auto space-y-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-electric-indigo/10 border border-electric-indigo/20 text-electric-indigo flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className="flex flex-col gap-1.5 max-w-[85%]">
              <div
                className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-deep-ink text-white rounded-br-xs'
                    : 'bg-soft-neutral/60 text-deep-ink rounded-bl-xs border border-border-color'
                }`}
              >
                {m.content}
              </div>

              {m.role === 'assistant' && (
                <div className="self-start pl-1">
                  <VoiceSpeakerButton
                    isSpeaking={activeSpeakingId === m.id && isSpeaking}
                    onToggle={() => handleToggleSpeak(m.id, m.content)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3.5 items-center">
            <div className="w-8 h-8 rounded-xl bg-electric-indigo/10 text-electric-indigo flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-soft-neutral/60 border border-border-color flex items-center gap-2 text-xs text-text-muted">
              <Loader2 className="w-4 h-4 animate-spin text-electric-indigo" />
              <span>Deconstructing mental model...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-coral/10 border border-coral/20 rounded-xl text-coral text-xs font-semibold">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Voice-First Input Box */}
      <div className="p-4 rounded-2xl bg-white border border-border-color shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <VoiceMicButton
            isListening={isListening}
            onToggle={handleToggleMic}
            isSupported={isVoiceSupported}
            disabled={loading}
            size="md"
          />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Speak clearly into your microphone...'
                : 'Ask a question or explain your reasoning (type or dictate)...'
            }
            disabled={loading}
            className="flex-1 bg-soft-neutral/50 border border-border-color rounded-xl px-4 py-3 text-xs md:text-sm text-deep-ink placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-electric-indigo/20 focus:border-electric-indigo transition-all"
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="p-3 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark text-white disabled:opacity-40 transition-all shadow-2xs"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-text-muted px-1">
          <span>Click microphone to speak · Press Enter to send</span>
          <Link
            href="/assessment/diagnostic"
            className="text-electric-indigo font-bold hover:underline"
          >
            Ready? Test yourself in the Reasoning Studio →
          </Link>
        </div>
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceMicButtonProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
  isSupported?: boolean;
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function VoiceMicButton({
  isListening,
  onToggle,
  disabled = false,
  isSupported = true,
  className = '',
  label,
  size = 'md',
}: VoiceMicButtonProps) {
  if (!isSupported) {
    return null;
  }

  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'px-3 py-2 text-xs',
    lg: 'px-4 py-3 text-sm',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={isListening ? 'Stop listening' : 'Start voice dictation'}
      className={`inline-flex items-center gap-2 rounded-xl font-bold transition-all ${sizeClasses[size]} ${
        isListening
          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
          : 'bg-soft-neutral hover:bg-neutral-200 text-deep-ink border border-border-color hover:border-electric-indigo/40'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isListening ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <Mic className={`${iconSizes[size]} animate-bounce`} />
          <span>{label || 'Listening...'}</span>
        </>
      ) : (
        <>
          <Mic className={iconSizes[size]} />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
}

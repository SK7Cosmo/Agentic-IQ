'use client';

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceSpeakerButtonProps {
  isSpeaking: boolean;
  onToggle: () => void;
  disabled?: boolean;
  isSupported?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function VoiceSpeakerButton({
  isSpeaking,
  onToggle,
  disabled = false,
  isSupported = true,
  className = '',
  size = 'sm',
}: VoiceSpeakerButtonProps) {
  if (!isSupported) {
    return null;
  }

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'px-2.5 py-1.5 text-xs',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={isSpeaking ? 'Stop audio' : 'Listen to explanation'}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all ${sizeClasses[size]} ${
        isSpeaking
          ? 'bg-electric-indigo text-white shadow-sm ring-2 ring-electric-indigo/30'
          : 'text-text-muted hover:text-deep-ink hover:bg-soft-neutral'
      } disabled:opacity-50 ${className}`}
    >
      {isSpeaking ? (
        <>
          <VolumeX className={iconSizes[size]} />
          <span className="text-[10px] font-bold">Mute</span>
        </>
      ) : (
        <>
          <Volume2 className={iconSizes[size]} />
          <span className="text-[10px]">Listen</span>
        </>
      )}
    </button>
  );
}

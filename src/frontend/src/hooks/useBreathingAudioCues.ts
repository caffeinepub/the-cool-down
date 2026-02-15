import { useCallback, useEffect, useRef, useState } from 'react';

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

// Distinct frequencies for each phase (in Hz)
const PHASE_FREQUENCIES: Record<BreathPhase, number> = {
  inhale: 523.25,   // C5 - higher pitch for inhale
  hold1: 392.00,    // G4 - mid pitch for hold
  exhale: 329.63,   // E4 - lower pitch for exhale
  hold2: 392.00,    // G4 - mid pitch for hold
};

const CUE_DURATION = 150; // milliseconds

export function useBreathingAudioCues() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isArmed, setIsArmed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const currentOscillatorRef = useRef<OscillatorNode | null>(null);
  const currentGainRef = useRef<GainNode | null>(null);

  // Initialize audio context on user gesture
  const arm = useCallback(() => {
    if (hasError) return; // Don't retry if we've already failed
    
    try {
      if (!audioContextRef.current) {
        // Create AudioContext only when user enables audio
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          setHasError(true);
          return;
        }
        audioContextRef.current = new AudioContextClass();
      }

      // Resume context if suspended (handles autoplay restrictions)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().then(() => {
          setIsArmed(true);
        }).catch(() => {
          setHasError(true);
        });
      } else {
        setIsArmed(true);
      }
    } catch (error) {
      setHasError(true);
    }
  }, [hasError]);

  // Play a cue for the given phase
  const playCue = useCallback((phase: BreathPhase) => {
    if (!isArmed || !audioContextRef.current || hasError) return;

    try {
      // Stop any currently playing cue
      if (currentOscillatorRef.current) {
        try {
          currentOscillatorRef.current.stop();
        } catch {
          // Ignore if already stopped
        }
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = PHASE_FREQUENCIES[phase];

      // Envelope: quick fade in, sustain, quick fade out
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02); // Fade in
      gainNode.gain.setValueAtTime(0.15, now + CUE_DURATION / 1000 - 0.02);
      gainNode.gain.linearRampToValueAtTime(0, now + CUE_DURATION / 1000); // Fade out

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(now);
      oscillator.stop(now + CUE_DURATION / 1000);

      currentOscillatorRef.current = oscillator;
      currentGainRef.current = gainNode;

      // Clean up references after the cue finishes
      oscillator.onended = () => {
        if (currentOscillatorRef.current === oscillator) {
          currentOscillatorRef.current = null;
          currentGainRef.current = null;
        }
      };
    } catch (error) {
      // Silently handle playback errors
      setHasError(true);
    }
  }, [isArmed, hasError]);

  // Stop any currently playing cue immediately
  const stop = useCallback(() => {
    if (currentOscillatorRef.current) {
      try {
        currentOscillatorRef.current.stop();
        currentOscillatorRef.current = null;
        currentGainRef.current = null;
      } catch {
        // Ignore if already stopped
      }
    }
    setIsArmed(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {
          // Ignore close errors
        });
        audioContextRef.current = null;
      }
    };
  }, [stop]);

  return {
    arm,
    playCue,
    stop,
    isArmed,
    hasError,
  };
}

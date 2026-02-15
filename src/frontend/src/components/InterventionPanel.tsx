import { useEffect, useState, useCallback } from 'react';
import { BoxBreathing } from './BoxBreathing';
import { useBreathingAudioCues } from '@/hooks/useBreathingAudioCues';

const INTERVENTION_COUNTDOWN = 10; // 10 seconds

interface InterventionPanelProps {
  audioEnabled: boolean;
}

export function InterventionPanel({ audioEnabled }: InterventionPanelProps) {
  const [countdown, setCountdown] = useState(INTERVENTION_COUNTDOWN);
  const { arm, playCue, stop, isArmed } = useBreathingAudioCues();

  useEffect(() => {
    setCountdown(INTERVENTION_COUNTDOWN);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return INTERVENTION_COUNTDOWN; // Reset and loop
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle audio enable/disable
  useEffect(() => {
    if (audioEnabled && !isArmed) {
      // Arm audio on user gesture (toggle click)
      arm();
    } else if (!audioEnabled && isArmed) {
      // Stop audio immediately when disabled
      stop();
    }
  }, [audioEnabled, isArmed, arm, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const handlePhaseChange = useCallback((phase: 'inhale' | 'hold1' | 'exhale' | 'hold2') => {
    // Only play cue if audio is enabled and armed
    if (audioEnabled && isArmed) {
      playCue(phase);
    }
  }, [audioEnabled, isArmed, playCue]);

  return (
    <div className="space-y-6">
      {/* Box Breathing Animation */}
      <BoxBreathing onPhaseChange={handlePhaseChange} />

      {/* Intervention Countdown */}
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium">
            Breathing cycle: {countdown}s
          </span>
        </div>
      </div>
    </div>
  );
}

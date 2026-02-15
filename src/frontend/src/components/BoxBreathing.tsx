import { useEffect, useState } from 'react';

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

const PHASE_DURATION = 4000; // 4 seconds per phase

const phaseLabels: Record<BreathPhase, string> = {
  inhale: 'Breathe In',
  hold1: 'Hold',
  exhale: 'Breathe Out',
  hold2: 'Hold'
};

const phaseOrder: BreathPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];

interface BoxBreathingProps {
  onPhaseChange?: (phase: BreathPhase) => void;
}

export function BoxBreathing({ onPhaseChange }: BoxBreathingProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const currentPhase = phaseOrder[phaseIndex];

  useEffect(() => {
    // Call onPhaseChange immediately for the initial phase
    if (onPhaseChange) {
      onPhaseChange(currentPhase);
    }

    const interval = setInterval(() => {
      setPhaseIndex(prev => {
        const nextIndex = (prev + 1) % phaseOrder.length;
        const nextPhase = phaseOrder[nextIndex];
        
        // Call onPhaseChange at the exact moment of phase transition
        if (onPhaseChange) {
          onPhaseChange(nextPhase);
        }
        
        return nextIndex;
      });
    }, PHASE_DURATION);

    return () => {
      clearInterval(interval);
    };
  }, [onPhaseChange, currentPhase]);

  const getScale = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'scale-150';
      case 'exhale':
        return 'scale-75';
      default:
        return phaseOrder[phaseIndex - 1] === 'inhale' ? 'scale-150' : 'scale-75';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8">
      {/* Breathing Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer glow ring */}
        <div
          className={`absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-[4000ms] ease-in-out animate-pulse-slow ${getScale()}`}
        />
        
        {/* Main breathing circle */}
        <div
          className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 border-2 border-primary/50 shadow-lg shadow-primary/20 transition-all duration-[4000ms] ease-in-out ${getScale()}`}
        >
          {/* Inner pulse */}
          <div className="absolute inset-2 rounded-full bg-primary/30 animate-pulse" />
        </div>
      </div>

      {/* Phase Label */}
      <div
        key={currentPhase}
        className="text-center space-y-2 animate-fade-in"
      >
        <div className="text-2xl font-semibold text-primary">
          {phaseLabels[currentPhase]}
        </div>
        <div className="text-sm text-muted-foreground">
          {PHASE_DURATION / 1000} seconds
        </div>
      </div>
    </div>
  );
}

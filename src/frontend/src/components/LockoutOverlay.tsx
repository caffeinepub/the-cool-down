import { useEffect, useState } from 'react';
import { ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { InterventionPanel } from './InterventionPanel';
import { Button } from '@/components/ui/button';

interface LockoutOverlayProps {
  remainingSeconds: number;
}

export function LockoutOverlay({ remainingSeconds }: LockoutOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleAudioToggle = () => {
    setAudioEnabled(prev => !prev);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: 'all' }}
    >
      <div
        className={`max-w-2xl w-full mx-4 space-y-8 transition-all duration-400 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-full bg-primary/10 animate-scale-in">
            <ShieldAlert className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-semibold">Lockout Mode Active</h2>
          <p className="text-muted-foreground">
            Your stress levels are elevated. Take a moment to breathe.
          </p>
        </div>

        {/* Audio Toggle Control */}
        <div className="flex justify-center">
          <Button
            variant={audioEnabled ? "default" : "outline"}
            size="sm"
            onClick={handleAudioToggle}
            className="gap-2"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-4 h-4" />
                Audio cues: On
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                Audio cues: Off
              </>
            )}
          </Button>
        </div>

        {/* Intervention Panel */}
        <InterventionPanel audioEnabled={audioEnabled} />

        {/* Lockout Timer */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <div className="text-5xl font-bold text-primary tabular-nums">
            {remainingSeconds}s
          </div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">
            Remaining
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { DashboardScreen } from './components/DashboardScreen';
import { LockoutOverlay } from './components/LockoutOverlay';
import { useSimulatedBpm } from './hooks/useSimulatedBpm';
import { useLockout } from './hooks/useLockout';

function App() {
  const { currentBpm, bpmHistory, simulateSpike } = useSimulatedBpm();
  const { isLocked, remainingSeconds, startLockout } = useLockout();

  // Trigger lockout when BPM exceeds 100
  useEffect(() => {
    if (currentBpm > 100 && !isLocked) {
      startLockout();
    }
  }, [currentBpm, isLocked, startLockout]);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <DashboardScreen
        currentBpm={currentBpm}
        bpmHistory={bpmHistory}
        onSimulateSpike={simulateSpike}
        isLocked={isLocked}
      />
      
      {isLocked && (
        <LockoutOverlay
          remainingSeconds={remainingSeconds}
        />
      )}
    </div>
  );
}

export default App;

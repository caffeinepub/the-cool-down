import { useState, useEffect, useCallback, useRef } from 'react';

interface BpmDataPoint {
  timestamp: number;
  value: number;
}

const HISTORY_DURATION = 30000; // 30 seconds of history
const UPDATE_INTERVAL = 500; // Update every 500ms
const BASE_BPM = 75;
const VARIATION = 5;
const SPIKE_DURATION = 3000; // 3 seconds spike
const SPIKE_TARGET = 120;

export function useSimulatedBpm() {
  const [currentBpm, setCurrentBpm] = useState(BASE_BPM);
  const [bpmHistory, setBpmHistory] = useState<BpmDataPoint[]>([]);
  const spikeEndTimeRef = useRef<number | null>(null);

  const generateBpm = useCallback(() => {
    const now = Date.now();
    
    // Check if we're in spike mode
    if (spikeEndTimeRef.current && now < spikeEndTimeRef.current) {
      const progress = 1 - (spikeEndTimeRef.current - now) / SPIKE_DURATION;
      const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      return BASE_BPM + (SPIKE_TARGET - BASE_BPM) * easedProgress;
    } else if (spikeEndTimeRef.current && now >= spikeEndTimeRef.current) {
      spikeEndTimeRef.current = null;
    }
    
    // Normal variation
    return BASE_BPM + (Math.random() - 0.5) * VARIATION * 2;
  }, []);

  const simulateSpike = useCallback(() => {
    spikeEndTimeRef.current = Date.now() + SPIKE_DURATION;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newBpm = generateBpm();
      
      setCurrentBpm(Math.round(newBpm));
      
      setBpmHistory(prev => {
        const newHistory = [
          ...prev,
          { timestamp: now, value: newBpm }
        ];
        
        // Keep only last 30 seconds
        return newHistory.filter(point => now - point.timestamp < HISTORY_DURATION);
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [generateBpm]);

  return {
    currentBpm,
    bpmHistory,
    simulateSpike
  };
}

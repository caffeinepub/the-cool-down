import { useState, useEffect, useCallback, useRef } from 'react';

const LOCKOUT_DURATION = 30; // 30 seconds

export function useLockout() {
  const [isLocked, setIsLocked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(LOCKOUT_DURATION);
  const lockoutEndTimeRef = useRef<number | null>(null);

  const startLockout = useCallback(() => {
    if (isLocked) return; // Prevent re-trigger
    
    setIsLocked(true);
    setRemainingSeconds(LOCKOUT_DURATION);
    lockoutEndTimeRef.current = Date.now() + LOCKOUT_DURATION * 1000;
  }, [isLocked]);

  useEffect(() => {
    if (!isLocked) return;

    const interval = setInterval(() => {
      if (!lockoutEndTimeRef.current) return;

      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((lockoutEndTimeRef.current - now) / 1000));
      
      setRemainingSeconds(remaining);

      if (remaining === 0) {
        setIsLocked(false);
        lockoutEndTimeRef.current = null;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLocked]);

  return {
    isLocked,
    remainingSeconds,
    startLockout
  };
}

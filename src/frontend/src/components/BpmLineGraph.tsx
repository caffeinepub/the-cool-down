import { useMemo } from 'react';

interface BpmDataPoint {
  timestamp: number;
  value: number;
}

interface BpmLineGraphProps {
  data: BpmDataPoint[];
}

export function BpmLineGraph({ data }: BpmLineGraphProps) {
  const { path, minBpm, maxBpm } = useMemo(() => {
    if (data.length < 2) {
      return { path: '', minBpm: 60, maxBpm: 100 };
    }

    const values = data.map(d => d.value);
    const min = Math.min(...values, 60);
    const max = Math.max(...values, 100);
    const range = max - min || 1;

    const width = 100;
    const height = 100;
    const padding = 5;

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - padding - ((point.value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return {
      path: `M ${points.join(' L ')}`,
      minBpm: Math.floor(min),
      maxBpm: Math.ceil(max)
    };
  }, [data]);

  if (data.length < 2) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
        Collecting data...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeWidth="0.2" opacity="0.2" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.2" opacity="0.2" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeWidth="0.2" opacity="0.2" />
        
        {/* Threshold line at 100 BPM */}
        {maxBpm > 100 && minBpm < 100 && (
          <line
            x1="0"
            y1={95 - ((100 - minBpm) / (maxBpm - minBpm)) * 90}
            x2="100"
            y2={95 - ((100 - minBpm) / (maxBpm - minBpm)) * 90}
            stroke="oklch(0.704 0.191 22.216)"
            strokeWidth="0.3"
            strokeDasharray="2,2"
            opacity="0.5"
          />
        )}
        
        {/* BPM line */}
        <path
          d={path}
          fill="none"
          stroke="oklch(0.65 0.15 160)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_oklch(0.65_0.15_160)]"
        />
      </svg>
      
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pointer-events-none">
        <span>{maxBpm}</span>
        <span>{minBpm}</span>
      </div>
    </div>
  );
}

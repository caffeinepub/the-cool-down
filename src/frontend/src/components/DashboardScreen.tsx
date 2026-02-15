import { Activity, Heart } from 'lucide-react';
import { BpmLineGraph } from './BpmLineGraph';
import { RageTextShield } from './RageTextShield';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface BpmDataPoint {
  timestamp: number;
  value: number;
}

interface DashboardScreenProps {
  currentBpm: number;
  bpmHistory: BpmDataPoint[];
  onSimulateSpike: () => void;
  isLocked: boolean;
}

export function DashboardScreen({ 
  currentBpm, 
  bpmHistory, 
  onSimulateSpike,
  isLocked 
}: DashboardScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">The Cool Down</h1>
              <p className="text-sm text-muted-foreground">Stress Response Monitor</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* BPM Monitor Card */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Heart Rate Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current BPM Display */}
            <div className="text-center space-y-2">
              <div className="text-6xl font-bold text-primary tabular-nums">
                {currentBpm}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                Beats Per Minute
              </div>
            </div>

            {/* BPM Graph */}
            <div className="h-48 rounded-lg bg-background/50 p-4">
              <BpmLineGraph data={bpmHistory} />
            </div>

            {/* Test Button */}
            <div className="flex justify-center">
              <Button
                onClick={onSimulateSpike}
                disabled={isLocked}
                variant="outline"
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                Simulate Anger Spike
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rage Text Shield */}
        <RageTextShield disabled={isLocked} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'the-cool-down'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

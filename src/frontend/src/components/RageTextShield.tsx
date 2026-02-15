import { useState } from 'react';
import { Cloud, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface RageTextShieldProps {
  disabled?: boolean;
}

export function RageTextShield({ disabled }: RageTextShieldProps) {
  const [text, setText] = useState('');
  const [isDissolving, setIsDissolving] = useState(false);

  const handleDissolve = () => {
    if (!text.trim()) return;
    
    setIsDissolving(true);
    
    // Clear text after animation completes
    setTimeout(() => {
      setText('');
      setIsDissolving(false);
    }, 1500);
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-primary" />
          Rage Text Shield
        </CardTitle>
        <CardDescription>
          Type your frustrations here. They won't be sent anywhere—just released into the void.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled || isDissolving}
            placeholder="Let it all out... type your anger, frustration, or stress here..."
            className="min-h-[200px] resize-none text-base"
          />
          
          {/* Dissolve Animation Overlay */}
          {isDissolving && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-md animate-fade-in">
              {/* Cloud particles */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-8 h-8 rounded-full bg-primary/30 blur-md animate-cloud-rise"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 300}ms`,
                    animationDuration: '1.5s'
                  }}
                />
              ))}
              
              {/* Text fade overlay */}
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm animate-fade-in-slow" />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleDissolve}
            disabled={disabled || !text.trim() || isDissolving}
            variant="outline"
            className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
          >
            <Trash2 className="w-4 h-4" />
            {isDissolving ? 'Dissolving...' : 'Dissolve'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Trophy, Star } from 'lucide-react';
import { GLUCOSE_RANGES, QUESTS } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface GlucoseLoggerProps {
  onLog: (value: number) => { newBadge: 'bronze' | 'silver' | 'gold' | null };
  glucoseCount: number;
}

export function GlucoseLogger({ onLog, glucoseCount }: GlucoseLoggerProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [showBadge, setShowBadge] = useState<'bronze' | 'silver' | 'gold' | null>(null);
  const [lastReading, setLastReading] = useState<{ value: number; range: keyof typeof GLUCOSE_RANGES } | null>(null);

  const getRange = (val: number): keyof typeof GLUCOSE_RANGES => {
    if (val < GLUCOSE_RANGES.low.max) return 'low';
    if (val <= GLUCOSE_RANGES.target.max) return 'target';
    return 'high';
  };

  const handleLog = () => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 500) return;

    const result = onLog(numValue);
    const range = getRange(numValue);
    setLastReading({ value: numValue, range });
    setValue('');
    setOpen(false);

    if (result.newBadge) {
      setShowBadge(result.newBadge);
      setTimeout(() => setShowBadge(null), 3000);
    }
  };

  const nextBadge = !glucoseCount ? QUESTS.bronze 
    : glucoseCount < QUESTS.silver.count ? QUESTS.silver 
    : glucoseCount < QUESTS.gold.count ? QUESTS.gold 
    : null;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="card-game cursor-pointer hover:shadow-glow transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/30">
                <Activity className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-foreground">Blood Glucose</h3>
                <p className="text-sm text-muted-foreground">
                  {nextBadge 
                    ? `${glucoseCount}/${nextBadge.count} to ${nextBadge.name}`
                    : 'All badges earned! 🏆'}
                </p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl font-bold text-foreground">{glucoseCount}</span>
                <p className="text-xs text-muted-foreground">logged</p>
              </div>
            </div>

            {lastReading && (
              <div className={`mt-3 rounded-xl p-3 ${
                lastReading.range === 'target' ? 'bg-happy/10' :
                lastReading.range === 'low' ? 'bg-destructive/10' : 'bg-hungry/10'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last reading:</span>
                  <span className={`font-display font-bold ${
                    lastReading.range === 'target' ? 'text-happy' :
                    lastReading.range === 'low' ? 'text-destructive' : 'text-hungry'
                  }`}>
                    {lastReading.value} mg/dL - {GLUCOSE_RANGES[lastReading.range].label}
                  </span>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Log Blood Glucose</DialogTitle>
            <DialogDescription>
              Enter your blood glucose reading to complete a quest!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="glucose" className="font-medium">Blood Glucose (mg/dL)</Label>
              <Input
                id="glucose"
                type="number"
                placeholder="e.g., 120"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-14 text-2xl text-center font-display rounded-xl"
                min="0"
                max="500"
              />
              <p className="text-xs text-center text-muted-foreground">
                Target range: 70-180 mg/dL
              </p>
            </div>
            <Button 
              onClick={handleLog}
              disabled={!value || parseInt(value) < 0 || parseInt(value) > 500}
              className="w-full h-12 font-display font-bold btn-primary rounded-xl"
            >
              Log Reading
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Badge unlock celebration */}
      <Dialog open={!!showBadge} onOpenChange={() => setShowBadge(null)}>
        <DialogContent className="sm:max-w-sm text-center border-0 bg-gradient-to-b from-card to-secondary/30">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative animate-bounce-in">
              <div className={`flex h-24 w-24 items-center justify-center rounded-full ${
                showBadge === 'gold' ? 'badge-gold' :
                showBadge === 'silver' ? 'bg-silver' : 'bg-bronze'
              }`}>
                <Trophy className="h-12 w-12 text-primary-foreground" />
              </div>
              <Star className="absolute -top-1 -right-1 h-8 w-8 fill-gold text-gold animate-sparkle" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-foreground">
                {showBadge === 'gold' ? '🥇' : showBadge === 'silver' ? '🥈' : '🥉'} Badge Unlocked!
              </h3>
              <p className="font-display text-lg font-semibold capitalize text-primary">
                {showBadge && QUESTS[showBadge].name}
              </p>
              <p className="text-muted-foreground">
                {showBadge && QUESTS[showBadge].description}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

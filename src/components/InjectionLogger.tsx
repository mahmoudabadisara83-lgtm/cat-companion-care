import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Syringe, Check, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface InjectionLoggerProps {
  onLog: (doseAmount?: number) => { leveledUp: boolean; newLevel: number };
}

export function InjectionLogger({ onLog }: InjectionLoggerProps) {
  const [showDoseInput, setShowDoseInput] = useState(false);
  const [doseAmount, setDoseAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ leveledUp: boolean; newLevel: number } | null>(null);

  const handleQuickLog = () => {
    const result = onLog();
    setLevelUpInfo(result);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setLevelUpInfo(null);
    }, 2500);
  };

  const handleDetailedLog = () => {
    const dose = doseAmount ? parseFloat(doseAmount) : undefined;
    const result = onLog(dose);
    setLevelUpInfo(result);
    setShowDoseInput(false);
    setDoseAmount('');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setLevelUpInfo(null);
    }, 2500);
  };

  return (
    <>
      <div className="card-game space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Syringe className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Log Injection</h3>
            <p className="text-sm text-muted-foreground">Feed your cat & keep your streak!</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleQuickLog}
            className="flex-1 h-14 text-lg font-display font-bold btn-primary rounded-xl"
          >
            <Check className="mr-2 h-5 w-5" />
            Done!
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDoseInput(true)}
            className="h-14 px-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5"
          >
            + Dose
          </Button>
        </div>
      </div>

      {/* Dose input dialog */}
      <Dialog open={showDoseInput} onOpenChange={setShowDoseInput}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Log with Dose</DialogTitle>
            <DialogDescription>
              Enter your dose amount to set a custom timer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dose" className="font-medium">Dose Amount (units)</Label>
              <Input
                id="dose"
                type="number"
                placeholder="e.g., 5"
                value={doseAmount}
                onChange={(e) => setDoseAmount(e.target.value)}
                className="h-12 text-lg rounded-xl"
              />
            </div>
            <Button 
              onClick={handleDetailedLog}
              className="w-full h-12 font-display font-bold btn-primary rounded-xl"
            >
              Log Injection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success celebration */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-sm text-center border-0 bg-gradient-to-b from-card to-secondary/30">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-happy/20 animate-bounce-in">
                <Check className="h-10 w-10 text-happy" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-gold animate-sparkle" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-foreground">
                {levelUpInfo?.leveledUp ? '🎉 Level Up!' : 'Great Job!'}
              </h3>
              <p className="text-muted-foreground">
                {levelUpInfo?.leveledUp 
                  ? `Your cat grew to Level ${levelUpInfo.newLevel}!`
                  : 'Your cat is happy and fed!'}
              </p>
            </div>

            {levelUpInfo?.leveledUp && (
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Sparkles 
                    key={i} 
                    className="h-6 w-6 text-gold animate-sparkle"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

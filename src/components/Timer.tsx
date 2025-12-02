import { useState, useEffect } from 'react';
import { Clock, Bell, CheckCircle } from 'lucide-react';
import { TimerData } from '@/types';

interface TimerProps {
  timerData: TimerData;
}

export function Timer({ timerData }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!timerData.nextDueTime) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const due = new Date(timerData.nextDueTime!).getTime();
      const diff = due - now;

      if (diff <= 0) {
        setIsOverdue(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setIsOverdue(false);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [timerData.nextDueTime]);

  if (!timerData.nextDueTime) {
    return (
      <div className="card-game">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Next Injection</h3>
            <p className="text-sm text-muted-foreground">Log an injection to start the timer</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-game transition-all ${isOverdue ? 'ring-2 ring-primary animate-pulse-glow' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
          isOverdue ? 'bg-primary/20' : 'bg-accent/30'
        }`}>
          {isOverdue ? (
            <Bell className="h-6 w-6 text-primary" />
          ) : (
            <Clock className="h-6 w-6 text-accent-foreground" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-foreground">
            {isOverdue ? 'Time for Injection!' : 'Next Injection'}
          </h3>
          {isOverdue ? (
            <p className="text-sm text-primary font-medium">Your cat is getting hungry!</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Due at {new Date(timerData.nextDueTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>

      {timeLeft && !isOverdue && (
        <div className="mt-4 flex justify-center gap-3">
          {[
            { value: timeLeft.hours, label: 'hrs' },
            { value: timeLeft.minutes, label: 'min' },
            { value: timeLeft.seconds, label: 'sec' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                <span className="font-display text-2xl font-bold text-foreground">
                  {item.value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="mt-1 text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {isOverdue && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary/10 p-3">
          <CheckCircle className="h-5 w-5 text-primary" />
          <span className="font-medium text-primary">Log your injection to feed your cat!</span>
        </div>
      )}
    </div>
  );
}

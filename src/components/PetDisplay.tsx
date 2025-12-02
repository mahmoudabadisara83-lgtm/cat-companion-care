import { useEffect, useState } from 'react';
import { CAT_LEVELS, CatMood } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Heart, Star, Sparkles } from 'lucide-react';

interface PetDisplayProps {
  level: number;
  totalInjections: number;
  isHungry: boolean;
  currentStreak: number;
  isLevelingUp?: boolean;
}

const CAT_EMOJIS = ['📦', '🐱', '😺', '😸', '🐈'];
const HUNGRY_EMOJI = '😿';

export function PetDisplay({ level, totalInjections, isHungry, currentStreak, isLevelingUp }: PetDisplayProps) {
  const [showHearts, setShowHearts] = useState(false);
  const currentLevel = CAT_LEVELS[level];
  const nextLevel = CAT_LEVELS[level + 1];
  
  const progress = nextLevel 
    ? ((totalInjections - currentLevel.injectionsNeeded) / (nextLevel.injectionsNeeded - currentLevel.injectionsNeeded)) * 100
    : 100;

  useEffect(() => {
    if (isLevelingUp) {
      setShowHearts(true);
      const timer = setTimeout(() => setShowHearts(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLevelingUp]);

  const catEmoji = isHungry ? HUNGRY_EMOJI : CAT_EMOJIS[level];
  const moodClass = isHungry ? 'animate-sad' : isLevelingUp ? 'animate-level-up' : 'animate-float';

  return (
    <div className="relative flex flex-col items-center gap-4 py-6">
      {/* Streak indicator */}
      {currentStreak > 0 && (
        <div className="absolute -top-2 right-4 flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
          <Star className="h-4 w-4 fill-gold text-gold" />
          <span className="font-display text-sm font-bold text-foreground">
            {currentStreak} day{currentStreak > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Hearts animation */}
      {showHearts && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className="absolute animate-heart fill-primary text-primary"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${30 + Math.random() * 30}%`,
                animationDelay: `${i * 0.1}s`,
                width: `${20 + Math.random() * 20}px`,
                height: `${20 + Math.random() * 20}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Pet container */}
      <div className="relative">
        {/* Glow effect */}
        <div 
          className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 ${
            isLevelingUp ? 'opacity-100 bg-gold/40' : isHungry ? 'opacity-50 bg-hungry/30' : 'opacity-30 bg-primary/30'
          }`}
          style={{ transform: 'scale(1.5)' }}
        />
        
        {/* Cat display */}
        <div 
          className={`relative flex items-center justify-center rounded-full bg-card p-8 shadow-soft ${moodClass}`}
          style={{ width: '180px', height: '180px' }}
        >
          <span className="text-8xl select-none" role="img" aria-label={currentLevel.name}>
            {catEmoji}
          </span>
          
          {/* Level badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 shadow-glow">
            <span className="font-display text-sm font-bold text-primary-foreground">
              Lv. {level}
            </span>
          </div>
        </div>

        {/* Sparkles for max level */}
        {level === 4 && (
          <>
            <Sparkles className="absolute -top-2 -left-2 h-6 w-6 text-gold animate-sparkle" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-gold animate-sparkle" style={{ animationDelay: '0.3s' }} />
          </>
        )}
      </div>

      {/* Pet name and status */}
      <div className="text-center mt-2">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {currentLevel.name}
        </h2>
        <p className={`text-sm font-medium ${isHungry ? 'text-hungry' : 'text-muted-foreground'}`}>
          {isHungry ? "I'm hungry! Time for an injection?" : currentLevel.description}
        </p>
      </div>

      {/* Progress to next level */}
      {nextLevel && (
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress to Level {level + 1}</span>
            <span>{totalInjections}/{nextLevel.injectionsNeeded} injections</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      )}

      {level === 4 && (
        <div className="flex items-center gap-2 rounded-full bg-gold/20 px-4 py-2">
          <Star className="h-5 w-5 fill-gold text-gold" />
          <span className="font-display font-bold text-foreground">Max Level Reached!</span>
          <Star className="h-5 w-5 fill-gold text-gold" />
        </div>
      )}
    </div>
  );
}

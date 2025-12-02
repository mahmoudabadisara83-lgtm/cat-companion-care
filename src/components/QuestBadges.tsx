import { Trophy, Lock, Check } from 'lucide-react';
import { QUESTS } from '@/types';

interface QuestBadgesProps {
  badges: {
    bronze: boolean;
    silver: boolean;
    gold: boolean;
  };
  glucoseCount: number;
}

export function QuestBadges({ badges, glucoseCount }: QuestBadgesProps) {
  const quests = [
    { key: 'bronze' as const, ...QUESTS.bronze, emoji: '🥉' },
    { key: 'silver' as const, ...QUESTS.silver, emoji: '🥈' },
    { key: 'gold' as const, ...QUESTS.gold, emoji: '🥇' },
  ];

  return (
    <div className="card-game">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
          <Trophy className="h-5 w-5 text-gold" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">Glucose Quests</h3>
      </div>

      <div className="grid gap-3">
        {quests.map((quest) => {
          const isUnlocked = badges[quest.key];
          const progress = Math.min(glucoseCount, quest.count);
          const progressPercent = (progress / quest.count) * 100;

          return (
            <div
              key={quest.key}
              className={`relative overflow-hidden rounded-xl p-4 transition-all ${
                isUnlocked 
                  ? quest.key === 'gold' ? 'bg-gold/20 ring-2 ring-gold/50' :
                    quest.key === 'silver' ? 'bg-silver/20 ring-2 ring-silver/50' :
                    'bg-bronze/20 ring-2 ring-bronze/50'
                  : 'bg-muted'
              }`}
            >
              {/* Progress bar background */}
              {!isUnlocked && (
                <div 
                  className="absolute inset-0 bg-accent/30 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              )}

              <div className="relative flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
                  isUnlocked 
                    ? quest.key === 'gold' ? 'badge-gold' :
                      quest.key === 'silver' ? 'bg-silver' : 'bg-bronze'
                    : 'bg-card'
                }`}>
                  {isUnlocked ? (
                    quest.emoji
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-foreground">{quest.name}</span>
                    {isUnlocked && <Check className="h-4 w-4 text-happy" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                </div>

                <div className="text-right">
                  <span className="font-display text-lg font-bold text-foreground">
                    {progress}/{quest.count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

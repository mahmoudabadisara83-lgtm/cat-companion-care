import { useState, useEffect } from 'react';
import { usePetData } from '@/hooks/usePetData';
import { PetDisplay } from '@/components/PetDisplay';
import { InjectionLogger } from '@/components/InjectionLogger';
import { GlucoseLogger } from '@/components/GlucoseLogger';
import { Timer } from '@/components/Timer';
import { QuestBadges } from '@/components/QuestBadges';
import { StreakCalendar } from '@/components/StreakCalendar';
import { RelaxationAudio } from '@/components/RelaxationAudio';
import { Navigation } from '@/components/Navigation';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  
  const {
    petData,
    timerData,
    logInjection,
    logGlucose,
    getStreakDates,
  } = usePetData();

  const handleInjectionLog = (doseAmount?: number) => {
    const result = logInjection(doseAmount);
    if (result.leveledUp) {
      setIsLevelingUp(true);
      setTimeout(() => setIsLevelingUp(false), 1500);
    }
    return result;
  };

  return (
    <>
      <Helmet>
        <title>DiaBuddy - Your Diabetes Companion Cat</title>
        <meta name="description" content="A fun gamified app for kids with type 1 diabetes. Care for your virtual cat by logging injections, tracking glucose, and maintaining healthy streaks!" />
        <meta name="keywords" content="diabetes, type 1 diabetes, kids health, gamification, injection tracker, glucose monitor, virtual pet" />
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐱</span>
              <h1 className="font-display text-xl font-bold text-foreground">DiaBuddy</h1>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-display font-bold text-primary">{petData.totalInjections}</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-lg mx-auto px-4 py-6">
          {activeTab === 'home' && (
            <div className="space-y-6 animate-fade-in">
              {/* Pet display */}
              <section className="card-game">
                <PetDisplay
                  level={petData.level}
                  totalInjections={petData.totalInjections}
                  isHungry={petData.isHungry}
                  currentStreak={petData.currentStreak}
                  isLevelingUp={isLevelingUp}
                />
              </section>

              {/* Quick actions */}
              <section>
                <InjectionLogger onLog={handleInjectionLog} />
              </section>

              {/* Timer */}
              <section>
                <Timer timerData={timerData} />
              </section>

              {/* Glucose logger */}
              <section>
                <GlucoseLogger 
                  onLog={logGlucose} 
                  glucoseCount={petData.glucoseLogs} 
                />
              </section>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6 animate-fade-in">
              <StreakCalendar
                streakDates={getStreakDates()}
                currentStreak={petData.currentStreak}
                longestStreak={petData.longestStreak}
              />
            </div>
          )}

          {activeTab === 'quests' && (
            <div className="space-y-6 animate-fade-in">
              <QuestBadges
                badges={petData.badges}
                glucoseCount={petData.glucoseLogs}
              />
              
              {/* Stats summary */}
              <div className="card-game">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">Your Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-muted p-4 text-center">
                    <span className="font-display text-3xl font-bold text-foreground">{petData.totalInjections}</span>
                    <p className="text-sm text-muted-foreground">Total Injections</p>
                  </div>
                  <div className="rounded-xl bg-muted p-4 text-center">
                    <span className="font-display text-3xl font-bold text-foreground">{petData.glucoseLogs}</span>
                    <p className="text-sm text-muted-foreground">Glucose Readings</p>
                  </div>
                  <div className="rounded-xl bg-muted p-4 text-center">
                    <span className="font-display text-3xl font-bold text-foreground">{petData.currentStreak}</span>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                  </div>
                  <div className="rounded-xl bg-muted p-4 text-center">
                    <span className="font-display text-3xl font-bold text-foreground">{petData.longestStreak}</span>
                    <p className="text-sm text-muted-foreground">Best Streak</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'relax' && (
            <div className="space-y-6 animate-fade-in">
              <RelaxationAudio />
              
              {/* Tips card */}
              <div className="card-game bg-gradient-to-br from-card to-secondary/20">
                <h3 className="font-display text-lg font-bold text-foreground mb-3">💡 Helpful Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Take slow, deep breaths before your injection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Choose a comfortable, quiet spot</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Reward yourself after - you earned it!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Remember: your cat believes in you! 🐱</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </main>

        {/* Bottom navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  );
};

export default Index;

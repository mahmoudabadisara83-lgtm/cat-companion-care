import { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StreakCalendarProps {
  streakDates: Set<string>;
  currentStreak: number;
  longestStreak: number;
}

export function StreakCalendar({ streakDates, currentStreak, longestStreak }: StreakCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const hasStreak = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return streakDates.has(checkDate.toDateString());
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const streakDay = hasStreak(day);
    const todayDay = isToday(day);
    
    days.push(
      <div
        key={day}
        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
          streakDay
            ? 'bg-primary text-primary-foreground shadow-glow'
            : todayDay
            ? 'ring-2 ring-primary text-foreground'
            : 'text-muted-foreground'
        }`}
      >
        {streakDay ? <Flame className="h-5 w-5" /> : day}
      </div>
    );
  }

  return (
    <div className="card-game">
      {/* Streak stats */}
      <div className="flex justify-around mb-6 pb-4 border-b border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="h-5 w-5 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">{currentStreak}</span>
          </div>
          <p className="text-xs text-muted-foreground">Current Streak</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="h-5 w-5 fill-gold text-gold" />
            <span className="font-display text-2xl font-bold text-foreground">{longestStreak}</span>
          </div>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth(-1)}
          className="h-8 w-8 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h4 className="font-display font-bold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth(1)}
          className="h-8 w-8 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 place-items-center">
        {days}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>Injection logged</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full ring-2 ring-primary" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

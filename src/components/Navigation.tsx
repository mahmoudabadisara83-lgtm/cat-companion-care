import { Home, Calendar, Trophy, Volume2 } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'quests', icon: Trophy, label: 'Quests' },
    { id: 'relax', icon: Volume2, label: 'Relax' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-pb">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-2 rounded-full transition-all ${
                isActive ? 'bg-primary/10' : ''
              }`}>
                <Icon className={`h-5 w-5 transition-transform ${
                  isActive ? 'scale-110' : ''
                }`} />
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'font-bold' : ''
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

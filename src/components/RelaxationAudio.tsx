import { useState, useRef } from 'react';
import { Play, Pause, Volume2, Sparkles, Heart, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioTrack {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  script: string;
}

const RELAXATION_TRACKS: AudioTrack[] = [
  {
    id: 'breathing',
    name: 'Calm Breathing',
    description: 'Deep breaths with your cat friend',
    icon: <Wind className="h-5 w-5" />,
    duration: '1 min',
    script: `Close your eyes and take a deep breath in... 
    Imagine your cat friend purring softly beside you.
    Breathe in slowly... 1, 2, 3, 4...
    Now breathe out gently... 1, 2, 3, 4...
    Feel yourself becoming calm and relaxed.
    Your cat is proud of you for taking care of yourself.
    One more deep breath in... and slowly out...
    You're doing amazing. Open your eyes when you're ready.`,
  },
  {
    id: 'courage',
    name: 'Brave & Strong',
    description: 'You can do this!',
    icon: <Sparkles className="h-5 w-5" />,
    duration: '1 min',
    script: `You are so brave and so strong.
    Taking your injection helps keep you healthy and happy.
    Your cat friend believes in you!
    Think of all the amazing things you do every day.
    This is just one small moment of bravery.
    Take a deep breath... you've got this!
    Remember: every hero faces small challenges.
    And you are a health hero!
    Your cat is cheering for you. Meow!`,
  },
  {
    id: 'purring',
    name: 'Cat Cuddles',
    description: 'Imagine cozy purring sounds',
    icon: <Heart className="h-5 w-5" />,
    duration: '1 min',
    script: `Imagine you're sitting somewhere cozy and warm.
    Your fluffy cat jumps up and curls into your lap.
    You can feel the gentle rumble of purring... purrrr...
    Pet your cat's soft fur... so soft and warm.
    The purring gets louder... purrrrrr...
    You feel safe and peaceful.
    Your cat loves you and you're taking great care of yourself.
    Stay here in this cozy moment as long as you like.`,
  },
];

export function RelaxationAudio() {
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handlePlay = (track: AudioTrack) => {
    // Stop any current playback
    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }

    if (selectedTrack?.id === track.id && isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setSelectedTrack(track);
    setIsPlaying(true);

    // Use Web Speech API for text-to-speech
    const utterance = new SpeechSynthesisUtterance(track.script);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = volume[0] / 100;
    
    // Try to find a gentle voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') || 
      v.name.includes('Female') ||
      v.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="card-game">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-mint">
          <Volume2 className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">Relaxation Corner</h3>
          <p className="text-sm text-muted-foreground">Listen before your injection</p>
        </div>
      </div>

      {/* Track list */}
      <div className="space-y-3">
        {RELAXATION_TRACKS.map((track) => {
          const isCurrentTrack = selectedTrack?.id === track.id;
          const isTrackPlaying = isCurrentTrack && isPlaying;

          return (
            <button
              key={track.id}
              onClick={() => handlePlay(track)}
              className={`w-full flex items-center gap-3 rounded-xl p-4 transition-all ${
                isTrackPlaying
                  ? 'bg-accent ring-2 ring-primary'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                isTrackPlaying ? 'bg-primary text-primary-foreground' : 'bg-card'
              }`}>
                {isTrackPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  {track.icon}
                  <span className="font-display font-bold text-foreground">{track.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{track.description}</p>
              </div>

              <span className="text-xs text-muted-foreground">{track.duration}</span>
            </button>
          );
        })}
      </div>

      {/* Volume control */}
      {selectedTrack && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">{volume}%</span>
          </div>
          
          {isPlaying && (
            <Button
              variant="outline"
              onClick={handleStop}
              className="w-full mt-3 rounded-xl"
            >
              Stop Playing
            </Button>
          )}
        </div>
      )}

      {/* Tip */}
      <div className="mt-4 rounded-xl bg-secondary/50 p-3 text-center">
        <p className="text-sm text-secondary-foreground">
          💡 <span className="font-medium">Tip:</span> Listen to a track before your injection to feel calm and ready!
        </p>
      </div>
    </div>
  );
}

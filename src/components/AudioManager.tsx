import React, { useEffect, useRef, useState } from 'react';
import { AUDIO_ASSETS } from '../constants';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioManagerProps {
  currentSceneId: string;
  isTyping: boolean;
  isTransitioning: boolean;
}

export const AudioManager: React.FC<AudioManagerProps> = ({ 
  currentSceneId, 
  isTyping, 
  isTransitioning 
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const clockRef = useRef<HTMLAudioElement | null>(null);
  const typingRef = useRef<HTMLAudioElement | null>(null);
  const footstepRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio objects
  useEffect(() => {
    rainRef.current = new Audio(AUDIO_ASSETS.rain);
    rainRef.current.loop = true;
    rainRef.current.volume = 0.3;

    clockRef.current = new Audio(AUDIO_ASSETS.clock);
    clockRef.current.loop = true;
    clockRef.current.volume = 0.15;

    typingRef.current = new Audio(AUDIO_ASSETS.typing);
    typingRef.current.loop = true;
    typingRef.current.volume = 0.2;

    footstepRef.current = new Audio(AUDIO_ASSETS.footsteps);
    footstepRef.current.volume = 0.4;

    return () => {
      rainRef.current?.pause();
      clockRef.current?.pause();
      typingRef.current?.pause();
      footstepRef.current?.pause();
    };
  }, []);

  // Handle Mute/Unmute
  useEffect(() => {
    if (isMuted) {
      rainRef.current?.pause();
      clockRef.current?.pause();
      typingRef.current?.pause();
    } else {
      rainRef.current?.play().catch(e => console.log("Autoplay blocked", e));
      
      // Clock only in office scenes (start, drawer_examine, etc.)
      const isOffice = ['start', 'drawer_examine', 'examine_letter'].includes(currentSceneId);
      if (isOffice) {
        clockRef.current?.play().catch(e => console.log("Autoplay blocked", e));
      } else {
        clockRef.current?.pause();
      }
    }
  }, [isMuted, currentSceneId]);

  // Handle Typing Sound
  useEffect(() => {
    if (!isMuted && isTyping) {
      typingRef.current?.play().catch(() => {});
    } else {
      typingRef.current?.pause();
    }
  }, [isTyping, isMuted]);

  // Handle Scene Transitions (Footsteps)
  useEffect(() => {
    if (!isMuted && isTransitioning) {
      if (footstepRef.current) {
        footstepRef.current.currentTime = 0;
        footstepRef.current.play().catch(() => {});
      }
    }
  }, [isTransitioning, isMuted]);

  return (
    <button 
      onClick={() => setIsMuted(!isMuted)}
      className="fixed bottom-6 right-6 z-50 p-3 bg-noir-900/80 border border-white/10 rounded-full text-noir-400 hover:text-white hover:bg-noir-800 transition-all shadow-xl group"
      title={isMuted ? "开启声音" : "关闭声音"}
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-detective-gold" />}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-noir-950 px-2 py-1 text-[10px] mono-label whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {isMuted ? "UNMUTE ARCHIVES" : "MUTE AMBIANCE"}
      </span>
    </button>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scene, Choice, Hotspot } from '../types';
import { ChevronRight, Search, Eye } from 'lucide-react';

interface NarrativeEngineProps {
  scene: Scene;
  onChoice: (choice: Choice) => void;
  onHotspotClick: (hotspot: Hotspot) => void;
  onTypingChange?: (isTyping: boolean) => void;
}

export const NarrativeEngine: React.FC<NarrativeEngineProps> = ({ 
  scene, 
  onChoice, 
  onHotspotClick,
  onTypingChange 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayText('');
    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < scene.text.length) {
        setDisplayText((prev) => prev + scene.text[index]);
        index++;
      } else {
        setIsTyping(false);
        onTypingChange?.(false);
        clearInterval(interval);
      }
    }, 25);

    onTypingChange?.(true);
    return () => clearInterval(interval);
  }, [scene]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-8 space-y-6"
      >
        {/* Immersive Scene Area */}
        <div className="relative group flex-1 min-h-[400px] flex flex-col">
          <div
            className="relative flex-1 rounded-sm overflow-hidden border border-white/5 bg-noir-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] cursor-crosshair h-full"
            ref={imageRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseLeave={() => setIsHoveringImage(false)}
          >
            {scene.imageUrl ? (
              <>
                <img
                  src={scene.imageUrl}
                  alt={scene.title}
                  className="w-full h-full object-cover grayscale brightness-50 transition-all duration-700 group-hover:brightness-75"
                  referrerPolicy="no-referrer"
                  style={{
                    maskImage: isHoveringImage 
                      ? `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, black 0%, transparent 100%)`
                      : 'none',
                    WebkitMaskImage: isHoveringImage 
                      ? `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, black 0%, transparent 100%)`
                      : 'none',
                  }}
                />
                
                {/* Hotspots */}
                {isHoveringImage && scene.hotspots?.map((spot) => (
                  <motion.button
                    key={spot.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: Math.max(0, 1 - (Math.sqrt(Math.pow(mousePos.x - spot.x, 2) + Math.pow(mousePos.y - spot.y, 2)) / 15))
                    }}
                    onClick={() => onHotspotClick(spot)}
                    className="absolute z-20 flex items-center justify-center"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `${spot.radius}px`, height: `${spot.radius}px`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="w-2 h-2 bg-detective-red rounded-full animate-ping" />
                    <div className="absolute inset-0 border border-detective-red/50 rounded-full bg-detective-red/10" />
                    <span className="absolute top-full mt-2 bg-noir-950 text-[10px] px-2 py-0.5 rounded border border-white/10 whitespace-nowrap shadow-xl">
                      {spot.label}
                    </span>
                  </motion.button>
                ))}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-noir-800">
                <Search className="w-12 h-12 text-noir-700 animate-pulse" />
              </div>
            )}

            {/* Narrative Overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-noir-950 via-noir-950/90 to-transparent">
              <div className="status-chip mb-4">场景：{scene.title}</div>
              <div className="min-h-[80px]">
                <p className="narrative-text">
                  {displayText}
                  {isTyping && <span className="inline-block w-2 h-6 bg-detective-red ml-1 animate-pulse" />}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Choices Area - Now more integrated */}
        <div className="min-h-[140px]">
          {!isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8"
            >
              {scene.choices.map((choice, idx) => (
                <button
                  key={choice.id}
                  onClick={() => onChoice(choice)}
                  className="px-6 py-3 bg-transparent border border-noir-700 text-noir-200 rounded-lg hover:border-detective-red hover:text-detective-red transform hover:-translate-y-1 transition-all duration-300 font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-3 group"
                  id={`choice-${choice.id}`}
                >
                  <span className="w-1.5 h-1.5 bg-noir-700 group-hover:bg-detective-red rounded-full transition-colors" />
                  {choice.text}
                </button>
              ))}
              
              {scene.hotspots && scene.hotspots.length > 0 && (
                <div className="md:col-span-2 text-center py-2 flex items-center justify-center gap-2 opacity-50">
                  <Eye className="w-3 h-3" />
                  <span className="mono-label text-[8px]">移动光标在搜寻点位获取更多线索</span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

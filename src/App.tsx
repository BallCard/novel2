/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, ScrollText, Map, Settings, Play, Archive } from 'lucide-react';
import { Scene, Choice, GameState, Evidence, Suspect, Hotspot, CaseRecord } from './types';
import { INITIAL_SCENES, INITIAL_EVIDENCE, INITIAL_SUSPECTS } from './constants';
import { NarrativeEngine } from './components/NarrativeEngine';
import { EvidenceBoard } from './components/EvidenceBoard';
import { SuspectDossier } from './components/SuspectDossier';
import { RainOverlay } from './components/AtmosphericEffects';
import { AudioManager } from './components/AudioManager';
import { CaseArchive } from './components/CaseArchive';

const TAB_OPTIONS = [
  { id: 'scene', label: 'Investigation', icon: Search },
  { id: 'evidence', label: 'Evidence', icon: ScrollText },
  { id: 'suspects', label: 'Suspects', icon: Users },
  { id: 'archives', label: 'Archives', icon: Archive },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentSceneId: 'start',
    discoveredEvidenceIds: [],
    interactedSuspectIds: [],
    journalEntries: [],
    suspectNotes: {},
    archivedCases: [],
  });

  const [activeTab, setActiveTab] = useState('scene');
  const [hasStarted, setHasStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentScene = useMemo(() => INITIAL_SCENES[gameState.currentSceneId], [gameState.currentSceneId]);
  
  const discoveredEvidence = useMemo(() => 
    INITIAL_EVIDENCE.filter(e => gameState.discoveredEvidenceIds.includes(e.id)),
    [gameState.discoveredEvidenceIds]
  );

  const [notification, setNotification] = useState<string | null>(null);

  const handleChoice = (choice: Choice) => {
    // Simulation: Some choices discover evidence
    if (choice.id === 'c2' && !gameState.discoveredEvidenceIds.includes('letter_1')) {
      discoverEvidence('letter_1');
    }
    
    setGameState(prev => ({
      ...prev,
      currentSceneId: choice.targetSceneId,
      interactedSuspectIds: [...new Set([...prev.interactedSuspectIds, 'unknown_informant'])]
    }));
    setActiveTab('scene');
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const discoverEvidence = (id: string) => {
    if (gameState.discoveredEvidenceIds.includes(id)) return;
    
    const item = INITIAL_EVIDENCE.find(e => e.id === id);
    setGameState(prev => ({
      ...prev,
      discoveredEvidenceIds: [...prev.discoveredEvidenceIds, id]
    }));
    setNotification(`发现新证据: ${item?.name}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.discoveryEvidenceId) {
      discoverEvidence(hotspot.discoveryEvidenceId);
    }
    if (hotspot.targetSceneId) {
      setGameState(prev => ({ ...prev, currentSceneId: hotspot.targetSceneId! }));
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const updateSuspectNote = (suspectId: string, note: string) => {
    setGameState(prev => ({
      ...prev,
      suspectNotes: {
        ...prev.suspectNotes,
        [suspectId]: note
      }
    }));
    setNotification('笔记已保存 (Notes Saved)');
    setTimeout(() => setNotification(null), 2000);
  };

  const handleArchiveCase = () => {
    const newRecord: CaseRecord = {
      id: `CASE-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      title: currentScene.title,
      completionDate: new Date().toLocaleDateString(),
      summary: currentScene.text.substring(0, 80) + '...',
      evidenceCount: gameState.discoveredEvidenceIds.length
    };

    setGameState(prev => ({
      ...prev,
      archivedCases: [newRecord, ...prev.archivedCases],
      currentSceneId: 'start', // Reset to beginning for "new" case feeling
      discoveredEvidenceIds: [],
      interactedSuspectIds: [],
    }));
    
    setActiveTab('archives');
    setNotification('案卷已归档 (Case Archived)');
    setTimeout(() => setNotification(null), 3000);
  };

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-noir-950 overflow-hidden">
        <div className="grain-overlay" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 z-10 p-6"
        >
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold tracking-tighter text-white italic drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              MIDNIGHT ECHOES
            </motion.h1>
            <p className="mono-label text-base tracking-[0.5em] text-detective-red opacity-80">
              A NOIR MYSTERY EXPERIENCE
            </p>
          </div>
          
          <button 
            onClick={() => setHasStarted(true)}
            className="group relative px-12 py-4 bg-transparent border border-white/20 hover:border-white text-white overflow-hidden transition-all duration-500"
            id="start-button"
          >
            <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative flex items-center gap-3 font-mono text-sm tracking-widest">
              INITIALIZE INVESTIGATION <Play className="w-4 h-4 fill-current" />
            </span>
          </button>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-12 left-12 opacity-10 space-y-4">
          <div className="w-32 h-1 bg-white" />
          <p className="mono-label text-xs">CASENO: #RE-1944-X</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-noir-950 overflow-hidden font-sans relative">
      <div className="grain-overlay" />
      <RainOverlay />
      
      {/* Sidebar navigation */}
      <aside className="w-16 md:w-20 bg-noir-950 border-r border-noir-600 flex flex-col items-center py-8 space-y-8 z-30">
        <div className="w-10 h-10 bg-detective-red rounded rotate-45 flex items-center justify-center transform hover:rotate-90 transition-transform duration-500 shadow-[0_0_15px_rgba(197,48,48,0.3)]">
          <span className="text-white -rotate-45 font-bold text-lg">M</span>
        </div>
        
        <nav className="flex-1 flex flex-col items-center space-y-4">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-lg transition-all duration-300 relative group
                ${activeTab === tab.id ? 'text-detective-red bg-white/5' : 'text-noir-600 hover:text-noir-200'}`}
              title={tab.label}
              id={`nav-tab-${tab.id}`}
            >
              <tab.icon className="w-6 h-6" />
              {activeTab === tab.id && (
                <motion.div layoutId="active-pill" className="absolute right-0 top-1/4 w-1 h-1/2 bg-detective-red rounded-full" />
              )}
            </button>
          ))}
        </nav>
        
        <button className="p-3 text-noir-600 hover:text-noir-200 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 border-b border-noir-600 flex items-center justify-between px-8 bg-noir-950/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <div className="status-chip">档案 #RE-1944-X</div>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-noir-700 rounded-full" />)}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleArchiveCase}
              className="text-[9px] font-mono border border-detective-red/30 text-detective-red px-3 py-1 rounded hover:bg-detective-red hover:text-white transition-all uppercase tracking-[0.1em]"
            >
              Close Archive
            </button>
            <div className="flex flex-col items-end">
              <span className="mono-label text-[8px]">LOGGED AS: DETECTIVE</span>
              <span className="text-[10px] font-mono text-noir-400">SESSION: #00234</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/10 bg-noir-800" />
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_center,_#1A1A1D_0%,_#0A0A0B_100%)]">
          <AnimatePresence mode="wait">
            {activeTab === 'scene' && (
              <motion.div
                key="scene"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <NarrativeEngine 
                  scene={currentScene} 
                  onChoice={handleChoice} 
                  onHotspotClick={handleHotspotClick}
                  onTypingChange={setIsTyping}
                />
              </motion.div>
            )}

            {activeTab === 'evidence' && (
              <motion.div
                key="evidence"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl mx-auto py-12 px-6"
              >
                <div className="mb-12">
                  <h2 className="text-4xl font-bold tracking-tighter mb-2 italic">Evidence Locker</h2>
                  <p className="mono-label opacity-40">ITEMIZED COLLECTION OF DISCOVERED CLUES</p>
                </div>
                <EvidenceBoard evidence={discoveredEvidence} />
              </motion.div>
            )}

            {activeTab === 'suspects' && (
              <motion.div
                key="suspects"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-6xl mx-auto py-12 px-6"
              >
                <div className="mb-12 px-6">
                  <h2 className="text-4xl font-bold tracking-tighter mb-2 italic">Subject Dossiers</h2>
                  <p className="mono-label opacity-40">CLASSIFIED PROFILES OF INTERESTED PARTIES</p>
                </div>
                <SuspectDossier 
                  suspects={INITIAL_SUSPECTS} 
                  notes={gameState.suspectNotes}
                  onUpdateNote={updateSuspectNote}
                />
              </motion.div>
            )}

            {activeTab === 'archives' && (
              <motion.div
                key="archives"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl mx-auto py-12 px-6"
              >
                <div className="mb-12">
                  <h2 className="text-4xl font-bold tracking-tighter mb-2 italic">Historical Archives</h2>
                  <p className="mono-label opacity-40">CHRONICLES OF RESOLVED INVESTIGATIONS</p>
                </div>
                <CaseArchive cases={gameState.archivedCases} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Atmospheric UI Footer */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-detective-red text-white px-6 py-3 rounded-full shadow-2xl font-mono text-sm tracking-widest flex items-center gap-3 border border-white/20"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
      
      <footer className="fixed bottom-0 right-0 p-4 z-40 pointer-events-none">
        <div className="flex items-center gap-4 text-noir-400 font-mono text-[9px] uppercase tracking-widest opacity-50">
          <span>LAT: 40.7128 N</span>
          <div className="w-px h-2 bg-noir-700" />
          <span>LONG: 74.0060 W</span>
        </div>
      </footer>

      <AudioManager 
        currentSceneId={gameState.currentSceneId} 
        isTyping={isTyping} 
        isTransitioning={isTransitioning} 
      />
    </div>
  );
}

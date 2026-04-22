import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Evidence } from '../types';
import { X, Calendar, Fingerprint, Search } from 'lucide-react';

interface EvidenceDetailModalProps {
  evidence: Evidence | null;
  onClose: () => void;
}

export const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({ evidence, onClose }) => {
  if (!evidence) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-noir-950/90 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-noir-900 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] rounded-sm overflow-hidden flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Evidence Image Section */}
          <div className="w-full md:w-1/2 aspect-square bg-noir-800 relative group overflow-hidden">
            {evidence.imageUrl ? (
              <img
                src={evidence.imageUrl}
                alt={evidence.name}
                className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
                <Search className="w-24 h-24 mb-4" />
                <span className="mono-label">No Visual Record</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-transparent to-transparent opacity-60" />
            
            {/* Stamp Effect */}
            <div className="absolute top-6 left-6 -rotate-12 border-2 border-detective-red/40 px-3 py-1 rounded text-detective-red/60 font-mono text-xs font-bold uppercase tracking-[0.2em]">
              Classified Evidence
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-between relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-noir-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-8">
              <div>
                <span className="mono-label text-detective-gold block mb-2">Subject Item / REF: {evidence.id.toUpperCase()}</span>
                <h2 className="text-4xl font-bold italic tracking-tighter text-white">
                  {evidence.name}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6 pb-8 border-b border-white/5">
                <div className="space-y-1">
                  <span className="mono-label text-[8px] opacity-40 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Found On
                  </span>
                  <p className="text-sm font-mono text-noir-300">{evidence.dateFound}</p>
                </div>
                <div className="space-y-1">
                  <span className="mono-label text-[8px] opacity-40 flex items-center gap-1">
                    <Fingerprint className="w-3 h-3" /> Class
                  </span>
                  <p className="text-sm font-mono text-noir-300 uppercase">{evidence.type}</p>
                </div>
              </div>

              <div>
                <span className="mono-label text-[8px] opacity-40 block mb-3">Investigation Analysis</span>
                <p className="narrative-text text-base md:text-lg leading-relaxed text-noir-200">
                  {evidence.description}
                </p>
              </div>
            </div>

            <div className="pt-8 mt-auto flex items-center justify-between text-noir-600">
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-noir-700 rounded-full" />)}
              </div>
              <span className="mono-label text-[9px] tracking-widest italic">Midnight Echoes Case Management</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

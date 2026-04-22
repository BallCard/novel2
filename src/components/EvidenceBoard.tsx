import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Evidence } from '../types';
import { Box, FileText, Camera, MessageSquare, Maximize2 } from 'lucide-react';
import { EvidenceDetailModal } from './EvidenceDetailModal';

interface EvidenceBoardProps {
  evidence: Evidence[];
}

const getIcon = (type: string, className: string = "w-5 h-5") => {
  switch (type) {
    case 'document': return <FileText className={className} />;
    case 'photo': return <Camera className={className} />;
    case 'testimony': return <MessageSquare className={className} />;
    default: return <Box className={className} />;
  }
};

export const EvidenceBoard: React.FC<EvidenceBoardProps> = ({ evidence }) => {
  const [selectedItem, setSelectedItem] = useState<Evidence | null>(null);

  return (
    <div className="p-4 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {evidence.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center justify-center opacity-30 text-center border-2 border-dashed border-white/5 rounded-xl">
            <Box className="w-16 h-16 mb-6" />
            <p className="mono-label text-sm tracking-[0.3em]">No Evidence Recovered</p>
          </div>
        ) : (
          evidence.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedItem(item)}
              className="bg-noir-900 border border-noir-700 rounded-lg p-3 hover:border-detective-red transition-all duration-300 group cursor-pointer"
              id={`evidence-${item.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="mono-label text-[8px] opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                  Found {item.dateFound}
                </span>
                <div className="p-1.5 bg-noir-800 rounded border border-noir-700 group-hover:border-detective-red group-hover:text-detective-red transition-all shadow-inner">
                  {getIcon(item.type, "w-4 h-4")}
                </div>
              </div>
              
              <h4 className="font-semibold text-sm tracking-tight mb-1 group-hover:text-white transition-colors flex items-center gap-2">
                <span className="text-detective-red opacity-60 group-hover:opacity-100 transition-all">
                  {getIcon(item.type, "w-3 h-3")}
                </span>
                {item.name}
              </h4>
              <p className="text-[11px] text-noir-400 leading-relaxed line-clamp-2 font-serif opacity-70 group-hover:opacity-100 transition-opacity">
                {item.description}
              </p>

              {/* Visual Decorative elements */}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-detective-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2 right-2 w-1 h-1 bg-detective-red rounded-full opacity-20 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Modal Layer */}
      <EvidenceDetailModal 
        evidence={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
};

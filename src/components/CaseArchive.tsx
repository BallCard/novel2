import React from 'react';
import { motion } from 'motion/react';
import { CaseRecord } from '../types';
import { Archive, Calendar, FileCheck, ArrowRight } from 'lucide-react';

interface CaseArchiveProps {
  cases: CaseRecord[];
}

export const CaseArchive: React.FC<CaseArchiveProps> = ({ cases }) => {
  return (
    <div className="space-y-6">
      {cases.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center opacity-20 text-center border border-dashed border-noir-700 rounded-xl">
          <Archive className="w-12 h-12 mb-4" />
          <p className="mono-label text-xs">No entries in secondary archives</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {cases.map((record, idx) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-noir-900 border border-noir-600 p-6 rounded-lg group hover:border-detective-red transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="p-1 px-2 bg-detective-red/10 text-detective-red text-[8px] font-mono rounded border border-detective-red/20 uppercase tracking-widest">
                      Closed Case
                    </span>
                    <span className="text-noir-600 text-[10px] font-mono">ID: {record.id}</span>
                  </div>
                  <h3 className="text-xl font-serif italic text-white group-hover:text-detective-red transition-colors">
                    {record.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-noir-400 text-[10px] font-mono">
                      <Calendar className="w-3 h-3" /> {record.completionDate}
                    </div>
                    <div className="flex items-center gap-1.5 text-noir-400 text-[10px] font-mono">
                      <FileCheck className="w-3 h-3" /> {record.evidenceCount} Clues Recovered
                    </div>
                  </div>
                  <button className="p-2 border border-noir-700 rounded-full group-hover:border-detective-red group-hover:text-detective-red transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-noir-700">
                <p className="text-xs text-noir-400 leading-relaxed italic font-serif">
                  "{record.summary}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

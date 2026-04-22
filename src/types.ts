export interface Evidence {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  dateFound: string;
  type: 'document' | 'object' | 'photo' | 'testimony';
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  status: 'innocent' | 'suspicious' | 'guilty' | 'unknown';
  relatedCases?: { id: string; description: string }[];
}

export interface Choice {
  id: string;
  text: string;
  targetSceneId: string;
  requirement?: {
    evidenceId?: string;
    actionPerformed?: string;
  };
}

export interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  radius: number;
  label: string;
  discoveryEvidenceId?: string;
  targetSceneId?: string;
}

export interface Scene {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
  choices: Choice[];
  hotspots?: Hotspot[];
  autoProgress?: boolean;
  ambientEffect?: 'rain' | 'fog' | 'smoke';
}

export interface CaseRecord {
  id: string;
  title: string;
  completionDate: string;
  summary: string;
  evidenceCount: number;
}

export interface GameState {
  currentSceneId: string;
  discoveredEvidenceIds: string[];
  interactedSuspectIds: string[];
  journalEntries: string[];
  suspectNotes: Record<string, string>;
  archivedCases: CaseRecord[];
}

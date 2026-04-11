import { StateCreator, create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- Sync Slice --- //
export interface SyncSlice {
  lastSyncedAt: Date | null;
  isSyncing: boolean;
  syncError: string | null;
  hasUnsyncedChanges: boolean;
  setSyncStatus: (status: Partial<Pick<SyncSlice, 'lastSyncedAt' | 'isSyncing' | 'syncError' | 'hasUnsyncedChanges'>>) => void;
}

const createSyncSlice: StateCreator<SyncSlice & CalendarSlice, [], [], SyncSlice> = (set) => ({
  lastSyncedAt: null,
  isSyncing: false,
  syncError: null,
  hasUnsyncedChanges: false,
  setSyncStatus: (status) => set((state) => ({ ...state, ...status })),
});


// --- Calendar Slice --- //
export interface CalendarSlice {
  selectedRange: { startDate: string | null; endDate: string | null };
  notes: Record<string, string>;
  lastUpdated: Date | null;
  setSelectedRange: (startDate: string | null, endDate: string | null) => void;
  setNote: (dateKey: string, note: string) => void;
  deleteNote: (dateKey: string) => void;
}

const createCalendarSlice: StateCreator<SyncSlice & CalendarSlice, [], [], CalendarSlice> = (set) => ({
  selectedRange: { startDate: null, endDate: null },
  notes: {},
  lastUpdated: null,
  
  setSelectedRange: (startDate, endDate) => set((state) => ({ 
    ...state, 
    selectedRange: { startDate, endDate },
    lastUpdated: new Date()
  })),

  setNote: (dateKey, note) => set((state) => {
    const newNotes = { ...state.notes, [dateKey]: note };
    return { 
      ...state, 
      notes: newNotes,
      hasUnsyncedChanges: true,
      lastUpdated: new Date()
    };
  }),

  deleteNote: (dateKey) => set((state) => {
    const newNotes = { ...state.notes };
    delete newNotes[dateKey];
    return {
      ...state,
      notes: newNotes,
      hasUnsyncedChanges: true,
      lastUpdated: new Date()
    };
  })
});


// --- Main Store Assembly --- //
export type StoreState = SyncSlice & CalendarSlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createSyncSlice(...a),
      ...createCalendarSlice(...a),
    }),
    {
      name: 'calendar-sync-store',
      storage: createJSONStorage(() => localStorage), 
      version: 1, // Added versioning for future migrations
      partialize: (state) => ({ 
        lastSyncedAt: state.lastSyncedAt,
        hasUnsyncedChanges: state.hasUnsyncedChanges,
        selectedRange: state.selectedRange,
        notes: state.notes,
        lastUpdated: state.lastUpdated
      }),
    }
  )
);

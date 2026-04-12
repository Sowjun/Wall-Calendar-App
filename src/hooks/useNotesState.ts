"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getNoteKey, findBestNoteKey } from "@/lib/notesStorage";
import { quickEventTags } from "@/features/calendar/constants";
import { calculateRangeMetrics } from "@/features/calendar/utils/rangeMetrics";
import { useStore } from "@/store/useStore";

type UseNotesStateArgs = {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  onAfterSave: () => void;
};

export function useNotesState({
  currentMonth,
  startDate,
  endDate,
  onAfterSave,
}: UseNotesStateArgs) {
  const { notes, setNote } = useStore();
  const [generalNote, setGeneralNote] = useState("");
  const [rangeNote, setRangeNote] = useState("");
  const [activeQuickTag, setActiveQuickTag] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeNoteKey, setActiveNoteKey] = useState<string | null>(null);
  const [isInherited, setIsInherited] = useState(false);

  const isRangeMode = Boolean(startDate && endDate);

  const activeNoteText = isRangeMode ? rangeNote : generalNote;
  const noteCharacterCount = activeNoteText.length;

  const {
    daysSelectedCount,
    businessDaysCount,
    weekendsCount,
    holidaysCount,
  } = useMemo(() => calculateRangeMetrics(startDate, endDate), [startDate, endDate]);

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const generalNoteKey = getNoteKey(year, month, null, null);
    const savedGeneralNote = notes[generalNoteKey] || "";
    setGeneralNote(savedGeneralNote);
  }, [currentMonth, notes]);

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const { key, isInherited: inherited } = findBestNoteKey(year, month, startDate, endDate);
    
    const savedNote = notes[key] || "";
    setRangeNote(savedNote);
    setActiveNoteKey(key);
    setIsInherited(inherited);
  }, [currentMonth, startDate, endDate, notes]);

  useEffect(() => {
    if (!isSaved) return;
    const timer = window.setTimeout(() => setIsSaved(false), 2000);
    return () => window.clearTimeout(timer);
  }, [isSaved]);

  const handleNoteSave = useCallback(() => {
    if (!activeNoteKey) return;
    
    setNote(activeNoteKey, isRangeMode ? rangeNote : generalNote);
    setIsSaved(true);
    onAfterSave();
  }, [activeNoteKey, isRangeMode, rangeNote, generalNote, onAfterSave, setNote]);

  const handleQuickTagClick = useCallback(
    (tag: string) => {
      setActiveQuickTag(tag);

      if (isRangeMode) {
        const nextValue = rangeNote.trim().length > 0 ? `${rangeNote} ${tag}` : `${tag} `;
        setRangeNote(nextValue);
        return;
      }

      const nextValue = generalNote.trim().length > 0 ? `${generalNote} ${tag}` : `${tag} `;
      setGeneralNote(nextValue);
    },
    [isRangeMode, rangeNote, generalNote]
  );

  return {
    generalNote,
    setGeneralNote,
    rangeNote,
    setRangeNote,
    activeQuickTag,
    isSaved,
    handleNoteSave,
    handleQuickTagClick,
    isRangeMode,
    activeNoteText,
    noteCharacterCount,
    daysSelectedCount,
    businessDaysCount,
    weekendsCount,
    holidaysCount,
    quickEventTags,
  };
}

export type NotesState = ReturnType<typeof useNotesState>;

"use client";

import { useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Download, Upload } from 'lucide-react';

export function SyncControls() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    // Generate a backup of the current store state
    const state = useStore.getState();
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Create an invisible link to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `calendar-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Directly hydrate the Zustand store with the parsed payload
        useStore.setState(json);
        alert("Calendar state restored successfully!");
        
      } catch (err) {
        console.error("Backup restoration failed:", err);
        alert("Invalid backup file. Please ensure it is a valid JSON file generated from this application.");
      }
    };
    reader.readAsText(file);
    
    // Reset file input so the same file could be selected again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleExport} 
        aria-label="Export Backup"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors text-xs font-semibold"
      >
        <Download size={14} />
        Export
      </button>
       
      <button 
        onClick={() => fileInputRef.current?.click()} 
        aria-label="Import Backup"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 text-white rounded-md shadow-sm hover:bg-slate-700 transition-colors text-xs font-semibold"
      >
        <Upload size={14} />
        Import
      </button>
      
      <input 
        type="file" 
        accept=".json" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImport} 
      />
    </div>
  );
}

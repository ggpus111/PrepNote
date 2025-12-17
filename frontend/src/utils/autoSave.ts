// Auto-save utility functions
export const AUTOSAVE_KEYS = {
  MATERIAL_SUMMARY: 'prepnote_autosave_summary',
  SCRIPT: 'prepnote_autosave_script',
  QA: 'prepnote_autosave_qa',
  PPT: 'prepnote_autosave_ppt',
} as const;

export interface AutoSaveData {
  timestamp: number;
  data: any;
}

// Save data to localStorage
export const autoSave = (key: string, data: any) => {
  try {
    const saveData: AutoSaveData = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(key, JSON.stringify(saveData));
  } catch (error) {
    console.error('Auto-save failed:', error);
  }
};

// Load data from localStorage
export const loadAutoSave = (key: string): AutoSaveData | null => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load auto-save:', error);
    return null;
  }
};

// Clear auto-save data
export const clearAutoSave = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear auto-save:', error);
  }
};

// Format timestamp for display
export const formatAutoSaveTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) { // Less than 1 minute
    return '방금 전';
  } else if (diff < 3600000) { // Less than 1 hour
    const minutes = Math.floor(diff / 60000);
    return `${minutes}분 전`;
  } else if (diff < 86400000) { // Less than 1 day
    const hours = Math.floor(diff / 3600000);
    return `${hours}시간 전`;
  } else {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
};
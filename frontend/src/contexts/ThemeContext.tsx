import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: ThemeMode;        // 사용자가 선택한 값
  actualTheme: 'light' | 'dark'; // 시스템 반영된 실제 적용 값
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void; // 라이트/다크 토글 (allow system도 유지 가능)
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => getSystemTheme());

  // 초기 로드: localStorage → 없으면 system
  useEffect(() => {
    const saved = localStorage.getItem('prepnote_theme') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      setThemeState(saved);
    } else {
      setThemeState('system');
    }
  }, []);

  // 시스템 테마 변화 감지
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSystemTheme(mq.matches ? 'dark' : 'light');
    handler();
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const actualTheme = useMemo<'light' | 'dark'>(() => {
    if (theme === 'system') return systemTheme;
    return theme;
  }, [theme, systemTheme]);

  // html 클래스 적용
  useEffect(() => {
    const root = document.documentElement;
    if (actualTheme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [actualTheme]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('prepnote_theme', t);
  };

  // ✅ 사용자가 누르면 라이트/다크만 토글 (system도 유지하고 싶으면 cycle로 바꿔도 됨)
  const toggleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  const value: ThemeContextValue = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

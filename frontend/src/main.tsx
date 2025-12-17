import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

function bootstrapThemeClass() {
  // ThemeContext와 동일한 키를 사용
  const mode = (localStorage.getItem('prepnote_theme_mode') as 'system' | 'light' | 'dark' | null) ?? 'system';
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const theme = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
  if (theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

bootstrapThemeClass();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

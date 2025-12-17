import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from './firebase';

import { ThemeProvider } from './contexts/ThemeContext';
import { Landing } from './components/Landing';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { MaterialSummary } from './components/MaterialSummary';
import { ScriptGenerator } from './components/ScriptGenerator';
import { RehearsalMode } from './components/RehearsalMode';
import { QAGenerator } from './components/QAGenerator';
import { Results } from './components/Results';
import { Profile } from './components/Profile';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { Chatbot } from './components/Chatbot';
import { PPTCreator, PPTPresentation } from './components/PPTCreator';
import { History } from './components/History';

export type UserType = 'elementary' | 'middle' | 'high' | 'university' | 'worker';
export type ChatbotTone = 'formal' | 'casual' | 'friendly' | 'professional';

export interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  chatbotTone?: ChatbotTone;
}

export interface Summary {
  id: string;
  title: string;
  content: string;
  outline?: string[];
  createdAt: Date;
}

export interface Script {
  id: string;
  title: string;
  sourceId?: string;
  speakers: number;
  tone: string;
  content: string[];
  createdAt: Date;
}

export interface RehearsalResult {
  id: string;
  title: string;
  scriptId?: string;
  score: number;
  speed: number;
  repeatWords: number;
  timeAccuracy: number;
  feedback: string;
  createdAt: Date;
}

export interface QASet {
  id: string;
  title: string;
  sourceId?: string;
  questions: Array<{
    level?: 'easy' | 'medium' | 'hard';
    question: string;
    answer: string;
  }>;
  createdAt: Date;
}

export type Page =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'summary'
  | 'script'
  | 'rehearsal'
  | 'qa'
  | 'results'
  | 'profile'
  | 'chatbot'
  | 'ppt'
  | 'history';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);

  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [rehearsals, setRehearsals] = useState<RehearsalResult[]>([]);
  const [qaSets, setQASets] = useState<QASet[]>([]);
  const [ppts, setPPTs] = useState<PPTPresentation[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ✅ Firebase 세션 기반 자동 로그인
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setCurrentPage('landing');
        return;
      }

      try {
        const uid = fbUser.uid;
        const snap = await getDoc(doc(db, 'users', uid));
        const data = snap.exists() ? (snap.data() as any) : null;

        const restored: User = {
          id: uid,
          email: fbUser.email || '',
          name: (data?.name || fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'User')) as string,
          userType: (data?.userType || 'university') as UserType,
        };

        setUser(restored);
        setCurrentPage('dashboard');
      } catch (e) {
        console.error('Failed to restore firebase user profile:', e);
        // 최소한 Firebase 로그인 상태면 대시보드로는 들어가게
        setUser({
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.email ? fbUser.email.split('@')[0] : 'User',
          userType: 'university',
        });
        setCurrentPage('dashboard');
      }
    });

    return () => unsub();
  }, []);

  // Sidebar responsive init
  useEffect(() => {
    const initializeSidebar = () => setSidebarCollapsed(window.innerWidth < 768);
    initializeSidebar();
    window.addEventListener('resize', initializeSidebar);
    return () => window.removeEventListener('resize', initializeSidebar);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  // ✅ 로그아웃: Firebase signOut
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentPage('landing');
  };

  // Show landing/auth without sidebar
  if (currentPage === 'landing' || currentPage === 'auth') {
    return (
      <div className="min-h-screen bg-background">
        {currentPage === 'landing' && (
          <Landing onGetStarted={() => setCurrentPage('auth')} onLogin={() => setCurrentPage('auth')} />
        )}
        {currentPage === 'auth' && <Auth onLogin={handleLogin} onBack={() => setCurrentPage('landing')} />}
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {user && (
          <>
            <MobileHeader onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} onNavigate={setCurrentPage} />
            <Sidebar
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </>
        )}

        <div
          className={`overflow-y-auto pt-14 md:pt-0 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentPage === 'dashboard' && user && (
              <Dashboard
                user={user}
                summaries={summaries}
                scripts={scripts}
                rehearsals={rehearsals}
                qaSets={qaSets}
                ppts={ppts}
                onLogout={handleLogout}
                onNavigate={setCurrentPage}
                onSelectPresentation={() => {}}
                presentations={[]}
              />
            )}

            {currentPage === 'summary' && user && (
              <MaterialSummary
                user={user}
                summaries={summaries}
                scripts={scripts}
                onBack={() => setCurrentPage('dashboard')}
                onComplete={(summary) => {
                  setSummaries((prev) => [...prev, summary]);
                  setCurrentPage('dashboard');
                }}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === 'script' && user && (
              <ScriptGenerator
                user={user}
                summaries={summaries}
                qaSets={qaSets as any}
                onBack={() => setCurrentPage('dashboard')}
                onComplete={(script) => {
                  setScripts((prev) => [...prev, script]);
                  setCurrentPage('dashboard');
                }}
              />
            )}

            {currentPage === 'rehearsal' && user && (
              <RehearsalMode
                user={user}
                scripts={scripts}
                onBack={() => setCurrentPage('dashboard')}
                onComplete={(rehearsal) => {
                  setRehearsals((prev) => [...prev, rehearsal]);
                  setCurrentPage('results');
                }}
                onViewResult={() => setCurrentPage('results')}
              />
            )}

            {currentPage === 'qa' && user && (
              <QAGenerator
                user={user}
                summaries={summaries}
                scripts={scripts}
                onBack={() => setCurrentPage('dashboard')}
                onComplete={(qa) => {
                  setQASets((prev) => [...prev, qa]);
                  setCurrentPage('dashboard');
                }}
              />
            )}

            {currentPage === 'ppt' && user && (
              <PPTCreator
                user={user}
                summaries={summaries}
                scripts={scripts}
                onComplete={(ppt) => {
                  setPPTs((prev) => [...prev, ppt]);
                  setCurrentPage('dashboard');
                }}
              />
            )}

            {currentPage === 'history' && user && (
              <History
                summaries={summaries}
                scripts={scripts}
                rehearsals={rehearsals}
                qaSets={qaSets}
                ppts={ppts}
                onDelete={() => {}}
                onView={() => {}}
              />
            )}

            {currentPage === 'results' && user && rehearsals.length > 0 && (
              <Results user={user} rehearsal={rehearsals[rehearsals.length - 1]} onBack={() => setCurrentPage('dashboard')} />
            )}

            {currentPage === 'profile' && user && (
              <Profile
                user={user}
                onBack={() => setCurrentPage('dashboard')}
                onUpdateUser={(u) => setUser(u)}
                onLogout={handleLogout}
                onDeleteAccount={() => {}}
              />
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

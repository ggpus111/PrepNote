import {
  Home,
  FileText,
  MessageSquare,
  Mic,
  HelpCircle,
  Presentation,
  Bot,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from './ui/button';
import type { Page } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import logoImage from 'figma:asset/ae5b552081ceb2d5f9f4e15a08861d29a64bcb3a.png';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ currentPage, onNavigate, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { icon: Home, label: '홈', page: 'dashboard' as Page },
    { icon: Bot, label: 'AI 챗봇', page: 'chatbot' as Page },
    { icon: FileText, label: '자료 요약', page: 'summary' as Page },
    { icon: MessageSquare, label: '대본 작성', page: 'script' as Page },
    { icon: Mic, label: '리허설 연습', page: 'rehearsal' as Page },
    { icon: HelpCircle, label: 'Q&A 준비', page: 'qa' as Page },
    { icon: Presentation, label: 'PPT 제작', page: 'ppt' as Page },
    { icon: History, label: '히스토리', page: 'history' as Page },
  ];

  const bottomItems = [{ icon: Settings, label: '프로필 설정', page: 'profile' as Page }];

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-40" onClick={onToggleCollapse} />
      )}

      <div
        className={`bg-white dark:bg-card border-r border-gray-200 dark:border-border flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        } fixed left-0 z-50 ${
          isCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
        } top-14 md:top-0 h-[calc(100vh-3.5rem)] md:h-screen`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-border flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="PrepNote" className="w-8 h-8" />
              <span className="text-gray-900 dark:text-foreground">PrepNote</span>
            </div>
          ) : (
            <img src={logoImage} alt="PrepNote" className="w-8 h-8 mx-auto" />
          )}
        </div>

        {/* Main Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;

              return (
                <Button
                  key={item.page}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start relative ${isCollapsed ? 'px-2' : 'px-3'} ${
                    isActive
                      ? 'bg-primary/10 text-primary hover:bg-primary/15 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-primary before:rounded-r-full'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                  onClick={() => onNavigate(item.page)}
                >
                  <Icon
                    className={`${isCollapsed ? '' : 'mr-3'} w-5 h-5 ${
                      isActive ? 'scale-110' : ''
                    } transition-transform`}
                  />
                  {!isCollapsed && <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Menu */}
        <div className="border-t border-gray-200 dark:border-border p-2">
          <div className="space-y-1">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'} text-muted-foreground hover:bg-muted`}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className={`${isCollapsed ? '' : 'mr-3'} w-5 h-5`} />
                  {!isCollapsed && <span>라이트 모드</span>}
                </>
              ) : (
                <>
                  <Moon className={`${isCollapsed ? '' : 'mr-3'} w-5 h-5`} />
                  {!isCollapsed && <span>다크 모드</span>}
                </>
              )}
            </Button>

            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;

              return (
                <Button
                  key={item.page}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'} ${
                    isActive ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-muted-foreground hover:bg-muted'
                  }`}
                  onClick={() => onNavigate(item.page)}
                >
                  <Icon className={`${isCollapsed ? '' : 'mr-3'} w-5 h-5`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Toggle collapse */}
        {onToggleCollapse && (
          <div className="p-2 border-t border-gray-200 dark:border-border">
            <Button variant="ghost" className="w-full justify-center" onClick={onToggleCollapse}>
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

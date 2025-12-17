import { Menu, Settings } from 'lucide-react';
import { Button } from './ui/button';
import logoImage from 'figma:asset/ae5b552081ceb2d5f9f4e15a08861d29a64bcb3a.png';
import type { Page } from '../App';

interface MobileHeaderProps {
  onToggleSidebar: () => void;
  onNavigate: (page: Page) => void;
}

export function MobileHeader({ onToggleSidebar, onNavigate }: MobileHeaderProps) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-card border-b border-gray-200 dark:border-border z-50 flex items-center justify-between px-4">
      {/* Left: Menu Button */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onToggleSidebar}
        className="p-2"
      >
        <Menu className="w-5 h-5 text-gray-900 dark:text-foreground" />
      </Button>

      {/* Center: Logo */}
      <button 
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <img src={logoImage} alt="PrepNote" className="w-7 h-7" />
        <span className="text-gray-900 dark:text-foreground">PrepNote</span>
      </button>

      {/* Right: Profile Settings */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onNavigate('profile')}
        className="p-2"
      >
        <Settings className="w-5 h-5 text-gray-900 dark:text-foreground" />
      </Button>
    </header>
  );
}
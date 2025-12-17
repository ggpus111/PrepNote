import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Play, Pause, RotateCcw, Clock, Bell, AlertTriangle } from 'lucide-react';

interface PresentationTimerProps {
  onTimeUpdate?: (seconds: number) => void;
  targetMinutes?: number;
}

export function PresentationTimer({ onTimeUpdate, targetMinutes: initialTarget = 5 }: PresentationTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(initialTarget);
  const [showWarning, setShowWarning] = useState(false);
  const [hasReachedTarget, setHasReachedTarget] = useState(false);
  const [hasExceeded, setHasExceeded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const targetSeconds = targetMinutes * 60;
  const warningSeconds = targetSeconds * 0.9; // 90% 시점에 경고

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1;
          
          // 콜백으로 시간 전달
          if (onTimeUpdate) {
            onTimeUpdate(newSeconds);
          }

          // 90% 시점 경고
          if (newSeconds >= warningSeconds && newSeconds < targetSeconds && !showWarning) {
            setShowWarning(true);
            playBeep();
          }

          // 목표 시간 도달
          if (newSeconds >= targetSeconds && !hasReachedTarget) {
            setHasReachedTarget(true);
            playBeep(2);
          }

          // 시간 초과
          if (newSeconds > targetSeconds + 30 && !hasExceeded) {
            setHasExceeded(true);
            playBeep(3);
          }

          return newSeconds;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, targetSeconds, warningSeconds, hasReachedTarget, hasExceeded, onTimeUpdate, showWarning]);

  const playBeep = (times: number = 1) => {
    // 간단한 비프음 (Web Audio API 사용)
    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }, i * 200);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setShowWarning(false);
    setHasReachedTarget(false);
    setHasExceeded(false);
  };

  const getTimerColor = () => {
    if (hasExceeded) return 'text-red-600 dark:text-red-400';
    if (hasReachedTarget) return 'text-orange-600 dark:text-orange-400';
    if (showWarning) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-primary';
  };

  const getStatusIcon = () => {
    if (hasExceeded) return <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />;
    if (hasReachedTarget) return <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
    if (showWarning) return <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
    return <Clock className="w-6 h-6 text-primary" />;
  };

  const getStatusMessage = () => {
    if (hasExceeded) return '⚠️ 목표 시간을 초과했습니다!';
    if (hasReachedTarget) return '🔔 목표 시간에 도달했습니다';
    if (showWarning) return '⏰ 곧 목표 시간입니다 (90%)';
    return '진행 중';
  };

  const progress = Math.min((seconds / targetSeconds) * 100, 100);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* 타이머 설정 */}
        <div>
          <Label htmlFor="targetTime">목표 시간 설정 (분)</Label>
          <Input
            id="targetTime"
            type="number"
            min="1"
            max="120"
            value={targetMinutes}
            onChange={(e) => setTargetMinutes(Number(e.target.value))}
            disabled={isRunning || seconds > 0}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            목표: {targetMinutes}분 (90% 시점에 알림)
          </p>
        </div>

        {/* 타이머 디스플레이 */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            {getStatusIcon()}
            <div className={`text-6xl font-mono ${getTimerColor()} transition-colors`}>
              {formatTime(seconds)}
            </div>
          </div>

          {/* 진행 바 */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                hasExceeded
                  ? 'bg-red-600'
                  : hasReachedTarget
                  ? 'bg-orange-600'
                  : showWarning
                  ? 'bg-yellow-600'
                  : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 상태 메시지 */}
          {(showWarning || hasReachedTarget || hasExceeded) && (
            <div
              className={`p-3 rounded-lg ${
                hasExceeded
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  : hasReachedTarget
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
              }`}
            >
              {getStatusMessage()}
            </div>
          )}

          {/* 목표 시간까지 남은 시간 */}
          {isRunning && seconds < targetSeconds && (
            <p className="text-sm text-muted-foreground">
              목표까지 남은 시간: {formatTime(targetSeconds - seconds)}
            </p>
          )}
        </div>

        {/* 컨트롤 버튼 */}
        <div className="grid grid-cols-3 gap-3">
          {!isRunning ? (
            <Button onClick={handleStart} className="w-full" size="lg">
              <Play className="w-5 h-5 mr-2" />
              {seconds > 0 ? '재개' : '시작'}
            </Button>
          ) : (
            <Button onClick={handlePause} variant="secondary" className="w-full" size="lg">
              <Pause className="w-5 h-5 mr-2" />
              일시정지
            </Button>
          )}
          <Button onClick={handleReset} variant="outline" className="w-full col-span-2" size="lg">
            <RotateCcw className="w-5 h-5 mr-2" />
            초기화
          </Button>
        </div>

        {/* 통계 정보 */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">경과 시간</p>
            <p className="text-gray-900 dark:text-foreground">{formatTime(seconds)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">목표 시간</p>
            <p className="text-gray-900 dark:text-foreground">{formatTime(targetSeconds)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">진행률</p>
            <p className={`${getTimerColor()}`}>
              {Math.min(Math.round(progress), 100)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
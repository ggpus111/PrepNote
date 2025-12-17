import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Toast } from './ui/Toast';
import { EmptyState } from './ui/EmptyState';
import { PresentationTimer } from './PresentationTimer';
import { Mic, Video, Square, Play, Loader2, Upload, Clock, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { User, Script, RehearsalResult } from '../App';

interface RehearsalModeProps {
  user: User;
  scripts: Script[];
  onBack: () => void;
  onComplete: (rehearsal: RehearsalResult) => void;
  onViewResult: (rehearsal: RehearsalResult) => void;
}

type InputMethod = 'upload' | 'script';
type Step = 'setup' | 'recording' | 'analyzing';

export function RehearsalMode({ user, scripts, onBack, onComplete }: RehearsalModeProps) {
  const [step, setStep] = useState<Step>('setup');
  const [inputMethod, setInputMethod] = useState<InputMethod>('script');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedScript, setSelectedScript] = useState<string>('');
  const [scriptContent, setScriptContent] = useState<string[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text.slice(0, 5000));
        setScriptContent([text]);
      };
      reader.readAsText(file);
    }
  };

  const handleScriptSelect = (scriptId: string) => {
    const script = scripts.find(s => s.id === scriptId);
    if (script) {
      setSelectedScript(scriptId);
      setTitle(script.title);
      setScriptContent(script.content);
    }
  };

  const handleStartRecording = () => {
    setStep('recording');
    setIsRecording(true);
    setRecordingTime(0);
    
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 600) {
          handleStopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleAnalyze = async () => {
    setStep('analyzing');
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const speedScore = 75 + Math.floor(Math.random() * 20);
    const repeatScore = 80 + Math.floor(Math.random() * 15);
    const timeScore = 85 + Math.floor(Math.random() * 15);
    
    const totalScore = Math.round((speedScore + repeatScore + timeScore) / 3);
    
    const feedback = `[종합 피드백]

전체적으로 ${totalScore >= 85 ? '매우 우수한' : totalScore >= 70 ? '좋은' : '개선이 필요한'} 발표였습니다.

강점:
- 발표 내용의 논리적 구성이 명확합니다
- 주요 포인트를 잘 전달하고 있습니다
${speedScore >= 80 ? '- 적절한 말하기 속도를 유지했습니다\n' : ''}${repeatScore >= 80 ? '- 반복어 사용이 적절합니다\n' : ''}
개선 사항:
${speedScore < 80 ? '- 말하기 속도를 조금 더 조절해보세요\n' : ''}${repeatScore < 80 ? '- "음", "아", "그" 등의 반복어 사용을 줄여보세요\n' : ''}${timeScore < 80 ? '- 시간 배분을 더 신경써보세요\n' : ''}
다음 발표:
- 더 많은 연습을 통해 자신감을 높이세요
- 청중과의 아이컨택을 유지하세요
- 핵심 메시지를 강조하는 연습을 하세요`;

    const rehearsal: RehearsalResult = {
      id: Math.random().toString(36).substring(2, 9),
      title: title || '발표 연습',
      scriptId: selectedScript || undefined,
      score: totalScore,
      speed: speedScore,
      repeatWords: repeatScore,
      timeAccuracy: timeScore,
      feedback,
      createdAt: new Date(),
    };
    
    setIsAnalyzing(false);
    onComplete(rehearsal);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setStep('setup');
    setIsRecording(false);
    setRecordingTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Setup Step
  if (step === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-gray-900 dark:text-foreground mb-2">발표 리허설</h1>
          <p className="text-gray-600 dark:text-muted-foreground">
            발표 대본을 준비하고 연습을 시작하세요
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              1
            </div>
            <span className="text-primary">대본 준비</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300 dark:bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-border text-gray-600 dark:text-muted-foreground flex items-center justify-center">
              2
            </div>
            <span className="text-gray-600 dark:text-muted-foreground">리허설</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300 dark:bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-border text-gray-600 dark:text-muted-foreground flex items-center justify-center">
              3
            </div>
            <span className="text-gray-600 dark:text-muted-foreground">분석</span>
          </div>
        </div>

        {/* Input Method Selection */}
        <Card className="p-6">
          <h2 className="text-gray-900 dark:text-foreground mb-4">대본 입력 방법</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              variant={inputMethod === 'script' ? 'default' : 'outline'}
              onClick={() => setInputMethod('script')}
              className="h-auto py-4 flex-col gap-2"
              disabled={scripts.length === 0}
            >
              <FileText className="w-6 h-6" />
              <div>
                <div>기존 대본</div>
                <div className="text-xs opacity-70 mt-1">저장된 대본 사용</div>
              </div>
            </Button>
            <Button
              variant={inputMethod === 'upload' ? 'default' : 'outline'}
              onClick={() => setInputMethod('upload')}
              className="h-auto py-4 flex-col gap-2"
            >
              <Upload className="w-6 h-6" />
              <div>
                <div>파일 업로드</div>
                <div className="text-xs opacity-70 mt-1">새 대본 업로드</div>
              </div>
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">발표 제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="발표 제목을 입력하세요"
                className="mt-1"
              />
            </div>

            {inputMethod === 'script' && (
              <div>
                <Label htmlFor="script">대본 선택</Label>
                {scripts.length === 0 ? (
                  <div className="mt-1 p-4 border border-dashed border-gray-300 dark:border-border rounded-lg text-center">
                    <p className="text-gray-500 dark:text-muted-foreground">
                      저장된 대본이 없습니다. 먼저 대본을 작성해주세요.
                    </p>
                  </div>
                ) : (
                  <select
                    id="script"
                    value={selectedScript}
                    onChange={(e) => handleScriptSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-border bg-white dark:bg-card text-gray-900 dark:text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                  >
                    <option value="">대본을 선택하세요</option>
                    {scripts.map((script) => (
                      <option key={script.id} value={script.id}>
                        {script.title} - {new Date(script.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {inputMethod === 'upload' && (
              <>
                <div>
                  <Label htmlFor="file">파일 업로드</Label>
                  <label
                    htmlFor="file"
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-border rounded-lg cursor-pointer hover:border-primary dark:hover:border-primary transition-colors mt-1"
                  >
                    <div className="text-center">
                      <Upload className="w-10 h-10 text-gray-400 dark:text-muted-foreground mx-auto mb-3" />
                      <p className="text-gray-900 dark:text-foreground mb-1">
                        클릭하여 대본 파일을 업로드하세요
                      </p>
                      <p className="text-sm text-gray-500 dark:text-muted-foreground">
                        PDF, DOCX, TXT 파일 지원
                      </p>
                    </div>
                    <input
                      id="file"
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                <div>
                  <Label htmlFor="content">대본 내용</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setScriptContent([e.target.value]);
                    }}
                    placeholder="발표 대본을 입력하세요..."
                    rows={8}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Script Preview */}
        {scriptContent.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h2 className="text-gray-900 dark:text-foreground">대본 미리보기</h2>
            </div>
            <div className="bg-gray-50 dark:bg-muted p-4 rounded-lg max-h-[300px] overflow-y-auto">
              {scriptContent.map((script, index) => (
                <div key={index} className="text-gray-700 dark:text-foreground/90 whitespace-pre-wrap">
                  {script}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Start Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleStartRecording}
            disabled={!title || scriptContent.length === 0}
            className="flex-1"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            리허설 시작하기
          </Button>
        </div>

        {/* Tips */}
        <Card className="p-6 bg-blue-50 dark:bg-primary/10 border-blue-200 dark:border-primary/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-gray-900 dark:text-foreground mb-2">리허설 팁</h3>
              <ul className="space-y-1.5 text-gray-700 dark:text-foreground/80">
                <li>• 조용한 환경에서 연습하세요</li>
                <li>• 자연스러운 말투로 발표하세요</li>
                <li>• 시간 제한을 염두에 두고 연습하세요 (권장: 5-10분)</li>
                <li>• 대본을 참고하되, 자연스럽게 표현하세요</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Recording Step
  if (step === 'recording') {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-gray-900 dark:text-foreground mb-2">{title || '발표 리허설'}</h1>
          <p className="text-gray-600 dark:text-muted-foreground">
            준비되면 녹음을 시작하고, 대본을 참고하며 발표하세요
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-green-600 dark:text-green-400">대본 준비</span>
          </div>
          <div className="w-12 h-0.5 bg-primary" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              2
            </div>
            <span className="text-primary">리허설</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300 dark:bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-border text-gray-600 dark:text-muted-foreground flex items-center justify-center">
              3
            </div>
            <span className="text-gray-600 dark:text-muted-foreground">분석</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Timer and Recording */}
          <div className="space-y-6">
            <PresentationTimer 
              targetMinutes={5}
              onTimeUpdate={(seconds) => setRecordingTime(seconds)}
            />

            {/* Recording Control */}
            <Card className="p-6">
              <h2 className="text-gray-900 dark:text-foreground mb-4">녹음 컨트롤</h2>
              
              <div className="aspect-video bg-gray-900 dark:bg-gray-950 rounded-lg mb-6 flex items-center justify-center">
                {isRecording ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full animate-pulse mb-4 mx-auto flex items-center justify-center">
                      <Mic className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white mb-2">녹음 중...</p>
                    <p className="text-white text-2xl font-mono">{formatTime(recordingTime)}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Video className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
                    <p className="text-gray-400">준비 완료</p>
                    <p className="text-gray-500 text-sm mt-2">녹음 시간: {formatTime(recordingTime)}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {!isRecording ? (
                  <>
                    <Button onClick={handleStartRecording} className="w-full" size="lg">
                      <Mic className="w-5 h-5 mr-2" />
                      녹음 {recordingTime > 0 ? '재개' : '시작'}
                    </Button>
                    {recordingTime > 0 && (
                      <>
                        <Button 
                          onClick={handleAnalyze} 
                          disabled={isAnalyzing} 
                          variant="default"
                          className="w-full" 
                          size="lg"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              AI 분석 중...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-5 h-5 mr-2" />
                              발표 완료 및 분석
                            </>
                          )}
                        </Button>
                        <Button onClick={handleReset} variant="outline" className="w-full">
                          처음부터 다시 시작
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <Button onClick={handleStopRecording} variant="destructive" className="w-full" size="lg">
                    <Square className="w-5 h-5 mr-2" />
                    녹음 일시정지
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Right: Script Reference */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-gray-900 dark:text-foreground mb-4">발표 대본</h2>
              
              {scriptContent.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {scriptContent.map((script, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-muted p-4 rounded-lg">
                      {scriptContent.length > 1 && (
                        <h3 className="text-gray-900 dark:text-foreground mb-2">
                          발표자 {index + 1}
                        </h3>
                      )}
                      <div className="text-gray-700 dark:text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {script}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="대본 없음"
                  description="대본 없이 자유롭게 발표를 진행하세요."
                />
              )}
            </Card>

            <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <h3 className="text-gray-900 dark:text-foreground mb-3">AI 분석 항목</h3>
              <ul className="space-y-2 text-gray-700 dark:text-foreground/80">
                <li>• <strong>말하기 속도:</strong> 적정 속도 대비 비율</li>
                <li>• <strong>반복어 사용:</strong> "음", "아" 등의 빈도</li>
                <li>• <strong>시간 정확도:</strong> 목표 시간 준수율</li>
                <li>• <strong>종합 점수:</strong> 100점 만점 기준 채점</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Analyzing Step
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center py-12">
        <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
        <h2 className="text-gray-900 dark:text-foreground mb-2">AI가 발표를 분석하고 있습니다...</h2>
        <p className="text-gray-600 dark:text-muted-foreground">
          발표 내용, 속도, 발음 등을 종합적으로 분석 중입니다.
        </p>
      </div>
    </div>
  );
}

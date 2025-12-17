import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Toast } from './ui/Toast';
import { Users, Sparkles, Loader2, Download, Clock } from 'lucide-react';
import type { User, Summary, Script } from '../App';

import { FileUpload } from './FileUpload';
import { createScript } from '../services/script';
import { extractTextFromFile as extractTextFromFileApi } from '../services/summary';

interface ScriptGeneratorProps {
  user: User;
  summaries: Summary[];
  onBack: () => void;
  onComplete: (script: Script) => void;
}

type InputMethod = 'upload' | 'summary';
type ToastState = { type: 'success' | 'error' | 'info'; message: string } | null;
type ApiTone = 'formal' | 'friendly' | 'energetic';

export function ScriptGenerator({ user, summaries, onBack, onComplete }: ScriptGeneratorProps) {
  const [inputMethod, setInputMethod] = useState<InputMethod>('upload');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [outline, setOutline] = useState<string[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<string>('');

  const [speakers, setSpeakers] = useState(1);
  const [tone, setTone] = useState('formal');
  const [targetMinutes, setTargetMinutes] = useState(3);

  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string[]>([]);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const tones = [
    { value: 'formal', label: '격식체 (존댓말, 학술적)' },
    { value: 'friendly', label: '친근체 (부드럽고 친근한)' },
    { value: 'casual', label: '구어체 (대화하듯 편안한)' },
    { value: 'professional', label: '전문적 (비즈니스 스타일)' },
  ];

  const mapToneToApiTone = (uiTone: string): ApiTone => {
    if (uiTone === 'formal') return 'formal';
    if (uiTone === 'friendly') return 'friendly';
    return 'energetic';
  };

  const handleFilesChange = async (files: File[]) => {
    if (!files.length) return;
    const file = files[0];

    setToast(null);
    setIsExtracting(true);

    setSelectedSummary('');
    setOutline([]);

    try {
      const extracted = await extractTextFromFileApi(file);
      const text = (extracted?.text ?? '').trim();

      if (!text) {
        setToast({ type: 'error', message: '텍스트를 추출하지 못했습니다. (이미지/스캔 문서면 어려울 수 있어요)' });
        return;
      }

      if (!title) setTitle(file.name.replace(/\.(txt|pdf|docx|pptx)$/i, ''));

      setContent(text);
      setToast({ type: 'success', message: '파일 텍스트 추출 완료' });
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.message || '파일 텍스트 추출 실패';
      setToast({ type: 'error', message: msg });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSummarySelect = (summaryId: string) => {
    const summary = summaries.find(s => s.id === summaryId);
    if (!summary) return;

    setSelectedSummary(summaryId);
    setTitle(summary.title);
    setContent(summary.content);

    // ✅ MaterialSummary에서 저장한 필드명에 맞춤: outline
    // (기존 slideStructure는 더 이상 사용하지 않음)
    const pickedOutline = Array.isArray((summary as any).outline) ? (summary as any).outline : [];
    setOutline(pickedOutline);

    setToast({ type: 'info', message: '요약 내용을 불러왔습니다. (목차도 함께 적용됨)' });
  };

  const handleGenerateScript = async () => {
    if (!title || !content) {
      setToast({ type: 'error', message: '제목과 내용을 입력해주세요.' });
      return;
    }

    setIsGenerating(true);
    setToast(null);

    try {
      const data = await createScript({
        title,
        summaryText: content,
        outline: outline.length ? outline : undefined,
        options: {
          tone: mapToneToApiTone(tone),
          speakerCount: speakers,
          targetMinutes,
        },
      });

      setGeneratedScript(Array.isArray(data.content) ? data.content : []);
      setToast({ type: 'success', message: '대본 생성 완료' });
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.message || '대본 생성 실패 (서버 /scripts 확인)';
      setToast({ type: 'error', message: msg });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    const newScript: Script = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      sourceId: selectedSummary || undefined,
      speakers,
      tone,
      content: generatedScript,
      createdAt: new Date(),
    };
    onComplete(newScript);
    setToast({ type: 'success', message: '대본 저장 완료' });
  };

  const downloadAs = (ext: 'txt' | 'docx') => {
    const file = new Blob([generatedScript.join('\n\n')], { type: 'text/plain' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = `${title || '대본'}_대본.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowDownloadMenu(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gray-900 dark:text-foreground mb-2">발표 대본 생성</h1>
        <p className="text-gray-600 dark:text-muted-foreground">
          자료를 업로드하거나 기존 요약을 선택하여 발표 대본을 생성하세요.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-gray-900 dark:text-foreground mb-4">입력 방법 선택</h2>

            <div className="grid grid-cols-2 gap-2 mb-6">
              <Button
                variant={inputMethod === 'upload' ? 'default' : 'outline'}
                onClick={() => setInputMethod('upload')}
                className="w-full"
              >
                파일 업로드
              </Button>
              <Button
                variant={inputMethod === 'summary' ? 'default' : 'outline'}
                onClick={() => setInputMethod('summary')}
                className="w-full"
                disabled={summaries.length === 0}
              >
                기존 요약
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
                />
              </div>

              {inputMethod === 'upload' && (
                <>
                  <div>
                    <Label>파일 업로드 (TXT / PDF / DOCX / PPTX)</Label>
                    <div className="mt-2">
                      <FileUpload
                        onFilesChange={handleFilesChange}
                        accept=".txt,.pdf,.docx,.pptx"
                        multiple={false}
                        maxFiles={1}
                        maxSize={10}
                        showPreview={false}
                      />
                    </div>

                    {isExtracting && (
                      <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        파일에서 텍스트 추출 중...
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>내용</Label>
                    {/* ✅ Textarea 자체에 height/overflow */}
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="추출된 텍스트가 여기에 표시됩니다."
                      className="mt-2 h-[260px] overflow-y-auto resize-none rounded-lg border border-gray-200 dark:border-border"
                    />
                  </div>
                </>
              )}

              {inputMethod === 'summary' && (
                <div>
                  <Label htmlFor="summary">기존 요약 선택</Label>
                  <select
                    id="summary"
                    value={selectedSummary}
                    onChange={(e) => handleSummarySelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 bg-white dark:bg-card"
                  >
                    <option value="">요약을 선택하세요</option>
                    {summaries.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} - {new Date(s.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>

                  {/* ✅ Textarea 자체에 height/overflow */}
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="선택한 요약 내용이 표시됩니다."
                    className="mt-3 h-[260px] overflow-y-auto resize-none rounded-lg border border-gray-200 dark:border-border"
                  />

                  {outline.length > 0 && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-muted-foreground">
                      목차 {outline.length}개가 대본 생성에 함께 사용됩니다.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-gray-900 dark:text-foreground mb-4">발표 설정</h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="speakers">발표자 수</Label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    id="speakers"
                    type="range"
                    min="1"
                    max="5"
                    value={speakers}
                    onChange={(e) => setSpeakers(Number(e.target.value))}
                    className="flex-1"
                  />
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <span>{speakers}명</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="minutes">발표 시간(분)</Label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    id="minutes"
                    type="range"
                    min="1"
                    max="15"
                    value={targetMinutes}
                    onChange={(e) => setTargetMinutes(Number(e.target.value))}
                    className="flex-1"
                  />
                  <div className="w-12 h-12 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {targetMinutes}m
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="tone">말투 스타일</Label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 bg-white dark:bg-card"
                >
                  {tones.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleGenerateScript}
                disabled={!title || !content || isGenerating || isExtracting}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    대본 생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    대본 생성하기
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {generatedScript.length > 0 ? (
            <>
              {generatedScript.map((script, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h2 className="text-gray-900 dark:text-foreground">
                      발표자 {index + 1}
                      {speakers > 1 && ` (총 ${speakers}명 중)`}
                    </h2>
                  </div>

                  <pre className="whitespace-pre-wrap text-gray-700 dark:text-foreground bg-gray-50 dark:bg-muted p-4 rounded-lg max-h-[360px] overflow-y-auto">
                    {script}
                  </pre>
                </Card>
              ))}

              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1">
                  저장하고 완료
                </Button>

                <div className="relative">
                  <Button variant="outline" onClick={() => setShowDownloadMenu(!showDownloadMenu)}>
                    <Download className="w-4 h-4 mr-2" />
                    다운로드
                  </Button>

                  {showDownloadMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-md shadow-lg z-10">
                      <button
                        className="block px-4 py-2 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted w-full text-left rounded-t-md"
                        onClick={() => downloadAs('txt')}
                      >
                        TXT로 저장
                      </button>
                      <button
                        className="block px-4 py-2 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted w-full text-left rounded-b-md"
                        onClick={() => downloadAs('docx')}
                      >
                        DOCX로 저장
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 dark:text-foreground mb-2">대본을 생성하세요</h3>
              <p className="text-gray-600 dark:text-muted-foreground">
                입력 방법을 선택하고 발표 설정을 완료한 후 대본 생성 버튼을 클릭하세요.
              </p>
            </Card>
          )}
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}

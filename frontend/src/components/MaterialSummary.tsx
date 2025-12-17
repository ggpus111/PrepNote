import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { FileUpload } from './FileUpload';
import { Toast } from './ui/Toast';
import { Sparkles, Loader2, History, RotateCcw, Trash2 } from 'lucide-react';
import type { User, Summary, Script, Page } from '../App';

import { createSummary, extractTextFromFile as extractTextFromFileApi } from '../services/summary';

interface MaterialSummaryProps {
  user: User;
  summaries: Summary[];
  scripts: Script[];
  onBack: () => void;
  onComplete: (summary: Summary) => void;
  onNavigate: (page: Page) => void;
}

type ToastState = { type: 'success' | 'error' | 'info'; message: string } | null;

export function MaterialSummary({ user, summaries, scripts, onBack, onComplete, onNavigate }: MaterialSummaryProps) {
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState<string>('college');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [files, setFiles] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState('');
  const [editedText, setEditedText] = useState('');
  const [summary, setSummary] = useState('');
  const [outline, setOutline] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const draftPromptedRef = useRef(false);

  const mapUserTypeToAudience = (userType: string) => {
    if (userType === 'elementary') return 'elementary';
    if (userType === 'middle') return 'middle';
    if (userType === 'high') return 'high';
    if (userType === 'worker') return 'office';
    return 'college';
  };

  useEffect(() => {
    setAudience(mapUserTypeToAudience(user.userType));
  }, [user.userType]);

  // ✅ draft 복원 팝업 (1번만)
  useEffect(() => {
    if (draftPromptedRef.current) return;
    draftPromptedRef.current = true;

    const draft = localStorage.getItem('prepnote_summary_draft');
    if (!draft) return;

    try {
      const parsed = JSON.parse(draft);
      if (!parsed?.title && !parsed?.editedText && !parsed?.extractedText) return;

      const ok = window.confirm('이전에 작성하던 내용이 있습니다. 불러올까요?');
      if (ok) {
        setTitle(parsed.title || '');
        setExtractedText(parsed.extractedText || '');
        setEditedText(parsed.editedText || '');
        setToast({ type: 'info', message: '이전 작성 내용을 불러왔습니다.' });
      } else {
        localStorage.removeItem('prepnote_summary_draft');
      }
    } catch {
      localStorage.removeItem('prepnote_summary_draft');
    }
  }, []);

  // ✅ draft 자동 저장
  useEffect(() => {
    localStorage.setItem(
      'prepnote_summary_draft',
      JSON.stringify({ title, extractedText, editedText })
    );
  }, [title, extractedText, editedText]);

  const handleFilesChange = async (newFiles: File[]) => {
    setFiles(newFiles);
    if (!newFiles.length) return;

    const file = newFiles[0];
    setToast(null);

    try {
      setIsExtracting(true);
      const extracted = await extractTextFromFileApi(file);
      const text = (extracted?.text ?? '').trim();

      if (!text) {
        setToast({
          type: 'error',
          message: '텍스트를 추출하지 못했습니다. (이미지/스캔 문서면 어려울 수 있어요)',
        });
        return;
      }

      setExtractedText(text);
      setEditedText(text);
      setToast({ type: 'success', message: '텍스트 추출 완료' });
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.message || '텍스트 추출 실패';
      setToast({ type: 'error', message: msg });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSummarize = async () => {
    if (!title || !editedText) {
      setToast({ type: 'error', message: '제목과 내용을 입력/추출해주세요.' });
      return;
    }

    setIsSummarizing(true);
    setToast(null);

    try {
      const data = await createSummary({
        title,
        text: editedText,
        options: { length, audience: audience as any },
      });

      setSummary(data.summary || '');
      setOutline(Array.isArray(data.outline) ? data.outline : []);
      setToast({ type: 'success', message: '요약 생성 완료' });
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.message || '요약 생성 실패';
      setToast({ type: 'error', message: msg });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSave = () => {
    // ✅ 핵심 수정: slideStructure → outline
    const newSummary: Summary = {
      id: Math.random().toString(36).slice(2, 11),
      title,
      content: summary,
      outline, // ✅ 이걸로 저장해야 App.tsx/History 흐름이 안 깨짐
      createdAt: new Date(),
    };

    onComplete(newSummary);
    localStorage.removeItem('prepnote_summary_draft');
    setToast({ type: 'success', message: '요약 저장 완료' });
  };

  const handleClearDraft = () => {
    localStorage.removeItem('prepnote_summary_draft');
    setTitle('');
    setExtractedText('');
    setEditedText('');
    setSummary('');
    setOutline([]);
    setFiles([]);
    setToast({ type: 'info', message: '작성 내용을 초기화했습니다.' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-foreground mb-2">자료 요약</h1>
          <p className="text-gray-600 dark:text-muted-foreground">
            파일 업로드 후 텍스트를 확인/수정하고 요약을 생성하세요.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onNavigate('history')}>
            <History className="w-4 h-4 mr-2" />
            히스토리
          </Button>
          <Button variant="outline" onClick={handleClearDraft}>
            <Trash2 className="w-4 h-4 mr-2" />
            초기화
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div>
              <Label htmlFor="title">발표 제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="발표 제목을 입력하세요"
              />
            </div>

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
              <Label>추출된 내용</Label>
              {/* ✅ 안정적인 스크롤: Textarea 자체에 height/overflow */}
              <Textarea
                value={extractedText}
                readOnly
                placeholder="추출된 텍스트가 여기에 표시됩니다."
                className="mt-2 h-[260px] overflow-y-auto resize-none rounded-lg border border-gray-200 dark:border-border"
              />
            </div>

            <div>
              <Label>내용 수정</Label>
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="추출된 내용을 필요에 맞게 수정하세요."
                className="mt-2 h-[260px] overflow-y-auto resize-none rounded-lg border border-gray-200 dark:border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>요약 분량</Label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 bg-white dark:bg-card"
                >
                  <option value="short">짧게</option>
                  <option value="medium">보통</option>
                  <option value="long">길게</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSummarize}
                  disabled={isExtracting || isSummarizing || !title || !editedText}
                  className="w-full"
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      요약 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      요약 생성
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-gray-900 dark:text-foreground mb-4">요약 결과</h2>

            {summary ? (
              <>
                <div className="max-h-[520px] overflow-y-auto rounded-lg border border-gray-200 dark:border-border p-4 bg-white dark:bg-card">
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-foreground">
                    {summary}
                  </pre>
                </div>

                {outline.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-gray-900 dark:text-foreground mb-2">추천 목차</h3>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-muted-foreground space-y-1">
                      {outline.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    저장하고 완료
                  </Button>
                  <Button variant="outline" onClick={() => setEditedText(extractedText)}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    수정 되돌리기
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center p-12 text-gray-500 dark:text-muted-foreground">
                요약을 생성하세요. 제목/내용 입력 후 “요약 생성” 버튼을 누르면 됩니다.
              </div>
            )}
          </Card>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}

import { useState, type ChangeEvent } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Upload,
  Loader2,
  Download,
  Plus,
  Trash2,
  Image as ImageIcon,
  Layout,
} from 'lucide-react';
import type { User, Summary, Script } from '../App';

interface PPTCreatorProps {
  user: User;
  summaries: Summary[];
  scripts: Script[];
  onComplete: (ppt: PPTPresentation) => void;
}

export interface PPTPresentation {
  id: string;
  title: string;
  sourceId?: string;
  slides: PPTSlide[];
  theme: string;
  createdAt: Date;
}

export interface PPTSlide {
  id: string;
  type: 'title' | 'content' | 'image' | 'closing';
  title: string;
  content?: string;
  bulletPoints?: string[];
  imageUrl?: string;
}

type InputMethod = 'upload' | 'summary' | 'script' | 'manual';

export function PPTCreator({ user, summaries, scripts, onComplete }: PPTCreatorProps) {
  const [inputMethod, setInputMethod] = useState<InputMethod>('manual');
  const [title, setTitle] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [theme, setTheme] = useState('modern');
  const [slides, setSlides] = useState<PPTSlide[]>([
    { id: '1', type: 'title', title: '', content: '' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const themes = [
    { id: 'modern', name: '모던', color: 'bg-gradient-to-br from-blue-500 to-purple-600' },
    { id: 'minimal', name: '미니멀', color: 'bg-gradient-to-br from-gray-800 to-gray-600' },
    { id: 'vibrant', name: '비비드', color: 'bg-gradient-to-br from-pink-500 to-orange-500' },
    { id: 'professional', name: '프로페셔널', color: 'bg-gradient-to-br from-indigo-600 to-blue-700' },
  ];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const nextTitle = file.name.replace(/\.[^/.]+$/, '');
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setTitle(nextTitle);
      generateSlidesFromText(text, nextTitle);
    };
    reader.readAsText(file);
  };

  const handleSourceSelect = (sourceId: string, type: 'summary' | 'script') => {
    setSelectedSource(sourceId);

    if (type === 'summary') {
      const summary = summaries.find((s) => s.id === sourceId);
      if (!summary) return;

      setTitle(summary.title);
      generateSlidesFromText(summary.content, summary.title);
      return;
    }

    const script = scripts.find((s) => s.id === sourceId);
    if (!script) return;

    setTitle(script.title);
    generateSlidesFromText(script.content.join('\n\n'), script.title);
  };

  // ✅ title 비동기 문제 방지: nextTitle을 인자로 받음
  const generateSlidesFromText = (text: string, nextTitle?: string) => {
    setIsGenerating(true);

    setTimeout(() => {
      const newSlides: PPTSlide[] = [
        {
          id: '1',
          type: 'title',
          title: nextTitle || title || '발표 제목',
          content: '부제: AI 기반 발표 준비',
        },
        {
          id: '2',
          type: 'content',
          title: '목차',
          bulletPoints: ['주제 소개', '핵심 내용', '분석 결과', '결론 및 시사점'],
        },
        { id: '3', type: 'content', title: '핵심 내용', content: (text || '').slice(0, 200) + '...' },
        { id: '4', type: 'closing', title: '감사합니다', content: 'Q&A 시간' },
      ];

      setSlides(newSlides);
      setIsGenerating(false);
    }, 800);
  };

  const addSlide = (type: PPTSlide['type']) => {
    const newSlide: PPTSlide = {
      id: Date.now().toString(),
      type,
      title: type === 'title' ? '제목 슬라이드' : type === 'closing' ? '감사합니다' : '새 슬라이드',
      content: '',
      bulletPoints: type === 'content' ? [''] : undefined,
    };
    setSlides((prev) => [...prev, newSlide]);
  };

  const updateSlide = (id: string, updates: Partial<PPTSlide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSlide = (id: string) => {
    setSlides((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  };

  const addBulletPoint = (slideId: string) => {
    const slide = slides.find((s) => s.id === slideId);
    if (!slide?.bulletPoints) return;
    updateSlide(slideId, { bulletPoints: [...slide.bulletPoints, ''] });
  };

  const updateBulletPoint = (slideId: string, index: number, value: string) => {
    const slide = slides.find((s) => s.id === slideId);
    if (!slide?.bulletPoints) return;

    const next = [...slide.bulletPoints];
    next[index] = value;
    updateSlide(slideId, { bulletPoints: next });
  };

  const removeBulletPoint = (slideId: string, index: number) => {
    const slide = slides.find((s) => s.id === slideId);
    if (!slide?.bulletPoints || slide.bulletPoints.length <= 1) return;

    const next = slide.bulletPoints.filter((_, i) => i !== index);
    updateSlide(slideId, { bulletPoints: next });
  };

  const handleGenerate = () => {
    const ppt: PPTPresentation = {
      id: Math.random().toString(36).slice(2, 11),
      title,
      sourceId: selectedSource || undefined,
      slides,
      theme,
      createdAt: new Date(),
    };
    onComplete(ppt);
  };

  const handleDownloadPPT = (format: 'ppt' | 'pptx') => {
    const pptText = slides
      .map((slide, idx) => {
        let slideText = `\n슬라이드 ${idx + 1}: ${slide.title}\n${'='.repeat(50)}\n\n`;

        if (slide.content) slideText += `${slide.content}\n`;

        if (slide.bulletPoints && slide.bulletPoints.length > 0) {
          slideText += `\n${slide.bulletPoints.map((p) => `• ${p}`).join('\n')}\n`;
        }

        if (slide.imageUrl) slideText += `\n[이미지: ${slide.imageUrl}]\n`;

        return slideText;
      })
      .join('\n');

    const fullContent = `${title}\n${'='.repeat(50)}\n테마: ${theme}\n생성일: ${new Date().toLocaleString()}\n\n${pptText}`;

    const element = document.createElement('a');
    const file = new Blob([fullContent], { type: 'application/vnd.ms-powerpoint' });
    element.href = URL.createObjectURL(file);
    element.download = `${title}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">PPT 제작</h1>
        <p className="text-gray-600">AI가 자동으로 프레젠테이션을 생성하거나 직접 편집할 수 있습니다.</p>
      </div>

      {/* Input Method */}
      <Card className="p-6">
        <h2 className="text-gray-900 mb-4">자료 선택</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <Button variant={inputMethod === 'manual' ? 'default' : 'outline'} onClick={() => setInputMethod('manual')} className="w-full">
            직접 작성
          </Button>
          <Button variant={inputMethod === 'upload' ? 'default' : 'outline'} onClick={() => setInputMethod('upload')} className="w-full">
            파일 업로드
          </Button>
          <Button variant={inputMethod === 'summary' ? 'default' : 'outline'} onClick={() => setInputMethod('summary')} className="w-full" disabled={summaries.length === 0}>
            기존 요약
          </Button>
          <Button variant={inputMethod === 'script' ? 'default' : 'outline'} onClick={() => setInputMethod('script')} className="w-full" disabled={scripts.length === 0}>
            기존 대본
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">발표 제목</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="PPT 제목을 입력하세요" />
          </div>

          {inputMethod === 'upload' && (
            <div>
              <Label htmlFor="file">파일 업로드</Label>
              <div className="mt-1">
                <label
                  htmlFor="file"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">클릭하여 파일을 업로드하세요</p>
                  </div>
                  <input id="file" type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          )}

          {inputMethod === 'summary' && (
            <div>
              <Label htmlFor="summary">기존 요약 선택</Label>
              <select
                id="summary"
                value={selectedSource}
                onChange={(e) => handleSourceSelect(e.target.value, 'summary')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
              >
                <option value="">요약을 선택하세요</option>
                {summaries.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} - {new Date(s.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {inputMethod === 'script' && (
            <div>
              <Label htmlFor="script">기존 대본 선택</Label>
              <select
                id="script"
                value={selectedSource}
                onChange={(e) => handleSourceSelect(e.target.value, 'script')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
              >
                <option value="">대본을 선택하세요</option>
                {scripts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} - {new Date(s.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* Theme Selection */}
      <Card className="p-6">
        <h2 className="text-gray-900 mb-4">테마 선택</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((t) => (
            <div
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                theme === t.id ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'
              }`}
            >
              <div className={`${t.color} h-24 flex items-center justify-center text-white`}>
                <Layout className="w-8 h-8" />
              </div>
              <div className="p-2 text-center bg-white">
                <p className="text-gray-700">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Slides Editor */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h2 className="text-gray-900">슬라이드 편집</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => addSlide('content')} size="sm" variant="outline" className="flex-1 sm:flex-none">
              <Plus className="w-4 h-4 mr-2" />
              컨텐츠 슬라이드
            </Button>
            <Button onClick={() => addSlide('image')} size="sm" variant="outline" className="flex-1 sm:flex-none">
              <ImageIcon className="w-4 h-4 mr-2" />
              이미지 슬라이드
            </Button>
          </div>
        </div>

        {isGenerating ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">AI가 슬라이드를 생성하는 중...</p>
          </div>
        ) : (
          <div className="max-h-[520px] overflow-y-auto pr-2 space-y-4">
            {slides.map((slide, index) => (
              <div key={slide.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">슬라이드 {index + 1}</span>
                    <span className="text-gray-500 px-2 py-1 bg-white rounded border border-gray-200">
                      {slide.type === 'title' ? '제목' : slide.type === 'content' ? '내용' : slide.type === 'image' ? '이미지' : '마무리'}
                    </span>
                  </div>
                  {slides.length > 1 && (
                    <Button onClick={() => deleteSlide(slide.id)} size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>제목</Label>
                    <Input value={slide.title} onChange={(e) => updateSlide(slide.id, { title: e.target.value })} placeholder="슬라이드 제목" />
                  </div>

                  {slide.type === 'content' && slide.bulletPoints && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>요점</Label>
                        <Button onClick={() => addBulletPoint(slide.id)} size="sm" variant="ghost">
                          <Plus className="w-3 h-3 mr-1" />
                          추가
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {slide.bulletPoints.map((point, i) => (
                          <div key={i} className="flex gap-2">
                            <Input value={point} onChange={(e) => updateBulletPoint(slide.id, i, e.target.value)} placeholder={`요점 ${i + 1}`} />
                            {slide.bulletPoints.length > 1 && (
                              <Button onClick={() => removeBulletPoint(slide.id, i)} size="sm" variant="ghost" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(slide.type === 'title' || slide.type === 'closing') && (
                    <div>
                      <Label>부제/설명</Label>
                      <Textarea value={slide.content || ''} onChange={(e) => updateSlide(slide.id, { content: e.target.value })} placeholder="부제 또는 설명" rows={2} />
                    </div>
                  )}

                  {slide.type === 'image' && (
                    <div>
                      <Label>이미지 URL 또는 설명</Label>
                      <Input value={slide.imageUrl || ''} onChange={(e) => updateSlide(slide.id, { imageUrl: e.target.value })} placeholder="이미지 URL 또는 이미지 설명" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Actions */}
      <Card className="p-6 bg-orange-50 border-orange-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-gray-900 mb-1">PPT 생성 준비 완료</h3>
            <p className="text-gray-600">
              총 {slides.length}개의 슬라이드 •{' '}
              {theme === 'modern' ? '모던' : theme === 'minimal' ? '미니멀' : theme === 'vibrant' ? '비비드' : '프로페셔널'} 테마
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button onClick={handleGenerate} disabled={!title || slides.length === 0} variant="outline" className="flex-1 sm:flex-none">
              저장하기
            </Button>

            <div className="relative flex-1 sm:flex-none">
              <Button onClick={() => setShowDownloadMenu(!showDownloadMenu)} disabled={!title || slides.length === 0} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                PPT 다운로드
              </Button>

              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left rounded-t-md"
                    onClick={() => {
                      handleDownloadPPT('ppt');
                      setShowDownloadMenu(false);
                    }}
                  >
                    PPT 형식 (.ppt)
                  </button>
                  <button
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left rounded-b-md"
                    onClick={() => {
                      handleDownloadPPT('pptx');
                      setShowDownloadMenu(false);
                    }}
                  >
                    PPTX 형식 (.pptx)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

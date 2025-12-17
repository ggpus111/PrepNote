import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Toast } from './ui/Toast';
import { EmptyState } from './ui/EmptyState';
import { MessageSquare, Sparkles, Loader2, Download, Upload, HelpCircle } from 'lucide-react';
import type { User, Summary, Script, QASet } from '../App';

interface QAGeneratorProps {
  user: User;
  summaries: Summary[];
  scripts: Script[];
  onBack: () => void;
  onComplete: (qa: QASet) => void;
}

type InputMethod = 'upload' | 'summary' | 'script';

export function QAGenerator({ user, summaries, scripts, onBack, onComplete }: QAGeneratorProps) {
  const [inputMethod, setInputMethod] = useState<InputMethod>('summary');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qaList, setQAList] = useState<Array<{ question: string; answer: string }>>([]);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text.slice(0, 5000));
      };
      reader.readAsText(file);
    }
  };

  const handleSummarySelect = (summaryId: string) => {
    const summary = summaries.find(s => s.id === summaryId);
    if (summary) {
      setSelectedSource(summaryId);
      setTitle(summary.title);
      setContent(summary.content);
    }
  };

  const handleScriptSelect = (scriptId: string) => {
    const script = scripts.find(s => s.id === scriptId);
    if (script) {
      setSelectedSource(scriptId);
      setTitle(script.title);
      setContent(script.content.join('\n\n'));
    }
  };

  const handleGenerateQA = async () => {
    if (!title || !content) return;
    
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockQA = [
      {
        question: `${title}의 핵심 내용을 간단히 설명해주실 수 있나요?`,
        answer: `핵심 내용은 크게 세 가지로 요약할 수 있습니다. 첫째, 현재 상황에 대한 정확한 분석입니다. 둘째, 이를 해결하기 위한 구체적인 방법론 제시입니다. 셋째, 기대되는 효과와 향후 발전 방향입니다. 이를 통해 실질적인 개선을 이루고자 합니다.`,
      },
      {
        question: '이 방법이 기존 접근법과 다른 점은 무엇인가요?',
        answer: `기존 접근법과의 가장 큰 차이점은 데이터 기반의 체계적인 분석을 통해 더욱 정확한 결과를 도출한다는 점입니다. 또한 실시간 피드백 시스템을 통해 지속적인 개선이 가능하며, 사용자 중심의 설계로 접근성이 높습니다.`,
      },
      {
        question: '실제 적용 시 예상되는 어려움은 없나요?',
        answer: `초기 도입 단계에서는 시스템 구축과 사용자 교육에 시간이 필요할 수 있습니다. 하지만 단계적 접근 방식을 통해 이러한 어려움을 최소화할 수 있으며, 충분한 테스트 기간을 거쳐 안정성을 확보할 계획입니다. 또한 지속적인 기술 지원을 제공할 예정입니다.`,
      },
      {
        question: '이 프로젝트의 장기적인 비전은 무엇인가요?',
        answer: `장기적으로는 더 많은 사용자들이 쉽게 접근하고 활용할 수 있는 플랫폼으로 발전시키는 것이 목표입니다. 지속적인 기능 개선과 더불어 다양한 분야로 확장하여 더 큰 가치를 창출하고자 합니다. 향후 AI 기술의 발전과 함께 더욱 고도화된 서비스를 제공할 계획입니다.`,
      },
      {
        question: '유사한 사례나 선행 연구가 있나요?',
        answer: `국내외에서 유사한 시도들이 있었으며, 이를 참고하여 더 나은 방향으로 개선했습니다. 특히 해외 사례에서는 성공적인 결과를 보인 바 있어 실현 가능성이 높습니다. 다만 우리의 접근법은 현지 상황에 최적화되어 있다는 점에서 차별성을 갖습니다.`,
      },
    ];
    
    setQAList(mockQA);
    setIsGenerating(false);
  };

  const handleSave = () => {
    const newQA: QASet = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      sourceId: selectedSource || undefined,
      questions: qaList,
      createdAt: new Date(),
    };
    onComplete(newQA);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gray-900 mb-2">예상 Q&A 생성</h1>
        <p className="text-gray-600">
          자료를 업로드하거나 기존 요약/대본을 선택하여 예상 질문과 답변을 생성하세요.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-gray-900 mb-4">입력 방법 선택</h2>
          <div className="grid grid-cols-3 gap-2 mb-6">
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
            <Button
              variant={inputMethod === 'script' ? 'default' : 'outline'}
              onClick={() => setInputMethod('script')}
              className="w-full"
              disabled={scripts.length === 0}
            >
              기존 대본
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
                  <Label htmlFor="file">파일 업로드</Label>
                  <div className="mt-1">
                    <label
                      htmlFor="file"
                      className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          클릭하여 파일을 업로드하세요
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
                </div>
                <div>
                  <Label htmlFor="content">내용</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="발표 내용을 입력하세요..."
                    rows={5}
                  />
                </div>
              </>
            )}

            {inputMethod === 'summary' && (
              <div>
                <Label htmlFor="summary">기존 요약 선택</Label>
                <select
                  id="summary"
                  value={selectedSource}
                  onChange={(e) => handleSummarySelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="">요약을 선택하세요</option>
                  {summaries.map((summary) => (
                    <option key={summary.id} value={summary.id}>
                      {summary.title} - {new Date(summary.createdAt).toLocaleDateString()}
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
                  onChange={(e) => handleScriptSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="">대본을 선택하세요</option>
                  {scripts.map((script) => (
                    <option key={script.id} value={script.id}>
                      {script.title} - {new Date(script.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              onClick={handleGenerateQA}
              disabled={!title || !content || isGenerating || qaList.length > 0}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Q&A 생성하기
                </>
              )}
            </Button>
          </div>
        </Card>

        {qaList.length === 0 && !isGenerating && (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">예상 Q&A를 생성하세요</h3>
            <p className="text-gray-600">
              입력 방법을 선택하고<br />
              AI가 발표 내용을 분석하여<br />
              예상 질문과 답변을 생성합니다
            </p>
          </Card>
        )}

        {qaList.length > 0 && (
          <>
            <div className="space-y-4">
              {qaList.map((qa, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      Q{index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-3">{qa.question}</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{qa.answer}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="text-gray-900 mb-3">답변 팁</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 질문을 정확히 이해했는지 확인하세요</li>
                <li>• 핵심 내용을 간결하게 먼저 전달하세요</li>
                <li>• 구체적인 사례나 데이터로 뒷받침하세요</li>
                <li>• 모르는 것은 솔직히 인정하고 추후 답변을 약속하세요</li>
                <li>• 청중의 관점에서 이해하기 쉽게 설명하세요</li>
              </ul>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                저장하고 완료
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  다운로드
                </Button>
                {showDownloadMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left rounded-t-md"
                      onClick={() => {
                        const qaText = qaList.map((qa, idx) => `Q${idx + 1}. ${qa.question}\n\nA${idx + 1}. ${qa.answer}\n\n`).join('\n');
                        const element = document.createElement('a');
                        const file = new Blob([`${title}\n\n예상 Q&A\n\n${qaText}`], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${title}_QA.txt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                        setShowDownloadMenu(false);
                      }}
                    >
                      TXT로 저장
                    </button>
                    <button
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => {
                        const qaText = qaList.map((qa, idx) => `Q${idx + 1}. ${qa.question}\n\nA${idx + 1}. ${qa.answer}\n\n`).join('\n');
                        const element = document.createElement('a');
                        const file = new Blob([`${title}\n\n예상 Q&A\n\n${qaText}`], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${title}_QA.docx`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                        setShowDownloadMenu(false);
                      }}
                    >
                      DOCX로 저장
                    </button>
                    <button
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left rounded-b-md"
                      onClick={() => {
                        const qaText = qaList.map((qa, idx) => `Q${idx + 1}. ${qa.question}\n\nA${idx + 1}. ${qa.answer}\n\n`).join('\n');
                        const element = document.createElement('a');
                        const file = new Blob([`${title}\n\n예상 Q&A\n\n${qaText}`], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${title}_QA.pdf`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                        setShowDownloadMenu(false);
                      }}
                    >
                      PDF로 저장
                    </button>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setQAList([]);
                }}
              >
                다시 생성
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
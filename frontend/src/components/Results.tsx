import { Button } from './ui/button';
import { Card } from './ui/card';
import { Trophy } from 'lucide-react';
import type { User, RehearsalResult } from '../App';

interface ResultsProps {
  user: User;
  rehearsal: RehearsalResult;
  onBack: () => void;
}

export function Results({ user, rehearsal, onBack }: ResultsProps) {
  const { score, speed, repeatWords, timeAccuracy, feedback, title } = rehearsal;

  const getScoreColor = (value: number) => {
    if (value >= 85) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (value: number) => {
    if (value >= 85) return '우수';
    if (value >= 70) return '양호';
    return '개선 필요';
  };

  const metrics = [
    { label: '말하기 속도', value: speed, description: '적정 속도 대비', icon: '🗣️' },
    { label: '반복어 사용', value: repeatWords, description: '반복어 최소화', icon: '🔄' },
    { label: '시간 정확도', value: timeAccuracy, description: '목표 시간 준수', icon: '⏱️' },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8 text-center">
        <Trophy className="w-16 h-16 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
        <h1 className="text-gray-900 dark:text-foreground mb-2">발표 분석 결과</h1>
        <p className="text-gray-600 dark:text-muted-foreground">{title}</p>
      </div>

      <Card className="p-8 mb-8 text-center">
        <p className="text-gray-600 dark:text-muted-foreground mb-2">종합 점수</p>
        <div className="flex items-center justify-center gap-4">
          <span className={`text-6xl ${getScoreColor(score)}`}>{score}</span>
          <span className="text-gray-400 dark:text-muted-foreground">/</span>
          <span className="text-gray-400 dark:text-muted-foreground">100</span>
        </div>
        <p className={`mt-4 ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
      </Card>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">{metric.icon}</div>
              <h3 className="text-gray-900 dark:text-foreground mb-2">{metric.label}</h3>
              <p className="text-gray-600 dark:text-muted-foreground mb-4">{metric.description}</p>
              <div className="flex items-center justify-center gap-2">
                <span className={`text-3xl ${getScoreColor(metric.value)}`}>{metric.value}</span>
                <span className="text-gray-400 dark:text-muted-foreground">/100</span>
              </div>
              <p className={`mt-2 ${getScoreColor(metric.value)}`}>{getScoreLabel(metric.value)}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-gray-900 dark:text-foreground mb-6">세부 점수</h2>
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 dark:text-foreground/90">{metric.label}</span>
                <span className={`${getScoreColor(metric.value)}`}>{metric.value}점</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-border rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    metric.value >= 85
                      ? 'bg-green-600'
                      : metric.value >= 70
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ✅ 피드백만 내부 스크롤 */}
      <Card className="p-6 mb-8">
        <h2 className="text-gray-900 dark:text-foreground mb-4">AI 피드백</h2>
        <div className="max-h-[420px] overflow-y-auto rounded-lg bg-gray-50 dark:bg-muted p-4">
          <pre className="whitespace-pre-wrap text-gray-700 dark:text-foreground/90 leading-relaxed">
            {feedback}
          </pre>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-gray-900 mb-4">다음 단계</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-gray-900 mb-2">개선하기</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 피드백을 참고하여 다시 연습하기</li>
              <li>• 부족한 부분을 집중적으로 개선하기</li>
              <li>• 다양한 상황을 가정하여 연습하기</li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-900 mb-2">발전시키기</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 더 많은 발표 경험 쌓기</li>
              <li>• 다른 주제로 연습해보기</li>
              <li>• 피드백을 바탕으로 성장 추적하기</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="flex gap-4 mt-8">
        <Button onClick={onBack} className="flex-1">대시보드로 돌아가기</Button>
        <Button variant="outline" className="flex-1">다시 연습하기</Button>
      </div>
    </div>
  );
}

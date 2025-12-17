import { Button } from './ui/button';
import { Card } from './ui/card';
import { FileText, Mic, MessageSquare, PlusCircle, BarChart3, Clock, Presentation, Bot, Sparkles, TrendingUp, HelpCircle, Award, Target } from 'lucide-react';
import type { User, Presentation as PresentationType, Summary, Script, RehearsalResult, QASet, Page } from '../App';
import type { PPTPresentation } from './PPTCreator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  user: User;
  presentations: PresentationType[];
  summaries: Summary[];
  scripts: Script[];
  rehearsals: RehearsalResult[];
  qaSets: QASet[];
  ppts: PPTPresentation[];
  onLogout: () => void;
  onNavigate: (page: Page) => void;
  onSelectPresentation: (presentation: PresentationType) => void;
}

export function Dashboard({ user, summaries, scripts, rehearsals, qaSets, ppts, onLogout, onNavigate }: DashboardProps) {
  const quickActions = [
    {
      icon: Bot,
      title: 'AI 챗봇',
      description: '발표 준비에 대해 무엇이든 물어보세요',
      action: () => onNavigate('chatbot'),
      color: 'bg-card border border-border hover:border-primary/30',
      iconColor: 'text-primary',
    },
    {
      icon: FileText,
      title: '자료 요약',
      description: 'AI가 발표 자료를 요약해드립니다',
      action: () => onNavigate('summary'),
      color: 'bg-card border border-border hover:border-primary/30',
      iconColor: 'text-primary',
    },
    {
      icon: MessageSquare,
      title: '대본 작성',
      description: '발표 대본을 자동으로 생성합니다',
      action: () => onNavigate('script'),
      color: 'bg-card border border-border hover:border-primary/30',
      iconColor: 'text-primary',
    },
    {
      icon: Mic,
      title: '리허설 연습',
      description: '발표를 연습하고 피드백을 받으세요',
      action: () => onNavigate('rehearsal'),
      color: 'bg-card border border-border hover:border-primary/30',
      iconColor: 'text-primary',
    },
    {
      icon: HelpCircle,
      title: 'Q&A 준비',
      description: '예상 질문과 답변을 준비합니다',
      action: () => onNavigate('qa'),
      color: 'bg-card border border-border hover:border-primary/30',
      iconColor: 'text-primary',
    },
    {
      icon: Presentation,
      title: 'PPT 제작',
      description: 'AI가 프레젠테이션을 만들어드립니다',
      action: () => onNavigate('ppt'),
      color: 'bg-card border border-border hover:border-primary/30',
      iconColor: 'text-primary',
    },
  ];

  const getUserTypeLabel = (type: string) => {
    const labels = {
      elementary: '초등학생',
      middle: '중학생',
      high: '고등학생',
      university: '대학생',
      worker: '직장인',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalItems = summaries.length + scripts.length + rehearsals.length + qaSets.length + ppts.length;
  const avgScore = rehearsals.length > 0 
    ? Math.round(rehearsals.reduce((sum, r) => sum + r.score, 0) / rehearsals.length) 
    : 0;

  // 활동 통계 데이터
  const activityData = [
    { name: '자료 요약', value: summaries.length, color: '#2685d8' },
    { name: '대본 작성', value: scripts.length, color: '#1e6bb8' },
    { name: '리허설', value: rehearsals.length, color: '#3a9ee5' },
    { name: 'Q&A', value: qaSets.length, color: '#5eb5ed' },
    { name: 'PPT', value: ppts.length, color: '#7dc8f2' },
  ];

  // 리허설 점수 추이 데이터
  const scoreData = rehearsals.slice(-5).map((r, index) => ({
    name: `${index + 1}회`,
    점수: r.score,
  }));

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 sm:p-8 border border-primary/20 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 dark:text-foreground mb-2">안녕하세요, {user.name}님! 👋</h1>
            <p className="text-gray-600 dark:text-muted-foreground">오늘도 멋진 발표를 준비해볼까요?</p>
          </div>
          <Button 
            onClick={() => onNavigate('chatbot')} 
            className="bg-primary text-white hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI 챗봇 시작하기
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-card border-border hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">전체 작업</p>
              <p className="text-foreground">{totalItems}개</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-card border-border hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">평균 점수</p>
              <p className="text-foreground">{avgScore > 0 ? `${avgScore}점` : '-'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-card border-border hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">대본</p>
              <p className="text-foreground">{scripts.length}개</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-card border-border hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Presentation className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">PPT</p>
              <p className="text-foreground">{ppts.length}개</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4">빠른 시작</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className={`p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 ${action.color}`}
              onClick={action.action}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">{action.title}</h3>
                  <p className="text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Distribution */}
        <Card className="p-6">
          <h2 className="text-gray-900 dark:text-foreground mb-6">활동 분포</h2>
          {activityData.every(item => item.value === 0) ? (
            <div className="h-64 sm:h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 dark:text-muted-foreground mx-auto mb-3" />
                <p className="text-gray-500 dark:text-muted-foreground">아직 활동 내역이 없습니다</p>
                <p className="text-gray-400 dark:text-muted-foreground/70 text-sm mt-1">작업을 시작해보세요!</p>
              </div>
            </div>
          ) : (
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent: number }) => 
                      window.innerWidth >= 640 ? `${name} ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={window.innerWidth >= 640 ? "70%" : "60%"}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Rehearsal Score Trend */}
        {scoreData.length > 0 && (
          <Card className="p-6">
            <h2 className="text-gray-900 dark:text-foreground mb-6">리허설 점수 추이</h2>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: window.innerWidth >= 640 ? 12 : 10 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: window.innerWidth >= 640 ? 12 : 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ddd',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="점수" 
                    stroke="#2685d8" 
                    strokeWidth={2}
                    dot={{ fill: '#2685d8', r: window.innerWidth >= 640 ? 4 : 3 }}
                    activeDot={{ r: window.innerWidth >= 640 ? 6 : 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2>최근 활동</h2>
          <Button variant="outline" onClick={() => onNavigate('history')}>
            전체 보기
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Recent Summaries */}
          {summaries.length > 0 && (
            <Card className="p-6 bg-card border-border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3>최근 요약</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onNavigate('summary')}>
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {summaries.slice(-3).reverse().map((summary) => (
                  <div key={summary.id} className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                    <h4 className="mb-1">{summary.title}</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{formatDate(summary.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Scripts */}
          {scripts.length > 0 && (
            <Card className="p-6 bg-card border-border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h3>최근 대본</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onNavigate('script')}>
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {scripts.slice(-3).reverse().map((script) => (
                  <div key={script.id} className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                    <h4 className="mb-1">{script.title}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(script.createdAt)}</span>
                      </div>
                      <span className="text-muted-foreground">{script.speakers}명</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Rehearsals */}
          {rehearsals.length > 0 && (
            <Card className="p-6 bg-card border-border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-primary" />
                  <h3>최근 리허설</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onNavigate('rehearsal')}>
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {rehearsals.slice(-3).reverse().map((rehearsal) => (
                  <div key={rehearsal.id} className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                    <h4 className="mb-1">{rehearsal.title}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(rehearsal.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3 text-primary" />
                        <span className="text-primary">{rehearsal.score}점</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recent PPTs */}
          {ppts.length > 0 && (
            <Card className="p-6 bg-card border-border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Presentation className="w-5 h-5 text-primary" />
                  <h3>최근 PPT</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onNavigate('ppt')}>
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {ppts.slice(-3).reverse().map((ppt) => (
                  <div key={ppt.id} className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                    <h4 className="mb-1">{ppt.title}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(ppt.createdAt)}</span>
                      </div>
                      <span className="text-muted-foreground">{ppt.slides.length}개 슬라이드</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Empty State */}
      {totalItems === 0 && (
        <Card className="p-12 text-center bg-card border-border">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="mb-2">발표 준비를 시작해보세요!</h3>
          <p className="text-muted-foreground mb-6">
            AI 챗봇에게 물어보거나 원하는 기능을 선택해주세요.
          </p>
          <Button onClick={() => onNavigate('chatbot')}>
            <Bot className="w-4 h-4 mr-2" />
            AI 챗봇 시작하기
          </Button>
        </Card>
      )}
    </div>
  );
}

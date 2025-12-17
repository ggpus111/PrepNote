import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Send, Bot, User as UserIcon, Sparkles, FileText, MessageSquare, Mic, HelpCircle, Presentation } from 'lucide-react';
import type { User } from '../App';

interface ChatbotProps {
  user: User;
  onNavigate: (page: string, context?: any) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function Chatbot({ user, onNavigate }: ChatbotProps) {
  // Get chatbot tone greeting based on user preference
  const getToneGreeting = () => {
    const tone = user.chatbotTone || 'friendly';
    switch(tone) {
      case 'formal':
        return `안녕하십니까, ${user.name}님.\n\n저는 PrepNote AI 어시스턴트입니다. 발표 준비와 관련하여 필요하신 사항이 있으시면 말씀해 주십시오.`;
      case 'casual':
        return `안녕! ${user.name}님 😊\n\nPrepNote AI 어시스턴트야. 발표 준비할 때 궁금한 거 편하게 물어봐!`;
      case 'professional':
        return `안녕하세요, ${user.name}님.\n\n저는 PrepNote AI 어시스턴트입니다. 발표 준비에 필요한 사항을 도와드리겠습니다.`;
      default: // friendly
        return `안녕하세요, ${user.name}님! 👋\n\n저는 PrepNote AI 어시스턴트입니다. 발표 준비에 대해 무엇이든 물어보세요!`;
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: getToneGreeting(),
      timestamp: new Date(),
      suggestions: [
        '발표 자료를 요약해줘',
        '대본 작성 도움이 필요해',
        '리허설 팁 알려줘',
        'PPT 구성 제안해줘'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { icon: FileText, label: '자료 요약', color: 'bg-primary/10 text-primary', action: () => onNavigate('summary') },
    { icon: MessageSquare, label: '대본 작성', color: 'bg-primary/10 text-primary', action: () => onNavigate('script') },
    { icon: Mic, label: '리허설', color: 'bg-primary/10 text-primary', action: () => onNavigate('rehearsal') },
    { icon: Presentation, label: 'PPT 제작', color: 'bg-primary/10 text-primary', action: () => onNavigate('ppt') },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('요약') || lowerMessage.includes('자료')) {
      return `발표 자료 요약 기능을 사용하시면 좋을 것 같아요! 📄\n\n다음과 같은 작업을 도와드릴 수 있습니다:\n• PDF, DOCX 파일 자동 요약\n• 핵심 내용 추출\n• 슬라이드 구조 제안\n\n[자료 요약] 버튼을 눌러 시작해보세요!`;
    }
    
    if (lowerMessage.includes('대본') || lowerMessage.includes('스크립트')) {
      return `발표 대본 작성을 도와드리겠습니다! 📝\n\n대본 작성 기능의 특징:\n• 발표자 수에 따른 맞춤 대본\n• 말투 스타일 선택 (격식체/구어체/친근체)\n• 자동 시간 배분\n\n[대본 작성] 버튼으로 시작하실 수 있어요!`;
    }
    
    if (lowerMessage.includes('리허설') || lowerMessage.includes('연습') || lowerMessage.includes('팁')) {
      return `효과적인 발표 리허설 팁을 알려드릴게요! 🎤\n\n리허설 핵심 포인트:\n1. **속도 조절**: 너무 빠르거나 느리지 않게\n2. **눈 맞춤**: 청중과 시선 교환\n3. **반복 연습**: 최소 3회 이상 연습\n4. **피드백 활용**: AI 분석 결과 참고\n\n[리허설 연습] 기능으로 실전처럼 연습해보세요!`;
    }
    
    if (lowerMessage.includes('질문') || lowerMessage.includes('q&a') || lowerMessage.includes('답변')) {
      return `예상 질문 대비가 중요하죠! 💬\n\nQ&A 준비 기능:\n• AI가 발표 내용 기반 예상 질문 생성\n• 각 질문에 대한 답변 제안\n• 추가 질문 대비 팁\n\n[Q&A 준비] 기능을 사용해보세요!`;
    }
    
    if (lowerMessage.includes('ppt') || lowerMessage.includes('슬라이드') || lowerMessage.includes('프레젠테이션')) {
      return `PPT 제작을 도와드리겠습니다! 📊\n\nPPT 제작 기능:\n• 자동 슬라이드 구성\n• 다양한 테마 선택\n• 내용 기반 레이아웃 제안\n• 이미지 및 차트 삽입\n\n[PPT 제작] 기능으로 멋진 프레젠테이션을 만들어보세요!`;
    }

    if (lowerMessage.includes('안녕') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `안녕하세요, ${user.name}님! 😊\n\n발표 준비에 대해 무엇이든 물어보세요. 제가 최선을 다해 도와드리겠습니다!`;
    }

    return `좋은 질문이에요! 발표 준비와 관련된 더 구체적인 내용을 말씀해주시면, 더 정확한 답변을 드릴 수 있습니다.\n\n이런 것들을 물어보실 수 있어요:\n• 발표 자료 요약 방법\n• 효과적인 대본 작성법\n• 리허설 팁과 노하우\n• 예상 질문 준비 방법\n• PPT 디자인 제안`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateAIResponse(input),
      timestamp: new Date(),
      suggestions: [
        '더 자세히 설명해줘',
        '다른 방법도 알려줘',
        '예시를 보여줘',
        '기능 사용법 알려줘'
      ]
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-2xl p-4 sm:p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-foreground text-lg sm:text-xl">PrepNote AI 어시스턴트</h2>
            <p className="text-gray-600 dark:text-muted-foreground text-xs sm:text-sm">발표 준비의 든든한 파트너</p>
          </div>
        </div>
      </div>

      {/* Quick Actions - 모바일에서 스크롤 가능 */}
      <div className="p-3 sm:p-4 bg-card border-b border-border overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:grid sm:grid-cols-4 sm:gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={action.action}
              className="flex-shrink-0 sm:flex-1"
              size="sm"
            >
              <action.icon className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap text-xs sm:text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 bg-background">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 sm:gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-card border border-border'
              }`}
            >
              <p className={`whitespace-pre-wrap text-sm sm:text-base ${
                message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-foreground'
              }`}>
                {message.content}
              </p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {message.suggestions && (
                <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-xs sm:text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 dark:bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 dark:bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 dark:bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 dark:bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 bg-card border-t border-border rounded-b-2xl">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
            className="resize-none min-h-[44px] max-h-32 text-sm sm:text-base"
            rows={1}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isTyping}
            className="h-[44px] px-3 sm:px-4 flex-shrink-0"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI는 실수할 수 있습니다. 중요한 정보는 확인하세요.
        </p>
      </div>
    </div>
  );
}
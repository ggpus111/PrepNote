import { Button } from './ui/button';
import { Card } from './ui/card';
import { FileText, Mic, MessageSquare, Bot, Users, Sparkles, ChevronDown, Check, BarChart3, Clock, Target, TrendingUp, Award, Zap } from 'lucide-react';
import { useState } from 'react';
import logoImage from 'figma:asset/ae5b552081ceb2d5f9f4e15a08861d29a64bcb3a.png';
import { ImageWithFallback } from './figma/ImageWithFallback';
import presentationImage from 'figma:asset/3f9d69ef5a83f5d6759ac88262cb35c6b9530303.png';
import documentsImage from 'figma:asset/7fa4149f56e8a87faa06c49c791beb55ad4ff90b.png';
import scriptImage from 'figma:asset/7720225d5de662f71403526a0e53fe3f44720388.png';

const heroImage = 'https://images.unsplash.com/photo-1707301280425-475534ec3cc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBtZWV0aW5nJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY1ODY3MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function Landing({ onGetStarted, onLogin }: LandingProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  const mainFeatures = [
    {
      icon: FileText,
      title: '발표 자료 요약',
      description: '보고서나 논문을 업로드하면 AI가 발표용 요약본과 슬라이드 구조를 자동으로 생성해드립니다.',
      image: documentsImage,
    },
    {
      icon: Users,
      title: '대본 자동 생성',
      description: '발표자 수와 말투 스타일을 선택하면 각 발표자별로 분배된 대본을 자동으로 작성해드립니다.',
      image: scriptImage,
    },
    {
      icon: Mic,
      title: '리허설 & 피드백',
      description: '실제 발표를 녹음/녹화하고 말 빠르기, 반복어, 시간 정확도 등을 분석하여 점수화합니다.',
      image: presentationImage,
    },
    {
      icon: MessageSquare,
      title: '예상 Q&A 생성',
      description: '발표 주제를 분석하여 예상 질문과 모범 답변을 자동으로 생성해드립니다.',
      image: 'https://images.unsplash.com/photo-1758598305246-2500f540bf40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMHBsYW5uaW5nJTIwZGVzayUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjU4NjUwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  const introFeatures = [
    {
      icon: Bot,
      title: 'AI와 함께 창작하기',
      description: '어떤 발표든, 어떤 자료든 AI에게 물어보고 함께 발표 준비 시작할 수 있습니다.',
    },
    {
      icon: FileText,
      title: '지식을 가져오세요',
      description: 'PDF, 문서 등을 업로드하면 AI가 자동으로 요약하고 발표용 구조로 정리합니다.',
    },
    {
      icon: Users,
      title: '팀과 공유하고 협업하기',
      description: '대본 작성, 슬라이드 제작, Q&A 준비까지 팀원들과 함께 준비할 수 있습니다.',
    },
  ];

  const useCases = [
    {
      title: '대학생',
      description: '과제 발표, 팀 프로젝트, 세미나 등',
      features: ['팀플 대본 자동 분배', '발표 시간 관리', 'Q&A 대비'],
    },
    {
      title: '직장인',
      description: '회의, 보고서 발표, 프레젠테이션',
      features: ['전문적인 요약본', '설득력 있는 대본', '데이터 시각화'],
    },
    {
      title: '취업 준비생',
      description: '면접 발표, 자기소개, PT 면접',
      features: ['자신감 향상', '면접 리허설', '실전 피드백'],
    },
  ];

  const workflow = [
    { icon: FileText, title: '발표 자료 요약', description: '보고서나 논문을 업로드하고 AI가 핵심 내용을 추출합니다' },
    { icon: Users, title: '대본 자동 생성', description: '발표자별로 맞춤형 대본을 자동으로 작성합니다' },
    { icon: Mic, title: '리허설 & 피드백', description: '실전처럼 연습하고 AI 피드백을 받습니다' },
    { icon: MessageSquare, title: '예상 Q&A 생성', description: '발표 주제에 대한 예상 질문과 답변을 준비합니다' },
  ];

  const faqs = [
    {
      question: 'PrepNote는 어떤 서비스인가요?',
      answer: 'PrepNote는 AI 기반 발표 준비 플랫폼입니다. 자료 업로드부터 요약, 대본 작성, 리허설 피드백, Q&A 준비까지 발표의 모든 과정을 AI가 지원합니다.',
    },
    {
      question: '어떤 파일 형식을 지원하나요?',
      answer: 'PDF, Word, PPT, 텍스트 파일 등 다양한 형식을 지원합니다. 파일을 업로드하면 AI가 자동으로 분석하여 발표용 자료로 변환해드립니다.',
    },
    {
      question: '여러 명이 함께 발표하는 경우에도 사용할 수 있나요?',
      answer: '네, 발표자 수를 지정하면 각 발표자별로 대본을 자동으로 분배해드립니다. 팀 프로젝트나 공동 발표에 최적화되어 있습니다.',
    },
    {
      question: '사용 비용은 얼마인가요?',
      answer: 'PrepNote는 스마트콘텐츠학과 딥러닝 프로젝트로 제작된 무료 서비스입니다. 누구나 회원가입 후 모든 기능을 무료로 사용할 수 있습니다.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-border bg-white/95 dark:bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <ImageWithFallback src={logoImage} alt="PrepNote" className="h-7 sm:h-8 w-7 sm:w-8" />
            <span className="text-gray-900 dark:text-foreground text-base sm:text-lg">PrepNote</span>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button 
              variant="ghost" 
              onClick={onLogin} 
              className="text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10"
            >
              로그인
            </Button>
            <Button 
              onClick={onGetStarted} 
              className="bg-primary text-white hover:bg-primary/90 text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10"
            >
              시작하기
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#faf9f8] dark:from-muted/50 to-white dark:to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 sm:py-20 md:py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="space-y-6 sm:space-y-8">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-gray-900 dark:text-foreground">
                    불가능한 발표?
                    <br />
                    <span className="text-primary">가능합니다.</span>
                  </h1>
                  <p className="text-[#353535] dark:text-muted-foreground text-xl sm:text-2xl lg:text-3xl leading-relaxed">
                    AI가 함께하는 완벽한 발표 준비
                  </p>
                  <div className="pt-4 flex justify-center lg:justify-start">
                    <Button
                      size="lg"
                      onClick={onGetStarted}
                      className="w-full sm:w-auto h-14 sm:h-16 text-base sm:text-lg bg-[#020202] dark:bg-foreground hover:bg-[#353535] dark:hover:bg-foreground/90 shadow-lg"
                    >
                      무료로 시작하기
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Image - Desktop Only */}
              <div className="relative hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-border">
                  <ImageWithFallback
                    src={heroImage}
                    alt="Presentation"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout - Stack vertically with center alignment */}
          <div className="lg:hidden flex flex-col items-center gap-10 w-full">
            {/* Features First on Mobile */}
            <div className="w-full space-y-6 sm:space-y-8 flex flex-col items-center">
              {introFeatures.map((feature, index) => (
                <div key={index} className="flex flex-col items-center justify-center text-center w-full max-w-md px-4">
                  <div className="w-11 sm:w-12 h-11 sm:h-12 bg-[#2685d8]/10 dark:bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-5 sm:w-6 h-5 sm:h-6 text-[#2685d8] dark:text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl mb-1.5 text-center text-gray-900 dark:text-foreground">{feature.title}</h3>
                  <p className="text-[#353535] dark:text-muted-foreground text-sm sm:text-base leading-relaxed text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Visual Second on Mobile */}
            <div className="w-full flex justify-center px-4">
              <div className="bg-gradient-to-br from-[#2685d8]/10 to-[#2685d8]/5 dark:from-primary/10 dark:to-primary/5 rounded-3xl p-8 sm:p-12 flex items-center justify-center aspect-square w-full max-w-md">
                <div className="text-center space-y-5">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 bg-[#2685d8] dark:bg-primary rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <Sparkles className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
                  </div>
                  <p className="text-xl sm:text-2xl text-[#353535] dark:text-foreground leading-relaxed px-4 text-center">
                    PrepNote는<br className="sm:hidden" /> AI 기반<br />발표 준비 플랫폼입니다
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original grid layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#2685d8]/10 to-[#2685d8]/5 dark:from-primary/10 dark:to-primary/5 rounded-3xl p-12 flex items-center justify-center aspect-square">
                <div className="text-center space-y-5">
                  <div className="w-20 h-20 bg-[#2685d8] dark:bg-primary rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-2xl text-[#353535] dark:text-foreground leading-relaxed px-4">
                    PrepNote는 AI 기반<br />발표 준비 플랫폼입니다
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Features */}
            <div className="space-y-8">
              {introFeatures.map((feature, index) => (
                <div key={index} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2685d8]/10 dark:bg-primary/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-[#2685d8] dark:text-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-2xl text-gray-900 dark:text-foreground">{feature.title}</h3>
                    <p className="text-[#353535] dark:text-muted-foreground text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 sm:py-20 lg:py-28 bg-[#faf9f8] dark:bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-6">주요 기능</h2>
            <p className="text-[#353535] dark:text-muted-foreground text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
              발표 준비의 모든 과정을 하나의 플랫폼에서
            </p>
          </div>

          {/* Mobile: Stack view */}
          <div className="lg:hidden space-y-8">
            {mainFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow"
                onClick={() => setSelectedFeature(index)}
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <ImageWithFallback
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <feature.icon className="w-6 h-6 text-[#2685d8]" />
                    <h3 className="text-xl sm:text-2xl">{feature.title}</h3>
                  </div>
                  <p className="text-[#353535] dark:text-muted-foreground text-base sm:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop: Side by side */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Feature List */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-8">
                <Sparkles className="w-6 h-6 text-[#2685d8]" />
                <span className="text-[#2685d8]">AI</span>
              </div>
              <h3 className="text-3xl lg:text-4xl mb-12">상상을 현실로 만드는 AI</h3>
              
              <div className="space-y-4">
                {mainFeatures.map((feature, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedFeature(index)}
                    className={`w-full text-left transition-all duration-300 cursor-pointer ${
                      selectedFeature === index
                        ? 'border-l-4 border-[#2685d8] pl-6'
                        : 'border-l-4 border-transparent pl-6 opacity-50 hover:opacity-75'
                    }`}
                  >
                    <h4 className={`text-xl lg:text-2xl mb-2 ${
                      selectedFeature === index ? 'text-[#020202]' : 'text-[#353535]'
                    }`}>
                      {feature.title}
                    </h4>
                    {selectedFeature === index && (
                      <div className="space-y-4 mt-4">
                        <p className="text-[#353535] dark:text-muted-foreground text-lg leading-relaxed">
                          {feature.description}
                        </p>
                        <Button onClick={onGetStarted} className="mt-4">
                          지금 써보기
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Feature Image */}
            <div className="lg:sticky lg:top-32">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 aspect-[4/3]">
                <ImageWithFallback
                  src={mainFeatures[selectedFeature].image}
                  alt={mainFeatures[selectedFeature].title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-6">PrepNote 사용법</h2>
            <p className="text-[#353535] text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
              필요한 기능만 선택해서 사용하세요
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {workflow.map((item, index) => (
              <Card 
                key={index} 
                className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-gray-200 cursor-pointer group"
                onClick={onGetStarted}
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-[#2685d8]/10 group-hover:bg-[#2685d8] rounded-2xl flex items-center justify-center mx-auto transition-colors">
                    <item.icon className="w-8 h-8 text-[#2685d8] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg sm:text-xl">{item.title}</h3>
                  <p className="text-[#353535] text-sm sm:text-base leading-relaxed">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 sm:py-20 lg:py-28 bg-[#faf9f8] dark:bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-6">누가 사하나요?</h2>
            <p className="text-[#353535] dark:text-muted-foreground text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
              <span className="block sm:hidden">당신을 위한 맞춤 솔루션</span>
              <span className="hidden sm:block">다양한 사용자를 위한 맞춤형 발표 준비 솔루션</span>
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-gray-200 flex flex-col h-full">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl mb-3">{useCase.title}</h3>
                  <p className="text-[#353535] dark:text-muted-foreground text-sm sm:text-base leading-relaxed">{useCase.description}</p>
                </div>
                <ul className="space-y-3 mt-auto">
                  {useCase.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#353535] dark:text-muted-foreground text-sm sm:text-base">
                      <Check className="w-5 h-5 text-[#2685d8] flex-shrink-0 mt-0.5" />
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-4">자주 묻는 질문</h2>
            <p className="text-[#353535] text-base sm:text-lg lg:text-xl leading-relaxed">
              PrepNote에 대해 궁금하신 점이 있으신가요?
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full py-5 sm:py-6 px-5 sm:px-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="pr-4 text-sm sm:text-base lg:text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-[#2685d8] transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-[#353535] text-sm sm:text-base border-t border-gray-200 pt-5 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[#2685d8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-4 sm:mb-5 leading-tight">
            지금 바로 시작하세요
          </h2>
          <p className="text-white/95 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed">
            PrepNote와 함께 더 나은 발표를 준비하고,<br className="sm:hidden" /> 발표 능력을 향상시키세요
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={onGetStarted} 
            className="text-base px-8 sm:px-10 h-12 sm:h-14 shadow-lg"
          >
            무료로 시작하기
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-[#faf9f8] dark:bg-muted/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:gap-8 text-center">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="PrepNote Logo" className="h-8 sm:h-9 w-8 sm:w-9" />
              <span className="text-[#020202] dark:text-foreground text-lg sm:text-xl">PrepNote</span>
            </div>
            <div className="text-[#353535] dark:text-muted-foreground space-y-2 sm:space-y-3 text-base sm:text-lg">
              <p>스마트콘텐츠학과 딥러닝 프로젝트</p>
              <p>강승우, 박다현</p>
            </div>
            <p className="text-[#353535] dark:text-muted-foreground text-sm sm:text-base">
              © 2025 PrepNote. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
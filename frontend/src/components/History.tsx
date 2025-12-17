import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DeleteConfirmDialog } from './ui/DeleteConfirmDialog';
import { 
  FileText, 
  MessageSquare, 
  Mic, 
  HelpCircle, 
  Presentation,
  Clock,
  Search,
  Filter,
  Trash2,
  Eye,
  Download,
  BarChart3,
  ArrowUpDown,
  Calendar
} from 'lucide-react';
import type { Summary, Script, RehearsalResult, QASet } from '../App';
import type { PPTPresentation } from './PPTCreator';

interface HistoryProps {
  summaries: Summary[];
  scripts: Script[];
  rehearsals: RehearsalResult[];
  qaSets: QASet[];
  ppts: PPTPresentation[];
  onDelete: (type: string, id: string) => void;
  onView: (type: string, id: string) => void;
}

type FilterType = 'all' | 'summary' | 'script' | 'rehearsal' | 'qa' | 'ppt';
type SortType = 'newest' | 'oldest' | 'name';
type DateFilterType = 'all' | 'today' | 'week' | 'month';

// 통합 아이템 타입 정의
type HistoryItemBase = {
  id: string;
  title: string;
  createdAt: Date;
};

type HistoryItemWithType = 
  | (Summary & { type: 'summary'; icon: typeof FileText; color: string; bgColor: string })
  | (Script & { type: 'script'; icon: typeof MessageSquare; color: string; bgColor: string })
  | (RehearsalResult & { type: 'rehearsal'; icon: typeof Mic; color: string; bgColor: string })
  | (QASet & { type: 'qa'; icon: typeof HelpCircle; color: string; bgColor: string })
  | (PPTPresentation & { type: 'ppt'; icon: typeof Presentation; color: string; bgColor: string });

export function History({ summaries, scripts, rehearsals, qaSets, ppts, onDelete, onView }: HistoryProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; type: string; id: string; title: string }>({
    isOpen: false,
    type: '',
    id: '',
    title: '',
  });

  const handleDeleteClick = (type: string, id: string, title: string) => {
    setDeleteDialog({ isOpen: true, type, id, title });
  };

  const handleConfirmDelete = () => {
    onDelete(deleteDialog.type, deleteDialog.id);
    setDeleteDialog({ isOpen: false, type: '', id: '', title: '' });
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ isOpen: false, type: '', id: '', title: '' });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isInDateRange = (date: Date) => {
    const now = new Date();
    const itemDate = new Date(date);
    
    switch (dateFilter) {
      case 'today':
        return itemDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return itemDate >= monthAgo;
      case 'all':
      default:
        return true;
    }
  };

  const allItems: HistoryItemWithType[] = [
    ...summaries.map(item => ({ ...item, type: 'summary' as const, icon: FileText, color: 'text-primary', bgColor: 'bg-blue-50 dark:bg-primary/10' })),
    ...scripts.map(item => ({ ...item, type: 'script' as const, icon: MessageSquare, color: 'text-primary', bgColor: 'bg-blue-50 dark:bg-primary/10' })),
    ...rehearsals.map(item => ({ ...item, type: 'rehearsal' as const, icon: Mic, color: 'text-primary', bgColor: 'bg-blue-50 dark:bg-primary/10' })),
    ...qaSets.map(item => ({ ...item, type: 'qa' as const, icon: HelpCircle, color: 'text-primary', bgColor: 'bg-blue-50 dark:bg-primary/10' })),
    ...ppts.map(item => ({ ...item, type: 'ppt' as const, icon: Presentation, color: 'text-primary', bgColor: 'bg-blue-50 dark:bg-primary/10' }))
  ];

  const filteredItems = allItems
    .filter(item => {
      const matchesFilter = filter === 'all' || item.type === filter;
      const matchesSearch = searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = isInDateRange(item.createdAt);
      return matchesFilter && matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getItemDetails = (item: any) => {
    if (item.type === 'script') {
      return `${item.speakers}명 발표자 • ${item.tone}`;
    }
    if (item.type === 'rehearsal') {
      return `점수: ${item.score}점`;
    }
    if (item.type === 'qa') {
      return `${item.questions.length}개 질문`;
    }
    if (item.type === 'ppt') {
      return `${item.slides.length}개 슬라이드`;
    }
    return '';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      summary: '자료 요약',
      script: '대본',
      rehearsal: '리허설',
      qa: 'Q&A',
      ppt: 'PPT'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-foreground mb-2">히스토리</h1>
        <p className="text-gray-600 dark:text-muted-foreground">
          모든 작업 기록을 확인하고 관리할 수 있습니다.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-muted-foreground">요약</p>
              <p className="text-gray-900 dark:text-foreground">{summaries.length}개</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-muted-foreground">대본</p>
              <p className="text-gray-900 dark:text-foreground">{scripts.length}개</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-primary/10 rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-muted-foreground">리허설</p>
              <p className="text-gray-900 dark:text-foreground">{rehearsals.length}개</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-primary/10 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-muted-foreground">Q&A</p>
              <p className="text-gray-900 dark:text-foreground">{qaSets.length}개</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-primary/10 rounded-lg flex items-center justify-center">
              <Presentation className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-muted-foreground">PPT</p>
              <p className="text-gray-900 dark:text-foreground">{ppts.length}개</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목으로 검색..."
              className="pl-10"
            />
          </div>

          {/* Type Filters */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">유형 필터</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
                className="w-full"
              >
                전체
              </Button>
              <Button
                variant={filter === 'summary' ? 'default' : 'outline'}
                onClick={() => setFilter('summary')}
                size="sm"
                className="w-full"
              >
                요약
              </Button>
              <Button
                variant={filter === 'script' ? 'default' : 'outline'}
                onClick={() => setFilter('script')}
                size="sm"
                className="w-full"
              >
                대본
              </Button>
              <Button
                variant={filter === 'rehearsal' ? 'default' : 'outline'}
                onClick={() => setFilter('rehearsal')}
                size="sm"
                className="w-full"
              >
                리허설
              </Button>
              <Button
                variant={filter === 'qa' ? 'default' : 'outline'}
                onClick={() => setFilter('qa')}
                size="sm"
                className="w-full"
              >
                Q&A
              </Button>
              <Button
                variant={filter === 'ppt' ? 'default' : 'outline'}
                onClick={() => setFilter('ppt')}
                size="sm"
                className="w-full"
              >
                PPT
              </Button>
            </div>
          </div>

          {/* Date Filter and Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">날짜 필터</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={dateFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setDateFilter('all')}
                  size="sm"
                  className="w-full"
                >
                  전체
                </Button>
                <Button
                  variant={dateFilter === 'today' ? 'default' : 'outline'}
                  onClick={() => setDateFilter('today')}
                  size="sm"
                  className="w-full"
                >
                  오늘
                </Button>
                <Button
                  variant={dateFilter === 'week' ? 'default' : 'outline'}
                  onClick={() => setDateFilter('week')}
                  size="sm"
                  className="w-full"
                >
                  7일
                </Button>
                <Button
                  variant={dateFilter === 'month' ? 'default' : 'outline'}
                  onClick={() => setDateFilter('month')}
                  size="sm"
                  className="w-full"
                >
                  30일
                </Button>
              </div>
            </div>

            {/* Sort */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">정렬</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={sortBy === 'newest' ? 'default' : 'outline'}
                  onClick={() => setSortBy('newest')}
                  size="sm"
                  className="w-full"
                >
                  최신순
                </Button>
                <Button
                  variant={sortBy === 'oldest' ? 'default' : 'outline'}
                  onClick={() => setSortBy('oldest')}
                  size="sm"
                  className="w-full"
                >
                  오래된순
                </Button>
                <Button
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  onClick={() => setSortBy('name')}
                  size="sm"
                  className="w-full"
                >
                  이름순
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground text-center pt-2 border-t border-gray-200 dark:border-border">
            총 {filteredItems.length}개 항목
          </div>
        </div>
      </Card>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <Card className="p-12 text-center">
          <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">항목이 없습니다</h3>
          <p className="text-gray-600">
            {searchQuery ? '검색 결과가 없습니다.' : '아직 생성된 항목이 없습니다.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={`${item.type}-${item.id}`} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900 truncate">{item.title}</h3>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs flex-shrink-0">
                        {getTypeLabel(item.type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      {getItemDetails(item) && (
                        <span>{getItemDetails(item)}</span>
                      )}
                      {item.type === 'rehearsal' && (
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">{item.score}점</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(item.type, item.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteClick(item.type, item.id, item.title)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="항목 삭제"
        itemName={deleteDialog.title}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
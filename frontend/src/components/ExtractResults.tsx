import { Card } from './ui/card';

interface ExtractResultsProps {
  extractedText: string;
  editedText?: string;
}

export function ExtractResults({ extractedText, editedText }: ExtractResultsProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-3">
        <h2 className="text-gray-900">추출된 텍스트</h2>
        <div className="max-h-[420px] overflow-y-auto pr-2 whitespace-pre-wrap text-gray-700 leading-relaxed">
          {extractedText || '추출된 텍스트가 없습니다.'}
        </div>
      </Card>

      {typeof editedText === 'string' && (
        <Card className="p-6 space-y-3">
          <h2 className="text-gray-900">수정된 텍스트</h2>
          <div className="max-h-[420px] overflow-y-auto pr-2 whitespace-pre-wrap text-gray-700 leading-relaxed">
            {editedText || '수정된 텍스트가 없습니다.'}
          </div>
        </Card>
      )}
    </div>
  );
}

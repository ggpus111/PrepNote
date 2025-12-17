import { Button } from './button';
import { Card } from './card';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ isOpen, title, itemName, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <Card className="max-w-md w-full p-6 bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">"{itemName}"</span>을(를) 삭제하시겠습니까?
            </p>
            <p className="text-gray-500 text-sm mt-2">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="min-w-[100px]"
          >
            아니요
          </Button>
          <Button
            onClick={onConfirm}
            className="min-w-[100px] bg-red-600 hover:bg-red-700 text-white"
          >
            예, 삭제합니다
          </Button>
        </div>
      </Card>
    </div>
  );
}

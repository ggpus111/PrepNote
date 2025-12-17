import { useState, useRef, DragEvent } from 'react';
import { Upload, X, File, FileText, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from './ui/button';

interface UploadedFile {
  file: File;
  preview?: string;
  id: string;
}

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  showPreview?: boolean;
}

export function FileUpload({
  onFilesChange,
  accept = '.pdf,.ppt,.pptx,.doc,.docx,.txt',
  multiple = true,
  maxFiles = 5,
  maxSize = 10,
  showPreview = true
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const filesArray = Array.from(files);
    const validFiles: UploadedFile[] = [];

    filesArray.forEach((file) => {
      // 파일 크기 체크
      if (file.size > maxSize * 1024 * 1024) {
        alert(`${file.name}의 크기가 너무 큽니다. (최대 ${maxSize}MB)`);
        return;
      }

      // 파일 개수 체크
      if (uploadedFiles.length + validFiles.length >= maxFiles) {
        alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
        return;
      }

      const fileData: UploadedFile = {
        file,
        id: Math.random().toString(36).substr(2, 9),
      };

      // PDF 미리보기 (첫 페이지만)
      if (file.type === 'application/pdf' && showPreview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileData.preview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }

      validFiles.push(fileData);
    });

    const newFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(newFiles);
    onFilesChange(newFiles.map(f => f.file));
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (id: string) => {
    const newFiles = uploadedFiles.filter(f => f.id !== id);
    setUploadedFiles(newFiles);
    onFilesChange(newFiles.map(f => f.file));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    if (file.type === 'application/pdf') return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-gray-300 dark:border-border hover:border-primary hover:bg-gray-50 dark:hover:bg-muted'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-primary/10' : 'bg-muted'}`}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          
          <div>
            <p className="text-gray-900 dark:text-foreground mb-1">
              파일을 드래그하거나 <span className="text-primary">클릭</span>하여 업로드
            </p>
            <p className="text-gray-500 dark:text-muted-foreground">
              {accept.split(',').join(', ')} 형식 지원 (최대 {maxSize}MB, {maxFiles}개)
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 dark:text-foreground">
              업로드된 파일 ({uploadedFiles.length}/{maxFiles})
            </p>
            {uploadedFiles.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUploadedFiles([]);
                  onFilesChange([]);
                }}
                className="text-gray-600 dark:text-muted-foreground"
              >
                전체 삭제
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {uploadedFiles.map((fileData) => {
              const FileIcon = getFileIcon(fileData.file);
              
              return (
                <div
                  key={fileData.id}
                  className="flex items-center gap-3 p-3 bg-muted dark:bg-card rounded-lg border border-gray-200 dark:border-border group"
                >
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                    <FileIcon className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-foreground truncate">
                      {fileData.file.name}
                    </p>
                    <p className="text-gray-500 dark:text-muted-foreground">
                      {formatFileSize(fileData.file.size)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">완료</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileData.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

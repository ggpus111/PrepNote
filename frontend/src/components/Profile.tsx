import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  User as UserIcon,
  Mail,
  Save,
  LogOut,
  Trash2,
  AlertTriangle,
  KeyRound,
  Lock,
  Moon,
  Sun,
  Monitor,
  Loader2,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useTheme } from '../contexts/ThemeContext';
import type { User, UserType, ChatbotTone } from '../App';

import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

interface ProfileProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function Profile({ user, onBack, onUpdateUser, onLogout, onDeleteAccount }: ProfileProps) {
  const [name, setName] = useState(user.name);
  const [userType, setUserType] = useState<UserType>(user.userType);
  const [chatbotTone, setChatbotTone] = useState<ChatbotTone>(user.chatbotTone || 'friendly');
  const [isEdited, setIsEdited] = useState(false);

  // 비밀번호 재설정 UI 상태
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  const { theme, setTheme, actualTheme } = useTheme();

  const userTypes = [
    { value: 'elementary' as UserType, label: '초등학생' },
    { value: 'middle' as UserType, label: '중학생' },
    { value: 'high' as UserType, label: '고등학생' },
    { value: 'university' as UserType, label: '대학생' },
    { value: 'worker' as UserType, label: '직장인' },
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

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name,
      userType,
      chatbotTone,
    });
    setIsEdited(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setUserType(user.userType);
    setChatbotTone(user.chatbotTone || 'friendly');
    setIsEdited(false);
  };

  /** 🔐 Firebase 비밀번호 재설정 (이메일 방식) */
  const handlePasswordReset = async () => {
    if (!user.email) {
      setResetMsg('이메일 정보가 없습니다.');
      return;
    }

    setLoadingReset(true);
    setResetMsg('');

    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetMsg('비밀번호 재설정 이메일을 전송했습니다. 메일함을 확인하세요.');
      setShowPasswordReset(false);
    } catch (e: any) {
      console.error(e);
      setResetMsg(e?.message || '비밀번호 재설정에 실패했습니다.');
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">
      <div>
        <h1 className="text-gray-900 dark:text-foreground mb-2">프로필 설정</h1>
        <p className="text-gray-600 dark:text-muted-foreground">
          계정 정보를 관리하고 설정을 변경하세요
        </p>
      </div>

      {/* 기본 정보 */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-gray-900 dark:text-foreground mb-6">기본 정보</h2>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-primary" />
          </div>
          <div>
            <p className="text-gray-900 dark:text-foreground">{user.name}</p>
            <p className="text-gray-600 dark:text-muted-foreground">
              {getUserTypeLabel(user.userType)}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Label>이름</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsEdited(true);
              }}
            />
          </div>

          <div>
            <Label>이메일</Label>
            <Input value={user.email} disabled className="bg-gray-100 cursor-not-allowed" />
          </div>

          <div>
            <Label>사용자 유형</Label>
            <select
              value={userType}
              onChange={(e) => {
                setUserType(e.target.value as UserType);
                setIsEdited(true);
              }}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-card"
            >
              {userTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>챗봇 톤</Label>
            <select
              value={chatbotTone}
              onChange={(e) => {
                setChatbotTone(e.target.value as ChatbotTone);
                setIsEdited(true);
              }}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-card"
            >
              <option value="friendly">친근한</option>
              <option value="formal">격식적인</option>
              <option value="casual">캐주얼한</option>
            </select>
          </div>

          {isEdited && (
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                취소
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* 화면 설정 */}
      <Card className="p-6">
        <h2 className="mb-4">화면 설정</h2>
        <div className="grid grid-cols-3 gap-3">
          <ThemeButton label="라이트" active={theme === 'light'} onClick={() => setTheme('light')}>
            <Sun />
          </ThemeButton>
          <ThemeButton label="다크" active={theme === 'dark'} onClick={() => setTheme('dark')}>
            <Moon />
          </ThemeButton>
          <ThemeButton label="시스템" active={theme === 'system'} onClick={() => setTheme('system')}>
            <Monitor />
          </ThemeButton>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          시스템 선택 시 현재 테마: {actualTheme === 'dark' ? '다크' : '라이트'}
        </p>
      </Card>

      {/* 계정 관리 */}
      <Card className="p-6 space-y-4">
        <h2>계정 관리</h2>

        {/* 비밀번호 재설정 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3>비밀번호 재설정</h3>
              <p className="text-gray-600 text-sm">
                이메일을 통해 비밀번호를 재설정합니다
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowPasswordReset(true)}>
              <KeyRound className="w-4 h-4 mr-2" />
              재설정
            </Button>
          </div>

          {showPasswordReset && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-600">
                계정 이메일로 비밀번호 재설정 링크가 전송됩니다.
              </p>

              {resetMsg && <p className="text-sm text-primary">{resetMsg}</p>}

              <div className="flex gap-2">
                <Button onClick={handlePasswordReset} disabled={loadingReset}>
                  {loadingReset ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      전송 중
                    </>
                  ) : (
                    '이메일 전송'
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowPasswordReset(false)}>
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 로그아웃 */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <h3>로그아웃</h3>
            <p className="text-gray-600 text-sm">현재 계정에서 로그아웃합니다</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </div>

        {/* 계정 삭제 */}
        <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
          <div>
            <h3>계정 탈퇴</h3>
            <p className="text-gray-600 text-sm">모든 데이터가 영구 삭제됩니다</p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                탈퇴
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말 계정을 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteAccount}>
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
}

/* ---- 내부 컴포넌트 ---- */
function ThemeButton({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
        active ? 'border-primary bg-primary/5' : 'border-gray-200'
      }`}
    >
      {children}
      <span className={active ? 'text-primary font-medium' : ''}>{label}</span>
    </button>
  );
}

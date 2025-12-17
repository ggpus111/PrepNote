import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from '../firebase';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Check, X, Loader2 } from 'lucide-react';
import type { User, UserType } from '../App';
import logoImage from 'figma:asset/ae5b552081ceb2d5f9f4e15a08861d29a64bcb3a.png';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

export function Auth({ onLogin, onBack }: AuthProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('university');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const userTypes = [
    { value: 'elementary' as UserType, label: '초등학생' },
    { value: 'middle' as UserType, label: '중학생' },
    { value: 'high' as UserType, label: '고등학생' },
    { value: 'university' as UserType, label: '대학생' },
    { value: 'worker' as UserType, label: '직장인' },
  ];

  // (기존처럼) 회원가입 때만 비밀번호 강도 체크
  const validatePassword = (pwd: string) => ({
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
  });

  const passwordChecks = validatePassword(password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const persistByRemember = async () => {
    // rememberMe true면 브라우저를 껐다 켜도 유지(Local)
    // false면 탭/브라우저 세션 동안만(Session)
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await persistByRemember();

      if (isSignup) {
        if (!isPasswordValid) {
          setErrorMsg('비밀번호가 보안 요구사항을 충족하지 않습니다.');
          setLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;

        const displayName = (name || email.split('@')[0]).trim();

        // Firestore에 사용자 프로필 저장
        await setDoc(doc(db, 'users', uid), {
          name: displayName,
          email,
          userType,
          createdAt: new Date().toISOString(),
        });

        const user: User = {
          id: uid,
          name: displayName,
          email,
          userType,
        };

        onLogin(user);
        return;
      }

      // 로그인
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // Firestore에서 userType/이름 가져오기(없으면 fallback)
      const snap = await getDoc(doc(db, 'users', uid));
      const data = snap.exists() ? (snap.data() as any) : null;

      const user: User = {
        id: uid,
        name: (data?.name || cred.user.displayName || email.split('@')[0]) as string,
        email: cred.user.email || email,
        userType: (data?.userType || 'university') as UserType,
      };

      onLogin(user);
    } catch (err: any) {
      console.error(err);

      // Firebase 에러 메시지 간단 매핑
      const code = err?.code as string | undefined;
      if (code === 'auth/invalid-credential') setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
      else if (code === 'auth/email-already-in-use') setErrorMsg('이미 가입된 이메일입니다.');
      else if (code === 'auth/weak-password') setErrorMsg('비밀번호가 너무 약합니다.');
      else if (code === 'auth/invalid-email') setErrorMsg('이메일 형식이 올바르지 않습니다.');
      else setErrorMsg(err?.message || '로그인/회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white dark:from-background to-gray-50 dark:to-muted/20 py-12">
      <div className="max-w-md mx-auto px-4">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>

        <Card className="p-8">
          <div className="flex flex-col items-center mb-8">
            <img src={logoImage} alt="PrepNote" className="h-16 w-16 mb-4" />
            <h2 className="text-gray-900 dark:text-foreground">{isSignup ? '회원가입' : '로그인'}</h2>
            <p className="text-gray-600 dark:text-muted-foreground text-center">
              {isSignup ? '새 계정을 만들어 시작하세요' : 'PrepNote에 오신 것을 환영합니다'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  required={isSignup}
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              {isSignup && password.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-muted rounded-lg border border-gray-200 dark:border-border">
                  <p className="text-gray-700 dark:text-foreground/90 mb-2">비밀번호 보안 요구사항</p>
                  <div className="space-y-1">
                    <Row ok={passwordChecks.length} label="최소 8자 이상" />
                    <Row ok={passwordChecks.uppercase} label="대문자 포함 (A-Z)" />
                    <Row ok={passwordChecks.lowercase} label="소문자 포함 (a-z)" />
                    <Row ok={passwordChecks.number} label="숫자 포함 (0-9)" />
                    <Row ok={passwordChecks.special} label="특수문자 포함 (!@#$%...)" />
                  </div>
                </div>
              )}
            </div>

            {isSignup && (
              <div>
                <Label htmlFor="userType">사용자 유형</Label>
                <select
                  id="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg bg-white dark:bg-card text-gray-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  {userTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isSignup && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="cursor-pointer text-gray-700 dark:text-foreground/90">
                  로그인 상태 유지
                </Label>
              </div>
            )}

            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>{isSignup ? '회원가입' : '로그인'}</>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setErrorMsg('');
              }}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {isSignup ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
      <span className={ok ? 'text-green-700 dark:text-green-500' : 'text-red-700 dark:text-red-500'}>{label}</span>
    </div>
  );
}

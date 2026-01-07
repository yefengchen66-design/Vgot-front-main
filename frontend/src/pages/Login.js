import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Home, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { authTranslations } from '../translations/auth_shouye.js';
import { toast } from 'sonner';
import logoImage from "../assets/logo.png";

function Login({ onLoginSuccess, onClose }) {
  const { language } = useLanguage();
  const t = authTranslations[language] || authTranslations['en'];
  const { login, register, sendEmailCode, loginWithGoogle, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  // 显示条款未勾选的可视化提示（红色高亮/说明文字）
  const [showTermsError, setShowTermsError] = useState(false);

  // 处理导航到条款页面
  const handleNavigateToTerms = (path) => {
    if (onClose) {
      onClose(); // 关闭登录模态框
    }
    navigate(path); // 导航到目标页面
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSendCode = async () => {
    if (!email) {
      toast.error(language === 'en' ? 'Please enter email first' : '请先输入邮箱');
      return;
    }
    if (countdown > 0) return;
    setIsSendingCode(true);
    try {
      const success = await sendEmailCode(email);
      if (success) {
        toast.success(language === 'en' ? 'Verification code sent!' : '验证码已发送！');
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(language === 'en' ? 'Failed to send code' : '发送验证码失败');
      }
    } catch (err) {
      toast.error(err.message || 'Error sending code');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (isLogin) {
      if (!username || !password) {
        toast.error(language === 'en' ? 'Please fill in all fields' : '请填写所有字段');
        return;
      }
    } else {
      if (!username || !password || !email || !verificationCode) {
        toast.error(language === 'en' ? 'Please fill in all fields' : '请填写所有字段');
        return;
      }
      if (!agreedToTerms) {
        setShowTermsError(true);
        toast.error(
          language === 'en' ? 'Please agree to the Terms of Service' :
            language === 'es' ? 'Por favor acepta los Términos de servicio' :
              language === 'zh-TW' ? '請同意服務條款' :
                '请同意服务条款'
        );
        return;
      }
    }

    setIsLoading(true);
    try {
      let success = false;
      if (isLogin) {
        success = await login(username, password);
        if (success) {
          toast.success(t.loginSuccess);
          if (onLoginSuccess) onLoginSuccess();
        }
      } else {
        success = await register(username, password, email, verificationCode, inviteCode);
        if (success) {
          toast.success(t.signupSuccess);
          setIsLogin(true);
          setEmail('');
          setVerificationCode('');
          setInviteCode('');
          setCountdown(0);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error('Google Login requires Client ID');
      return;
    }
    if (!window.google) {
      toast.error('Google services loading...');
      return;
    }
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          await loginWithGoogle(response.credential);
          if (onLoginSuccess) onLoginSuccess();
        } catch (error) {
          toast.error('Google login failed');
        }
      },
    });
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        try {
          const tempDiv = document.createElement('div');
          document.body.appendChild(tempDiv);
          window.google.accounts.id.renderButton(tempDiv, { theme: 'outline', size: 'large' });
          setTimeout(() => {
            const button = tempDiv.querySelector('div[role="button"]');
            if (button) button.click();
            document.body.removeChild(tempDiv);
          }, 100);
        } catch (e) {
          toast.error('Google login unavailable');
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05050f]/90 backdrop-blur-sm p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-800/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <a href="#home" onClick={(e) => { e.preventDefault(); onLoginSuccess && onLoginSuccess(); }} className="fixed top-6 left-6 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
          <Home size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm">{language === 'en' ? 'Back to Home' : language === 'es' ? 'Volver al inicio' : language === 'zh-TW' ? '返回首頁' : '返回首页'}</span>
        </div>
      </a>
      <div className="w-full max-w-md z-10 relative">

        <div className="flex justify-center mb-12">
          <img src={logoImage} alt="VGOT" className="h-24 w-auto object-contain transition-transform duration-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]" />
        </div>

        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600" />
          <div className="text-center mb-8">
            <h2 className="text-2xl mb-2 text-white">{isLogin ? t.welcomeBack : t.startCreating}</h2>
            <p className="text-[#9ca3af] text-sm">{isLogin ? t.loginSubtitle : t.signupSubtitle}</p>
          </div>

          <div className="space-y-3 mb-6">
            <Button type="button" onClick={handleGoogleLogin} className="w-full bg-white hover:bg-gray-100 text-gray-900 py-2.5 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>{t.continueWithGoogle}</span>
            </Button>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-700" />
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-widest">{t.orWithEmail}</span>
            <div className="flex-grow border-t border-gray-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isLogin ? (
              <>
                <div className="space-y-1">
                  <Label htmlFor="login-username" className="text-xs text-gray-400 ml-1">{t.usernameLabel}</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors pointer-events-none z-10" size={18} />
                    <Input
                      id="login-username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t.usernamePlaceholder}
                      className="bg-gray-800/50 border-gray-700 text-white rounded-lg focus-visible:ring-purple-500/50 focus-visible:border-purple-500 pl-11 pr-3 h-10 placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <Label htmlFor="login-password" className="text-xs text-gray-400">{t.passwordLabel}</Label>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // 跳转到忘记密码页，关闭当前登录弹窗
                        if (onClose) onClose();
                        navigate('/forgot-password');
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {t.forgotPassword}
                    </a>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors pointer-events-none z-10" size={18} />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="bg-gray-800/50 border-gray-700 text-white rounded-lg focus-visible:ring-purple-500/50 focus-visible:border-purple-500 pl-11 pr-11 h-10 placeholder:text-gray-600"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors z-10">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <Label htmlFor="username" className="text-xs text-gray-400 ml-1">{t.usernameLabel}</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors pointer-events-none z-10" size={18} />
                    <Input
                      id="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t.usernamePlaceholder}
                      className="bg-gray-800/50 border-gray-700 text-white rounded-lg focus-visible:ring-purple-500/50 focus-visible:border-purple-500 pl-11 pr-3 h-10 placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs text-gray-400 ml-1">{t.passwordLabel}</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors pointer-events-none z-10" size={18} />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="bg-gray-800/50 border-gray-700 text-white rounded-lg focus-visible:ring-purple-500/50 focus-visible:border-purple-500 pl-11 pr-11 h-10 placeholder:text-gray-600"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors z-10">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs text-gray-400 ml-1">{t.emailLabel}</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors pointer-events-none z-10" size={18} />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="bg-gray-800/50 border-gray-700 text-white rounded-lg focus-visible:ring-purple-500/50 focus-visible:border-purple-500 pl-11 pr-3 h-10 placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="verificationCode" className="text-xs text-gray-400 ml-1">{t.verificationCodeLabel}</Label>
                  <div className="flex gap-3">
                    <div className="relative group flex-grow">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors pointer-events-none z-10" size={18} />
                      <Input
                        id="verificationCode"
                        type="text"
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder={t.verificationCodePlaceholder}
                        className="bg-gray-800/50 border-gray-700 text-white rounded-lg focus-visible:ring-purple-500/50 focus-visible:border-purple-500 pl-11 pr-3 h-10 placeholder:text-gray-600 w-full"
                      />
                    </div>
                    <Button type="button" onClick={handleSendCode} disabled={isSendingCode || countdown > 0} className="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded-lg whitespace-nowrap transition-colors min-w-[100px]">
                      {isSendingCode ? '...' : countdown > 0 ? `${countdown}s` : t.sendCode}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="inviteCode" className="text-xs text-gray-400 ml-1">{t.inviteCodeLabel}</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors pointer-events-none z-10" size={18} />
                    <Input
                      id="inviteCode"
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder={t.inviteCodePlaceholder}
                      className="bg-gray-800/50 border-gray-700 text-white rounded-lg focus-visible:ring-purple-500/50 focus-visible:border-purple-500 pl-11 pr-3 h-10 placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </>
            )}

            {!isLogin && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => {
                      setAgreedToTerms(checked);
                      if (checked) setShowTermsError(false);
                    }}
                    aria-invalid={!agreedToTerms && showTermsError}
                    className={
                      `h-5 w-5 rounded-md border-2 ` +
                      // Always-visible in unchecked state
                      (!agreedToTerms
                        ? ' border-purple-400 bg-purple-500/15 hover:bg-purple-500/25 '
                        : ' data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 ') +
                      (!agreedToTerms && showTermsError
                        ? ' border-red-500 ring-2 ring-red-500/40 animate-[shake_0.25s_ease-in-out_0s_1]'
                        : '')
                    }
                  />
                  <label htmlFor="terms" className="text-xs leading-tight cursor-pointer "
                    style={{ color: (!agreedToTerms && showTermsError) ? '#fca5a5' : '#9ca3af' }}>
                    {t.termsAgree} <button type="button" onClick={() => handleNavigateToTerms('/terms-of-service')} className="text-purple-400 hover:underline bg-transparent border-none cursor-pointer p-0 font-inherit text-xs">{t.termsService}</button> {t.and} <button type="button" onClick={() => handleNavigateToTerms('/privacy-policy')} className="text-purple-400 hover:underline bg-transparent border-none cursor-pointer p-0 font-inherit text-xs">{t.privacyPolicy}</button>.
                  </label>
                </div>
                {(!agreedToTerms && showTermsError) && (
                  <p className="text-xs text-red-400 ml-6">{language === 'en' ? 'Please check to continue' : language === 'es' ? 'Marca esta casilla para continuar' : language === 'zh-TW' ? '請勾選後繼續' : '请勾选后继续'}</p>
                )}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm px-5 py-3 text-center transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (<>{isLogin ? t.signIn : t.createAccount}<ArrowRight size={16} /></>)}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {isLogin ? t.noAccount : t.hasAccount}{' '}
              <button onClick={() => { setIsLogin(!isLogin); setAgreedToTerms(false); }} className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                {isLogin ? t.signUp : t.logIn}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center flex justify-center items-center gap-2 text-xs text-gray-500 opacity-60">
          <Lock size={12} />
          <span>{t.securedBy}</span>
        </div>
      </div>
    </div>
  );
}
export default Login;
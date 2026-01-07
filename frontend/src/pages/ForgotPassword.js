import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { API_BASE_URL } from '../config/api';

// 简单封装请求（也可复用现有 api 封装）
async function postJson(path, body) {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.detail || data?.message || '请求失败');
    }
    return data;
  } catch (e) {
    throw e;
  }
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const t = {
    title: {
      'en': 'Reset Password',
      'ja': 'パスワードをリセット',
      'zh-CN': '重置密码',
      'zh-TW': '重設密碼',
      'es': 'Restablecer contraseña'
    },
    sendCode: {
      'en': 'Send Code',
      'ja': 'コードを送信',
      'zh-CN': '发送验证码',
      'zh-TW': '發送驗證碼',
      'es': 'Enviar código'
    },
    reset: {
      'en': 'Reset Password',
      'ja': 'パスワードをリセット',
      'zh-CN': '重置密码',
      'zh-TW': '重設密碼',
      'es': 'Restablecer'
    },
    emailPlaceholder: {
      'en': 'Registered Email',
      'ja': '登録済みメールアドレス',
      'zh-CN': '注册邮箱',
      'zh-TW': '註冊信箱',
      'es': 'Correo registrado'
    },
    codePlaceholder: {
      'en': 'Verification Code',
      'ja': '認証コード',
      'zh-CN': '验证码',
      'zh-TW': '驗證碼',
      'es': 'Código de verificación'
    },
    pwdPlaceholder: {
      'en': 'New Password',
      'ja': '新しいパスワード',
      'zh-CN': '新密码',
      'zh-TW': '新密碼',
      'es': 'Nueva contraseña'
    },
    backLogin: {
      'en': 'Back to Login',
      'ja': 'ログインへ戻る',
      'zh-CN': '返回登录',
      'zh-TW': '返回登入',
      'es': 'Volver al inicio de sesión'
    }
  };

  const L = (key) => t[key][language] || t[key]['en'];

  const handleSendCode = async () => {
    if (!email) {
      const msg = {
        'en': 'Please enter email',
        'ja': 'メールアドレスを入力してください',
        'zh-CN': '请输入邮箱',
        'zh-TW': '請輸入信箱',
        'es': 'Por favor ingrese el correo'
      };
      toast.error(msg[language] || msg['en']);
      return;
    }
    setLoading(true);
    try {
  await postJson(`${API_BASE_URL}/api/auth/forgot-password/send-code`, { email });
      const msg = {
        'en': 'Code sent, check your inbox',
        'ja': '認証コードを送信しました。メールをご確認ください',
        'zh-CN': '验证码已发送，请查收邮箱',
        'zh-TW': '驗證碼已發送，請查收信箱',
        'es': 'Código enviado, revisa tu bandeja'
      };
      toast.success(msg[language] || msg['en']);
      setStep(2);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email || !code || !newPassword) {
      const msg = {
        'en': 'Please fill all fields',
        'ja': 'すべての項目を入力してください',
        'zh-CN': '请填写所有字段',
        'zh-TW': '請填寫所有欄位',
        'es': 'Por favor completa todos los campos'
      };
      toast.error(msg[language] || msg['en']);
      return;
    }
    setLoading(true);
    try {
  await postJson(`${API_BASE_URL}/api/auth/forgot-password/reset`, { email, code, new_password: newPassword });
      const msg = {
        'en': 'Password updated, please login',
        'ja': 'パスワードを更新しました。ログインしてください',
        'zh-CN': '密码已更新，请登录',
        'zh-TW': '密碼已更新，請登入',
        'es': 'Contraseña actualizada, por favor inicia sesión'
      };
      toast.success(msg[language] || msg['en']);
      navigate('/');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0b16] p-4">
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-xl text-white mb-6">{L('title')}</h2>

        {step === 1 && (
          <div className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={L('emailPlaceholder')}
              className="bg-gray-800/50 border-gray-700 text-white"
            />
            <Button onClick={handleSendCode} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white">
              {L('sendCode')}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={L('emailPlaceholder')}
              className="bg-gray-800/50 border-gray-700 text-white"
            />
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={L('codePlaceholder')}
              className="bg-gray-800/50 border-gray-700 text-white"
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={L('pwdPlaceholder')}
              className="bg-gray-800/50 border-gray-700 text-white"
            />
            <Button onClick={handleReset} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white">
              {L('reset')}
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button onClick={() => navigate('/')} className="text-sm text-purple-400 hover:underline">
            {L('backLogin')}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { flushPendingHistory } from '../services/historySync';

const AuthContext = createContext();

// 从环境变量获取API基础URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/me`);
      console.log('✅ fetchUser response:', response.data);
      console.log('🎯 User tier:', response.data?.tier);
      setUser(response.data);
      // 登录状态确认后，尝试回放未同步的历史记录
      try { await flushPendingHistory(); } catch {}
    } catch (error) {
      // Log the error to help debugging why token validation failed
      // (network/CORS/401/500 etc). Keep existing behavior of removing token.
      console.error('fetchUser failed:', error?.response?.status, error?.response?.data || error.message || error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const sendEmailCode = async (email) => {
    try {
      setError(null);
      if (!email) throw new Error('邮箱地址必填');
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/send-email-code`, { email });
      console.log(`验证码已发送至 ${email}`);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || '发送验证码失败';
      setError(errorMessage);
      return false;
    }
  };
  const verifyEmailCode = async () => { throw new Error('Email verification is disabled'); };

// Legacy username/password login/register (re-enabled).
const login = async (username, password) => {
  try {
    setError(null);
    if (!username || !password) throw new Error('username and password required');
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
    console.log('Login response:', response.data);
    localStorage.setItem('token', response.data.access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    // 登录接口可能不包含 tier 等扩展字段，立即刷新获取完整用户
    try {
      await fetchUser(); // fetchUser 会自行设置 user 并处理 loading
    } catch (e) {
      // 如果获取失败，至少回退设置基本信息，避免界面完全空白
      if (response.data.user) {
        setUser(prev => ({ ...response.data.user, ...(prev || {}) }));
      }
    }
    
    try { await flushPendingHistory(); } catch {}
    return true;
  } catch (err) {
    const errorMessage = err.response?.data?.detail || err.message || '登录失败';
    setError(errorMessage);
    return false;
  }
};

const register = async (username, password, email, verificationCode, invite_code = null) => {
  try {
    setError(null);
    if (!username || !password) throw new Error('用户名和密码必填');
    if (!email) throw new Error('邮箱地址必填');
    if (!verificationCode) throw new Error('验证码必填');
    
    // 前端验证码格式检查
    if (verificationCode.length < 4) {
      throw new Error('验证码格式不正确');
    }
    
    // 发送完整注册数据到后端
    const body = { 
      username, 
      password, 
      email, 
      verification_code: verificationCode 
    };
    if (invite_code) body.invite_code = invite_code;
    
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, body);
    return true;
  } catch (err) {
    const errorMessage = err.response?.data?.detail || err.message || '注册失败';
    setError(errorMessage);
    return false;
  }
};

const clearError = () => {
  setError(null);
};

const loginWithGoogle = async (id_token, invite_code = null) => {
  try {
    setError(null);
    if (!id_token) throw new Error('Google认证失败');
    
    const body = { id_token };
    if (invite_code) body.invite_code = invite_code;
    
    const response = await axios.post(`${API_BASE_URL}/api/auth/login-google`, body);
    localStorage.setItem('token', response.data.access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    
  // 同样获取完整用户信息（包含最新 tier/credits）
  try { await fetchUser(); } catch { if (response.data.user) setUser(response.data.user); }
    
    try { await flushPendingHistory(); } catch {}
    return response.data;
  } catch (err) {
    let errorMessage = 'Google登录失败';
    
    if (err.response?.status === 501) {
      errorMessage = 'Google登录功能正在开发中，请使用用户名密码登录';
    } else if (err.response?.data?.detail) {
      errorMessage = err.response.data.detail;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    throw new Error(errorMessage);
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    // legacy login/register disabled — use loginWithGoogle
    login,
    register,
    loginWithGoogle,
    sendEmailCode,
    verifyEmailCode,
    logout,
    clearError,
    refreshUser: fetchUser
  };

  
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}


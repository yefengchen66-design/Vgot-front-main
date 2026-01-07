import React, { useRef, useEffect, lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, matchPath, useNavigate } from 'react-router-dom';
import './App.css';
import './components/CreditAlerts.css';
import Sidebar from './components/Sidebar';
import Workspace from './pages/Workspace';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UsageProvider } from './contexts/UsageContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSwitch from './components/LanguageSwitch';
import ParticlesBackground from './components/ParticlesBackground';
import Landing from './pages/Landing';
import { Toaster } from 'sonner';
import { TaskManagerProvider } from './contexts/TaskManagerContext';

// Lazy load larger pages so initial bundle is smaller and we can prefetch/caching later
const VideoGeneration = lazy(() => import('./pages/VideoGeneration'));
const VideoAnalysis = lazy(() => import('./pages/VideoAnalysis'));
const GenerationHistory = lazy(() => import('./pages/GenerationHistory'));
const SuperIP = lazy(() => import('./pages/SuperIP'));
const Payment = lazy(() => import('./pages/Payment'));
const Referral = lazy(() => import('./pages/Referral'));
const Partner = lazy(() => import('./pages/Partner'));
// 使用合并后的 Subscription 页面，替换原 SubscriptionWithAPI
const Subscription = lazy(() => import('./pages/Subscription'));
const PricingComparison = lazy(() => import('./pages/PricingComparison'));
const Credits = lazy(() => import('./pages/CreditsWithAPI'));
const Login = lazy(() => import('./pages/Login'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Contact = lazy(() => import('./pages/Contact'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

function AppContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const mainContentRef = useRef(null);
  const location = useLocation();
  const [visited, setVisited] = useState(new Set());
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const container = mainContentRef.current;
    if (!container) return;
    const handleScroll = () => {
      container.classList.add('scroll-active');

      // 清除之前的定时器（避免滚动中频繁触发隐藏）
      clearTimeout(container.scrollTimer);

      // 滚动停止 1 秒后隐藏
      container.scrollTimer = setTimeout(() => {
        container.classList.remove('scroll-active');
      }, 1000);
    };
    container.addEventListener('scroll', handleScroll);

    // 组件卸载时清理
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(container.scrollTimer);
    };
  }, []);

  useEffect(() => {
    const newSet = new Set(visited);
    newSet.add(location.pathname);
    setVisited(newSet);
  }, [location.pathname, visited]);

  useEffect(() => {
    import('./pages/VideoGeneration');
    import('./pages/VideoAnalysis');
    import('./pages/GenerationHistory');
  }, []);

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    navigate('/');
  };

  const handleCloseModal = () => {
    setLoginModalOpen(false);
  };

  const routes = [
    { path: '/', element: <Workspace /> },
    { path: '/generation-history', element: <GenerationHistory /> },
    { path: '/video-generation', element: <VideoGeneration /> },
    { path: '/video-analysis', element: <VideoAnalysis /> },
    { path: '/super-ip', element: <SuperIP /> },
    { path: '/partner', element: <Partner /> },
    { path: '/subscription', element: <Subscription /> },
    { path: '/credits', element: <Credits /> },
    { path: '/payment', element: <Payment /> },
    { path: '/referral', element: <Referral /> }
  ];

  if (location.pathname === '/privacy-policy') {
    return (
      <>
        <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
          <PrivacyPolicy onLoginClick={() => setLoginModalOpen(true)} />
        </Suspense>
        {isLoginModalOpen && (
          <Suspense fallback={<div style={{ padding: 20 }}>{t('landing.loading')}</div>}>
            <Login onLoginSuccess={handleLoginSuccess} onClose={handleCloseModal} />
          </Suspense>
        )}
      </>
    );
  }

  if (location.pathname === '/terms-of-service') {
    return (
      <>
        <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
          <TermsOfService onLoginClick={() => setLoginModalOpen(true)} />
        </Suspense>
        {isLoginModalOpen && (
          <Suspense fallback={<div style={{ padding: 20 }}>{t('landing.loading')}</div>}>
            <Login onLoginSuccess={handleLoginSuccess} onClose={handleCloseModal} />
          </Suspense>
        )}
      </>
    );
  }

  if (location.pathname === '/contact') {
    return (
      <>
        <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
          <Contact onLoginClick={() => setLoginModalOpen(true)} />
        </Suspense>
        {isLoginModalOpen && (
          <Suspense fallback={<div style={{ padding: 20 }}>{t('landing.loading')}</div>}>
            <Login onLoginSuccess={handleLoginSuccess} onClose={handleCloseModal} />
          </Suspense>
        )}
      </>
    );
  }

  if (location.pathname === '/help-center') {
    return (
      <>
        <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
          <HelpCenter onLoginClick={() => setLoginModalOpen(true)} />
        </Suspense>
        {isLoginModalOpen && (
          <Suspense fallback={<div style={{ padding: 20 }}>{t('landing.loading')}</div>}>
            <Login onLoginSuccess={handleLoginSuccess} onClose={handleCloseModal} />
          </Suspense>
        )}
      </>
    );
  }

  if (!user) {
    // 独立的忘记密码页面：未登录也可访问，全屏显示
    if (location.pathname === '/forgot-password') {
      return (
        <Suspense fallback={<div style={{ padding: 20 }}>加载中…</div>}>
          <ForgotPassword />
        </Suspense>
      );
    }
    return (
      <>
        <Landing onLoginClick={() => setLoginModalOpen(true)} />
        {isLoginModalOpen && (
          <Suspense fallback={<div style={{ padding: 20 }}>{t('landing.loading')}</div>}>
            <Login onLoginSuccess={handleLoginSuccess} onClose={handleCloseModal} />
          </Suspense>
        )}
      </>
    );
  }

  // 全屏页面路由 - 不显示侧边栏和主布局
  if (location.pathname === '/pricing-comparison') {
    return (
      <Suspense fallback={<div style={{ padding: 20 }}>加载中…</div>}>
        <PricingComparison />
      </Suspense>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content" ref={mainContentRef}>
        <LanguageSwitch />
        <Suspense fallback={<div style={{ padding: 20 }}>加载中…</div>}>
          {routes.map((r) => {
            // determine if this route should be active (simple prefix match)
            const isActive = matchPath({ path: r.path, end: r.path === '/' }, location.pathname) !== null;
            const shouldMount = isActive || visited.has(r.path);
            return (
              <div key={r.path} style={{ display: isActive ? 'block' : 'none', width: '100%' }}>
                {shouldMount ? r.element : null}
              </div>
            );
          })}
          {routes.every(r => matchPath({ path: r.path, end: r.path === '/' }, location.pathname) === null) && <Navigate to="/" />}
        </Suspense>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <UsageProvider>
          <TaskManagerProvider>
            <Router>
              <AppContent />
              <Toaster />
            </Router>
          </TaskManagerProvider>
        </UsageProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
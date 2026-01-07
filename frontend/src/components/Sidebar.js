import React, { useRef, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  History,
  Bot,
  Sparkles,
  Film,
  CreditCard,
  Gift,
  ChevronsUpDown,
  LogOut,
  Crown,
  Coins,
  Zap,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const sidebarRef = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, bottom: 'auto' });

  // 动态获取套餐显示文案
  const getPlanLabel = () => {
    const tier = user?.tier || 'Free';
    try {
      switch (tier) {
        case 'Creator':
          return `${t('subscriptionPage.creatorName') || 'Creator'}${t('subscriptionPage.planSuffix') ? ` ${t('subscriptionPage.planSuffix')}` : ''}`;
        case 'Business':
          return `${t('subscriptionPage.businessName') || 'Business'}${t('subscriptionPage.planSuffix') ? ` ${t('subscriptionPage.planSuffix')}` : ''}`;
        case 'Enterprise':
          return `${t('subscriptionPage.enterpriseName') || 'Enterprise'}${t('subscriptionPage.planSuffix') ? ` ${t('subscriptionPage.planSuffix')}` : ''}`;
        case 'Free':
        default:
          return t('sidebar.userMenu.freeplan') || 'Free';
      }
    } catch {
      return tier;
    }
  };

  // 计算弹窗位置
  const calculateMenuPosition = () => {
    if (!buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 280;
    const menuHeight = 320;
    const padding = 12;
    
    // 默认位置：按钮右侧
    let left = buttonRect.right + padding;
    let top = buttonRect.top;
    let bottom = 'auto';
    
    // 检查右侧是否有足够空间
    if (left + menuWidth > window.innerWidth - 20) {
      // 如果右侧空间不足，放到左侧
      left = buttonRect.left - menuWidth - padding;
    }
    
    // 检查底部是否有足够空间
    if (top + menuHeight > window.innerHeight - 20) {
      // 如果底部空间不足，向上对齐
      bottom = window.innerHeight - buttonRect.bottom + padding;
      top = 'auto';
    }
    
    setMenuPosition({ top, left, bottom });
  };

  useEffect(() => {
    if (menuOpen) {
      calculateMenuPosition();
      // 监听窗口大小变化
      const handleResize = () => calculateMenuPosition();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [menuOpen]);

  // 调试：在组件中监听用户状态变化
  useEffect(() => {
    console.log('Sidebar user info updated:', user);
  }, [user]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    let hideTimer;
    const activate = () => {
      sidebar.classList.add('scroll-active');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        sidebar.classList.remove('scroll-active');
      }, 3000); // hide after 3s of inactivity
    };

    const handleScroll = () => {
      activate();
    };
    const handleMouseEnter = activate;
    const handleMouseLeave = () => {
      clearTimeout(hideTimer);
      sidebar.classList.remove('scroll-active');
    };

    sidebar.addEventListener('scroll', handleScroll);
    sidebar.addEventListener('mouseenter', handleMouseEnter);
    sidebar.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      sidebar.removeEventListener('scroll', handleScroll);
      sidebar.removeEventListener('mouseenter', handleMouseEnter);
      sidebar.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inMenu = menuRef.current && menuRef.current.contains(e.target);
      const inButton = buttonRef.current && buttonRef.current.contains(e.target);
      if (!inMenu && !inButton) {
        setMenuOpen(false);
      }
    };
    const handleEsc = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div className="sidebar" ref={sidebarRef}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">VGOT</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard className="nav-icon" />
          <span>{t('sidebar.workspace')}</span>
        </NavLink>
        <NavLink to="/generation-history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <History className="nav-icon" />
          <span>{t('sidebar.history')}</span>
        </NavLink>
      </nav>

      <div className="sidebar-section">
        <div className="sidebar-section-title">{t('sidebar.section.replicator')}</div>
        <NavLink to="/video-analysis" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Bot className="nav-icon" />
          <span>{t('sidebar.scripts')}</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">{t('sidebar.section.commerce')}</div>
        <NavLink to="/super-ip" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Sparkles className="nav-icon" />
          <span>{t('sidebar.superIP')}</span>
        </NavLink>
        <NavLink to="/video-generation" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Film className="nav-icon" />
          <span>{t('sidebar.sora')}</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">{t('sidebar.section.finance')}</div>
        <NavLink to="/partner" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users className="nav-icon" />
          <span>{t('sidebar.partner')}</span>
        </NavLink>
        <NavLink to="/subscription" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CreditCard className="nav-icon" />
          <span>{t('sidebar.subscription')}</span>
        </NavLink>
        <NavLink to="/credits" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Zap className="nav-icon" />
          <span>{t('sidebar.credits')}</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div
          className={`account-card ${menuOpen ? 'open' : ''}`}
          ref={buttonRef}
          role="button"
          tabIndex={0}
          onClick={() => setMenuOpen(!menuOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setMenuOpen(!menuOpen);
            }
          }}
        >
          <div className="avatar-square">{user?.username?.charAt(0)?.toUpperCase?.()}</div>
          <div className="account-meta">
            <div className="account-name">{user?.username || '-'}</div>
            {user?.email && (
              <div className="account-email" title={user.email}>{user.email}</div>
            )}
          </div>
          <div className="account-actions">
            <ChevronsUpDown size={16} className="chevron-duo" />
          </div>
        </div>
        {menuOpen && (
          <div
            ref={menuRef}
            className="user-menu"
            style={{
              position: 'fixed',
              top: menuPosition.top !== 'auto' ? menuPosition.top : 'auto',
              bottom: menuPosition.bottom !== 'auto' ? menuPosition.bottom : 'auto',
              left: menuPosition.left,
            }}
          >
            <div 
              className="user-menu-arrow" 
              style={{
                top: menuPosition.bottom !== 'auto' ? 'auto' : '20px',
                bottom: menuPosition.bottom !== 'auto' ? '20px' : 'auto'
              }}
            />
            
            {/* 用户信息头部 */}
            <div className="user-menu-header">
              <div className="user-menu-avatar">
                {user?.username?.charAt(0)?.toUpperCase?.()}
              </div>
              <div className="user-menu-info">
                <div className="user-menu-name">{user?.username || 'User'}</div>
                <div className="user-menu-email">{user?.email || t('sidebar.noEmail')}</div>
              </div>
            </div>

            {/* 积分信息 */}
            <div className="user-menu-credits">
              <div className="credits-item">
                <Coins size={14} className="credits-icon" />
                <span className="credits-label">{t('sidebar.userMenu.credits')}</span>
                <span className="credits-value">{user?.credits || 0}</span>
              </div>
              <div className="credits-item">
                <Crown size={14} className="credits-icon" />
                <span className="credits-label">{getPlanLabel()}</span>
              </div>
            </div>

            {/* 分割线 */}
            <div className="user-menu-divider"></div>

            {/* 菜单项（移除个人资料与设置，仅保留升级） */}
            <div className="user-menu-items">
              <button className="user-menu-item" onClick={() => { navigate('/pricing-comparison'); setMenuOpen(false); }}>
                <Crown size={16} className="menu-item-icon" />
                <span>{t('sidebar.userMenu.upgrade')}</span>
              </button>
            </div>

            {/* 分割线 */}
            <div className="user-menu-divider"></div>

            {/* 退出按钮 */}
            <button className="user-menu-item logout-item" onClick={logout}>
              <LogOut size={16} className="menu-item-icon" />
              <span>{t('sidebar.logout')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;


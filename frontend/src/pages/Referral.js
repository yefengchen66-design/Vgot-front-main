import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Referral.css';
import { useLanguage } from '../contexts/LanguageContext';

// 从环境变量获取API基础URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function Referral() {
  const { t } = useLanguage();
  const [referralData, setReferralData] = useState({
    referralCode: '',
    totalReferred: 0,
    referralEarnings: 0.00
  });
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReferralInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/referral-info`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setReferralData(response.data);
      } catch (error) {
        console.error('Failed to fetch referral info:', error);
      }
    };

    if (user) {
      fetchReferralInfo();
    }
  }, [user]);

  const referralLink = `${window.location.origin}?ref=${referralData.referralCode}`;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      alert(t('referral.alerts.copied').replace('{label}', label));
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="referral-container">
      <div className="referral-header">
        <h1>{t('referral.title')}</h1>
        <p>{t('referral.subtitle')}</p>
      </div>

      {/* Referral Code Card */}
      <div className="referral-code-card">
        <div className="card-header">
          <span className="gift-icon">🎁</span>
          <span>{t('referral.codeCard.yourCode')}</span>
        </div>
        <div className="referral-code">{referralData.referralCode}</div>
        <p className="card-description">{t('referral.codeCard.description')}</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">👥</span>
            <span>{t('referral.stats.users')}</span>
          </div>
          <div className="stat-value">{referralData.totalReferred}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <span>{t('referral.stats.earnings')}</span>
          </div>
          <div className="stat-value">${referralData.referralEarnings.toFixed(2)}</div>
          <p className="stat-subtitle">{t('referral.stats.cashback')}</p>
        </div>
      </div>

      {/* Share Section */}
      <div className="share-section">
        <h3>{t('referral.share.title')}</h3>
        
        <div className="share-item">
          <label>{t('referral.share.code')}</label>
          <div className="input-with-copy">
            <input 
              type="text" 
              value={referralData.referralCode} 
              readOnly 
              className="share-input"
            />
            <button 
              className="copy-button"
              onClick={() => copyToClipboard(referralData.referralCode, '推荐码')}
            >
              📋
            </button>
          </div>
        </div>

        <div className="share-item">
          <label>{t('referral.share.link')}</label>
          <div className="input-with-copy">
            <input 
              type="text" 
              value={referralLink} 
              readOnly 
              className="share-input"
            />
            <button 
              className="copy-button"
              onClick={() => copyToClipboard(referralLink, '推荐链接')}
            >
              📋
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h3>{t('referral.how.title')}</h3>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>{t('referral.how.step1Title')}</h4>
              <p>{t('referral.how.step1Desc')}</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>{t('referral.how.step2Title')}</h4>
              <p>{t('referral.how.step2Desc')}</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>{t('referral.how.step3Title')}</h4>
              <p>{t('referral.how.step3Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Referral;
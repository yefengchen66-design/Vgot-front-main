import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiVideo, FiMessageSquare} from 'react-icons/fi';
import { FaChild } from "react-icons/fa";
import './Workspace.css';
import { useLanguage } from '../contexts/LanguageContext';

function Workspace() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="page workspace-page">
      <div className="page-header">
        <h1 className="page-title">{t('workspace.title')}</h1>
      </div>

      <div className="action-cards grid grid-3">
        <div className="action-card" onClick={() => navigate('/video-generation')}>
          <div className="action-icon video-icon">
            <FiVideo />
          </div>
          <div className="action-content">
            <h3 className="action-title">{t('workspace.cards.generateTitle')}</h3>
            <p className="action-description">{t('workspace.cards.generateDesc')}</p>
          </div>
          {/* Removed Sora 2 badge per request */}
        </div>

        <div className="action-card" onClick={() => navigate('/video-analysis')}>
          <div className="action-icon analysis-icon">
            <FiMessageSquare />
          </div>
          <div className="action-content">
            <h3 className="action-title">{t('workspace.cards.analyzeTitle')}</h3>
            <p className="action-description">{t('workspace.cards.analyzeDesc')}</p>
          </div>
        </div>
    
          <div className="action-card" onClick={() => navigate('/super-ip')}>
          <div className="action-icon digitalhuman-icon">
            <FaChild />
          </div>
          <div className="action-content">
            <h3 className="action-title">{t('workspace.cards.digitalTitle')}</h3>
            <p className="action-description">{t('workspace.cards.digitalDesc')}</p>
          </div>
        </div>
      </div>

      <div className="powered-by">{t('workspace.poweredBy')}</div>
    </div>
  );
}

export default Workspace;


import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Payment.css';
import { useLanguage } from '../contexts/LanguageContext';

// 从环境变量获取API基础URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function Payment() {
  const { t } = useLanguage();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('deposit');
  const { user } = useAuth();

  // 模拟用户余额，如果后端没有balance字段的话
  const userBalance = user?.balance || 0;

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      alert(t('payment.alerts.enterValidAmount'));
      return;
    }

    setLoading(true);
    try {
      // 调用后端创建Stripe支付会话
      const response = await axios.post(`${API_BASE_URL}/api/payments/create-checkout-session`, {
        amount: Math.round(amount * 100), // 转换为分
        currency: 'usd'
      });
      
      // 跳转到Stripe支付页面
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert(t('payment.alerts.createSessionFail'));
      }
    } catch (error) {
      console.error('充值失败:', error);
      alert(t('payment.alerts.depositFail').replace('{msg}', error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert(t('payment.alerts.enterValidAmount'));
      return;
    }

    if (amount > userBalance) {
      alert(t('payment.alerts.insufficient'));
      return;
    }

    setLoading(true);
    try {
      // 调用后端提现API
      const response = await axios.post(`${API_BASE_URL}/api/payments/withdraw-request`, {
        amount: amount,
        payment_method: 'bank_transfer' // 或者其他提现方式
      });
      
      alert(t('payment.alerts.withdrawSubmitted').replace('${amount}', String(amount)));
      setWithdrawAmount('');
    } catch (error) {
      console.error('提现失败:', error);
      alert(t('payment.alerts.withdrawFail').replace('{msg}', error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [10, 50, 100, 500];

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>{t('payment.title')}</h1>
        <p>{t('payment.subtitle')}</p>
      </div>

      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-label">Balance</div>
        <div className="balance-amount">${userBalance.toFixed(2)}</div>
      </div>

      {/* Payment Tabs */}
      <div className="payment-tabs-container">
        <div className="payment-tabs">
          <button 
            className={`payment-tab-button ${activeTab === 'deposit' ? 'active' : ''}`}
            onClick={() => setActiveTab('deposit')}
          >
            <span className="tab-icon">↙</span>
            {t('payment.tabs.deposit')}
          </button>
          <button 
            className={`payment-tab-button ${activeTab === 'withdraw' ? 'active' : ''}`}
            onClick={() => setActiveTab('withdraw')}
          >
            <span className="tab-icon">↗</span>
            {t('payment.tabs.withdraw')}
          </button>
        </div>

        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <div className="payment-tab-content">
            <div className="form-group">
              <label className="form-label">{t('payment.form.amount')}</label>
              <div className="input-container">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="amount-input"
                />
              </div>
            </div>

            <div className="quick-amounts">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  className="quick-amount-button"
                  onClick={() => setDepositAmount(amount.toString())}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">{t('payment.form.paymentMethod')}</label>
              <div className="payment-method">
                <span className="payment-icon">💳</span>
                <span>{t('payment.form.card')}</span>
              </div>
            </div>

            <button
              onClick={handleDeposit}
              disabled={loading || !depositAmount}
              className="action-button"
            >
              {loading ? t('payment.form.processing') : t('payment.form.depositBtn').replace('${amount}', depositAmount || '0.00')}
            </button>
          </div>
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <div className="payment-tab-content">
            <div className="form-group">
              <label className="form-label">{t('payment.form.amount')}</label>
              <div className="input-container">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  max={userBalance}
                  className="amount-input"
                />
              </div>
              <p className="available-balance">
                {t('payment.form.available').replace('${amount}', userBalance.toFixed(2))}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">{t('payment.form.paymentMethod')}</label>
              <div className="payment-method">
                <span className="payment-icon">🏦</span>
                <span>{t('payment.form.bank')}</span>
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={loading || !withdrawAmount}
              className="action-button"
            >
              {loading ? t('payment.form.processing') : t('payment.form.withdrawBtn').replace('${amount}', withdrawAmount || '0.00')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
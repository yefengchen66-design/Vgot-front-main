import React, { useState, useEffect } from 'react';
import { Zap, BarChart3, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function CreditPack({ amount, price, isPopular, onPurchase, purchasing, t }) {
  return (
    <div className={`relative flex items-center justify-between p-5 rounded-xl border transition-all cursor-pointer shadow-md hover:shadow-xl ${isPopular ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/50 hover:border-purple-400/60 hover:bg-purple-900/40' : 'bg-gradient-to-br from-white/[0.07] to-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/10'}`}
      onClick={() => !purchasing && onPurchase(amount, price)}>
      {isPopular && (
        <span className="absolute -top-2.5 left-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {t.bestValue}
        </span>
      )}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shadow-inner">
          <Zap size={22} fill="currentColor" />
        </div>
        <div>
          <p className="font-bold text-white text-base">{amount.toLocaleString()} {t.credits}</p>
          <p className="text-sm text-gray-400 font-medium">{t.instantDelivery}</p>
        </div>
      </div>
      <button 
        disabled={purchasing}
        className={`bg-white text-black text-base font-bold px-5 py-2.5 rounded-lg transition-all shadow-lg ${
          purchasing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'
        }`}
      >
        {purchasing ? t.processing : price}
      </button>
    </div>
  );
}

// 自定义购买积分包组件
function CustomCreditPack({ onPurchase, t }) {
  const [rawInput, setRawInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const MIN_CREDITS = 1000;

  // 解析数值
  const credits = rawInput === '' ? 0 : parseInt(rawInput, 10);
  const isInteger = Number.isInteger(credits);
  // 约束：每 1 美分 = 10 积分 -> 输入需为 10 的倍数，才能与 Stripe 金额精确对应
  const isStep10 = isInteger && credits % 10 === 0;
  const isValid = isInteger && credits >= MIN_CREDITS && isStep10;
  const priceNumber = isValid ? credits / 1000 : (isInteger ? credits / 1000 : 0);
  // 精确换算：cents = credits / 10（已通过 isStep10 保证为整数）
  const priceInCents = isStep10 ? (credits / 10) : 0;

  function handleCheckout(e) {
    e.stopPropagation();
    if (!isInteger || credits < MIN_CREDITS) {
      setError(t.minPurchaseError?.replace?.('{amount}', MIN_CREDITS.toLocaleString()) || `最少购买 ${MIN_CREDITS.toLocaleString()} 积分`);
      return;
    }
    if (!isStep10) {
      setError('输入需为 10 的倍数（每 1 美分 = 10 积分）');
      return;
    }
    setError(null);
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError(t.pleaseLogin);
      setLoading(false);
      return;
    }
    axios.post(`${API_BASE_URL}/api/payments/create-checkout-session`, {
      amount: priceInCents,
      currency: 'usd'
    }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const url = res.data.url;
        if (url) {
          window.location.href = url;
        } else {
          setError(t.paymentLinkError);
        }
      })
      .catch(err => {
        setError(err.response?.data?.detail || t.createSessionError);
      })
      .finally(() => setLoading(false));
  }

  // 输入框显示格式化
  function handleInputChange(e) {
    const v = e.target.value.replace(/[^0-9]/g, '');
    if (v.length > 9) return; 
    setRawInput(v);
    if (error) setError(null);
  }

  return (
    <div className={`relative flex items-center justify-between p-5 rounded-xl border transition-all duration-300 ${
      isValid 
        ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
        : 'bg-gradient-to-br from-white/[0.07] to-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/10'
    }`}>
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          isValid 
            ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
            : 'bg-white/5 border border-white/10 text-gray-500'
        }`}>
          <Zap size={22} className={isValid ? "drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" : ""} />
        </div>
        
        <div className="flex flex-col flex-1">
          <div className="flex items-baseline gap-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder={t.customPlaceholder}
              value={rawInput}
              onChange={handleInputChange}
              className="bg-transparent text-xl font-bold text-white placeholder-gray-600 outline-none w-32 border-b-2 border-transparent focus:border-purple-500 transition-all pb-0.5"
            />
            <span className={`text-base font-bold transition-colors ${isValid ? 'text-white' : 'text-gray-500'}`}>{t.credits}</span>
          </div>
          <p className="text-xs font-medium mt-1 transition-colors text-gray-500">
             {error ? (
               <span className="text-red-400">{error}</span>
             ) : (
               <>
                 <span>{t.customRate}</span>
                 <span className="ml-2 text-gray-400">· 输入需为10的倍数（每1美分=10积分）</span>
               </>
             )}
          </p>
        </div>
      </div>

      <button
        disabled={loading || !isValid}
        onClick={handleCheckout}
        className={`relative px-6 py-2.5 rounded-lg font-bold text-base transition-all duration-300 min-w-[100px] flex justify-center ${
          isValid 
            ? 'bg-white text-black hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
            : 'bg-white/10 text-gray-500 cursor-not-allowed'
        }`}
      >
        {loading ? (
           <RefreshCw size={20} className="animate-spin opacity-50" />
        ) : (
           <span>${(isStep10 ? (credits/1000) : Math.max(0, Math.floor(credits/10)/100)).toFixed(2)}</span>
        )}
      </button>
    </div>
  );
}

export default function CreditsAndUsagePage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // purchasing will hold the `amount` of the pack currently being purchased, or null when none
  const [purchasing, setPurchasing] = useState(null);
  const [creditsData, setCreditsData] = useState({
    credits: 0,
    monthly_credits: 0,
    tier: 'Free'
  });
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;
  // i18n via shared LanguageContext
  const t = translations[language]?.credits || translations['en'].credits;

  const fetchCreditsData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('请先登录');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // 获取积分余额
      const balanceResponse = await axios.get(`${API_BASE_URL}/api/credits/balance`, { headers });
      if (balanceResponse.data.success) {
        setCreditsData(balanceResponse.data.data);
      }

      // 获取交易历史
      const historyResponse = await axios.get(`${API_BASE_URL}/api/credits/history?limit=20`, { headers });
      if (historyResponse.data.success) {
        setTransactions(historyResponse.data.data.transactions);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching credits data:', err);
      setError(err.response?.data?.detail || '加载失败，请重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCreditsData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCreditsData();
  };

  const handlePurchase = async (amount, price) => {
    // mark this pack (by amount) as purchasing so only its button shows loading
    setPurchasing(amount);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        setPurchasing(false);
        return;
      }

      // 将价格转换为美分 (去掉 $ 符号并乘以 100)
      const priceInCents = parseInt(price.replace('$', '')) * 100;

      console.log('🛒 创建支付会话:', { amount: priceInCents, credits: amount });

      // 调用后端创建 Stripe Checkout Session
      const response = await axios.post(
        `${API_BASE_URL}/api/payments/create-checkout-session`,
        {
          amount: priceInCents,
          currency: 'usd'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

  if (response.data.url) {
        console.log('✅ 支付会话创建成功，跳转到:', response.data.url);
        
        // 跳转到 Stripe Checkout 页面
        window.location.href = response.data.url;
      } else {
        throw new Error('未能获取支付链接');
      }
    } catch (err) {
      console.error('❌ 创建支付会话失败:', err);
      alert(err.response?.data?.detail || '创建支付会话失败，请重试');
      // clear purchasing state for the failing pack
      setPurchasing(null);
    }
  };

  const calculateUsagePercentage = () => {
    const total = creditsData.credits + creditsData.monthly_credits;
    if (total === 0) return 0;
    return Math.round((creditsData.monthly_credits / total) * 100);
  };

  // 分页计算
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const localizeStatus = (status) => {
    if (!status) return '';
    switch (status) {
      case 'Success':
        return t.statusSuccess || status;
      case 'Completed':
        return t.statusCompleted || status;
      case 'Pending':
        return t.statusPending || status;
      case 'Failed':
        return t.statusFailed || status;
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="pt-16 pb-12 h-full flex items-center justify-center" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
        <div className="loading-state">
          <div className="spinner"></div>
          <p className="text-gray-400 mt-4">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 pb-12 h-full flex items-center justify-center" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  const usagePercentage = calculateUsagePercentage();

  return (
    <div className="pt-16 pb-12 h-full flex flex-col" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 text-white">{t.pageTitle}</h1>
        <p className="text-gray-400 text-base">{t.pageSubtitle}</p>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0 w-full">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden shadow-xl shadow-purple-500/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-2">{t.currentCredits}</h3>
            <div className="flex items-end gap-2 mb-5 relative z-10">
              <span className="text-5xl font-black text-white tracking-tight">{creditsData.credits.toLocaleString()}</span>
              <span className="text-sm text-purple-300 font-semibold mb-2">{t.credits}</span>
            </div>
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden mb-2 shadow-inner">
              <div 
                className="bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 h-full rounded-full shadow-lg transition-all duration-500"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 font-medium">{t.monthlyUsage} {usagePercentage}%</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2.5">
              <div className="bg-yellow-500/10 p-1.5 rounded-lg">
                <Zap size={20} className="fill-yellow-400 text-yellow-400" />
              </div>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{t.purchaseTitle}</span>
            </h3>
            <div className="space-y-4">
              <CreditPack amount={10000} price="$10" onPurchase={handlePurchase} purchasing={purchasing === 10000} t={t} />
              <CreditPack amount={55000} price="$50" isPopular onPurchase={handlePurchase} purchasing={purchasing === 55000} t={t} />
              <CreditPack amount={120000} price="$100" onPurchase={handlePurchase} purchasing={purchasing === 120000} t={t} />
              {/* 自定义购买套餐包 */}
              <CustomCreditPack onPurchase={handlePurchase} t={t} />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-8 flex flex-col h-full backdrop-blur-sm shadow-xl">
          <div className="mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2.5">
              <div className="bg-gray-500/10 p-1.5 rounded-lg">
                <BarChart3 size={20} className="text-gray-300" />
              </div>
              <span className="text-white">{t.transactionTitle}</span>
            </h3>
          </div>
          
          <div className="overflow-auto flex-1">
            {transactions.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                {t.noTransactions}
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-gray-400 uppercase border-b border-white/10">
                    <th className="pb-4 font-semibold pl-3">{t.tableHeaderAction}</th>
                    <th className="pb-4 font-semibold">{t.tableHeaderTime}</th>
                    <th className="pb-4 font-semibold text-right">{t.tableHeaderCredits}</th>
                    <th className="pb-4 font-semibold text-right pr-3">{t.tableHeaderStatus}</th>
                  </tr>
                </thead>
                <tbody className="text-base text-gray-300">
                  {currentTransactions.map((log) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all group">
                      <td className="py-5 pl-3">
                        <span className="font-semibold text-white">{log.action}</span>
                      </td>
                      <td className="py-5 text-gray-400 font-medium">{log.date}</td>
                      <td className={`py-5 text-right font-mono font-bold ${log.cost.startsWith('+') ? 'text-green-400' : 'text-gray-200'}`}>
                        {log.cost}
                      </td>
                      <td className="py-5 text-right pr-3">
                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold shadow-sm ${
                          log.status === 'Success' || log.status === 'Completed' 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                        }`}>
                          {localizeStatus(log.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 分页控件 */}
          {transactions.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
              <div className="text-sm text-gray-400">
                {t.showing
                  .replace('{start}', startIndex + 1)
                  .replace('{end}', Math.min(endIndex, transactions.length))
                  .replace('{total}', transactions.length)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentPage === 1
                      ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:shadow-lg'
                  }`}
                >
                  {t.previousPage}
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentPage === totalPages
                      ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:shadow-lg'
                  }`}
                >
                  {t.nextPage}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

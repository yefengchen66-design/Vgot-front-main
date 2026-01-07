import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// 可根据需要抽离到 services
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

// 会员各等级的积分设定（用于显示及百分比计算）
const TIER_MONTHLY_CREDITS = {
   Free: 0, // 注册赠送一次性 200 不算月度配额，这里显示 0 并在界面用提示说明
   Creator: 30000,
   Business: 120000,
   Enterprise: 0 // 企业版自定义
};

function nextTierOf(tier) {
   switch (tier) {
      case 'Free': return 'Creator';
      case 'Creator': return 'Business';
      case 'Business': return 'Enterprise';
      default: return null; // Enterprise 已最高
   }
}

export default function SubscriptionPage() {
   const navigate = useNavigate();
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [errorCode, setErrorCode] = useState(null); // store error key, translate at render
   const [banner, setBanner] = useState(null); // { type: 'success'|'info'|'error', text: string }
   const { t, lang } = useLanguage();

   // Quick helper to start a subscription checkout for testing (Creator plan)
   const startSubscriptionCheckout = async (tier = 'creator', cycle = 'monthly') => {
      try {
         const token = localStorage.getItem('token');
         if (!token) { setErrorCode('notLoggedIn'); return; }
         const res = await fetch(`${API_BASE}/api/membership/checkout`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ tier, cycle }),
         });
         if (!res.ok) throw new Error(await res.text());
         const data = await res.json();
         const url = data?.checkout_url || data?.url;
         if (url) {
            window.location.href = url;
         } else {
            setBanner({ type: 'error', text: '未返回 checkout_url' });
         }
      } catch (e) {
         console.error('Start subscription checkout failed:', e);
         setBanner({ type: 'error', text: e.message || '创建订阅会话失败' });
      }
   };

   // 测试用的 Product 订阅入口已移除

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
         setErrorCode('notLoggedIn');
         setLoading(false);
         return;
      }
      (async () => {
         try {
            const res = await fetch(`${API_BASE}/api/credits/balance`, {
               headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            const u = data.data || data.user || data;
            setUser(u);
         } catch (e) {
            setErrorCode('fetchFailed');
         } finally {
            setLoading(false);
         }
      })();
   }, [t]);

   // Detect Stripe return and show success banner + refresh balance
   useEffect(() => {
      const params = new URLSearchParams(window.location.search || '');
      const mightBeCheckoutReturn = params.has('session_id') || params.has('checkout_session_id') || params.get('success') === 'true' || params.get('stripe') === 'success' || params.get('paid') === 'true';
      if (!mightBeCheckoutReturn) return;
      const token = localStorage.getItem('token');
      if (!token) return;
      (async () => {
         try {
            // Small delay to allow webhook to process in production if needed
            await new Promise(r => setTimeout(r, 600));
            const res = await fetch(`${API_BASE}/api/credits/balance`, {
               headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
               const data = await res.json();
               const u = data.data || data.user || data;
               setUser(u);
               // Compose success banner text
               // Simplify: use generic success message without cycle-specific amounts
               setBanner({ type: 'success', text: t('subscriptionPage.successGeneric') });
            }
         } catch (e) {
            // no-op
         } finally {
            // Clean URL
            try {
               const url = new URL(window.location.href);
               url.search = '';
               window.history.replaceState({}, document.title, url.toString());
            } catch {}
         }
      })();
   }, [t]);

   const tier = user?.tier || 'Free';
   const nextTier = nextTierOf(tier);
   const monthlyTotal = TIER_MONTHLY_CREDITS[tier] || 0;
   // monthly_credits 字段记录“已用”，credits 是余额（含赠送）。这里假设 used=monthly_credits，remaining=credits。
   const used = user?.monthly_credits || 0;
   const remaining = user?.credits ?? 0;
   const percentUsed = monthlyTotal > 0 ? Math.min(100, Math.round((used / monthlyTotal) * 100)) : 0;

   function translateTierName(name) {
      switch (name) {
         case 'Creator': return t('subscriptionPage.creatorName');
         case 'Business': return t('subscriptionPage.businessName');
         case 'Enterprise': return t('subscriptionPage.enterpriseName');
         case 'Free': return 'Free'; // keep brand name
         default: return name;
      }
   }

   function formatExpiry() {
      const prefix = t('subscriptionPage.expiryPrefix');
      if (tier === 'Free') return prefix + t('subscriptionPage.expiryFree');
      if (tier === 'Enterprise' || !user?.membership_expires_at) return prefix + t('subscriptionPage.expiryCustom');
      try {
         const d = new Date(user.membership_expires_at);
         if (lang === 'zh' || lang === 'zh-TW') {
            return `${prefix}${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
         }
         return `${prefix}${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      } catch { return prefix + t('subscriptionPage.expiryUnknown'); }
   }

   return (
      <div className="pt-16 pb-12" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
         <div className="flex justify-between items-end mb-6">
            <div>
               <h1 className="text-3xl font-bold mb-2 text-white">{t('subscriptionPage.title')}</h1>
               <p className="text-gray-400">
                  {t('subscriptionPage.statusLabel')}<span className="text-blue-400 font-bold">{translateTierName(tier)} {tier === 'Free' ? t('subscriptionPage.freeSuffix') : t('subscriptionPage.planSuffix')}</span>
               </p>
            </div>
            <button
               onClick={() => navigate('/pricing-comparison')}
               className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            >
               <Crown size={18} /> {t('subscriptionPage.compareButton')}
            </button>
         </div>

         {errorCode && (
            <div className="flex items-center gap-2 text-red-400 mb-4 text-sm">
               <AlertCircle size={16} /> {t(`subscriptionPage.errors.${errorCode}`)}
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* 当前套餐卡片 */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Sparkles size={70} />
               </div>
               <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">{t('subscriptionPage.currentPlanCardLabel')}</h3>
               <div className="text-2xl font-bold text-white mb-1">{tier.toUpperCase()}</div>
               <p className="text-gray-400 text-xs mb-3">{formatExpiry()}</p>
               <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                     <span className="text-gray-400">{user?.billing_cycle === 'yearly' ? t('subscriptionPage.yearlyCreditsLabel') : t('subscriptionPage.monthlyCreditsLabel')}</span>
                     <span>{monthlyTotal.toLocaleString()}</span>
                  </div>
                  {/* Yearly upfront info removed per request; keep UI simple */}
                  {/* 移除视频去水印行，应用户要求保持高度，可用占位 */}
                  <div className="flex justify-between text-xs invisible">
                     <span className="text-gray-400">{t('subscriptionPage.placeholderLabel')}</span>
                     <span className="text-green-400">{t('subscriptionPage.placeholderLabel')}</span>
                  </div>
               </div>
               <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-xs font-medium transition-colors mt-auto">
                  {t('subscriptionPage.manageButton')}
               </button>
            </div>

            {/* 使用百分比卡片 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
               <div className="w-28 h-28 rounded-full border-8 border-purple-500/20 flex items-center justify-center mb-3 relative">
                  <div className="absolute inset-0 rounded-full" style={{
                     background: `conic-gradient(#8b5cf6 ${percentUsed}%, rgba(139,92,246,0.15) ${percentUsed}% 100%)`
                  }} />
                  <div className="relative flex flex-col items-center">
                     <span className="text-2xl font-bold text-white">{percentUsed}%</span>
                     <span className="text-[10px] text-gray-400">{t('subscriptionPage.usedLabel')}</span>
                  </div>
               </div>
               <p className="text-sm text-gray-400 mb-3">{t('subscriptionPage.remainingLabelPrefix')} {monthlyTotal > 0 ? (monthlyTotal - used).toLocaleString() : remaining.toLocaleString()}</p>
               <button className="text-purple-400 text-sm hover:text-purple-300 hover:underline">
                  {t('subscriptionPage.buyExtraCredits')}
               </button>
            </div>

            {/* 升级卡片 */}
            <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-2xl p-6 flex flex-col">
               {nextTier ? (
                  <>
                     <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
                        <Crown size={18} /> {t('subscriptionPage.upgradePrefix')}{translateTierName(nextTier)}
                     </div>
                     <p className="text-xs text-gray-400 mb-4">{t('subscriptionPage.upgradeBenefitsIntro')}</p>
                     <ul className="space-y-2 mb-auto">
                        {nextTier !== 'Enterprise' && (
                           <li className="flex items-center gap-2 text-sm text-gray-300">
                              <Check size={14} className="text-green-400" /> {TIER_MONTHLY_CREDITS[nextTier].toLocaleString()} {t('subscriptionPage.benefitMonthlyCreditsSuffix')}
                           </li>
                        )}
                        {nextTier === 'Business' && (
                           <li className="flex items-center gap-2 text-sm text-gray-300">
                              <Check size={14} className="text-green-400" /> {t('subscriptionPage.benefitTeamCollaboration')}
                           </li>
                        )}
                        {nextTier === 'Enterprise' && (
                           <li className="flex items-center gap-2 text-sm text-gray-300">
                              <Check size={14} className="text-green-400" /> {t('subscriptionPage.benefitEnterpriseCustom')}
                           </li>
                        )}
                     </ul>
                     <button
                        onClick={() => navigate('/pricing-comparison')}
                        className="w-full mt-4 bg-white text-black hover:bg-gray-200 py-2 rounded-lg text-sm font-bold transition-colors"
                     >
                        {t('subscriptionPage.upgradeButton')}
                     </button>
                  </>
               ) : (
                  <div className="flex flex-col h-full">
                     <div className="flex items-center gap-2 mb-2 text-purple-300 font-bold text-sm">
                        <Crown size={18} /> {t('subscriptionPage.highestTitle')}
                     </div>
                     <p className="text-xs text-gray-400 mb-4">{t('subscriptionPage.highestDescription')}</p>
                     <div className="text-xs text-gray-500 mt-auto">{t('subscriptionPage.highestContact')}</div>
                  </div>
               )}
            </div>
         </div>

                {/* 测试订阅卡片已移除 */}
      {banner && (
         <div className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-50 px-4 py-2 rounded-lg shadow-lg text-sm ${banner.type === 'success' ? 'bg-green-600 text-white' : banner.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-700 text-white'}`}>
            {banner.text}
            <button className="ml-3 text-white/80 hover:text-white" onClick={() => setBanner(null)}>×</button>
         </div>
      )}
      </div>
   );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, Check } from 'lucide-react';
import { PricingCards } from '../components/pricing/PricingCards';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// 等级对应的月度积分配额
const TIER_MONTHLY_CREDITS = {
  'Free': 0,
  'Creator': 30000,
  'Business': 120000,
  'Enterprise': 999999
};

// 等级显示名称
const TIER_NAMES = {
  'Free': 'Free 免费版',
  'Creator': 'Creator 创作者计划',
  'Business': 'Business 商业版',
  'Enterprise': 'Enterprise 企业版'
};

export default function SubscriptionPageWithAPI() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    tier: 'Free',
    credits: 0,
    monthly_credits: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('请先登录');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/credits/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserData(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const calculateUsagePercentage = () => {
    const monthlyLimit = TIER_MONTHLY_CREDITS[userData.tier] || 0;
    if (monthlyLimit === 0) return 0;
    return Math.round((userData.monthly_credits / monthlyLimit) * 100);
  };

  const getRemainingCredits = () => {
    const monthlyLimit = TIER_MONTHLY_CREDITS[userData.tier] || 0;
    return Math.max(0, monthlyLimit - userData.monthly_credits);
  };

  if (loading) {
    return (
      <div className="pt-16 pb-12" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
        <div className="loading-state">
          <div className="spinner"></div>
          <p className="text-gray-400 mt-4">加载订阅计划...</p>
        </div>
      </div>
    );
  }

  const usagePercentage = calculateUsagePercentage();
  const remainingCredits = getRemainingCredits();

  return (
    <div className="pt-16 pb-12" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">订阅计划</h1>
          <p className="text-gray-400">
            当前状态：<span className="text-blue-400 font-bold">{TIER_NAMES[userData.tier]}</span>
          </p>
        </div>
        <button 
          onClick={() => navigate('/pricing-comparison')} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <Crown size={18} /> 查看完整权益对比
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         {/* 当前套餐卡片 */}
         <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
               <Sparkles size={70} />
            </div>
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">当前套餐</h3>
            <div className="text-2xl font-bold text-white mb-1">{userData.tier.toUpperCase()}</div>
            <p className="text-gray-400 text-xs mb-3">将于 2023年11月24日 续费</p>
            <div className="space-y-2 mb-4">
               <div className="flex justify-between text-xs">
                  <span className="text-gray-400">月度积分</span> 
                  <span>{TIER_MONTHLY_CREDITS[userData.tier].toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-gray-400">视频去水印</span> 
                  <span className="text-green-400">{userData.tier !== 'Free' ? '已激活' : '未激活'}</span>
               </div>
            </div>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-xs font-medium transition-colors">
               管理订阅
            </button>
         </div>
         
         {/* 使用进度卡片 */}
         <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <div className="w-28 h-28 rounded-full border-8 border-purple-500/20 border-t-purple-500 flex flex-col items-center justify-center mb-3 relative">
               <span className="text-2xl font-bold text-white">{usagePercentage}%</span>
               <span className="text-[10px] text-gray-400">已使用</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              本月剩余积分: {remainingCredits.toLocaleString()}
            </p>
            <button 
              onClick={() => window.location.href = '/credits'}
              className="text-purple-400 text-sm hover:text-purple-300 hover:underline"
            >
               购买额外积分包 &rarr;
            </button>
         </div>
         
         {/* 升级卡片 */}
         <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
               <Crown size={18} /> 
               {userData.tier === 'Free' ? '升级到创作者' : 
                userData.tier === 'Creator' ? '升级到商业版' : 
                '升级到企业版'}
            </div>
            <p className="text-xs text-gray-400 mb-4">
               {userData.tier === 'Free' ? '解锁所有功能，获得 30,000 月度积分。' :
                userData.tier === 'Creator' ? '获得更多协作席位和 API 访问权限。' :
                '定制化解决方案，专属技术支持。'}
            </p>
            <ul className="space-y-2 mb-auto">
               {userData.tier === 'Free' && (
                 <>
                   <li className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={14} className="text-green-400"/> 30,000 积分/月
                   </li>
                   <li className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={14} className="text-green-400"/> 视频去水印
                   </li>
                 </>
               )}
               {userData.tier === 'Creator' && (
                 <>
                   <li className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={14} className="text-green-400"/> 120,000 积分/月
                   </li>
                   <li className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={14} className="text-green-400"/> 团队协作功能
                   </li>
                 </>
               )}
               {(userData.tier === 'Business' || userData.tier === 'Enterprise') && (
                 <>
                   <li className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={14} className="text-green-400"/> 无限积分
                   </li>
                   <li className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={14} className="text-green-400"/> 专属支持
                   </li>
                 </>
               )}
            </ul>
            <button 
              onClick={() => navigate('/pricing-comparison')} 
              className="w-full mt-4 bg-white text-black hover:bg-gray-200 py-2 rounded-lg text-sm font-bold transition-colors"
            >
               去升级
            </button>
         </div>
      </div>
    </div>
  );
}

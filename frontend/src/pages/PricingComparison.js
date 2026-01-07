import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PricingCards } from '../components/pricing/PricingCards';
import { useLanguage } from '../contexts/LanguageContext';

export default function PricingComparison() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] py-8 px-12">
      {/* Back button */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t('pricing.fullComparison.back', 'Back')}</span>
        </button>
      </div>

      {/* Page title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          {t('pricing.fullComparison.title', 'Full Benefits Comparison')}
        </h1>
        <p className="text-gray-400 text-lg">
          {t('pricing.fullComparison.subtitle', 'Choose the plan that suits you best and unlock more creative possibilities')}
        </p>        {/* 按月/按年 切换，与登录页定价保持一致 */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="inline-flex items-center gap-3 px-2 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-full text-sm transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-[#4f46e5] to-[#ec4899] text-white shadow-lg'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              {t('pricing.hero.monthly', '按月')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-full text-sm transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-[#4f46e5] to-[#ec4899] text-white shadow-lg'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              <span>{t('pricing.hero.yearly', '按年')}</span>
              <span className="text-[#4ADE80] text-xs border border-[#4ADE80] rounded px-2 py-0.5">
                {t('pricing.hero.saveUp', '节省 20%')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 定价卡片 */}
      <div className="max-w-7xl mx-auto">
        <PricingCards billingCycle={billingCycle} />
      </div>
    </div>
  );
}

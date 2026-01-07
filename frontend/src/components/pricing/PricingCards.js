import React, { useState } from 'react';
import { Check, X, ArrowRight, Sparkles, Lock, Zap, Gift, Clock, Infinity, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";
// Animations temporarily removed to avoid missing dependency; can add framer-motion later if needed

export function PricingCards({ billingCycle }) {
  const { language } = useLanguage();
  const t = translations[language].pricing.plans;
  // 记录当前加载中的套餐，避免重复点击
  const [loadingPlan, setLoadingPlan] = useState(null);
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

  const startCheckout = async (planId) => {
    if (planId === 'free') {
      window.location.hash = '#auth';
      return;
    }
    if (planId === 'enterprise') {
      window.location.hash = '#contact-sales';
      return;
    }
    try {
      setLoadingPlan(planId);
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#auth';
        setLoadingPlan(null);
        return;
      }
      const res = await fetch(`${API_BASE}/api/membership/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tier: planId, cycle: billingCycle })
      });
      if (!res.ok) {
        const txt = await res.text();
        alert('创建结算会话失败: ' + txt);
        setLoadingPlan(null);
        return;
      }
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert('未返回 checkout_url');
      }
    } catch (e) {
      console.error('Checkout error', e);
      alert('请求异常: ' + e.message);
    } finally {
      setLoadingPlan(null);
    }
  };



  const plans = [
    {
      id: 'free',
      data: t.free,
      price: {
        monthly: { amount: 0, display: '$0' },
        yearly: { amount: 0, display: '$0' }
      },
    },
    {
      id: 'creator',
      data: t.creator,
      price: {
        monthly: { amount: 29, display: '$29', total: null },
        yearly: { amount: 24.17, display: '$24', total: '$290' }
      },
    },
    {
      id: 'business',
      data: t.business,
      price: {
        monthly: { amount: 99, display: '$99', total: null },
        yearly: { amount: 82.5, display: '$82', total: '$990' }
      },
    },
    {
      id: 'enterprise',
      data: t.enterprise,
      price: {
        monthly: { amount: 0, display: t.enterprise.price },
        yearly: { amount: 0, display: t.enterprise.price }
      },
    },
  ];

  const renderFeatureIcon = (feature) => {
    if (feature.locked) return <Lock className="w-4 h-4 text-[#9ca3af]" />;
    if (feature.checked) return <Check className="w-4 h-4 text-[#22c55e]" />;
    if (feature.unlimited) return <Infinity className="w-4 h-4 text-[#a855f7]" />;
    if (feature.free) return <Sparkles className="w-4 h-4 text-[#22c55e]" />;
    if (feature.discount) return <Zap className="w-4 h-4 text-[#f59e0b]" />;
    if (feature.gift) return <Gift className="w-4 h-4 text-[#ec4899]" />;
    if (feature.custom) return <Settings className="w-4 h-4 text-[#a855f7]" />;
    if (feature.partial) return <X className="w-4 h-4 text-[#f59e0b]" />;
    return <span className="w-4 h-4" />;
  };

  return (
    <section className="py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isPopular = plan.data.popular || false;
            const isEnterprise = plan.id === 'enterprise';
            const isFree = plan.id === 'free';
            const currentPrice = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border backdrop-blur-sm p-8 transition-all hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 ${isPopular ? 'border-[#a855f7] shadow-lg shadow-purple-500/20' : 'border-white/10'
                  }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#ec4899] text-white text-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>{t.labels.mostPopular}</span>
                    </div>
                  </div>
                )}

                {/* Plan Name & Icon */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl text-white">{plan.data.name}</h3>
                    {plan.id === 'business' && <span className="text-xl">👑</span>}
                    {plan.id === 'enterprise' && <span className="text-xl">🏢</span>}
                  </div>
                  <p className="text-[#9ca3af] text-sm">{plan.data.tagline}</p>
                </div>

                {/* Price */}
                <div className="mb-6" key={billingCycle}>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl text-white">
                      {currentPrice.display}
                    </span>
                    {!isEnterprise && !isFree && (
                      <span className="text-[#9ca3af]">{t.labels.perMonth}</span>
                    )}
                  </div>

                  {/* Billed Info and Save Badge */}
                  {!isEnterprise && !isFree && (
                    <div className="space-y-2">
                      {billingCycle === 'yearly' && currentPrice.total && (
                        <p className="text-[#9ca3af] text-sm">
                          {t.labels.billed} {currentPrice.total} {t.labels.year}
                        </p>
                      )}
                      {billingCycle === 'monthly' && (
                        <p className="text-[#9ca3af] text-sm">
                          {t.labels.billedMonthly}
                        </p>
                      )}

                      {/* Save Badge */}
                      {billingCycle === 'yearly' && (
                        <div className="inline-block">
                          {plan.id === 'creator' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#4ADE80]/20 border border-[#4ADE80] text-[#4ADE80] text-xs">
                              {t.labels.save} $58
                            </span>
                          )}
                          {plan.id === 'business' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500 text-orange-400 text-xs animate-pulse">
                              {t.labels.save} $198
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Credits (always show monthly for simplicity) */}
                <div className="mb-6">
                  <div className="text-[#9ca3af] text-sm mb-1">{t.labels.monthlyCredits}</div>
                  <div className="text-white">
                    {plan.data.credits}
                    {(plan.id === 'business' || plan.id === 'creator') && (
                      <span className="ml-2 text-xs text-[#9ca3af] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t.labels.expiresMonthly}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[#9ca3af] text-sm mb-6 leading-relaxed">
                  {plan.data.description}
                </p>

                {/* CTA Button */}
                <Button
                  className={`w-full mb-8 rounded-full py-6 ${isPopular
                    ? 'bg-gradient-to-r from-[#4f46e5] to-[#ec4899] hover:from-[#4338ca] hover:to-[#db2777] text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  disabled={loadingPlan === plan.id}
                  onClick={() => startCheckout(plan.id)}
                >
                  {loadingPlan === plan.id ? t.labels.loading || '处理中...' : plan.data.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Core Features */}
                <div className="space-y-3">
                  <div className="text-white text-sm mb-4">{t.labels.coreFeatures}</div>
                  {plan.data.features && Object.entries(plan.data.features).map(([key, feature]) => (
                    <div key={key} className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {renderFeatureIcon(feature)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[#9ca3af] text-xs mb-0.5">{feature.label}</div>
                        <div className={`text-sm leading-relaxed ${feature.locked ? 'text-[#6b7280]' :
                          feature.checked || feature.unlimited || feature.free ? 'text-white' :
                            'text-[#9ca3af]'
                          }`}>
                          {feature.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

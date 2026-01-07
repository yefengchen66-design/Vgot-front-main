import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";

interface PricingHeroProps {
  billingCycle: 'monthly' | 'yearly';
  setBillingCycle: (cycle: 'monthly' | 'yearly') => void;
}

export function PricingHero({ billingCycle, setBillingCycle }: PricingHeroProps) {
  const { language } = useLanguage();
  const t = translations[language].pricing.hero;

  return (
    <section className="pt-32 pb-12 px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#4f46e5]/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-5xl lg:text-7xl mb-6 text-white tracking-tight">
            {t.title}
          </h1>
          
          <p className="text-[#9ca3af] text-xl lg:text-2xl mb-12 leading-relaxed max-w-4xl mx-auto">
            {t.subtitle}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="inline-flex items-center gap-3 px-2 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-full text-sm transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-[#4f46e5] to-[#ec4899] text-white shadow-lg'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                {t.monthly}
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-full text-sm transition-all flex items-center gap-2 ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-[#4f46e5] to-[#ec4899] text-white shadow-lg'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                <span>{t.yearly}</span>
                <span className="text-[#4ADE80] text-xs border border-[#4ADE80] rounded px-2 py-0.5">
                  {t.saveUp}
                </span>
              </button>
            </div>
          </div>

          <p className="text-[#9ca3af] text-sm mb-8">{t.noHiddenFees}</p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              className="bg-gradient-to-r from-[#4f46e5] to-[#ec4899] hover:from-[#4338ca] hover:to-[#db2777] text-white text-base px-8 py-7 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all group"
              onClick={() => window.location.hash = '#auth'}
            >
              {t.startFree}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:border-white/30 backdrop-blur-sm text-base px-8 py-7 rounded-full"
              onClick={() => {
                const element = document.getElementById('plan-comparison');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              {t.comparePlans}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

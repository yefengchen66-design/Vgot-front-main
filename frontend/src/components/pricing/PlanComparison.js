import { Check, X, Lock, Infinity, Sparkles, Zap, Gift } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";

export function PlanComparison() {
  const { language } = useLanguage();
  const t = translations[language].pricing;
  const comparison = t.comparison;

  // Plan headers
  const plans = [
    { id: 'free', name: t.plans.free.name, tagline: t.plans.free.tagline },
    { id: 'creator', name: t.plans.creator.name, tagline: t.plans.creator.tagline },
    { id: 'business', name: t.plans.business.name, tagline: t.plans.business.tagline },
    { id: 'enterprise', name: t.plans.enterprise.name, tagline: t.plans.enterprise.tagline },
  ];

  // Feature rows
  const features = [
    {
      name: comparison.features.monthlyPrice,
      free: '$0 / mo',
      creator: '$29 / mo',
      business: '$99 / mo',
      enterprise: { type: 'custom', value: comparison.customLabel || 'Custom' }
    },
    {
      name: comparison.features.monthlyCredits,
      free: comparison.features.signupBonus,
      creator: { type: 'text-expires', value: '30,000' },
      business: { type: 'text-expires', value: '120,000' },
      enterprise: { type: 'unlimited', value: comparison.features.unlimitedDemand || 'Unlimited' }
    },
    {
      name: comparison.features.scriptGeneration,
      free: { type: 'free-limited', value: comparison.features.freeLimit || 'Free (50/day)' },
      creator: { type: 'unlimited', value: comparison.features.unlimited || 'Unlimited' },
      business: { type: 'unlimited', value: comparison.features.unlimited || 'Unlimited' },
      enterprise: { type: 'unlimited', value: comparison.features.unlimited || 'Unlimited' }
    },
    {
      name: comparison.features.roleGeneration,
      free: { type: 'locked', value: '-' },
      creator: { type: 'unlimited', value: comparison.features.unlimited || 'Unlimited' },
      business: { type: 'unlimited', value: comparison.features.unlimited || 'Unlimited' },
      enterprise: { type: 'unlimited', value: comparison.features.unlimited || 'Unlimited' }
    },
    {
      name: comparison.features.characterImage,
      free: comparison.features.creditsPerImage || '50 credits/image',
      creator: comparison.features.creditsPerImage || '50 credits/image',
      business: { type: 'free-unlimited', value: comparison.features.freeUnlimited || 'Free Unlimited' },
      enterprise: { type: 'free-unlimited', value: comparison.features.freeUnlimited || 'Free Unlimited' }
    },
    {
      name: comparison.features.video || 'Video',
      free: comparison.features.creditsPerVideo || '150 credits/video',
      creator: comparison.features.creditsPerVideo || '150 credits/video',
      business: comparison.features.creditsPerVideo || '150 credits/video',
      enterprise: { type: 'custom', value: comparison.features.customRate || 'Custom rate' }
    },
    {
      name: comparison.features.digitalHuman,
      free: { type: 'locked', value: 'X' },
      creator: comparison.features.creditsPerSecond || '70 credits/sec',
      business: comparison.features.creditsPerSecond || '70 credits/sec',
      enterprise: { type: 'custom', value: comparison.features.customRate || 'Custom rate' }
    },
    {
      name: comparison.features.durationLimit,
      free: { type: 'locked', value: 'X' },
      creator: { type: 'duration', value: comparison.features.twoMinutes || '2 minutes' },
      business: { type: 'duration', value: comparison.features.tenMinutes || '10 minutes' },
      enterprise: { type: 'custom-unlimited', value: comparison.features.customUnlimited || 'Custom / Unlimited' }
    },
    {
      name: comparison.features.hdEnhancement,
      free: { type: 'locked', value: 'X' },
      creator: comparison.features.creditsPerEnhance || '800 credits/time',
      business: { type: 'discount', value: comparison.features.discountEnhance || '500 credits (discount)' },
      enterprise: { type: 'discount', value: comparison.features.customDiscount || 'Custom discount' }
    },
    {
      name: comparison.features.voiceCloning,
      free: { type: 'locked', value: 'X' },
      creator: comparison.features.creditsPerVoice || '3000 credits/voice',
      business: { type: 'gift', value: comparison.features.firstFree || 'First free' },
      enterprise: { type: 'gift', value: comparison.features.batchGift || 'Batch gift' }
    },
    {
      name: comparison.features.watermarkFree,
      free: false,
      creator: true,
      business: true,
      enterprise: true
    },
    {
      name: comparison.features.priorityQueue,
      free: false,
      creator: true,
      business: true,
      enterprise: true
    },
    {
      name: comparison.features.apiAccess,
      free: false,
      creator: false,
      business: false,
      enterprise: true
    },
  ];

  const renderCellContent = (value) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-[#22c55e] mx-auto" />
      ) : (
        <X className="w-5 h-5 text-red-400 mx-auto" />
      );
    }

    if (typeof value === 'object' && value !== null) {
      switch (value.type) {
        case 'locked':
          return (
            <div className="flex items-center justify-center gap-2">
              <X className="w-5 h-5 text-red-400" />
            </div>
          );
        case 'unlimited':
          return (
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-[#22c55e]" />
              <span className="text-white">{value.value}</span>
            </div>
          );
        case 'free-unlimited':
          return (
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-[#22c55e]" />
              <span className="text-white">{value.value}</span>
            </div>
          );
        case 'free-limited':
          return (
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#22c55e]" />
              <span className="text-[#9ca3af]">{value.value}</span>
            </div>
          );
        case 'text-expires':
          return <span className="text-[#9ca3af]">{value.value}</span>;
        case 'duration':
          return (
            <div className="flex items-center justify-center">
              <span className="text-[#9ca3af]">{value.value}</span>
            </div>
          );
        case 'discount':
          return (
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-[#9ca3af]">{value.value}</span>
            </div>
          );
        case 'gift':
          return (
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-4 h-4 text-[#ec4899]" />
              <span className="text-[#9ca3af]">{value.value}</span>
            </div>
          );
        case 'custom':
          return <span className="text-[#9ca3af]">{value.value}</span>;
        case 'custom-unlimited':
          return <span className="text-[#9ca3af]">{value.value}</span>;
        default:
          return <span className="text-[#9ca3af]">{value.value}</span>;
      }
    }

    return <span className="text-[#9ca3af]">{value}</span>;
  };

  return (
    <section id="plan-comparison" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-4 text-white tracking-tight">
            {comparison.title}
          </h2>
          <p className="text-[#9ca3af] text-lg max-w-3xl mx-auto">
            {comparison.subtitle}
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-6 px-6 text-white min-w-[200px]">
                    {comparison.featureLabel || 'Feature'}
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center py-6 px-6 min-w-[180px]">
                      <div className="text-white mb-1">{plan.name}</div>
                      <div className="text-xs text-[#9ca3af]">({plan.tagline})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-white/5 last:border-0">
                    <td className="py-4 px-6 text-[#9ca3af]">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      {renderCellContent(feature.free)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderCellContent(feature.creator)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderCellContent(feature.business)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderCellContent(feature.enterprise)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

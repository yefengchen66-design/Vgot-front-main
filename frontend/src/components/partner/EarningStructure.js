import { DollarSign, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";

export function EarningStructure() {
  const { language } = useLanguage();
  const t = translations[language].partner.earning;

  const benefits = [
    {
      icon: DollarSign,
      text: t.revenue,
    },
    {
      icon: TrendingUp,
      text: t.recurring,
    },
    {
      icon: Calendar,
      text: t.payouts,
    },
    {
      icon: BarChart3,
      text: t.dashboard,
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-6 text-white tracking-tight">
            {t.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#14b8a6] p-0.5 mb-4 mx-auto">
                  <div className="w-full h-full rounded-xl bg-[#020617] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-[#9ca3af] text-sm leading-relaxed">{benefit.text}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#22c55e]/10 to-[#14b8a6]/10 border border-[#22c55e]/20 backdrop-blur-sm p-8 lg:p-12">
          <h3 className="text-2xl lg:text-3xl mb-6 text-white text-center">
            {t.exampleTitle}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-[#22c55e] text-lg">✓</span>
                <p className="text-[#9ca3af]">{t.example1}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#22c55e] text-lg">✓</span>
                <p className="text-[#9ca3af]">{t.example2}</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#9ca3af] mb-2">{t.exampleTotal}</p>
                <p className="text-5xl text-white mb-2">$384</p>
                <p className="text-[#22c55e]">{t.exampleRecurring}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


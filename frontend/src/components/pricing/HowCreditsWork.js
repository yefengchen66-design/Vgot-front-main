import { Video, TrendingUp, Users } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";

export function HowCreditsWork() {
  const { language } = useLanguage();
  const t = translations[language].pricing.credits;

  const examples = [
    {
      icon: Video,
      action: t.examples.soraVideo,
      credits: '150 credits',
      gradient: 'from-[#4f46e5] to-[#7c3aed]'
    },
    {
      icon: TrendingUp,
      action: t.examples.enhance,
      credits: '500-800 credits',
      gradient: 'from-[#ec4899] to-[#f97316]'
    },
    {
      icon: Users,
      action: t.examples.talkingAvatar,
      credits: '70 credits/sec',
      gradient: 'from-[#8b5cf6] to-[#ec4899]'
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-6 text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-[#9ca3af] text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            {t.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {examples.map((example, index) => {
            const Icon = example.icon;
            return (
              <div
                key={index}
                className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm p-6 text-center"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${example.gradient} p-0.5 mb-4 mx-auto`}>
                  <div className="w-full h-full rounded-2xl bg-[#020617] flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-[#9ca3af] text-sm mb-3 min-h-[40px] flex items-center justify-center">{example.action}</p>
                <p className="text-white text-lg">{example.credits}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#4f46e5]/10 to-[#ec4899]/10 border border-white/10 backdrop-blur-sm p-8">
          <p className="text-[#9ca3af] leading-relaxed text-center">
            {t.footnote}
          </p>
        </div>
      </div>
    </section>
  );
}

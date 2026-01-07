import { Rocket, Target, BookOpen, Globe, Handshake, TrendingUp } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";

export function WhyPromoteVGOT() {
  const { language } = useLanguage();
  const t = translations[language].partner.whyPromote;

  const reasons = [
    {
      icon: Rocket,
      text: t.highConverting,
    },
    {
      icon: Target,
      text: t.clearPricing,
    },
    {
      icon: BookOpen,
      text: t.educationFriendly,
    },
    {
      icon: Globe,
      text: t.global,
    },
    {
      icon: Handshake,
      text: t.realPartnership,
    },
    {
      icon: TrendingUp,
      text: t.recurring,
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-4 text-white tracking-tight">
            {t.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm p-6 hover:border-white/20 transition-all"
              >
                <Icon className="w-8 h-8 text-[#22c55e] mb-4" />
                <p className="text-[#9ca3af] leading-relaxed">{reason.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

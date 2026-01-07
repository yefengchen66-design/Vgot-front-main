import { Video, Building2, GraduationCap, Users } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";

export function WhoIsThisFor() {
  const { language } = useLanguage();
  const t = translations[language].partner.whoIsThisFor;

  const audiences = [
    {
      icon: Video,
      text: t.creators,
      gradient: 'from-[#4f46e5] to-[#7c3aed]'
    },
    {
      icon: Building2,
      text: t.agencies,
      gradient: 'from-[#ec4899] to-[#f97316]'
    },
    {
      icon: GraduationCap,
      text: t.educators,
      gradient: 'from-[#8b5cf6] to-[#ec4899]'
    },
    {
      icon: Users,
      text: t.communities,
      gradient: 'from-[#22c55e] to-[#14b8a6]'
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

        <div className="grid md:grid-cols-2 gap-6">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <div
                key={index}
                className="group relative rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm p-8 hover:border-white/20 transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${audience.gradient} p-0.5 mb-6`}>
                  <div className="w-full h-full rounded-2xl bg-[#020617] flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-[#9ca3af] leading-relaxed text-lg">{audience.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


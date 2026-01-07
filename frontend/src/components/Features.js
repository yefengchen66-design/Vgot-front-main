import { FileText, Lightbulb, Video, Wand2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

export function Features() {
  const { language } = useLanguage();
  const t = translations[language].features;
  // Safeguard against missing language key
  if (!t) {
    return null; // or a fallback UI
  }

  const features = [
    {
      icon: FileText,
      title: t.scriptGenerator.title,
      description: t.scriptGenerator.description,
      gradient: "from-[#4f46e5] to-[#7c3aed]"
    },
    {
      icon: Lightbulb,
      title: t.soraVideo.title,
      description: t.soraVideo.description,
      gradient: "from-[#ec4899] to-[#f97316]"
    },
    {
      icon: Video,
      title: t.digitalExpert.title,
      description: t.digitalExpert.description,
      gradient: "from-[#8b5cf6] to-[#ec4899]"
    },
    {
      icon: Wand2,
      title: t.videoTools.title,
      description: t.videoTools.description,
      gradient: "from-[#22c55e] to-[#14b8a6]"
    }
  ];

  return (
    <section id="features" className="py-8 px-6 lg:px-8 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl mb-6 text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-[#9ca3af] text-xl max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm p-8 hover:border-white/20 transition-all overflow-hidden"
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl`}></div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-6`}>
                  <div className="w-full h-full rounded-2xl bg-[#020617] flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl mb-3 text-white">{feature.title}</h3>
                <p className="text-[#9ca3af] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

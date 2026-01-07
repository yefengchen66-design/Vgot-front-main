import { FileCheck, Link2, Share2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";

export function HowItWorksPartner() {
  const { language } = useLanguage();
  const t = translations[language].partner.howItWorks;

  const steps = [
    {
      icon: FileCheck,
      title: t.step1.title,
      description: t.step1.description,
      gradient: 'from-[#4f46e5] to-[#7c3aed]',
    },
    {
      icon: Link2,
      title: t.step2.title,
      description: t.step2.description,
      gradient: 'from-[#ec4899] to-[#f97316]',
    },
    {
      icon: Share2,
      title: t.step3.title,
      description: t.step3.description,
      gradient: 'from-[#22c55e] to-[#14b8a6]',
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

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-white/20 to-transparent"></div>
                )}
                
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${step.gradient} p-0.5 mb-6 mx-auto relative z-10`}>
                  <div className="w-full h-full rounded-3xl bg-[#020617] flex items-center justify-center">
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#ec4899] flex items-center justify-center text-white shadow-lg">
                      {index + 1}
                    </div>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h3 className="text-xl mb-3 text-white">{step.title}</h3>
                <p className="text-[#9ca3af] leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

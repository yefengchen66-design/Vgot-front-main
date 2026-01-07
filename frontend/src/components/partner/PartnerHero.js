import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";

export function PartnerHero() {
  const { language } = useLanguage();
  const t = translations[language].partner.hero;

  const scrollToContact = () => {
    const contactSection = document.querySelector('#partner-contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="pt-32 pb-24 px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#22c55e]/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative text-center">
        <h1 className="text-5xl lg:text-7xl mb-6 text-white tracking-tight leading-tight">
          {t.title}
        </h1>
        
        <p className="text-[#9ca3af] text-xl lg:text-2xl mb-12 leading-relaxed max-w-4xl mx-auto">
          {t.subtitle}
        </p>

        <div className="flex justify-center mb-8">
          <Button 
            onClick={scrollToContact}
            className="bg-gradient-to-r from-[#22c55e] to-[#14b8a6] hover:from-[#16a34a] hover:to-[#0f766e] text-white text-base px-8 py-7 rounded-full shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 transition-all group"
          >
            {t.apply}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <p className="text-[#9ca3af] text-sm">
          {t.payouts}
        </p>
      </div>
    </section>
  );
}

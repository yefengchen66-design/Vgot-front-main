
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

export function ValueProposition() {
  const { language } = useLanguage();
  const t = translations[language].valueProposition;

  return (
    <section className="py-32 px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto text-center">
        {/* Large centered heading */}
        <h2 className="text-5xl lg:text-7xl mb-4 text-white tracking-tight leading-tight">
          {t.title1}
        </h2>
        <h2 className="text-5xl lg:text-7xl mb-8 tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-[#4f46e5] to-[#ec4899] bg-clip-text text-transparent">
            {t.title2}
          </span>
        </h2>

        <p className="text-[#9ca3af] text-xl lg:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto">
          {t.description}
        </p>


      </div>
    </section>
  );
}

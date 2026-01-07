import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { partnerTranslations } from "../../translations/partner";

export function PartnerFAQ() {
  const { language } = useLanguage();
  const t = partnerTranslations[language].faq;
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { question: t.q2.question, answer: t.q2.answer },
    { question: t.q3.question, answer: t.q3.answer },
    { question: t.q4.question, answer: t.q4.answer },
    { question: t.q5.question, answer: t.q5.answer },
  ];

  return (
    <section id="partner-faq" className="py-24 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-4 text-white tracking-tight">
            {t.title}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
              >
                <span className="pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#9ca3af] transition-transform shrink-0 ${openIndex === index ? 'rotate-180' : ''
                    }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-[#9ca3af] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

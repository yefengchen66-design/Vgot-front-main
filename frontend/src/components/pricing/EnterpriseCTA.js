import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Shield, Zap, Headphones } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../contexts/LanguageContext";

export function EnterpriseCTA() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Looking for Enterprise Solutions?",
      description: "For large teams, high-volume production, or bespoke AI models, our Enterprise plan offers tailored features, custom credit packages, and dedicated support.",
      cta: "Contact Sales",
      features: [
        { icon: Building2, text: "Unlimited team seats" },
        { icon: Zap, text: "Custom credit bundles" },
        { icon: Shield, text: "SLA & priority queue" },
        { icon: Headphones, text: "Dedicated account manager" },
      ],
    },
    ja: {
      title: "エンタープライズ向けソリューションをお探しですか？",
      description:
        "大規模チーム、ハイボリュームの運用、または専用のAIモデルをご希望の場合、エンタープライズプランでは特別機能、カスタムクレジットパッケージ、そして専任サポートをご提供します。",
      cta: "営業に問い合わせ",
      features: [
        { icon: Building2, text: "無制限のチーム席数" },
        { icon: Zap, text: "カスタムクレジットバンドル" },
        { icon: Shield, text: "SLA対応・優先キュー" },
        { icon: Headphones, text: "専任アカウントマネージャー" },
      ],
    },
    'zh-CN': {
      title: "寻找企业级解决方案？",
      description: "针对大型团队、高并发需求或定制 AI 模型，我们的企业版提供可扩展功能、自定义积分套餐与专属支持。",
      cta: "联系销售",
      features: [
        { icon: Building2, text: "无限团队席位" },
        { icon: Zap, text: "自定义积分套餐" },
        { icon: Shield, text: "SLA 与优先队列" },
        { icon: Headphones, text: "专属客户经理" },
      ],
    },
    'zh-TW': {
      title: "尋找企業級解決方案？",
      description: "針對大型團隊、高併發需求或客製 AI 模型，我們的企業版提供可擴展功能、自訂積分方案與專屬支援。",
      cta: "聯絡銷售",
      features: [
        { icon: Building2, text: "無限團隊席位" },
        { icon: Zap, text: "自訂積分方案" },
        { icon: Shield, text: "SLA 與優先佇列" },
        { icon: Headphones, text: "專屬客戶經理" },
      ],
    },
    es: {
      title: "¿Buscas soluciones empresariales?",
      description: "Para equipos grandes, producción de alto volumen o modelos de IA personalizados, nuestro plan Enterprise ofrece funciones a medida, paquetes de créditos personalizados y soporte dedicado.",
      cta: "Contactar ventas",
      features: [
        { icon: Building2, text: "Asientos de equipo ilimitados" },
        { icon: Zap, text: "Paquetes de créditos personalizados" },
        { icon: Shield, text: "SLA y cola prioritaria" },
        { icon: Headphones, text: "Gerente de cuenta dedicado" },
      ],
    },
  };
  const t = content[language] || content.en;

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10 backdrop-blur-sm p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4f46e5]/10 via-transparent to-[#ec4899]/10 pointer-events-none"></div>

          <div className="relative">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl mb-4 text-white tracking-tight">
                {t.title}
              </h2>
              <p className="text-[#9ca3af] text-lg leading-relaxed max-w-2xl mx-auto">
                {t.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {t.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <Icon className="w-5 h-5 text-[#a855f7]" />
                    <span className="text-[#9ca3af]">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Button
                className="bg-gradient-to-r from-[#4f46e5] to-[#ec4899] hover:from-[#4338ca] hover:to-[#db2777] text-white text-base px-8 py-7 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all group"
                onClick={() => navigate('/contact')}
              >
                {t.cta}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


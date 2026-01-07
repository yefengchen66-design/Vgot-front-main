import logoImage from "../assets/logo.png";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language].footer;

  const links = {
    product: [
      { name: t.features, href: "/#features" },
      { name: t.pricing, href: "/#pricing" },
    ],
    company: [
      { name: t.contact, href: "/contact" },
      { name: t.privacy, href: "/privacy-policy" },
      { name: t.terms, href: "/terms-of-service" },
    ],
  };

  return (
    <footer className="border-t border-white/5 py-20 px-6 lg:px-8 bg-[#020617]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <img
                src={logoImage}
                alt="VGOT"
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-[#9ca3af] leading-relaxed mb-6 max-w-sm">
              {t.description}
            </p>



          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white mb-4 text-sm font-semibold">
              {t.product}
            </h3>
            <ul className="space-y-3">
              {links.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-[#9ca3af] hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>



          {/* Company Links */}
          <div>
            <h3 className="text-white mb-4 text-sm font-semibold">
              {t.company}
            </h3>
            <ul className="space-y-3">
              {links.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-[#9ca3af] hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#9ca3af] text-sm">
              {t.copyright}
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}

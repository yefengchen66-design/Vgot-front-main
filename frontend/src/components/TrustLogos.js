import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
function TrustLogos() {
  const { language } = useLanguage();
  const t = translations[language].trustLogos;
  const logos = [
    { name: "TikTok" },
    { name: "Shopify" },
    { name: "Amazon" },
    { name: "YouTube" },
    { name: "Instagram" },
    { name: "Reels" }
  ];
  return /* @__PURE__ */ React.createElement("section", { className: "py-20 px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#9ca3af] text-sm mb-12 uppercase tracking-wider" }, t.title), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center" }, logos.map((logo, index) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: index,
      className: "flex items-center justify-center h-16 px-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/10 transition-all"
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-white/60 font-medium text-sm" }, logo.name)
  )))));
}
export {
  TrustLogos
};

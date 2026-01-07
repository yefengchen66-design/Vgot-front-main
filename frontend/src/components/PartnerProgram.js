import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DollarSign, Handshake, Globe } from "lucide-react";
function PartnerProgram() {
  const benefits = [
    {
      icon: DollarSign,
      title: "\u6301\u7EED\u6536\u76CA",
      description: "\u8BA2\u9605\u6BCF\u7EED\u8D39\u4E00\u6B21\uFF0C\u4F60\u5C31\u62FF\u4E00\u6B21\u5206\u6210"
    },
    {
      icon: Handshake,
      title: "\u5B98\u65B9\u652F\u6301",
      description: "\u63D0\u4F9B\u7269\u6599\u3001\u8BDD\u672F\u3001\u6848\u4F8B\uFF0C\u5E2E\u52A9\u4F60\u66F4\u597D\u8F6C\u5316"
    },
    {
      icon: Globe,
      title: "\u5168\u7403\u7ED3\u7B97",
      description: "\u652F\u6301\u591A\u79CD\u6536\u6B3E\u65B9\u5F0F\uFF0C\u9002\u914D\u6D77\u5916\u63A8\u5E7F\u56E2\u961F"
    }
  ];
  return /* @__PURE__ */ React.createElement("section", { id: "partner", className: "py-20 px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-6xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-purple-950/50 to-purple-900/30 backdrop-blur-sm border border-pink-500/30 rounded-3xl p-12 shadow-2xl shadow-pink-500/10" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-12" }, /* @__PURE__ */ React.createElement(Badge, { className: "bg-pink-500/10 text-pink-400 border-pink-500/30 mb-6" }, "\u63A8\u5E7F\u8BA1\u5212 \xB7 Partner Program"), /* @__PURE__ */ React.createElement("h2", { className: "text-4xl mb-4 text-white" }, "\u505A VGOT \u5408\u4F5C\u4F19\u4F34\uFF0C\u62FF\u8D70 ", /* @__PURE__ */ React.createElement("span", { className: "text-pink-400" }, "30%"), " \u6301\u7EED\u5206\u6210"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed" }, "\u5982\u679C\u4F60\u6709\u8DE8\u5883\u7535\u5546\u7528\u6237\u3001\u521B\u4F5C\u8005\u793E\u7FA4\u3001\u57F9\u8BAD\u5B66\u5458\uFF0C", /* @__PURE__ */ React.createElement("br", null), "\u53EF\u4EE5\u7533\u8BF7\u52A0\u5165 VGOT \u63A8\u5E7F\u8BA1\u5212\uFF0C\u901A\u8FC7\u4E13\u5C5E\u94FE\u63A5\u83B7\u5F97 30% \u8BA2\u9605\u5206\u6210\u3002", /* @__PURE__ */ React.createElement("br", null), "\u4F60\u7684\u7528\u6237\u7528\u5F97\u8D8A\u4E45\uFF0C\u4F60\u8D5A\u5F97\u8D8A\u4E45\u3002")), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-3 gap-8 mb-12" }, benefits.map((benefit, index) => {
    const Icon = benefit.icon;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: index,
        className: "bg-purple-950/40 border border-purple-500/20 rounded-xl p-6 text-center"
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-4 mx-auto" }, /* @__PURE__ */ React.createElement(Icon, { className: "w-6 h-6 text-pink-400" })),
      /* @__PURE__ */ React.createElement("h3", { className: "text-lg mb-2 text-white" }, benefit.title),
      /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-sm" }, benefit.description)
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-4" }, /* @__PURE__ */ React.createElement(Button, { className: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transition-all" }, "\u7533\u8BF7\u52A0\u5165\u63A8\u5E7F\u8BA1\u5212"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", className: "text-white hover:bg-white/10 px-8 py-6" }, "\u4E86\u89E3\u63A8\u5E7F\u89C4\u5219")))));
}
export {
  PartnerProgram
};

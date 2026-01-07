import React from "react";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
function PricingTeaser() {
  const tiers = [
    {
      name: "Free",
      desc: "\u9002\u5408\u4F53\u9A8C\u529F\u80FD\u3001\u6D4B\u8BD5\u811A\u672C"
    },
    {
      name: "Pro",
      desc: "\u9002\u5408\u4E2A\u4EBA\u521B\u4F5C\u8005 / \u5C0F\u5356\u5BB6"
    },
    {
      name: "Business",
      desc: "\u9002\u5408\u56E2\u961F\u4E0E\u4EE3\u8FD0\u8425"
    },
    {
      name: "Enterprise",
      desc: "\u5B9A\u5236\u5316\u989D\u5EA6\u4E0E\u79C1\u6709\u529F\u80FD"
    }
  ];
  return /* @__PURE__ */ React.createElement("section", { id: "pricing", className: "py-20 px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-5xl mx-auto text-center" }, /* @__PURE__ */ React.createElement("h2", { className: "text-4xl mb-4 text-white" }, "\u4ECE ", /* @__PURE__ */ React.createElement("span", { className: "text-pink-400" }, "0 \u7F8E\u5143"), "\u5F00\u59CB\uFF0C\u7528 AI \u642D\u5EFA\u4F60\u7684\u7535\u5546\u89C6\u9891\u5DE5\u5382"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 mb-12 text-lg" }, "\u7075\u6D3B\u7684\u4EF7\u683C\u65B9\u6848\uFF0C\u9002\u5408\u4E0D\u540C\u89C4\u6A21\u7684\u56E2\u961F\u548C\u4E2A\u4EBA"), /* @__PURE__ */ React.createElement("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" }, tiers.map((tier, index) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: index,
      className: "bg-purple-950/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all"
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto" }, /* @__PURE__ */ React.createElement(Check, { className: "w-5 h-5 text-pink-400" })),
    /* @__PURE__ */ React.createElement("h3", { className: "text-xl mb-2 text-white" }, tier.name),
    /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-sm" }, tier.desc)
  ))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-4" }, /* @__PURE__ */ React.createElement(Button, { className: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transition-all" }, "\u67E5\u770B\u8BE6\u7EC6\u4EF7\u683C\u65B9\u6848"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", className: "border-purple-500/50 text-white hover:bg-purple-500/10 px-8 py-6" }, "\u5BF9\u6BD4\u5404\u4E2A\u7248\u672C\u529F\u80FD"))));
}
export {
  PricingTeaser
};

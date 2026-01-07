import React from "react";
import { Globe, Sparkles, Briefcase } from "lucide-react";
function UseCases() {
  const useCases = [
    {
      icon: Globe,
      title: "\u8DE8\u5883\u7535\u5546\u5356\u5BB6",
      description: "\u6279\u91CF\u751F\u6210\u4E0D\u540C\u8BED\u8A00\u7684\u4EA7\u54C1\u89C6\u9891\u4E0E\u8BB2\u89E3\u811A\u672C\uFF0C\u5E2E\u4F60\u8986\u76D6\u66F4\u591A\u56FD\u5BB6\u7684 TikTok / \u72EC\u7ACB\u7AD9\u6D41\u91CF\u3002",
      color: "from-blue-500/20 to-blue-500/5"
    },
    {
      icon: Sparkles,
      title: "\u5185\u5BB9\u521B\u4F5C\u8005 / \u5DE5\u4F5C\u5BA4",
      description: "\u7528 SORA + \u6570\u5B57\u4E13\u5BB6\u5FEB\u901F\u642D\u5EFA\u5185\u5BB9\u77E9\u9635\uFF0C\u4E3A\u54C1\u724C\u5BA2\u6237\u5236\u4F5C\u9AD8\u8D28\u91CF\u89C6\u9891\uFF0C\u63D0\u5347\u6536\u8D39\u5355\u4EF7\u3002",
      color: "from-purple-500/20 to-purple-500/5"
    },
    {
      icon: Briefcase,
      title: "\u5E7F\u544A\u4EE3\u8FD0\u8425 / MCN",
      description: "\u628A VGOT \u5F53\u6210\u5185\u90E8\u300C\u5185\u5BB9\u4E2D\u63A7\u7CFB\u7EDF\u300D\uFF0C\u811A\u672C\u5E93\u3001\u89C6\u9891\u7D20\u6750\u3001\u8D26\u53F7\u4F01\u5212\u7EDF\u4E00\u7BA1\u7406\u3002",
      color: "from-orange-500/20 to-orange-500/5"
    }
  ];
  return /* @__PURE__ */ React.createElement("section", { id: "solutions", className: "py-20 px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ React.createElement("h2", { className: "text-center text-4xl mb-4 text-white" }, "\u4E0D\u540C\u89D2\u8272\uFF0C\u90FD\u80FD\u5728 VGOT \u627E\u5230\u81EA\u5DF1\u7684\u4F4D\u7F6E"), /* @__PURE__ */ React.createElement("p", { className: "text-center text-gray-400 mb-16 text-lg" }, "\u65E0\u8BBA\u4F60\u662F\u5356\u5BB6\u3001\u521B\u4F5C\u8005\u8FD8\u662F\u4EE3\u8FD0\u8425\uFF0CVGOT \u90FD\u80FD\u5E2E\u4F60\u63D0\u5347\u6548\u7387"), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-3 gap-8" }, useCases.map((useCase, index) => {
    const Icon = useCase.icon;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: index,
        className: "bg-purple-950/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
      },
      /* @__PURE__ */ React.createElement("div", { className: `w-16 h-16 bg-gradient-to-br ${useCase.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform` }, /* @__PURE__ */ React.createElement(Icon, { className: "w-8 h-8 text-pink-400" })),
      /* @__PURE__ */ React.createElement("h3", { className: "text-2xl mb-4 text-white" }, useCase.title),
      /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 leading-relaxed" }, useCase.description)
    );
  }))));
}
export {
  UseCases
};

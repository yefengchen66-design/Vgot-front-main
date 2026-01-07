import React from "react";
import { DollarSign, Lightbulb, Users } from "lucide-react";
function PainPoints() {
  const painPoints = [
    {
      icon: DollarSign,
      title: "\u89C6\u9891\u6210\u672C\u9AD8",
      description: "\u5916\u5305\u4E00\u6761\u89C6\u9891\u8981\u51E0\u767E\u4E0A\u5343\uFF0C\u8FD8\u8981\u6765\u56DE\u6539\u811A\u672C\u3001\u6539\u5206\u955C\u3002"
    },
    {
      icon: Lightbulb,
      title: "\u811A\u672C\u6CA1\u7075\u611F",
      description: "\u770B\u4E86\u5F88\u591A\u7206\u6B3E\uFF0C\u5374\u4E0D\u4F1A\u62C6\u89E3\uFF0C\u4E0D\u77E5\u9053\u600E\u4E48\u590D\u5236\u6253\u6CD5\u3002"
    },
    {
      icon: Users,
      title: "\u56E2\u961F\u6548\u7387\u4F4E",
      description: "\u7D20\u6750\u6563\u843D\u5728\u5404\u5904\uFF0C\u6C9F\u901A\u6210\u672C\u9AD8\uFF0C\u590D\u7528\u7387\u4F4E\u3002"
    }
  ];
  return /* @__PURE__ */ React.createElement("section", { className: "py-20 px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ React.createElement("h2", { className: "text-center text-4xl mb-16 text-white" }, "\u8FD8\u5728\u4E3A\u8FD9\u4E9B\u95EE\u9898\u5934\u75BC\uFF1F"), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-3 gap-8 mb-12" }, painPoints.map((point, index) => {
    const Icon = point.icon;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: index,
        className: "bg-purple-950/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all group"
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:from-pink-500/30 group-hover:to-purple-600/30 transition-colors" }, /* @__PURE__ */ React.createElement(Icon, { className: "w-6 h-6 text-pink-400" })),
      /* @__PURE__ */ React.createElement("h3", { className: "text-xl mb-3 text-white" }, point.title),
      /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 leading-relaxed" }, point.description)
    );
  })), /* @__PURE__ */ React.createElement("p", { className: "text-center text-lg text-gray-400" }, "VGOT \u628A\u8FD9\u4E09\u4EF6\u4E8B\uFF0C\u5408\u6210\u4E00\u5757", /* @__PURE__ */ React.createElement("span", { className: "text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text" }, "\u300C\u7535\u5546\u77ED\u89C6\u9891\u64CD\u4F5C\u9762\u677F\u300D"), "\u3002")));
}
export {
  PainPoints
};

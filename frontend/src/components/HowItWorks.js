import React from "react";
import { Button } from "./ui/button";
import { Upload, Wand2, Download } from "lucide-react";
function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: Upload,
      title: "\u5BFC\u5165\u4EA7\u54C1 & \u7D20\u6750",
      description: "\u4E0A\u4F20\u4EA7\u54C1\u56FE\u7247\u3001\u586B\u5199\u5356\u70B9\u6216\u7C98\u8D34\u4F60\u7684\u5546\u54C1\u94FE\u63A5\uFF0CVGOT \u5E2E\u4F60\u81EA\u52A8\u5B8C\u6210\u4FE1\u606F\u6574\u7406\u3002"
    },
    {
      number: "2",
      icon: Wand2,
      title: "\u751F\u6210\u811A\u672C & \u89C6\u9891\u65B9\u6848",
      description: "\u4F7F\u7528\u3010\u811A\u672C\u3011\u6A21\u5757\u4E00\u952E\u751F\u6210\u591A\u5957\u5E7F\u544A\u811A\u672C\uFF0C\u9009\u62E9\u559C\u6B22\u7684\u7248\u672C\uFF0C\u76F4\u63A5\u53D1\u9001\u5230 SORA \u89C6\u9891\u751F\u6210\u6216\u6570\u5B57\u4E13\u5BB6\u6A21\u5757\u3002"
    },
    {
      number: "3",
      icon: Download,
      title: "\u5BFC\u51FA\u89C6\u9891\uFF0C\u4E0A\u67B6\u6295\u653E",
      description: "\u4E00\u952E\u5BFC\u51FA\u65E0\u6C34\u5370\u89C6\u9891\uFF0C\u76F4\u63A5\u4E0A\u4F20 TikTok\u3001Reels\u3001YouTube Shorts\uFF0C\u6216\u7ED9\u4F60\u7684\u5E7F\u544A\u6295\u653E\u56E2\u961F\u4F7F\u7528\u3002"
    }
  ];
  return /* @__PURE__ */ React.createElement("section", { className: "py-20 px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ React.createElement("h2", { className: "text-center text-4xl mb-4 text-white" }, "3 \u6B65\u642D\u5EFA\u4F60\u7684\u77ED\u89C6\u9891\u7535\u5546\u5185\u5BB9\u5DE5\u5382"), /* @__PURE__ */ React.createElement("p", { className: "text-center text-gray-400 mb-16 text-lg" }, "\u7B80\u5355\u3001\u5FEB\u901F\u3001\u9AD8\u6548\u7684\u89C6\u9891\u521B\u4F5C\u6D41\u7A0B"), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-3 gap-8 mb-12" }, steps.map((step, index) => {
    const Icon = step.icon;
    return /* @__PURE__ */ React.createElement("div", { key: index, className: "relative" }, index < steps.length - 1 && /* @__PURE__ */ React.createElement("div", { className: "hidden md:block absolute top-20 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[2px] bg-gradient-to-r from-pink-500 to-purple-500/20" }), /* @__PURE__ */ React.createElement("div", { className: "bg-purple-950/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all relative z-10" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30" }, /* @__PURE__ */ React.createElement(Icon, { className: "w-8 h-8 text-white" })), /* @__PURE__ */ React.createElement("div", { className: "text-pink-400 text-sm mb-2" }, "Step ", step.number), /* @__PURE__ */ React.createElement("h3", { className: "text-xl mb-3 text-white" }, step.title), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 leading-relaxed" }, step.description)));
  })), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement(Button, { className: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transition-all" }, "\u7ACB\u5373\u8BD5\u7528 \xB7 \u514D\u8D39\u751F\u6210\u4E00\u6761\u7535\u5546\u811A\u672C"))));
}
export {
  HowItWorks
};

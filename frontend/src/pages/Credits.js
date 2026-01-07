import React from 'react';
import { Zap, BarChart3 } from 'lucide-react';

const USAGE_LOGS = [
  { id: 1, action: 'Sora2 Video Gen', date: '2023-10-24 14:20', cost: '-800', status: 'Completed' },
  { id: 2, action: 'Script Analysis', date: '2023-10-24 12:05', cost: '-50', status: 'Completed' },
  { id: 3, action: 'SuperIP Training', date: '2023-10-23 09:30', cost: '-2400', status: 'Completed' },
  { id: 4, action: 'Credit Top-up', date: '2023-10-22 18:00', cost: '+5000', status: 'Success' },
];

function CreditPack({ amount, price, isPopular }) {
  return (
    <div className={`relative flex items-center justify-between p-5 rounded-xl border transition-all cursor-pointer shadow-md hover:shadow-xl ${isPopular ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/50 hover:border-purple-400/60 hover:bg-purple-900/40' : 'bg-gradient-to-br from-white/[0.07] to-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/10'}`}>
      {isPopular && (
        <span className="absolute -top-2.5 left-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          BEST VALUE
        </span>
      )}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shadow-inner">
          <Zap size={22} fill="currentColor" />
        </div>
        <div>
          <p className="font-bold text-white text-base">{amount} 积分</p>
          <p className="text-sm text-gray-400 font-medium">立即到账</p>
        </div>
      </div>
      <button className="bg-white text-black text-base font-bold px-5 py-2.5 rounded-lg hover:scale-105 transition-all shadow-lg hover:shadow-xl">
        {price}
      </button>
    </div>
  );
}

export default function CreditsAndUsagePage() {
  return (
    <div className="pt-16 pb-12 h-full flex flex-col" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 text-white">积分与算力消耗</h1>
        <p className="text-gray-400 text-base">管理您的算力积分余额，查看详细的使用记录或购买额外积分。</p>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0 w-full">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden shadow-xl shadow-purple-500/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-2">当前可用积分</h3>
            <div className="flex items-end gap-2 mb-5 relative z-10">
              <span className="text-5xl font-black text-white tracking-tight">14,250</span>
              <span className="text-sm text-purple-300 font-semibold mb-2">Credits</span>
            </div>
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden mb-2 shadow-inner">
              <div className="bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 w-[45%] h-full rounded-full shadow-lg"></div>
            </div>
            <p className="text-xs text-gray-400 font-medium">本月额度已使用 45%</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2.5">
              <div className="bg-yellow-500/10 p-1.5 rounded-lg">
                <Zap size={20} className="fill-yellow-400 text-yellow-400" />
              </div>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">购买额外积分包</span>
            </h3>
            <div className="space-y-4">
              <CreditPack amount="5,000" price="$10" />
              <CreditPack amount="20,000" price="$35" isPopular />
              <CreditPack amount="100,000" price="$150" />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-2xl p-8 flex flex-col h-full backdrop-blur-sm shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2.5">
              <div className="bg-gray-500/10 p-1.5 rounded-lg">
                <BarChart3 size={20} className="text-gray-300" />
              </div>
              <span className="text-white">算力消耗明细</span>
            </h3>
            <button className="text-sm text-purple-400 hover:text-purple-300 border border-purple-500/30 px-4 py-2 rounded-lg hover:bg-purple-500/10 transition-all font-medium hover:shadow-lg hover:shadow-purple-500/20">
              导出 CSV
            </button>
          </div>
          
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-gray-400 uppercase border-b border-white/10">
                  <th className="pb-4 font-semibold pl-3">操作项目</th>
                  <th className="pb-4 font-semibold">时间</th>
                  <th className="pb-4 font-semibold text-right">积分变动</th>
                  <th className="pb-4 font-semibold text-right pr-3">状态</th>
                </tr>
              </thead>
              <tbody className="text-base text-gray-300">
                {USAGE_LOGS.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all group">
                    <td className="py-5 pl-3">
                      <span className="font-semibold text-white">{log.action}</span>
                    </td>
                    <td className="py-5 text-gray-400 font-medium">{log.date}</td>
                    <td className={`py-5 text-right font-mono font-bold ${log.cost.startsWith('+') ? 'text-green-400' : 'text-gray-200'}`}>
                      {log.cost}
                    </td>
                    <td className="py-5 text-right pr-3">
                      <span className="inline-block px-3 py-1 rounded-md text-xs bg-green-500/10 text-green-400 border border-green-500/30 font-semibold shadow-sm">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

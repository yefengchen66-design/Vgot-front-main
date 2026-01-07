import React, { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import {
  Play, Heart, TrendingUp, Zap, X, Power,
  Sparkles, ArrowRight, FileText, Lightbulb, Clock,
  Sparkles as SparklesIcon
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

export function Hero({ onLoginClick }) {
  const { language } = useLanguage();
  const t = translations[language].hero;

  // Interaction engine state
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({ views: 0, sales: 0 });
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particles = useRef([]);

  // Cleanup animation on unmount
  useEffect(() => () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }, []);

  // Particle spawning & animation
  const spawnParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height + 400;

    const createParticle = () => {
      const x = Math.random() * canvas.width;
      const y = -50;
      const size = Math.random() * 20 + 15;
      const speed = Math.random() * 5 + 3;
      const spin = (Math.random() - 0.5) * 0.25;
      const types = ['heart', 'diamond', 'spark', 'fire'];
      const type = types[Math.floor(Math.random() * types.length)];
      return { x, y, size, speed, spin, angle: 0, type };
    };

    // Initial burst
    for (let i = 0; i < 60; i++) {
      particles.current.push(createParticle());
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (particles.current.length < 200) {
        if (Math.random() < 0.2) particles.current.push(createParticle());
      }
      particles.current.forEach((p, index) => {
        p.y += p.speed;
        p.angle += p.spin;
        p.x += Math.sin(p.y * 0.01) * 0.5;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        // Use a color-emoji capable font stack for proper rendering across platforms (Windows needs Segoe UI Emoji)
        ctx.font = `bold ${p.size}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Map particle type -> emoji (previously mojibake). Hearts & diamonds match original design screenshot.
        switch (p.type) {
          case 'heart':
            ctx.fillText('❤️', 0, 0);
            break;
          case 'diamond':
            ctx.fillText(Math.random() < 0.5 ? '🔷' : '🔹', 0, 0);
            break;
          case 'spark':
            ctx.fillText('✨', 0, 0);
            break;
          case 'fire':
            ctx.fillText('🔥', 0, 0);
            break;
          default:
            ctx.fillText('💎', 0, 0);
        }
        ctx.restore();
        if (p.y > canvas.height) particles.current.splice(index, 1);
      });
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const handleTrigger = () => {
    if (isActive) return;
    setIsActive(true);
    setTimeout(spawnParticles, 200);
    let elapsed = 0;
    const duration = 3000;
    const interval = setInterval(() => {
      elapsed += 50;
      setStats(prev => ({
        views: prev.views + Math.floor(Math.random() * 8000),
        sales: prev.sales + Math.floor(Math.random() * 250)
      }));
      if (elapsed >= duration) clearInterval(interval);
    }, 50);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setIsActive(false);
    particles.current = [];
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setStats({ views: 0, sales: 0 });
  };

  return (
    <section className="pt-40 pb-16 px-6 lg:px-8 relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#4f46e5]/10 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto relative w-full">
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl mb-6 text-white leading-tight tracking-tight max-w-5xl mx-auto">{t.headline1}</h1>
          <h2 className="text-5xl lg:text-6xl xl:text-7xl mb-12 leading-tight tracking-tight max-w-5xl mx-auto">
            <span className="bg-gradient-to-r from-[#4f46e5] to-[#ec4899] bg-clip-text text-transparent">{t.headline2}</span>
          </h2>
          {t.sellingPoint1 && (
            <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                <FileText className="w-4 h-4 text-[#4f46e5]" />
                <span className="text-white/90 text-sm">{t.sellingPoint1}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                <Lightbulb className="w-4 h-4 text-[#4f46e5]" />
                <span className="text-white/90 text-sm">{t.sellingPoint2}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                <Clock className="w-4 h-4 text-[#4f46e5]" />
                <span className="text-white/90 text-sm">{t.sellingPoint3}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                <SparklesIcon className="w-4 h-4 text-[#4f46e5]" />
                <span className="text-white/90 text-sm">{t.sellingPoint4}</span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <Button className="bg-gradient-to-r from-[#4f46e5] to-[#ec4899] hover:from-[#4338ca] hover:to-[#db2777] text-white text-base px-8 py-7 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all group" onClick={onLoginClick}>
              {t.ctaPrimary}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:border-white/30 backdrop-blur-sm text-base px-8 py-7 rounded-full" onClick={() => (window.location.hash = '#pricing')}>
              {t.ctaSecondary}
            </Button>
          </div>
          <p className="text-[#9ca3af] text-sm">{t.stats} · <span className="text-[#22c55e]">{t.videosGenerated}</span></p>
        </div>

        <div className="relative w-full max-w-4xl mx-auto h-48 md:h-56 perspective-1000 group select-none">
          <canvas ref={canvasRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[400%] pointer-events-none z-30" />
          <div onClick={handleTrigger} className={`relative w-full h-full rounded-2xl transition-all duration-500 cursor-pointer ${isActive ? 'shadow-[0_0_100px_rgba(147,51,234,0.25)] scale-[1.02]' : 'hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(147,51,234,0.15)]'}`}>
            {isActive && (
              <button onClick={handleReset} className="absolute -right-4 -top-4 z-50 bg-gray-800/80 backdrop-blur-md rounded-full p-2 border border-white/10 hover:bg-red-500/80 transition-colors group/close">
                <X size={16} className="group-hover/close:text-white text-gray-400" />
              </button>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/30 flex items-center justify-around overflow-hidden shadow-inner">
              <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] animate-pan" />
              {isActive ? (
                <>
                  <div className="relative z-10 text-center animate-in fade-in zoom-in duration-500">
                    <div className="flex items-center gap-2 justify-center text-purple-400 mb-1">
                      <Play size={14} className="fill-current" />
                      <span className="text-xs font-bold tracking-widest uppercase">{t.viewsLabel || 'Views'}</span>
                    </div>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tabular-nums tracking-tighter">{(stats.views / 1000).toFixed(1)}k</p>
                  </div>
                  <div className="relative z-10 group/core">
                    <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.6)] border border-purple-500/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-500 animate-spin-slow opacity-50" />
                      <div className="absolute inset-[2px] bg-black rounded-full z-10 flex items-center justify-center">
                        <Zap className="text-purple-300 fill-purple-300 drop-shadow-[0_0_10px_rgba(216,180,254,0.8)]" size={40} />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping" />
                  </div>
                  <div className="relative z-10 text-center animate-in fade-in zoom-in duration-500 delay-100">
                    <div className="flex items-center gap-2 justify-center text-green-400 mb-1">
                      <TrendingUp size={14} />
                      <span className="text-xs font-bold tracking-widest uppercase">{t.salesLabel || 'Sales'}</span>
                    </div>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tabular-nums tracking-tighter">${stats.sales.toLocaleString()}</p>
                  </div>
                </>
              ) : (
                <span className="text-gray-600 font-mono text-xs animate-pulse">{t.waiting || 'Waiting for input...'}</span>
              )}
            </div>
            <div className={`absolute top-0 left-0 w-full h-1/2 bg-[#0f1016] rounded-t-2xl z-20 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) border-b border-gray-800/50 flex items-end justify-center overflow-hidden shadow-lg ${isActive ? '-translate-y-[110%]' : 'translate-y-0'}`}>
              <div className="absolute bottom-0 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-[#0f1016] rounded-b-2xl z-20 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) border-t border-gray-800/50 flex items-start justify-center overflow-hidden shadow-lg ${isActive ? 'translate-y-[110%]' : 'translate-y-0'}`}>
              <div className="absolute bottom-4 left-6 flex gap-1">
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
              </div>
              <div className="absolute top-0 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            </div>
            <div className={`absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none transition-all duration-300 ${isActive ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100'}`}>
              <div className="relative mb-3 group-hover:scale-105 transition-transform duration-500 ease-out">
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full group-hover:bg-purple-500/40 transition-colors" />
                <div className="w-16 h-16 rounded-full border border-purple-500/30 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                  <Power className="text-purple-400 group-hover:text-white transition-colors" size={28} />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-white font-bold tracking-widest text-sm group-hover:text-purple-300 transition-colors">{t.activateEngine || 'ACTIVATE VIRAL ENGINE'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-4xl mx-auto mt-12 border-t border-white/5 pt-10 relative">
          <p className="text-center text-xs font-bold tracking-[0.2em] text-gray-500 mb-8 uppercase">{t.distribute || 'Distribute directly to'}</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 opacity-80">
            <a href="#" className="group relative px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-[#00f2ea] opacity-0 group-hover:opacity-10 blur-xl rounded-xl transition-opacity duration-500" />
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 fill-gray-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0-1 13.6 6.84 6.84 0 0 0 6.87-6.84V9.6a9.26 9.26 0 0 0 5-1.38v-3.2a5.06 5.06 0 0 1-1.64.57z" /></svg>
                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">TikTok</span>
              </div>
            </a>
            <a href="#" className="group relative px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-[#95bf47] opacity-0 group-hover:opacity-10 blur-xl rounded-xl transition-opacity duration-500" />
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 fill-gray-400 group-hover:fill-[#95bf47] transition-colors" viewBox="0 0 24 24"><path d="M20.5 6.8l-1.8-5.6-4.2 1.6c-.5-.2-1-.3-1.5-.3s-1 .1-1.5.3l-4.2-1.6-1.8 5.6c-.7 1.3-1 2.7-1 4.1 0 5.8 4.7 10.6 10.5 10.6s10.5-4.7 10.5-10.6c0-1.4-.3-2.8-1-4.1zm-11.5 1.4l1.6-2.1 1.6 2.1h-3.2zm2.4-3.8l1.6 2.1h-3.2l1.6-2.1zm5.7 1.7l-2.1 2.1h-2.8l2.3-2.9 2.6.8zm-9.4.8l2.6-.8 2.3 2.9h-2.8l-2.1-2.1z" /></svg>
                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Shopify</span>
              </div>
            </a>
            <a href="#" className="group relative px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-[#ff9900] opacity-0 group-hover:opacity-10 blur-xl rounded-xl transition-opacity duration-500" />
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 fill-gray-400 group-hover:fill-[#ff9900] transition-colors" viewBox="0 0 24 24"><path d="M13.9 13.3c0-1.7 1.1-2.4 2.8-2.4 1.7 0 2.3.8 2.3 2.1v3.8h2.6v-4.5c0-2.6-1.4-4-4.3-4-2.3 0-3.6 1.1-4.1 2.4l-.1-.1v-2.1h-2.5v8.2h2.6v-3.4h.7zm-5.8 2.6c-1.5 0-2.3-.7-2.3-1.8 0-1.5 1.3-2 3.5-2 .4 0 .8 0 1.2.1v.6c0 1.9-1.1 3.1-2.4 3.1zm2.4-5.2c-.8-.2-1.8-.3-2.7-.3-3.3 0-5.1 1.7-5.1 4.3 0 2.4 1.8 3.7 4.3 3.7 1.5 0 2.6-.6 3.2-1.4l.1.1v1.2h2.5v-8h-2.3v.4zm8.2 8.5c.1.1.3.1.4 0 2.3-2.4 5.3-2.9 7.5-1.2.3.2.7.1.9-.2.2-.3.1-.7-.2-.9-2.8-2.1-6.2-1.6-8.9 1.3-.3.3-.2.8.3 1z" /></svg>
                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Amazon</span>
              </div>
            </a>
            <a href="#" className="group relative px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-[#ff0000] opacity-0 group-hover:opacity-10 blur-xl rounded-xl transition-opacity duration-500" />
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 fill-gray-400 group-hover:fill-[#ff0000] transition-colors" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">YouTube</span>
              </div>
            </a>
            <a href="#" className="group relative px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-[#E1306C] opacity-0 group-hover:opacity-10 blur-xl rounded-xl transition-opacity duration-500" />
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 fill-gray-400 group-hover:fill-[#E1306C] transition-colors" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Instagram</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

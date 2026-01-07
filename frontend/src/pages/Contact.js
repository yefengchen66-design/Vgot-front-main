import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

const Contact = ({ onLoginClick }) => {
  const { language } = useLanguage();
  const t = translations[language]?.contact || translations['en'].contact;
  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#020617] to-[#050816]" />
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 flex-grow flex flex-col">
        <Header onLoginClick={onLoginClick} />
        
        <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-24 lg:px-8">
          <div className="max-w-3xl w-full text-center">
            {/* Badge */}
            <div className="inline-flex items-center justify-center px-6 py-2 mb-8 rounded-full border border-purple-500/30 bg-purple-500/10">
              <span className="text-sm font-bold tracking-wider text-purple-400 uppercase">{t.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
              {t.titleLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {t.titleLine2Gradient}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-400 mb-16 leading-relaxed max-w-2xl mx-auto">
              {t.subtitle}
            </p>

            {/* Cards */}
            <div className="grid md:grid-cols-1 gap-6 max-w-xl mx-auto text-left">
              {/* General Support */}
              <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center gap-6 hover:bg-white/10 transition-all duration-300">
                <div className="h-14 w-14 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                   <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-1">{t.generalSupportLabel}</h3>
                  <a href="mailto:service@vgot.ai" className="text-2xl text-white font-medium hover:text-purple-400 transition-colors">
                    service@vgot.ai
                  </a>
                </div>
              </div>

              {/* Partner Program */}
              <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center gap-6 hover:bg-white/10 transition-all duration-300">
                <div className="h-14 w-14 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-1">{t.partnerProgramLabel}</h3>
                  <a href="mailto:affiliate@vgot.ai" className="text-2xl text-white font-medium hover:text-pink-400 transition-colors">
                    affiliate@vgot.ai
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Gradient Overlay to smooth transition to footer */}
        <div className="w-full h-40 bg-gradient-to-b from-transparent to-[#020617] -mt-40 relative z-20 pointer-events-none" />
        
        <Footer />
      </div>
    </div>
  );
};

export default Contact;

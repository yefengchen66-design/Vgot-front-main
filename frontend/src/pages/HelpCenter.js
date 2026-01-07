import React, { useContext } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

const HelpCenter = ({ onLoginClick }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { language } = useLanguage();
  const t = translations[language]?.helpCenter || translations.en.helpCenter;

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#020617] to-[#050816]" />
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 flex-grow flex flex-col">
        <Header onLoginClick={onLoginClick} />

        <main className="flex-grow px-6 pt-32 pb-24 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center px-6 py-2 mb-8 rounded-full border border-purple-500/30 bg-purple-500/10">
                <span className="text-sm font-bold tracking-wider text-purple-400 uppercase">{t.badge}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                {t.titleLine1} & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{t.titleLine2Gradient}</span>
              </h1>
              <p className="text-gray-400 text-lg mb-4">{t.lastUpdatedPrefix} {t.lastUpdatedDate}</p>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {t.intro1}
                <br />
                {t.intro2Prefix} <a href="mailto:service@vgot.ai" className="text-purple-400 hover:text-purple-300 transition-colors">service@vgot.ai</a>.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-16 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">{t.tocTitle}</h2>
              <ul className="space-y-3">
                {[
                  { id: 'getting-started', title: t.tocItems.item1 },
                  { id: 'credits', title: t.tocItems.item2 },
                  { id: 'subscription', title: t.tocItems.item3 },
                  { id: 'features', title: t.tocItems.item4 },
                  { id: 'partner', title: t.tocItems.item5 }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-gray-400 hover:text-purple-400 transition-colors text-left flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 group-hover:bg-purple-400 transition-colors"></span>
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Sections */}
            <div className="space-y-16">
              {/* Section 1 */}
              <section id="getting-started" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-purple-400">01.</span> {t.sections.gettingStarted.title}
                </h2>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t.sections.gettingStarted.whatIs.title}</h3>
                    <p>{t.sections.gettingStarted.whatIs.text}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t.sections.gettingStarted.freeTrial.title}</h3>
                    <p>{t.sections.gettingStarted.freeTrial.text}</p>
                    <div className="mt-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-yellow-200 text-sm">
                        <span className="font-bold">{t.sections.gettingStarted.freeTrial.notePrefix}</span> {t.sections.gettingStarted.freeTrial.noteText}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="credits" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-purple-400">02.</span> {t.sections.credits.title}
                </h2>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">{t.sections.credits.consumption.title}</h3>
                    <p className="mb-4">{t.sections.credits.consumption.intro}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                        <h4 className="text-white font-medium mb-2">{t.sections.credits.consumption.items.hypersell.title}</h4>
                        <p className="text-sm text-gray-400">{t.sections.credits.consumption.items.hypersell.text}</p>
                      </div>
                      <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                        <h4 className="text-white font-medium mb-2">{t.sections.credits.consumption.items.superip.title}</h4>
                        <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                          <li>{t.sections.credits.consumption.items.superip.points.p1}</li>
                          <li>{t.sections.credits.consumption.items.superip.points.p2}</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                        <h4 className="text-white font-medium mb-2">{t.sections.credits.consumption.items.character.title}</h4>
                        <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                          <li>{t.sections.credits.consumption.items.character.points.p1}</li>
                          <li><span className="text-green-400 font-semibold">{t.sections.credits.consumption.items.character.points.highlight}</span> {t.sections.credits.consumption.items.character.points.p2}</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                        <h4 className="text-white font-medium mb-2">{t.sections.credits.consumption.items.voice.title}</h4>
                        <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                          <li>{t.sections.credits.consumption.items.voice.points.p1}</li>
                          <li>{t.sections.credits.consumption.items.voice.points.p2Prefix} <span className="text-green-400 font-semibold">{t.sections.credits.consumption.items.voice.points.p2Highlight}</span> {t.sections.credits.consumption.items.voice.points.p2Suffix}</li>
                        </ul>
                      </div>
                      <div className="bg-white/5 p-5 rounded-xl border border-white/5 md:col-span-2">
                        <h4 className="text-white font-medium mb-2">{t.sections.credits.consumption.items.hd.title}</h4>
                        <p className="text-sm text-gray-400">{t.sections.credits.consumption.items.hd.text}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t.sections.credits.expiry.title}</h3>
                    <ul className="space-y-3 list-none pl-0">
                      <li className="flex gap-3">
                        <span className="text-purple-400 font-bold whitespace-nowrap">{t.sections.credits.expiry.monthly.prefix}</span>
                        <span>{t.sections.credits.expiry.monthly.text}</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-purple-400 font-bold whitespace-nowrap">{t.sections.credits.expiry.yearly.prefix}</span>
                        <span>{t.sections.credits.expiry.yearly.text}</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-purple-400 font-bold whitespace-nowrap">{t.sections.credits.expiry.extra.prefix}</span>
                        <span>{t.sections.credits.expiry.extra.text}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t.sections.credits.runOut.title}</h3>
                    <p>{t.sections.credits.runOut.text}</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="subscription" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-purple-400">03.</span> {t.sections.subscription.title}
                </h2>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t.sections.subscription.compare.title}</h3>
                    <p>{t.sections.subscription.compare.textPrefix} <a href="/#pricing" className="text-purple-400 hover:underline">{t.sections.subscription.compare.linkText}</a> {t.sections.subscription.compare.textSuffix}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t.sections.subscription.change.title}</h3>
                    <p className="mb-2">{t.sections.subscription.change.intro}</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                      <li><span className="text-white font-medium">{t.sections.subscription.change.items.upgrades.prefix}</span> {t.sections.subscription.change.items.upgrades.text}</li>
                      <li><span className="text-white font-medium">{t.sections.subscription.change.items.downgrades.prefix}</span> {t.sections.subscription.change.items.downgrades.text}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="features" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-purple-400">04.</span> {t.sections.features.title}
                </h2>
                <div className="space-y-8 text-gray-300 leading-relaxed">

                  {/* HyperSell */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">🛍️</span>
                      <h3 className="text-xl font-bold text-white">{t.sections.features.hypersell.title}</h3>
                    </div>
                    <div className="space-y-4 pl-2">
                      <div>
                        <h4 className="text-white font-medium mb-1">{t.sections.features.hypersell.whatIs.title}</h4>
                        <p className="text-sm text-gray-400">{t.sections.features.hypersell.whatIs.text}</p>
                      </div>
                      <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                        <li><span className="text-gray-300">{t.sections.features.hypersell.points.costPrefix}</span> {t.sections.features.hypersell.points.costText}</li>
                        <li><span className="text-gray-300">{t.sections.features.hypersell.points.bestForPrefix}</span> {t.sections.features.hypersell.points.bestForText}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Super IP */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">👤</span>
                      <h3 className="text-xl font-bold text-white">{t.sections.features.superip.title}</h3>
                    </div>
                    <div className="space-y-4 pl-2">
                      <div>
                        <h4 className="text-white font-medium mb-1">{t.sections.features.superip.whatIs.title}</h4>
                        <p className="text-sm text-gray-400">{t.sections.features.superip.whatIs.text}</p>
                      </div>
                      <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                        <li><span className="text-gray-300">{t.sections.features.superip.points.costPrefix}</span> {t.sections.features.superip.points.costText}</li>
                        <li><span className="text-gray-300">{t.sections.features.superip.points.customizationPrefix}</span> {t.sections.features.superip.points.customizationText}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Script Master */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">📝</span>
                      <h3 className="text-xl font-bold text-white">{t.sections.features.scriptMaster.title}</h3>
                    </div>
                    <div className="space-y-4 pl-2">
                      <div>
                        <h4 className="text-white font-medium mb-1">{t.sections.features.scriptMaster.how.title}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1 mt-2">
                          <li><span className="text-gray-300">{t.sections.features.scriptMaster.points.freePrefix}</span> {t.sections.features.scriptMaster.points.freeText}</li>
                          <li><span className="text-gray-300">{t.sections.features.scriptMaster.points.paidPrefix}</span> {t.sections.features.scriptMaster.points.paidText}</li>
                          <li>{t.sections.features.scriptMaster.points.extra}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* Section 5 */}
              <section id="partner" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-purple-400">05.</span> {t.sections.partner.title}
                </h2>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t.sections.partner.how.title}</h3>
                    <p className="mb-2">{t.sections.partner.how.intro}</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                      <li><span className="text-white font-medium">{t.sections.partner.how.items.commission.prefix}</span> {t.sections.partner.how.items.commission.text}</li>
                      <li><span className="text-white font-medium">{t.sections.partner.how.items.payouts.prefix}</span> {t.sections.partner.how.items.payouts.text}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t.sections.partner.rights.title}</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                      <li><span className="text-white font-medium">{t.sections.partner.rights.items.free.prefix}</span> {t.sections.partner.rights.items.free.text}</li>
                      <li><span className="text-white font-medium">{t.sections.partner.rights.items.paid.prefix}</span> {t.sections.partner.rights.items.paid.text}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t.sections.partner.refund.title}</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                      <li><span className="text-white font-medium">{t.sections.partner.refund.items.subscriptions.prefix}</span> {t.sections.partner.refund.items.subscriptions.text}</li>
                      <li><span className="text-white font-medium">{t.sections.partner.refund.items.credits.prefix}</span> {t.sections.partner.refund.items.credits.text}</li>
                    </ul>
                  </div>
                </div>
              </section>
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

export default HelpCenter;

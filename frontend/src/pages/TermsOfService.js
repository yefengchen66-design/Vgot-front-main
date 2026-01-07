import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

const TermsOfService = ({ onLoginClick }) => {
  const { language } = useLanguage();
  const t = translations[language]?.terms || translations.en.terms;
  const s = t.sections; // shorthand
  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#020617] to-[#050816]" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10">
        <Header onLoginClick={onLoginClick} />

        <div className="max-w-4xl mx-auto px-6 pt-40 pb-24 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">{t.title}</h1>
          <p className="text-gray-400 mb-8">{t.lastUpdatedPrefix} November 26, 2025</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <p className="mb-4">{t.intro1}</p>
              <p>{t.intro2}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.accounts.title}</h2>
              <p className="mb-4">{s.accounts.intro}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{s.accounts.bullets.accuracy}</li>
                <li>{s.accounts.bullets.security}</li>
                <li>{s.accounts.bullets.age}</li>
                <li>{s.accounts.bullets.sharing}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.subscription.title}</h2>
              <h3 className="text-xl font-semibold text-white mb-2">{s.subscription.plansTitle}</h3>
              <p className="mb-4">{s.subscription.plansIntro}</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{s.subscription.plansBullets.billing}</li>
                <li>{s.subscription.plansBullets.cancellation}</li>
              </ul>
              <h3 className="text-xl font-semibold text-white mb-2">{s.subscription.creditsTitle}</h3>
              <p className="mb-4">{s.subscription.creditsIntro}</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{s.subscription.creditsBullets.consumption}</li>
                <li>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>{s.subscription.creditsBullets.expirationMonthly}</li>
                    <li>{s.subscription.creditsBullets.expirationExtra}</li>
                  </ul>
                </li>
              </ul>
              <h3 className="text-xl font-semibold text-white mb-2">{s.subscription.refundTitle}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{s.subscription.refundBullets.general}</li>
                <li>{s.subscription.refundBullets.waiver}</li>
                <li>{s.subscription.refundBullets.unused}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.userContent.title}</h2>
              <h3 className="text-xl font-semibold text-white mb-2">{s.userContent.inputTitle}</h3>
              <p className="mb-4">{s.userContent.inputIntro}</p>
              <h3 className="text-xl font-semibold text-white mb-2">{s.userContent.featureTitle}</h3>
              <p className="mb-2"><strong>HyperSell:</strong></p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{s.userContent.hypersellBullets.commercial}</li>
                <li>{s.userContent.hypersellBullets.counterfeits}</li>
              </ul>
              <p className="mb-2"><strong>Super IP:</strong></p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{s.userContent.superipBullets.consent}</li>
                <li>{s.userContent.superipBullets.biometric}</li>
              </ul>
              <h3 className="text-xl font-semibold text-white mb-2">{s.userContent.ownershipTitle}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{s.userContent.ownershipBullets.free}</li>
                <li>{s.userContent.ownershipBullets.paid}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.partner.title}</h2>
              <p className="mb-4">{s.partner.intro}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{s.partner.bullets.commission}</li>
                <li>{s.partner.bullets.payouts}</li>
                <li>{s.partner.bullets.prohibited}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.acceptable.title}</h2>
              <p className="mb-4">{s.acceptable.intro}</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{s.acceptable.prohibitedList.illegal}</li>
                <li>{s.acceptable.prohibitedList.sexual}</li>
                <li>{s.acceptable.prohibitedList.hate}</li>
                <li>{s.acceptable.prohibitedList.deepfakes}</li>
                <li>{s.acceptable.prohibitedList.selfHarm}</li>
                <li>{s.acceptable.prohibitedList.ip}</li>
              </ul>
              <p className="mb-2"><strong>{s.acceptable.platformTitle}</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{s.acceptable.platformBullets.scripts}</li>
                <li>{s.acceptable.platformBullets.reverse}</li>
                <li>{s.acceptable.platformBullets.compete}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.analysis.title}</h2>
              <p className="mb-4">{s.analysis.intro}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{s.analysis.bullets.affiliation}</li>
                <li>{s.analysis.bullets.responsibility}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.disclaimer.title}</h2>
              <p className="mb-4">{s.disclaimer.intro}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.liability.title}</h2>
              <p className="mb-4">{s.liability.intro}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.indemnification.title}</h2>
              <p className="mb-4">{s.indemnification.intro}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.termination.title}</h2>
              <p className="mb-4">{s.termination.intro}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.law.title}</h2>
              <p className="mb-4">{s.law.intro}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{s.contact.title}</h2>
              <p className="mb-4">{s.contact.intro}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{s.contact.emailPrefix} <a href="mailto:service@vgot.ai" className="text-indigo-400 hover:text-indigo-300">service@vgot.ai</a></li>
              </ul>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default TermsOfService;

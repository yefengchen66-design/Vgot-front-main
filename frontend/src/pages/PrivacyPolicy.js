import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

const PrivacyPolicy = ({ onLoginClick }) => {
  const { language } = useLanguage();
  const t = translations[language]?.privacy || translations['en'].privacy;
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
              <p className="mb-4">
                {t.intro1}
              </p>
              <p>
                {t.intro2}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.interpretationTitle}</h2>
              
              <h3 className="text-xl font-semibold text-white mb-2">{t.interpretation}</h3>
              <p className="mb-4">
                {t.interpretationText}
              </p>

              <h3 className="text-xl font-semibold text-white mb-2">{t.definitions}</h3>
              <p className="mb-4">{t.definitionsIntro}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account</strong> {t.definitionsList.account}</li>
                <li><strong>Company</strong> {t.definitionsList.company}</li>
                <li><strong>Cookies</strong> {t.definitionsList.cookies}</li>
                <li><strong>Country</strong> {t.definitionsList.country}</li>
                <li><strong>Device</strong> {t.definitionsList.device}</li>
                <li><strong>Personal Data</strong> {t.definitionsList.personalData}</li>
                <li><strong>Service</strong> {t.definitionsList.service}</li>
                <li><strong>Service Provider</strong> {t.definitionsList.serviceProvider}</li>
                <li><strong>Usage Data</strong> {t.definitionsList.usageData}</li>
                <li><strong>Website</strong> {t.definitionsList.website}</li>
                <li><strong>You</strong> {t.definitionsList.you}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.collectingTitle}</h2>
              
              <h3 className="text-xl font-semibold text-white mb-2">{t.typesCollectedTitle}</h3>
              
              <h4 className="text-lg font-semibold text-white mb-2">{t.personalDataTitle}</h4>
              <p className="mb-4">
                {t.personalDataIntro}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{t.personalDataItems.email}</li>
                <li>{t.personalDataItems.credentials}</li>
                <li>{t.personalDataItems.payment}</li>
                <li>{t.personalDataItems.usageData}</li>
              </ul>

              <h4 className="text-lg font-semibold text-white mb-2">{t.userContentTitle}</h4>
              <p className="mb-4">
                {t.userContentIntro}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{t.userContentItems.media}</li>
                <li>{t.userContentItems.text}</li>
                <li>{t.userContentItems.biometric}</li>
              </ul>

              <h4 className="text-lg font-semibold text-white mb-2">{t.usageDataTitle}</h4>
              <p className="mb-4">
                {t.usageDataIntro}
              </p>

              <h4 className="text-lg font-semibold text-white mb-2">{t.trackingTitle}</h4>
              <p className="mb-4">
                {t.trackingIntro}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{t.trackingItems.necessary}</li>
                <li>{t.trackingItems.functionality}</li>
                <li>{t.trackingItems.analytics}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.useTitle}</h2>
              <p className="mb-4">{t.useIntro}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t.useItems.provide}</li>
                <li>{t.useItems.manageAccount}</li>
                <li>{t.useItems.contract}</li>
                <li>{t.useItems.contactYou}</li>
                <li>{t.useItems.improve}</li>
                <li>{t.useItems.requests}</li>
                <li>{t.useItems.transfers}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.thirdPartyTitle}</h2>
              <p className="mb-4">
                {t.thirdPartyIntro}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t.thirdPartyItems.ai}</li>
                <li>{t.thirdPartyItems.payments}</li>
                <li>{t.thirdPartyItems.analytics}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.retentionTitle}</h2>
              <p className="mb-4">
                {t.retentionIntro}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t.retentionItems.account}</li>
                <li>{t.retentionItems.content}</li>
                <li>{t.retentionItems.legal}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.transferTitle}</h2>
              <p className="mb-4">
                {t.transferIntro}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.deleteTitle}</h2>
              <p className="mb-4">
                {t.deleteIntro}
                <a href="mailto:service@vgot.ai" className="text-indigo-400 hover:text-indigo-300">service@vgot.ai</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.disclosureTitle}</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t.disclosureItems.business}</li>
                <li>{t.disclosureItems.law}</li>
                <li>{t.disclosureItems.consent}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.childrenTitle}</h2>
              <p className="mb-4">
                {t.childrenIntro}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.linksTitle}</h2>
              <p className="mb-4">
                {t.linksIntro}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.rightsTitle}</h2>
              <p className="mb-4">
                {t.rightsIntro}
                <a href="mailto:service@vgot.ai" className="text-indigo-400 hover:text-indigo-300">service@vgot.ai</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.changesTitle}</h2>
              <p className="mb-4">
                {t.changesIntro}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t.contactTitle}</h2>
              <p className="mb-4">{t.contactIntro}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t.contactEmailPrefix} <a href="mailto:service@vgot.ai" className="text-indigo-400 hover:text-indigo-300">service@vgot.ai</a></li>
              </ul>
            </section>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicy;

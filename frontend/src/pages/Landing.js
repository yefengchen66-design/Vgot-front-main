import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Home } from './Home';
import { Pricing } from './Pricing';
import { PartnerProgramPage } from './PartnerProgramPage';
import { Toaster } from '../components/ui/sonner';

export default function Landing({ onLoginClick }) {
    const [currentPage, setCurrentPage] = useState("home");

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (hash === 'pricing' || hash === 'partner') {
                setCurrentPage(hash);
            } else {
                setCurrentPage('home');
            }
        };
        window.addEventListener("hashchange", handleHashChange);
        handleHashChange();
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case "pricing": return <Pricing />;
            case "partner": return <PartnerProgramPage />;
            default: return <Home onLoginClick={onLoginClick} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#020617] to-[#050816]" />
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10">
                <Header onLoginClick={onLoginClick} />
                {renderPage()}
                <Footer />
            </div>
            <Toaster />
        </div>
    );
}

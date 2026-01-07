import React from "react";
import { PartnerHero } from "../components/partner/PartnerHero";
import { WhoIsThisFor } from "../components/partner/WhoIsThisFor";
import { EarningStructure } from "../components/partner/EarningStructure";
import { PartnerTiers } from "../components/partner/PartnerTiers";
import { HowItWorksPartner } from "../components/partner/HowItWorksPartner";
import { WhyPromoteVGOT } from "../components/partner/WhyPromoteVGOT";
import { PartnerFAQ } from "../components/partner/PartnerFAQ";

export function PartnerProgramPage() {
  return (
    <div className="pt-20">
      <PartnerHero />
      <WhoIsThisFor />
      <EarningStructure />
      <PartnerTiers />
      <HowItWorksPartner />
      <WhyPromoteVGOT />
      <PartnerFAQ />
    </div>
  );
}

import React, { useState } from "react";
import { PricingHero } from "../components/pricing/PricingHero";
import { PricingCards } from "../components/pricing/PricingCards";
import { PlanComparison } from "../components/pricing/PlanComparison";
import { HowCreditsWork } from "../components/pricing/HowCreditsWork";
import { EnterpriseCTA } from "../components/pricing/EnterpriseCTA";
import { PricingFAQ } from "../components/pricing/PricingFAQ";

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="pt-20">
      <PricingHero billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
      <PricingCards billingCycle={billingCycle} />
      <PlanComparison />
      <HowCreditsWork />
      <EnterpriseCTA />
      <PricingFAQ />
    </div>
  );
}

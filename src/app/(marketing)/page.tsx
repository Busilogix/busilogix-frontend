import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { WorkflowSection } from "@/components/marketing/workflow-section";
import { ComparisonSection } from "@/components/marketing/comparison-section";
import { FAQSection } from "@/components/marketing/faq-section";
import { StatsSection } from "@/components/marketing/stats-section";
import { CTASection } from "@/components/marketing/cta-section";

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <ComparisonSection />
      <FAQSection />
      <StatsSection />
      <CTASection />
    </>
  );
}

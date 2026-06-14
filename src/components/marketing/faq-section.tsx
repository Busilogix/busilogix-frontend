"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Is the Open Beta really free?",
    answer: "Yes, 100%. All core features—invoicing, CRM, inventory, and analytics—are completely free during the Open Beta phase. No credit card is required to sign up, and founding members will get special legacy pricing when public pricing is launched.",
  },
  {
    question: "Can I export my business data if I decide to leave?",
    answer: "Absolutely. We believe your data belongs to you, not us. You can export your invoices, customer directories, and product catalogs to standard CSV and JSON formats at any time with a single click from your settings dashboard.",
  },
  {
    question: "How secure is my business information?",
    answer: "Security is built into every layer. We use industry-standard AES-256 encryption at rest, TLS 1.3 for data in transit, and host our infrastructure in secure, SOC2-compliant data centers. Your data is isolated, backed up daily, and never shared.",
  },
  {
    question: "What features are coming next?",
    answer: "We are actively developing direct Stripe and PayPal integrations for online invoice payments, automated recurring invoices, customized HTML/CSS email templates, and webhooks for developers to connect with external web apps.",
  },
  {
    question: "How do I report bugs or suggest feature requests?",
    answer: "We love feedback! You can reach us directly via the 'Contact' link in the navigation or from our dedicated support forms inside the dashboard. We read every message and prioritize requests from early beta members.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 border border-indigo-100">
            <HelpCircle className="size-3.5" />
            Support
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-500">
            Clear, honest answers about our open beta program, data privacy, and roadmap.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "border border-slate-150 rounded-2xl bg-slate-50/30 overflow-hidden transition-all duration-200",
                  isOpen ? "border-indigo-200 bg-indigo-50/10 shadow-sm" : "hover:border-slate-300 hover:bg-slate-50/50"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-sm sm:text-base font-bold text-slate-900 focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 text-slate-400 shrink-0 transition-transform duration-200",
                      isOpen && "transform rotate-180 text-indigo-500"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "transition-all duration-200 ease-in-out",
                    isOpen ? "max-h-[300px] border-t border-slate-150/50" : "max-h-0 pointer-events-none"
                  )}
                >
                  <p className="px-6 py-5 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

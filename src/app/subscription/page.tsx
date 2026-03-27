"use client";

import AppShell from "@/components/layout/AppShell";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const tiers = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Get started with the basics",
    badge: null,
    highlighted: false,
    cta: "Current Plan",
    ctaStyle: "outlined" as const,
    features: [
      { text: "Basic player profile", included: true },
      { text: "Join public tournaments", included: true },
      { text: "Live scoreboard access", included: true },
      { text: "Community forums", included: true },
      { text: "Standard match stats", included: true },
      { text: "Advanced analytics", included: false },
      { text: "Priority matchmaking", included: false },
      { text: "Custom team branding", included: false },
      { text: "Dedicated support", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 49.99,
    yearlyPrice: 39.99,
    description: "For competitive athletes and teams",
    badge: "MOST POPULAR",
    highlighted: true,
    cta: "Upgrade to Pro",
    ctaStyle: "filled" as const,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Advanced performance analytics", included: true },
      { text: "Priority matchmaking", included: true },
      { text: "Custom team branding", included: true },
      { text: "Video replay highlights", included: true },
      { text: "Tournament creation (up to 5)", included: true },
      { text: "Export reports & data", included: true },
      { text: "Priority email support", included: true },
      { text: "Multi-org management", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    name: "Pro Max",
    monthlyPrice: 19.99,
    yearlyPrice: 15.99,
    description: "Enterprise-grade for organizations",
    badge: null,
    highlighted: false,
    cta: "Go Pro Max",
    ctaStyle: "filled-alt" as const,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited tournament creation", included: true },
      { text: "Multi-org management", included: true },
      { text: "Full API access & webhooks", included: true },
      { text: "White-label options", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom integrations", included: true },
      { text: "SLA guarantee (99.9%)", included: true },
      { text: "On-site training sessions", included: true },
      { text: "Early access to new features", included: true },
    ],
  },
];

const comparisonFeatures = [
  { feature: "Player profiles", free: true, pro: true, proMax: true },
  { feature: "Join tournaments", free: true, pro: true, proMax: true },
  { feature: "Live scoreboard", free: true, pro: true, proMax: true },
  { feature: "Community forums", free: true, pro: true, proMax: true },
  { feature: "Standard match stats", free: true, pro: true, proMax: true },
  { feature: "Advanced analytics", free: false, pro: true, proMax: true },
  { feature: "Priority matchmaking", free: false, pro: true, proMax: true },
  { feature: "Custom team branding", free: false, pro: true, proMax: true },
  { feature: "Video replay highlights", free: false, pro: true, proMax: true },
  { feature: "Tournament creation", free: false, pro: "Up to 5", proMax: "Unlimited" },
  { feature: "Export reports & data", free: false, pro: true, proMax: true },
  { feature: "Priority support", free: false, pro: "Email", proMax: "Dedicated manager" },
  { feature: "Multi-org management", free: false, pro: false, proMax: true },
  { feature: "API access & webhooks", free: false, pro: false, proMax: true },
  { feature: "White-label options", free: false, pro: false, proMax: true },
  { feature: "Custom integrations", free: false, pro: false, proMax: true },
  { feature: "SLA guarantee", free: false, pro: false, proMax: "99.9%" },
];

const faqs = [
  {
    question: "Can I switch between plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you will be charged the prorated difference for the remainder of your billing cycle. Downgrades take effect at the start of your next billing period.",
  },
  {
    question: "Is there a free trial for Pro or Pro Max?",
    answer:
      "We offer a 14-day free trial on both the Pro and Pro Max plans. No credit card is required to start your trial. You will only be charged once the trial period ends and you choose to continue.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans. All payments are securely processed and encrypted.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your account settings. Your plan benefits will remain active until the end of your current billing period. There are no cancellation fees.",
  },
  {
    question: "Do you offer discounts for teams or organizations?",
    answer:
      "Yes, we offer volume discounts for teams with 10 or more members and custom enterprise pricing for large organizations. Contact our sales team for a personalized quote.",
  },
  {
    question: "What happens to my data if I downgrade?",
    answer:
      "Your data is always safe. If you downgrade, features exclusive to higher tiers become read-only. You will not lose any historical data, but you will need to upgrade again to create new content with premium features.",
  },
];

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function formatPrice(tier: (typeof tiers)[number]) {
    const price = billingCycle === "monthly" ? tier.monthlyPrice : tier.yearlyPrice;
    if (price === 0) return "Free";
    return `$${price.toFixed(2)}`;
  }

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-10">
        {/* -------------------------------------------------------- */}
        {/*  Hero Header                                              */}
        {/* -------------------------------------------------------- */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-bold text-vp-lime uppercase tracking-[0.25em] mb-4">
            Subscription Tiers
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.1]">
            Level Up Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vp-lime to-vp-green">
              Game
            </span>
          </h1>
          <p className="text-base sm:text-lg text-vp-text-dim mt-5 max-w-xl mx-auto leading-relaxed">
            Choose the perfect subscription plan built for athletes, teams, and organizations who demand more from their competitive platform.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span
              className={`text-sm font-semibold transition-colors ${
                billingCycle === "monthly" ? "text-white" : "text-vp-text-muted"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-7 rounded-full bg-vp-card border border-vp-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-vp-lime"
              aria-label="Toggle billing cycle"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-vp-lime transition-transform duration-200 ${
                  billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-sm font-semibold transition-colors ${
                billingCycle === "yearly" ? "text-white" : "text-vp-text-muted"
              }`}
            >
              Yearly
            </span>
            {billingCycle === "yearly" && (
              <span className="ml-1 inline-flex items-center bg-vp-lime/15 text-vp-lime text-xs font-bold px-2.5 py-1 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Pricing Cards                                            */}
        {/* -------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-24">
          {tiers.map((tier) => {
            const isHighlighted = tier.highlighted;
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 ${
                  isHighlighted
                    ? "border-vp-lime/60 bg-vp-card shadow-[0_0_40px_-10px_rgba(200,255,0,0.15)] scale-[1.02] z-10"
                    : "border-vp-border bg-vp-card hover:border-vp-text-muted/50"
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-block bg-vp-lime text-vp-dark text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Tier Name */}
                <div className="mb-6 pt-2">
                  <h3
                    className={`text-lg font-bold uppercase tracking-wider ${
                      isHighlighted ? "text-vp-lime" : "text-white"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p className="text-xs text-vp-text-dim mt-1">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-black ${
                        isHighlighted ? "text-vp-lime" : "text-white"
                      }`}
                    >
                      {formatPrice(tier)}
                    </span>
                    {tier.monthlyPrice > 0 && (
                      <span className="text-sm text-vp-text-muted font-medium">/mo</span>
                    )}
                  </div>
                  {billingCycle === "yearly" && tier.monthlyPrice > 0 && (
                    <p className="text-xs text-vp-text-dim mt-1">
                      Billed ${(tier.yearlyPrice * 12).toFixed(2)}/year
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-vp-border mb-6" />

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5">
                      {f.included ? (
                        <CheckIcon className="text-vp-lime flex-shrink-0 mt-0.5" />
                      ) : (
                        <XIcon className="text-vp-text-muted flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm leading-snug ${
                          f.included ? "text-vp-text" : "text-vp-text-muted"
                        }`}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {tier.ctaStyle === "outlined" ? (
                  <button className="w-full py-3.5 rounded-xl border border-vp-border text-sm font-bold text-white hover:border-vp-text-muted transition-colors">
                    {tier.cta}
                  </button>
                ) : tier.ctaStyle === "filled" ? (
                  <button className="w-full py-3.5 rounded-xl bg-vp-lime text-vp-dark text-sm font-bold hover:bg-vp-lime-dark transition-colors shadow-[0_0_20px_-4px_rgba(200,255,0,0.3)]">
                    {tier.cta}
                  </button>
                ) : (
                  <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-vp-purple to-vp-blue text-white text-sm font-bold hover:opacity-90 transition-opacity">
                    {tier.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Feature Comparison Table                                  */}
        {/* -------------------------------------------------------- */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-vp-blue uppercase tracking-[0.25em] mb-3">
              Compare Plans
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Feature Breakdown
            </h2>
          </div>

          <div className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-vp-border bg-vp-dark/50">
              <div className="text-xs font-bold text-vp-text-dim uppercase tracking-wider">
                Feature
              </div>
              <div className="text-xs font-bold text-vp-text-dim uppercase tracking-wider text-center">
                Free
              </div>
              <div className="text-xs font-bold text-vp-lime uppercase tracking-wider text-center">
                Pro
              </div>
              <div className="text-xs font-bold text-vp-purple uppercase tracking-wider text-center">
                Pro Max
              </div>
            </div>

            {/* Table Rows */}
            {comparisonFeatures.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 gap-4 px-6 py-3.5 items-center ${
                  i < comparisonFeatures.length - 1 ? "border-b border-vp-border/50" : ""
                } ${i % 2 === 0 ? "bg-transparent" : "bg-vp-dark/20"}`}
              >
                <div className="text-sm text-vp-text font-medium">{row.feature}</div>
                {(["free", "pro", "proMax"] as const).map((plan) => {
                  const val = row[plan];
                  return (
                    <div key={plan} className="flex justify-center">
                      {val === true ? (
                        <CheckIcon className="text-vp-lime" />
                      ) : val === false ? (
                        <XIcon className="text-vp-text-muted/40" />
                      ) : (
                        <span className="text-xs font-semibold text-vp-text text-center">
                          {val}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  FAQ Section                                               */}
        {/* -------------------------------------------------------- */}
        <div className="max-w-3xl mx-auto mb-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-vp-orange uppercase tracking-[0.25em] mb-3">
              FAQ
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Common Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-vp-card rounded-2xl border border-vp-border overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-vp-lime rounded-2xl"
                  >
                    <span className="text-sm font-semibold text-white">{faq.question}</span>
                    <ChevronDownIcon
                      className={`text-vp-text-dim flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-60" : "max-h-0"
                    }`}
                  >
                    <p className="px-6 pb-5 text-sm text-vp-text-dim leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Bottom CTA                                                */}
        {/* -------------------------------------------------------- */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="relative rounded-2xl border border-vp-border bg-vp-card overflow-hidden px-8 py-14">
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-vp-purple/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                Need a Custom Plan?
              </h2>
              <p className="text-sm sm:text-base text-vp-text-dim max-w-lg mx-auto mb-8 leading-relaxed">
                We build tailored solutions for large organizations, leagues, and federations. Get dedicated infrastructure, custom integrations, and premium support.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-vp-purple to-vp-blue text-white text-sm font-bold hover:opacity-90 transition-opacity">
                  Contact Sales
                </button>
                <button className="px-8 py-3.5 rounded-xl border border-vp-border text-sm font-bold text-white hover:border-vp-text-muted transition-colors">
                  Schedule a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

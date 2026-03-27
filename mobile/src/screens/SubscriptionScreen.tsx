import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  badge?: string;
  features: PlanFeature[];
  ctaText: string;
  ctaStyle: "outlined" | "lime" | "gradient";
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    features: [
      { text: "Basic profile", included: true },
      { text: "Join tournaments", included: true },
      { text: "Live scoreboard", included: true },
      { text: "Community access", included: true },
      { text: "Standard stats", included: true },
    ],
    ctaText: "Current Plan",
    ctaStyle: "outlined",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "$49.99",
    yearlyPrice: "$39.99",
    badge: "MOST POPULAR",
    highlight: true,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority matchmaking", included: true },
      { text: "Custom branding", included: true },
      { text: "Video replays", included: true },
      { text: "Tournament creation (5)", included: true },
      { text: "Export reports", included: true },
    ],
    ctaText: "Upgrade to Pro",
    ctaStyle: "lime",
  },
  {
    id: "promax",
    name: "Pro Max",
    monthlyPrice: "$19.99",
    yearlyPrice: "$15.99",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited tournaments", included: true },
      { text: "Multi-org management", included: true },
      { text: "API access", included: true },
      { text: "White-label solution", included: true },
      { text: "Dedicated manager", included: true },
      { text: "Custom integrations", included: true },
      { text: "SLA 99.9%", included: true },
    ],
    ctaText: "Go Pro Max",
    ctaStyle: "gradient",
  },
];

const FAQ_ITEMS = [
  {
    id: "1",
    question: "Can I switch plans at any time?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    id: "2",
    question: "Is there a free trial for Pro plans?",
    answer: "Yes! All Pro and Pro Max plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    id: "3",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay. Enterprise plans can also pay via invoice.",
  },
  {
    id: "4",
    question: "Can I cancel my subscription?",
    answer: "Absolutely. You can cancel anytime from your account settings. You will retain access until the end of your current billing period.",
  },
];

export default function SubscriptionScreen() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>LEVEL UP</Text>
          <Text style={styles.headerTitleAccent}>YOUR GAME</Text>
          <Text style={styles.headerSubtitle}>
            Choose the plan that fits your competitive spirit
          </Text>
        </View>

        {/* Billing Toggle */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setBillingPeriod("monthly")}
              style={[styles.toggleBtn, billingPeriod === "monthly" && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleText, billingPeriod === "monthly" && styles.toggleTextActive]}>
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBillingPeriod("yearly")}
              style={[styles.toggleBtn, billingPeriod === "yearly" && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleText, billingPeriod === "yearly" && styles.toggleTextActive]}>
                Yearly
              </Text>
            </TouchableOpacity>
          </View>
          {billingPeriod === "yearly" && (
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>Save 20%</Text>
            </View>
          )}
        </View>

        {/* Plan Cards */}
        {PLANS.map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              plan.highlight && styles.planCardHighlight,
            ]}
          >
            {plan.badge && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>{plan.badge}</Text>
              </View>
            )}

            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.planPrice}>
                {billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
              </Text>
              {plan.id !== "free" && (
                <Text style={styles.planPeriod}>/{billingPeriod === "monthly" ? "mo" : "yr"}</Text>
              )}
            </View>

            <View style={styles.featuresList}>
              {plan.features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkText}>+</Text>
                  </View>
                  <Text style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.ctaButton,
                plan.ctaStyle === "outlined" && styles.ctaOutlined,
                plan.ctaStyle === "lime" && styles.ctaLime,
                plan.ctaStyle === "gradient" && styles.ctaGradient,
              ]}
            >
              <Text
                style={[
                  styles.ctaButtonText,
                  plan.ctaStyle === "outlined" && styles.ctaOutlinedText,
                  plan.ctaStyle === "lime" && styles.ctaLimeText,
                  plan.ctaStyle === "gradient" && styles.ctaGradientText,
                ]}
              >
                {plan.ctaText}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* FAQ Section */}
        <View style={[styles.faqSection, { marginBottom: 100 }]}>
          <Text style={styles.sectionLabel}>FREQUENTLY ASKED QUESTIONS</Text>
          {FAQ_ITEMS.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              onPress={() => toggleFaq(faq.id)}
              style={styles.faqCard}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <View style={styles.faqChevron}>
                  <Text style={styles.faqChevronText}>
                    {expandedFaq === faq.id ? "-" : "+"}
                  </Text>
                </View>
              </View>
              {expandedFaq === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.dark },
  container: { flex: 1, backgroundColor: colors.dark },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  headerTitle: { fontSize: fontSize.xxxl, fontWeight: "900", color: colors.white },
  headerTitleAccent: { fontSize: fontSize.xxxl, fontWeight: "900", color: colors.lime },
  headerSubtitle: {
    fontSize: fontSize.base,
    color: colors.textDim,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  toggleContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  toggleBtnActive: { backgroundColor: colors.lime },
  toggleText: { fontSize: fontSize.sm, fontWeight: "700", color: colors.textDim },
  toggleTextActive: { color: colors.dark },
  saveBadge: {
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  saveText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.green },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  planCardHighlight: {
    borderColor: colors.lime,
    borderWidth: 2,
    shadowColor: colors.lime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  popularBadge: {
    backgroundColor: colors.lime,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  popularBadgeText: { fontSize: 9, fontWeight: "800", color: colors.dark, letterSpacing: 1 },
  planName: { fontSize: fontSize.xl, fontWeight: "800", color: colors.white },
  priceRow: { flexDirection: "row", alignItems: "baseline", marginTop: spacing.xs, marginBottom: spacing.lg },
  planPrice: { fontSize: fontSize.xxxl, fontWeight: "900", color: colors.white },
  planPeriod: { fontSize: fontSize.sm, color: colors.textDim, marginLeft: 4 },
  featuresList: { marginBottom: spacing.lg },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(200,255,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  checkText: { fontSize: fontSize.xs, fontWeight: "700", color: colors.lime },
  featureText: { fontSize: fontSize.sm, color: colors.text, flex: 1 },
  ctaButton: {
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  ctaOutlined: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  ctaLime: { backgroundColor: colors.lime },
  ctaGradient: { backgroundColor: "#7c3aed" },
  ctaButtonText: { fontSize: fontSize.base, fontWeight: "700" },
  ctaOutlinedText: { color: colors.textDim },
  ctaLimeText: { color: colors.dark },
  ctaGradientText: { color: colors.white },
  faqSection: { paddingHorizontal: spacing.xl },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textDim,
    letterSpacing: 1.5,
    marginBottom: spacing.lg,
  },
  faqCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: { fontSize: fontSize.sm, fontWeight: "600", color: colors.white, flex: 1, marginRight: spacing.md },
  faqChevron: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  faqChevronText: { fontSize: fontSize.md, color: colors.lime, fontWeight: "700" },
  faqAnswer: {
    fontSize: fontSize.sm,
    color: colors.textDim,
    marginTop: spacing.md,
    lineHeight: 20,
  },
});

export const siteConfig = {
  name: "Voice AI Scorecard",
  description:
    "Find out if your business is ready for an AI voice agent in 2 minutes.",
  url: "https://scorecard.talkra.ai",
  oneTimePrice: 19,
  stripePriceId: process.env.STRIPE_PRICE_SCORECARD || "price_placeholder",
  nav: [
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  features: [
    {
      title: "15 Smart Questions",
      description:
        "Covers call volume, tech stack, team process, and ROI readiness",
      icon: "ClipboardList",
    },
    {
      title: "Score 0-100",
      description:
        "Instant score across 4 dimensions: Infra, Process, ROI, Fit",
      icon: "BarChart3",
    },
    {
      title: "PDF Report",
      description:
        "Detailed recommendations and 90-day implementation roadmap",
      icon: "FileText",
    },
    {
      title: "Talkra Demo",
      description:
        "Book a live demo of a real AI voice agent for your vertical",
      icon: "Phone",
    },
  ],
  faq: [
    {
      q: "How long does it take?",
      a: "About 2 minutes to complete the 15 questions.",
    },
    {
      q: "What do I get for $19?",
      a: "Full score breakdown, category analysis, top 5 recommendations, ROI estimate, and a PDF report.",
    },
    {
      q: "Is there a free version?",
      a: "No. Paying upfront means you get results you actually act on.",
    },
    {
      q: "Refund policy?",
      a: "Email hello@talkra.ai within 7 days for a full refund, no questions asked.",
    },
  ],
};

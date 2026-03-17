export interface Question {
  id: string;
  step: number;
  text: string;
  options: string[];
}

export const questions: Question[] = [
  // Step 1: Volume (q1-q4)
  {
    id: "q1",
    step: 1,
    text: "How many inbound calls does your business handle per month?",
    options: [
      "Under 100",
      "100–500",
      "500–2,000",
      "Over 2,000",
    ],
  },
  {
    id: "q2",
    step: 1,
    text: "How many outbound calls (sales, follow-ups, reminders) do you make per month?",
    options: [
      "Almost none",
      "Under 200",
      "200–1,000",
      "Over 1,000",
    ],
  },
  {
    id: "q3",
    step: 1,
    text: "What percentage of calls are repetitive or follow a script?",
    options: [
      "Less than 10%",
      "10–30%",
      "30–60%",
      "Over 60%",
    ],
  },
  {
    id: "q4",
    step: 1,
    text: "How many full-time staff currently handle phone calls?",
    options: [
      "0–1 (it's ad-hoc)",
      "2–3",
      "4–8",
      "9 or more",
    ],
  },

  // Step 2: Tech (q5-q8)
  {
    id: "q5",
    step: 2,
    text: "Does your business use a CRM (Salesforce, HubSpot, etc.)?",
    options: [
      "No CRM at all",
      "Spreadsheets / basic tool",
      "CRM but not well integrated",
      "Fully integrated CRM",
    ],
  },
  {
    id: "q6",
    step: 2,
    text: "Do you have an existing phone system or VoIP provider?",
    options: [
      "Personal cell phones",
      "Basic landline",
      "Cloud phone / VoIP (RingCentral, Twilio, etc.)",
      "Advanced contact center platform",
    ],
  },
  {
    id: "q7",
    step: 2,
    text: "How comfortable is your team with adopting new software tools?",
    options: [
      "Very resistant to change",
      "Slow but willing",
      "Generally open to new tools",
      "Early adopters — we love new tech",
    ],
  },
  {
    id: "q8",
    step: 2,
    text: "Do you have any APIs or integrations between your tools today?",
    options: [
      "No — everything is manual",
      "A few basic integrations (Zapier, etc.)",
      "Several integrations in place",
      "Fully connected tech stack with APIs",
    ],
  },

  // Step 3: Process (q9-q12)
  {
    id: "q9",
    step: 3,
    text: "Are your call scripts or talk tracks documented?",
    options: [
      "No scripts exist",
      "Informal / tribal knowledge",
      "Some scripts documented",
      "Fully documented call flows for every scenario",
    ],
  },
  {
    id: "q10",
    step: 3,
    text: "How do you currently handle after-hours or missed calls?",
    options: [
      "We don't — callers get voicemail",
      "Answering service / basic IVR",
      "Call-back next business day",
      "24/7 live team or overflow system",
    ],
  },
  {
    id: "q11",
    step: 3,
    text: "How do you measure call performance today?",
    options: [
      "We don't track anything",
      "Basic call logs only",
      "Track some KPIs (answer rate, hold time)",
      "Full analytics dashboard with conversion tracking",
    ],
  },
  {
    id: "q12",
    step: 3,
    text: "Does leadership support investing in AI or automation?",
    options: [
      "No — leadership is skeptical",
      "Open-minded but cautious",
      "Actively exploring AI solutions",
      "AI is a stated priority with budget allocated",
    ],
  },

  // Step 4: ROI (q13-q15)
  {
    id: "q13",
    step: 4,
    text: "What is the average revenue per customer or deal closed over the phone?",
    options: [
      "Under $100",
      "$100–$500",
      "$500–$2,000",
      "Over $2,000",
    ],
  },
  {
    id: "q14",
    step: 4,
    text: "How many leads or appointments do you estimate are lost to missed calls each month?",
    options: [
      "Very few (under 5)",
      "5–20",
      "20–50",
      "Over 50",
    ],
  },
  {
    id: "q15",
    step: 4,
    text: "How much do you currently spend on phone staff, answering services, or call centers per month?",
    options: [
      "Under $1,000",
      "$1,000–$5,000",
      "$5,000–$15,000",
      "Over $15,000",
    ],
  },
];

export const stepLabels: Record<number, string> = {
  1: "Call Volume",
  2: "Tech Stack",
  3: "Process & Culture",
  4: "ROI Potential",
};

export function getQuestionsForStep(step: number): Question[] {
  return questions.filter((q) => q.step === step);
}

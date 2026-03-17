const POINTS = [10, 40, 75, 100] as const;

const WEIGHTS = {
  volume: 0.3,
  tech: 0.25,
  process: 0.25,
  roi: 0.2,
} as const;

export type Level = "not-ready" | "exploring" | "ready" | "champion";

export interface CategoryScore {
  label: string;
  score: number;
  weight: number;
}

export interface ScorecardResult {
  totalScore: number;
  level: Level;
  categories: CategoryScore[];
  recommendations: string[];
  roiEstimate: string;
}

function avg(ids: string[], answers: Record<string, number>): number {
  const scores = ids.map((id) => POINTS[answers[id] ?? 0]);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function getLevel(score: number): Level {
  if (score >= 80) return "champion";
  if (score >= 60) return "ready";
  if (score >= 40) return "exploring";
  return "not-ready";
}

function buildRecommendations(
  answers: Record<string, number>,
  categories: CategoryScore[]
): string[] {
  const recs: string[] = [];

  const sorted = [...categories].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];

  if (weakest.label === "Call Volume") {
    recs.push(
      "Start by tracking your exact call volume for 30 days — you may be underestimating demand."
    );
  } else if (weakest.label === "Tech Stack") {
    recs.push(
      "Upgrade your phone system to a cloud VoIP provider before deploying a voice AI agent."
    );
  } else if (weakest.label === "Process & Culture") {
    recs.push(
      "Document your most common call scripts — AI agents need clear playbooks to follow."
    );
  } else if (weakest.label === "ROI Potential") {
    recs.push(
      "Calculate your cost-per-missed-call to build a concrete ROI case for leadership."
    );
  }

  if ((answers["q5"] ?? 0) < 2) {
    recs.push(
      "Implement a CRM (even a free one like HubSpot) to centralize customer data before adding AI."
    );
  }

  if ((answers["q9"] ?? 0) < 2) {
    recs.push(
      "Create documented call scripts for your top 5 call scenarios — this is the #1 input an AI agent needs."
    );
  }

  if ((answers["q10"] ?? 0) < 2) {
    recs.push(
      "Deploy an AI agent for after-hours calls first — it's the easiest win with the fastest ROI."
    );
  }

  if ((answers["q12"] ?? 0) < 2) {
    recs.push(
      "Present leadership with a small pilot proposal — a 30-day trial on one call type reduces risk."
    );
  }

  if ((answers["q11"] ?? 0) < 2) {
    recs.push(
      "Start tracking call KPIs (answer rate, hold time, conversion) to establish a baseline before AI."
    );
  }

  if ((answers["q7"] ?? 0) < 2) {
    recs.push(
      "Run a team workshop on AI voice agents to reduce resistance and build internal champions."
    );
  }

  if ((answers["q6"] ?? 0) < 2) {
    recs.push(
      "Migrate to a cloud phone system (Twilio, RingCentral) — it's a prerequisite for voice AI integration."
    );
  }

  // Always return exactly 5
  return recs.slice(0, 5);
}

function estimateROI(answers: Record<string, number>): string {
  const missedCalls = [3, 12, 35, 75][(answers["q14"] ?? 0)];
  const dealValue = [50, 300, 1000, 3000][(answers["q13"] ?? 0)];
  const conversionRate = 0.15;
  const monthlyRecovery = Math.round(missedCalls * dealValue * conversionRate);

  if (monthlyRecovery < 500) {
    return `Estimated $${monthlyRecovery.toLocaleString()}/mo in recovered revenue — modest but growing.`;
  }
  if (monthlyRecovery < 5000) {
    return `Estimated $${monthlyRecovery.toLocaleString()}/mo in recovered revenue — strong case for a voice AI pilot.`;
  }
  return `Estimated $${monthlyRecovery.toLocaleString()}/mo in recovered revenue — voice AI could pay for itself in weeks.`;
}

export function calculateScore(
  answers: Record<string, number>
): ScorecardResult {
  const volumeScore = avg(["q1", "q2", "q3", "q4"], answers);
  const techScore = avg(["q5", "q6", "q7", "q8"], answers);
  const processScore = avg(["q9", "q10", "q11", "q12"], answers);
  const roiScore = avg(["q13", "q14", "q15"], answers);

  const categories: CategoryScore[] = [
    { label: "Call Volume", score: Math.round(volumeScore), weight: WEIGHTS.volume },
    { label: "Tech Stack", score: Math.round(techScore), weight: WEIGHTS.tech },
    { label: "Process & Culture", score: Math.round(processScore), weight: WEIGHTS.process },
    { label: "ROI Potential", score: Math.round(roiScore), weight: WEIGHTS.roi },
  ];

  const totalScore = Math.round(
    volumeScore * WEIGHTS.volume +
      techScore * WEIGHTS.tech +
      processScore * WEIGHTS.process +
      roiScore * WEIGHTS.roi
  );

  const level = getLevel(totalScore);
  const recommendations = buildRecommendations(answers, categories);
  const roiEstimate = estimateROI(answers);

  return { totalScore, level, categories, recommendations, roiEstimate };
}

/* ------------------------------------------------------------------ */
/* DESIGN FUNDAMENTALS - COURSE ARCHITECTURE (Phase 1)                 */
/* No unit/section content lives here yet - that's Phase 2/3. This file*/
/* holds the reusable scaffolding every section will be built on:      */
/* the DT stage system, grade boundaries, question categories/types,   */
/* randomisation counts, and the deterministic (non-AI) stage-         */
/* suggestion heuristic used for open responses.                       */
/* ------------------------------------------------------------------ */

// Canonical DT stages. Do not introduce alternative labels anywhere in
// this course - these four are the only ones the app should ever show.
const DT_STAGES = ["beginning", "emerging", "developing", "mastering"];

const DT_STAGE_INFO = {
  beginning: { label: "Beginning", verb: "Identify", tint: "#FF3B30" },
  emerging: { label: "Emerging", verb: "Explain", tint: "#FF9500" },
  developing: { label: "Developing", verb: "Apply", tint: "#0071E3" },
  mastering: { label: "Mastering", verb: "Justify", tint: "#34C759" },
};

// Existing DT grade boundaries (do not change these numbers - they're the
// school's own reporting scale, kept here as reference/documentation for
// the teacher dashboard; the course itself only ever assigns a DT stage).
const DT_GRADE_BOUNDARIES = [
  { band: "9.0+", grade: "A*", percent: 83, stage: "mastering" },
  { band: "8.0\u20138.9", grade: "A", percent: 78, stage: "mastering" },
  { band: "7.0\u20137.9", grade: "A-", percent: 72, stage: "mastering" },
  { band: "6.0\u20136.9", grade: "B", percent: 62, stage: "developing" },
  { band: "5.0\u20135.9", grade: "C+", percent: 54, stage: "developing" },
  { band: "4.0\u20134.9", grade: "C-", percent: 49, stage: "developing" },
  { band: "3.0\u20133.9", grade: "D", percent: 45, stage: "emerging" },
  { band: "2.0\u20132.9", grade: "E", percent: 36, stage: "emerging" },
  { band: "1.0\u20131.9", grade: "F", percent: 29, stage: "beginning" },
  { band: "Below 1.0", grade: "G", percent: 22, stage: "beginning" },
];

const FIVE_CS = ["Creativity", "Collaboration", "Critical Thinking", "Community", "Character"];

// Cognitive question categories (section 12)
const QUESTION_CATEGORIES = {
  R: { label: "Remember & Recognise", description: "Recall and basic recognition." },
  E: { label: "Explain & Examine", description: "Understanding and explanation." },
  A: { label: "Apply & Analyse", description: "Application to a context." },
  D: { label: "Decide & Defend", description: "Decision-making and justification." },
  C: { label: "Challenge & Connect", description: "Higher-order connections." },
};

// Supported question types (section 11). Each maps to a renderer component
// name; Phase 1 wires the plumbing, Phase 3 supplies real questions of
// each type for Section 1.
const QUESTION_TYPES = [
  "multiple_choice", "multiple_select", "true_false", "matching", "sorting",
  "fill_gap", "short_response", "extended_response", "improve_it",
  "decide_defend", "scenario_response",
];

const OPEN_RESPONSE_TYPES = ["short_response", "extended_response", "improve_it", "decide_defend", "scenario_response"];

// Randomisation targets (section 16)
const ATTEMPT_TYPE_INFO = {
  micro: { label: "Micro Check", count: 2 },
  section: { label: "Section Check", count: 5 },
  checkpoint: { label: "Checkpoint Quiz", countRange: [8, 10] },
  endofunit: { label: "End-of-Unit Quiz", countRange: [15, 20] },
  final: { label: "Final Challenge", count: null }, // not a random draw - a single integrated task
};

/* ------------------------------------------------------------------ */
/* DETERMINISTIC STAGE-SUGGESTION HEURISTIC                            */
/* No AI call. Compares a student's response text against the         */
/* question's own curated acceptedIdeas/expectedKnowledge, exactly as  */
/* section 9/55 require - the heuristic works against approved content,*/
/* it never invents its own judgement of what's correct. Always        */
/* produces a plain-language reason a teacher can read and override.   */
/* ------------------------------------------------------------------ */

const REASONING_CONNECTORS = /\b(because|so that|this means|therefore|as a result|due to|which means|in order to)\b/i;
const JUSTIFICATION_SIGNALS = /\b(evidence|test(ed|ing)?|measur(e|ed|ing)|compar(e|ed|ison)|justif\w*|research|data|survey|user(s)? (said|found|showed|reported)|percent|%|\d+)\b/i;

function countAcceptedIdeaMatches(text, acceptedIdeas) {
  const lower = (text || "").toLowerCase();
  return (acceptedIdeas || []).filter((idea) => {
    const key = idea.toLowerCase().split(/\s+/).slice(0, 3).join(" "); // match on the idea's leading phrase
    return lower.includes(key) || idea.toLowerCase().split(/\s+/).some((w) => w.length > 4 && lower.includes(w));
  }).length;
}

function suggestDTStage(responseText, question) {
  const text = (responseText || "").trim();
  const acceptedIdeas = (question && question.acceptedIdeas) || [];
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const keywordHits = text ? countAcceptedIdeaMatches(text, acceptedIdeas) : 0;
  const hasReasoning = REASONING_CONNECTORS.test(text);
  const hasJustification = JUSTIFICATION_SIGNALS.test(text);

  if (!text || keywordHits === 0 || wordCount < 4) {
    return {
      stage: "beginning",
      reasoning: acceptedIdeas.length
        ? "Doesn't yet clearly connect to the DT knowledge this question is looking for. Look again at what's being asked and identify the relevant idea."
        : "The response is very short or unclear \u2014 there isn't enough here yet to identify the key idea.",
    };
  }
  if (keywordHits >= 2 && hasReasoning && wordCount >= 15 && hasJustification) {
    return {
      stage: "mastering",
      reasoning: `Identifies ${keywordHits} relevant idea${keywordHits === 1 ? "" : "s"}, explains the reasoning, and includes evidence, testing or comparison language \u2014 the hallmark of justifying a decision.`,
    };
  }
  if (keywordHits >= 2 && hasReasoning && wordCount >= 15) {
    return {
      stage: "developing",
      reasoning: `Applies ${keywordHits} relevant ideas and explains the thinking within the design context, but doesn't yet reference evidence, testing or comparison to justify it.`,
    };
  }
  if (keywordHits >= 1 && (hasReasoning || wordCount >= 8)) {
    return {
      stage: "emerging",
      reasoning: "Identifies a relevant idea and begins to explain it, but the reasoning is still limited \u2014 try developing why it matters in this specific situation.",
    };
  }
  return {
    stage: "beginning",
    reasoning: "Identifies something relevant, but the answer isn't yet connected clearly to the design situation.",
  };
}

// Section 7's feedback language, generated from the suggested stage. Kept
// separate from suggestDTStage's `reasoning` (which explains *why* to a
// teacher) - this is what the *student* sees, phrased as a next step.
function stageNextStepFeedback(stage) {
  switch (stage) {
    case "beginning":
      return "You've started to identify the idea. Look again at what the question is asking and identify the DT knowledge that could help.";
    case "emerging":
      return "You've identified a relevant point. Develop your answer by explaining why it matters in this situation.";
    case "developing":
      return "You've applied the idea clearly. To move towards Mastering, justify your decision using evidence, measurements, research or testing.";
    case "mastering":
      return "You've applied the knowledge and justified your decision clearly using the design context.";
    default:
      return "";
  }
}

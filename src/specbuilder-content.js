/* ------------------------------------------------------------------ */
/* SPECIFICATION BUILDER CONTENT                                       */
/* ------------------------------------------------------------------ */

const SPEC_CATEGORIES = [
  {
    key: "user", label: "User", icon: "Users",
    question: "Who will use the product?",
    prompts: [
      "Who is the target user?",
      "What does the user need?",
      "Are there any age, ability or accessibility considerations?",
      "What would make the product easy or comfortable for them to use?",
    ],
    example: { weak: "It should be easy to use.", better: "The product must have controls that a Year 7 student with limited hand strength can operate one-handed." },
  },
  {
    key: "function", label: "Function", icon: "Settings",
    question: "What must the product actually do?",
    prompts: [
      "What is the main purpose?",
      "What does the product need to hold, support, protect, display or perform?",
      "Are there secondary functions?",
      "What would make it successful?",
    ],
    example: { weak: "It should work well.", better: "The organiser must hold at least 6 pens and 3 pencils upright." },
  },
  {
    key: "size", label: "Size & Ergonomics", icon: "Ruler",
    question: "What size and shape does it need to be?",
    prompts: [
      "Are there maximum or minimum dimensions?",
      "Does it need to fit somewhere?",
      "Does it need to fit a person, object or piece of equipment?",
      "Are there measurements from user research that should be used?",
      "Does it need to be comfortable or easy to operate?",
    ],
    example: { weak: "The product should not be too big.", better: "The product must be less than 250mm wide so it fits inside the user's school locker." },
  },
  {
    key: "materials", label: "Materials", icon: "Layers",
    question: "What properties do the materials need?",
    prompts: [
      "Does the product need to be strong, flexible, lightweight, waterproof, transparent, or heat resistant?",
      "Are there materials that should or should not be used, and why?",
    ],
    example: { weak: "The product must be made from acrylic.", better: "The main body should use a rigid material that can be accurately laser cut and is resistant to moisture." },
  },
  {
    key: "manufacturing", label: "Manufacturing", icon: "Wrench",
    question: "How will it be made?",
    prompts: [
      "How accurately does the product need to be made?",
      "Are there manufacturing processes that may be appropriate?",
      "Will it be made as a one-off, batch or mass-produced product?",
      "Does it need to be easy to assemble?",
      "Are there limitations caused by available equipment?",
    ],
    example: { weak: "It should be easy to make.", better: "All parts must be cuttable on the school's laser cutter (max sheet size 600 x 400mm)." },
  },
  {
    key: "safety", label: "Safety", icon: "ShieldCheck",
    question: "How could this product cause harm, and how will you prevent it?",
    prompts: [
      "Could any part of the product injure the user?",
      "Are there sharp edges? Could it tip over? Are there small parts?",
      "Will it carry weight? Does it involve electricity, heat or moving parts?",
    ],
    example: { weak: "It should be safe.", better: "All exposed corners must have a radius of at least 3mm to reduce sharp edges." },
  },
  {
    key: "sustainability", label: "Sustainability", icon: "Leaf",
    question: "What is the environmental impact?",
    prompts: [
      "Can material use be reduced?",
      "Could recycled or recyclable materials be used?",
      "Can components be repaired or replaced?",
      "Could the product be disassembled? What happens at the end of its life?",
    ],
    example: { weak: "It should be eco-friendly.", better: "At least 50% of the material used must be recycled or from a certified sustainable source." },
  },
  {
    key: "aesthetics", label: "Aesthetics", icon: "Palette",
    question: "What should it look like?",
    prompts: [
      "What style would appeal to the intended user?",
      "Are there colours, shapes, textures or finishes that would be suitable?",
      "Does it need to match an existing environment or brand?",
    ],
    example: { weak: "It should look nice.", better: "The product should use bright, bold colours that appeal to primary-school-aged children." },
  },
  {
    key: "cost", label: "Cost", icon: "Coins",
    question: "What are the cost constraints?",
    prompts: [
      "Is there a maximum budget?",
      "Should the product use inexpensive materials?",
      "Does manufacturing time affect cost?",
      "If commercially produced, what might the target selling price be?",
    ],
    example: { weak: "It should be cheap.", better: "The total material cost must not exceed \u00a35 per unit." },
  },
];

function specCategoryByKey(key) {
  return SPEC_CATEGORIES.find((c) => c.key === key);
}

/* Rule-based quality checker. Deliberately simple and deterministic (no
   AI/LLM involved) - it pattern-matches a handful of common vague phrases
   per the brief, plus a couple of generic length/number heuristics, and
   returns a Socratic follow-up question rather than rewriting anything. */
function checkSpecQuality(text) {
  const t = (text || "").trim();
  if (!t) return null;
  const lower = t.toLowerCase();

  const rules = [
    { test: /\b(good size|right size|not too big|not too small|appropriate size)\b/, message: "Can you add a measurement, or a maximum/minimum size?" },
    { test: /\b(nice|good|attractive|appealing)\b/, message: "This is hard to measure. What colours, style, shape or finish would appeal to your intended user?" },
    { test: /\bstrong\b/, message: "Strong enough for what? Consider what weight, force or type of use the product needs to withstand." },
    { test: /\bcheap\b/, message: "Could you define a maximum material cost or target selling price?" },
    { test: /\b(safe|safely)\b/, message: "What specifically makes it safe? Think about edges, weight, moving parts or electricity." },
    { test: /\beasy to use\b/, message: "Easy for whom, and in what way? What would make it easy for your specific user?" },
    { test: /\beco.?friendly\b/, message: "What specifically makes it eco-friendly \u2014 recycled content, reduced material, repairability?" },
    { test: /\bdurable\b/, message: "Durable against what? Consider drops, daily use, weather, or a specific number of uses." },
    { test: /\bcomfortable\b/, message: "Comfortable how? Think about grip, weight, texture or how long it will be used for." },
  ];

  for (const rule of rules) {
    if (rule.test.test(lower)) return rule.message;
  }

  const hasNumber = /\d/.test(t);
  const wordCount = t.split(/\s+/).filter(Boolean).length;
  if (!hasNumber && wordCount <= 6) {
    return "Try adding a specific detail or measurement \u2014 specifications that include a number are usually easier to test later.";
  }
  return null;
}

/* Simple strength check: a category counts as covered once it has at least
   one point. This is guidance, not a checklist - no category is compulsory,
   and there's no "correct" number of points per category. */
function specStrength(points) {
  const byCategory = {};
  (points || []).forEach((p) => { byCategory[p.category] = (byCategory[p.category] || 0) + 1; });
  return SPEC_CATEGORIES.map((c) => ({
    key: c.key,
    label: c.label,
    count: byCategory[c.key] || 0,
    status: byCategory[c.key] >= 2 ? "strong" : byCategory[c.key] === 1 ? "partial" : "empty",
  }));
}

/* Builds a rough written-prose DRAFT of the specification from the
   student's own structured points - a starting point for the kind of
   written summary a design portfolio needs, not a finished piece of work.
   Deliberately template-based (no AI) so it's fast, free, and predictable,
   and always framed to the student as something to rewrite in their own
   words rather than hand in as-is. */
function generateSpecSummaryDraft(project, points) {
  const lines = [];
  const name = (project.projectName || "this product").trim();
  const user = (project.intendedUser || "").trim();
  const problem = (project.designProblem || "").trim();

  let intro = `This specification is for ${name}`;
  if (user) intro += `, designed for ${user}`;
  intro += ".";
  if (problem) intro += ` ${problem}`;
  lines.push(intro);

  SPEC_CATEGORIES.forEach((cat) => {
    const items = (points || []).filter((p) => p.category === cat.key).sort((a, b) => a.order - b.order);
    if (items.length === 0) return;

    const sentences = items.map((p, i) => {
      const lead = i === 0 ? "The product must" : "It must also";
      const body = stripLeadingRequirementPhrase(p.requirement);
      let s = `${lead} ${body}`;
      if (p.reason && p.reason.trim()) s += `, because ${lowerFirst(p.reason.trim())}`;
      s += ".";
      if (p.testingMethod && p.testingMethod.trim()) {
        s += ` This will be checked by ${lowerFirst(p.testingMethod.trim())}.`;
      }
      return s;
    });

    lines.push(`${cat.label}: ${sentences.join(" ")}`);
  });

  return lines.join("\n\n");
}

/* Students often write requirements already starting with "The product
   must..." / "Must..." (matching the worked examples they're shown) - strip
   that off so it doesn't collide with the sentence lead-in we add. */
function stripLeadingRequirementPhrase(text) {
  const t = (text || "").trim();
  const stripped = t.replace(/^(the product|it)\s+(must|should)\s+/i, "").replace(/^(must|should)\s+/i, "");
  return lowerFirst(stripped || t);
}

function lowerFirst(text) {
  const t = (text || "").trim();
  if (!t) return t;
  // don't lowercase things that look like they start with a proper noun/number/acronym
  if (/^[A-Z]{2,}/.test(t) || /^\d/.test(t)) return t;
  return t.charAt(0).toLowerCase() + t.slice(1);
}

/* global React, ReactDOM */
const {
  useState,
  useMemo,
  useRef,
  useEffect
} = React;

/* ===== content.js ===== */
/* ------------------------------------------------------------------ */
/* CONTENT DATA                                                        */
/* ------------------------------------------------------------------ */

const ACCESSFM = [{
  id: "a1",
  letter: "A",
  word: "Aesthetics",
  icon: "Palette",
  desc: "How the product looks, feels and appeals to the user \u2014 shape, colour, pattern and finish.",
  simple: "How does it look? Do people like the colours, shape and style?",
  example: "A smoothie maker with soft curves and a matte finish feels friendly on a kitchen worktop.",
  prompt: "Describe the look and feel of your product. What shapes, colours, textures or finishes will make it appealing?",
  analyzePrompt: "How does this product look and feel? What do you think makes it appealing \u2014 or not?",
  wordbank: ["bright colours", "smooth finish", "modern style", "bold pattern", "simple shape", "eye-catching", "matches other products"],
  starters: ["I want my product to look...", "I will use these colours because...", "My design will stand out because..."],
  analyzeStarters: ["This product looks...", "I think people would like this because...", "The colours and shape make me think..."],
  scenario: "A furniture company redesigns their bookshelf with smooth curves, a choice of three trending colours, and a glossy finish that matches modern living rooms."
}, {
  id: "c1",
  letter: "C",
  word: "Cost",
  icon: "Coins",
  desc: "What it costs to make and to buy \u2014 materials, manufacturing and profit margin.",
  simple: "How much money does it take to make, and how much will people pay for it?",
  example: "A flat-pack chair uses cheap board and simple joints to keep the price down.",
  prompt: "Estimate what your product might cost to make. Where could you save money without ruining the quality?",
  analyzePrompt: "How much do you think this product costs to make and to buy? Does it seem good value?",
  wordbank: ["cheap to make", "good value", "affordable", "low-cost materials", "keeps the price down", "worth the money"],
  starters: ["My product could cost around...", "I can keep the cost low by...", "This part might be expensive because..."],
  analyzeStarters: ["I think this costs around... because...", "This looks like good value because...", "This might be expensive to make because..."],
  scenario: "A phone case brand switches to a cheaper plastic and simplifies the mould design, cutting the retail price by \u00a33."
}, {
  id: "c2",
  letter: "C",
  word: "Customer",
  icon: "Users",
  desc: "Who the product is designed for \u2014 their age, needs, lifestyle and budget.",
  simple: "Who will use this product? What do they need?",
  example: "A children's toothbrush has a chunky handle sized for small hands.",
  prompt: "Who exactly is this product for? What do they need from it that other products don't give them?",
  analyzePrompt: "Who do you think this product was designed for? How can you tell?",
  wordbank: ["teenagers", "young children", "busy parents", "older people", "students", "easy to hold", "comfortable to use"],
  starters: ["My product is designed for...", "This person needs...", "It will be easy for them to use because..."],
  analyzeStarters: ["I think this was designed for... because...", "This suggests it's aimed at...", "The clues that show me this are..."],
  scenario: "A backpack is designed with reflective strips, a padded laptop sleeve, and straps sized for a 12-year-old's shoulders."
}, {
  id: "e1",
  letter: "E",
  word: "Environment",
  icon: "Leaf",
  desc: "The impact on the planet \u2014 materials, energy use, waste and recyclability.",
  simple: "Does the product harm the planet, or help it?",
  example: "A bamboo phone case biodegrades instead of sitting in landfill for centuries.",
  prompt: "What happens to your product at the end of its life? Could it use recycled or renewable materials?",
  analyzePrompt: "What impact might this product have on the environment? Could it be more sustainable?",
  wordbank: ["recyclable", "biodegradable", "reduces waste", "made from recycled material", "long-lasting", "energy-saving"],
  starters: ["My product is good for the environment because...", "At the end of its life, my product will...", "I could reduce waste by..."],
  analyzeStarters: ["This product could affect the environment by...", "It could be more sustainable if...", "One eco-friendly feature is..."],
  scenario: "A shampoo brand switches from a plastic bottle to a compostable cardboard tube."
}, {
  id: "s1",
  letter: "S",
  word: "Size",
  icon: "Ruler",
  desc: "The dimensions and proportions \u2014 does it fit the space, the task and the user?",
  simple: "Is it the right size for the job and the person using it?",
  example: "A fold-flat drying rack is sized to fit inside a standard airing cupboard.",
  prompt: "What size does your product need to be? Think about the space and the people using it.",
  analyzePrompt: "Is the size right for its purpose and user? Why or why not?",
  wordbank: ["compact", "lightweight", "fits easily", "small enough to carry", "large enough for", "the right height"],
  starters: ["My product needs to be...", "It has to fit...", "The size is important because..."],
  analyzeStarters: ["The size seems right because...", "This size works well because...", "It might be a problem if..."],
  scenario: "A travel kettle is designed to be small enough to fit in a suitcase, holding just enough water for two cups."
}, {
  id: "s2",
  letter: "S",
  word: "Safety",
  icon: "ShieldCheck",
  desc: "How safe the product is to make, use and dispose of.",
  simple: "Could the product hurt someone? How can the design stop that?",
  example: "A kettle's handle stays cool to the touch to prevent burns.",
  prompt: "What hazards could your product create? How will your design reduce or remove them?",
  analyzePrompt: "Are there any safety features you can spot, or any hazards?",
  wordbank: ["rounded edges", "no sharp parts", "stays cool to touch", "stable base", "non-toxic materials", "clear warning label"],
  starters: ["A possible danger is...", "To keep the user safe, I will...", "I need to think about..."],
  analyzeStarters: ["A safety feature I can see is...", "A possible hazard is...", "This keeps the user safe by..."],
  scenario: "A hairdryer is fitted with a heat-resistant handle and an automatic cut-off switch if it overheats."
}, {
  id: "f1",
  letter: "F",
  word: "Function",
  icon: "Settings",
  desc: "What the product actually does, and how well it does it.",
  simple: "What job does the product need to do?",
  example: "A multi-tool works as a knife, screwdriver and bottle opener in one.",
  prompt: "What is the main job your product has to do? What secondary jobs might it also do?",
  analyzePrompt: "How well do you think this product does its job? Does it do more than one job?",
  wordbank: ["works quickly", "easy to use", "reliable", "multi-purpose", "does the job well", "simple to operate"],
  starters: ["The main job of my product is to...", "It also needs to...", "It will work by..."],
  analyzeStarters: ["This product's main job is to...", "I think it works well because...", "It also seems to..."],
  scenario: "A watch is designed to tell the time, track steps, and show text message notifications."
}, {
  id: "m1",
  letter: "M",
  word: "Materials",
  icon: "Layers",
  desc: "What it's made from, and why those materials suit the job.",
  simple: "What is it made from, and why is that a good choice?",
  example: "A saucepan uses stainless steel for the body and heat-resistant plastic for the handle.",
  prompt: "What materials will you use, and why are they suitable \u2014 strength, cost, appearance, weight?",
  analyzePrompt: "What materials is it made from? Why do you think the designer chose them?",
  wordbank: ["strong", "waterproof", "lightweight", "recycled plastic", "natural wood", "stainless steel", "flexible"],
  starters: ["I will use... because...", "This material is good for my product because...", "One material I am considering is..."],
  analyzeStarters: ["I think this is made from... because...", "This material was probably chosen because...", "It looks like it is made of..."],
  scenario: "A saucepan is made with a copper base for even heating and a heat-resistant plastic handle."
}];
const SCAMPER = [{
  id: "s1",
  letter: "S",
  word: "Substitute",
  icon: "Repeat",
  desc: "Swap a material, part, process or ingredient for something else.",
  simple: "Can you swap one part or material for something different?",
  example: "Swapping a glass bottle for a lightweight aluminium can.",
  prompt: "What could you swap out in your design \u2014 a material, a part, a process?",
  analyzePrompt: "Could any part or material of this product be substituted for something better?",
  wordbank: ["swap the material", "use a different part", "replace with something lighter", "try a new process", "use an alternative"],
  starters: ["I could substitute... with...", "Instead of using..., I could use...", "One thing I could swap is..."],
  analyzeStarters: ["A better material might be...", "Swapping... for... could improve it because...", "I would substitute... with..."],
  scenario: "A shoe designer replaces the leather upper with a recycled mesh fabric to cut cost and weight."
}, {
  id: "c1",
  letter: "C",
  word: "Combine",
  icon: "GitMerge",
  desc: "Merge two ideas, products or functions into one.",
  simple: "Can you join two ideas or jobs together to make one new idea?",
  example: "A printer that also scans and photocopies.",
  prompt: "Could you combine your product with another idea or function?",
  analyzePrompt: "Could this product be combined with another product or feature to add value?",
  wordbank: ["combine two functions", "merge with another product", "join together", "two-in-one design", "add an extra feature"],
  starters: ["I could combine my idea with...", "What if it also did...", "Joining these two ideas would..."],
  analyzeStarters: ["This could be combined with...", "Adding... would improve it because...", "It might work well alongside..."],
  scenario: "A designer adds a built-in bottle opener to the end of a camping multi-tool."
}, {
  id: "a1",
  letter: "A",
  word: "Adapt",
  icon: "RefreshCw",
  desc: "Change part of the design to suit a new purpose or improve it.",
  simple: "Can you copy or change an idea from somewhere else?",
  example: "Velcro was adapted from the way burrs cling to fur.",
  prompt: "What could you adapt from another product, or from nature, to improve your design?",
  analyzePrompt: "Has anything about this product been adapted from another product or from nature? What else could be adapted?",
  wordbank: ["copy from nature", "borrow an idea from", "change the shape of", "adjust to fit", "inspired by"],
  starters: ["I could adapt this idea from...", "This reminds me of..., so I could...", "I might change this part to..."],
  analyzeStarters: ["This feature looks adapted from...", "I think the designer was inspired by...", "Something else that could be adapted is..."],
  scenario: "A running shoe sole is redesigned to copy the grip pattern found on a mountain goat's hoof."
}, {
  id: "m1",
  letter: "M",
  word: "Modify",
  icon: "SlidersHorizontal",
  desc: "Make a feature bigger, smaller, or change it in some way.",
  simple: "Can you make a part bigger, smaller or different?",
  example: "A travel-size shampoo bottle shrinks the packaging for convenience.",
  prompt: "What could you make bigger, smaller, louder, stronger or lighter?",
  analyzePrompt: "What could be modified about this product to improve it?",
  wordbank: ["make it smaller", "make it bigger", "make it stronger", "make it lighter", "change the colour", "add more detail"],
  starters: ["I could make... bigger by...", "Changing the... would...", "One modification I could make is..."],
  analyzeStarters: ["I would modify... by making it...", "Changing... would improve it because...", "One thing I'd make bigger or smaller is..."],
  scenario: "A backpack's shoulder straps are made wider and more padded to reduce pressure on the wearer."
}, {
  id: "p1",
  letter: "P",
  word: "Put to another use",
  icon: "Recycle",
  desc: "Find a new use for the product, or for its parts.",
  simple: "Could this be used for a different job?",
  example: "Bubble wrap was originally designed and sold as wallpaper.",
  prompt: "Could your product \u2014 or parts of it \u2014 be used for something else entirely?",
  analyzePrompt: "Could this product, or part of it, be used differently?",
  wordbank: ["reuse for", "repurpose as", "could also work as", "a new use for this could be"],
  starters: ["This part could also be used for...", "Instead of throwing it away, it could become...", "A new use for this might be..."],
  analyzeStarters: ["This could also be used for...", "Instead of its usual job, it could...", "A new use for this might be..."],
  scenario: "An old shipping container is turned into a small coffee shop instead of being scrapped."
}, {
  id: "e1",
  letter: "E",
  word: "Eliminate",
  icon: "Eraser",
  desc: "Remove a part, feature or step to simplify the design.",
  simple: "Can you take a part away to make it simpler, cheaper or safer?",
  example: "Cordless tools eliminate the need for a trailing cable.",
  prompt: "What could you remove from your design to make it simpler, cheaper or safer?",
  analyzePrompt: "Is there anything unnecessary about this product that could be removed to improve it?",
  wordbank: ["remove the", "simplify by taking away", "no longer needs", "cut out the", "make it simpler"],
  starters: ["I could remove... because...", "This part isn't needed because...", "Taking away... would make it..."],
  analyzeStarters: ["I think... could be removed because...", "This part doesn't seem necessary because...", "Removing... would make it..."],
  scenario: "A juice carton removes the plastic cap entirely, replacing it with a fold-and-tear spout."
}, {
  id: "r1",
  letter: "R",
  word: "Reverse",
  icon: "ArrowLeftRight",
  desc: "Flip the order, layout or direction of something.",
  simple: "Can you turn it around, or do it in a different order?",
  example: "A reversible jacket can be worn inside-out for a second look.",
  prompt: "What could you reverse or rearrange \u2014 the order of steps, the layout, the direction?",
  analyzePrompt: "Could anything about this product be reversed or rearranged to work better?",
  wordbank: ["reverse the order", "flip it around", "turn inside out", "swap the direction", "do it backwards"],
  starters: ["I could reverse... by...", "What if I did this in the opposite order?", "Turning it around would..."],
  analyzeStarters: ["Reversing... could improve it by...", "Rearranging... would...", "What if the order or direction was flipped?"],
  scenario: "A jacket is designed so it can be worn inside out as a completely different colour and pattern."
}];
const FRAMEWORKS = {
  accessfm: {
    label: "ACCESSFM",
    full: "A checklist for designing new products and evaluating existing ones",
    items: ACCESSFM,
    tint: "#0071E3"
  },
  scamper: {
    label: "SCAMPER",
    full: "A toolkit for generating new ideas and improving existing designs",
    items: SCAMPER,
    tint: "#FF9500"
  }
};

/* ===== specbuilder-content.js ===== */
/* ------------------------------------------------------------------ */
/* SPECIFICATION BUILDER CONTENT                                       */
/* ------------------------------------------------------------------ */

const SPEC_CATEGORIES = [{
  key: "user",
  label: "User",
  icon: "Users",
  question: "Who will use the product?",
  prompts: ["Who is the target user?", "What does the user need?", "Are there any age, ability or accessibility considerations?", "What would make the product easy or comfortable for them to use?"],
  example: {
    weak: "It should be easy to use.",
    better: "The product must have controls that a Year 7 student with limited hand strength can operate one-handed."
  }
}, {
  key: "function",
  label: "Function",
  icon: "Settings",
  question: "What must the product actually do?",
  prompts: ["What is the main purpose?", "What does the product need to hold, support, protect, display or perform?", "Are there secondary functions?", "What would make it successful?"],
  example: {
    weak: "It should work well.",
    better: "The organiser must hold at least 6 pens and 3 pencils upright."
  }
}, {
  key: "size",
  label: "Size & Ergonomics",
  icon: "Ruler",
  question: "What size and shape does it need to be?",
  prompts: ["Are there maximum or minimum dimensions?", "Does it need to fit somewhere?", "Does it need to fit a person, object or piece of equipment?", "Are there measurements from user research that should be used?", "Does it need to be comfortable or easy to operate?"],
  example: {
    weak: "The product should not be too big.",
    better: "The product must be less than 250mm wide so it fits inside the user's school locker."
  }
}, {
  key: "materials",
  label: "Materials",
  icon: "Layers",
  question: "What properties do the materials need?",
  prompts: ["Does the product need to be strong, flexible, lightweight, waterproof, transparent, or heat resistant?", "Are there materials that should or should not be used, and why?"],
  example: {
    weak: "The product must be made from acrylic.",
    better: "The main body should use a rigid material that can be accurately laser cut and is resistant to moisture."
  }
}, {
  key: "manufacturing",
  label: "Manufacturing",
  icon: "Wrench",
  question: "How will it be made?",
  prompts: ["How accurately does the product need to be made?", "Are there manufacturing processes that may be appropriate?", "Will it be made as a one-off, batch or mass-produced product?", "Does it need to be easy to assemble?", "Are there limitations caused by available equipment?"],
  example: {
    weak: "It should be easy to make.",
    better: "All parts must be cuttable on the school's laser cutter (max sheet size 600 x 400mm)."
  }
}, {
  key: "safety",
  label: "Safety",
  icon: "ShieldCheck",
  question: "How could this product cause harm, and how will you prevent it?",
  prompts: ["Could any part of the product injure the user?", "Are there sharp edges? Could it tip over? Are there small parts?", "Will it carry weight? Does it involve electricity, heat or moving parts?"],
  example: {
    weak: "It should be safe.",
    better: "All exposed corners must have a radius of at least 3mm to reduce sharp edges."
  }
}, {
  key: "sustainability",
  label: "Sustainability",
  icon: "Leaf",
  question: "What is the environmental impact?",
  prompts: ["Can material use be reduced?", "Could recycled or recyclable materials be used?", "Can components be repaired or replaced?", "Could the product be disassembled? What happens at the end of its life?"],
  example: {
    weak: "It should be eco-friendly.",
    better: "At least 50% of the material used must be recycled or from a certified sustainable source."
  }
}, {
  key: "aesthetics",
  label: "Aesthetics",
  icon: "Palette",
  question: "What should it look like?",
  prompts: ["What style would appeal to the intended user?", "Are there colours, shapes, textures or finishes that would be suitable?", "Does it need to match an existing environment or brand?"],
  example: {
    weak: "It should look nice.",
    better: "The product should use bright, bold colours that appeal to primary-school-aged children."
  }
}, {
  key: "cost",
  label: "Cost",
  icon: "Coins",
  question: "What are the cost constraints?",
  prompts: ["Is there a maximum budget?", "Should the product use inexpensive materials?", "Does manufacturing time affect cost?", "If commercially produced, what might the target selling price be?"],
  example: {
    weak: "It should be cheap.",
    better: "The total material cost must not exceed \u00a35 per unit."
  }
}];
function specCategoryByKey(key) {
  return SPEC_CATEGORIES.find(c => c.key === key);
}

/* Rule-based quality checker. Deliberately simple and deterministic (no
   AI/LLM involved) - it pattern-matches a handful of common vague phrases
   per the brief, plus a couple of generic length/number heuristics, and
   returns a Socratic follow-up question rather than rewriting anything. */
function checkSpecQuality(text) {
  const t = (text || "").trim();
  if (!t) return null;
  const lower = t.toLowerCase();
  const rules = [{
    test: /\b(good size|right size|not too big|not too small|appropriate size)\b/,
    message: "Can you add a measurement, or a maximum/minimum size?"
  }, {
    test: /\b(nice|good|attractive|appealing)\b/,
    message: "This is hard to measure. What colours, style, shape or finish would appeal to your intended user?"
  }, {
    test: /\bstrong\b/,
    message: "Strong enough for what? Consider what weight, force or type of use the product needs to withstand."
  }, {
    test: /\bcheap\b/,
    message: "Could you define a maximum material cost or target selling price?"
  }, {
    test: /\b(safe|safely)\b/,
    message: "What specifically makes it safe? Think about edges, weight, moving parts or electricity."
  }, {
    test: /\beasy to use\b/,
    message: "Easy for whom, and in what way? What would make it easy for your specific user?"
  }, {
    test: /\beco.?friendly\b/,
    message: "What specifically makes it eco-friendly \u2014 recycled content, reduced material, repairability?"
  }, {
    test: /\bdurable\b/,
    message: "Durable against what? Consider drops, daily use, weather, or a specific number of uses."
  }, {
    test: /\bcomfortable\b/,
    message: "Comfortable how? Think about grip, weight, texture or how long it will be used for."
  }];
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
  (points || []).forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });
  return SPEC_CATEGORIES.map(c => ({
    key: c.key,
    label: c.label,
    count: byCategory[c.key] || 0,
    status: byCategory[c.key] >= 2 ? "strong" : byCategory[c.key] === 1 ? "partial" : "empty"
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
  SPEC_CATEGORIES.forEach(cat => {
    const items = (points || []).filter(p => p.category === cat.key).sort((a, b) => a.order - b.order);
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

/* ===== dtf-content.js ===== */
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
  beginning: {
    label: "Beginning",
    verb: "Identify",
    tint: "#FF3B30"
  },
  emerging: {
    label: "Emerging",
    verb: "Explain",
    tint: "#FF9500"
  },
  developing: {
    label: "Developing",
    verb: "Apply",
    tint: "#0071E3"
  },
  mastering: {
    label: "Mastering",
    verb: "Justify",
    tint: "#34C759"
  }
};

// Existing DT grade boundaries (do not change these numbers - they're the
// school's own reporting scale, kept here as reference/documentation for
// the teacher dashboard; the course itself only ever assigns a DT stage).
const DT_GRADE_BOUNDARIES = [{
  band: "9.0+",
  grade: "A*",
  percent: 83,
  stage: "mastering"
}, {
  band: "8.0\u20138.9",
  grade: "A",
  percent: 78,
  stage: "mastering"
}, {
  band: "7.0\u20137.9",
  grade: "A-",
  percent: 72,
  stage: "mastering"
}, {
  band: "6.0\u20136.9",
  grade: "B",
  percent: 62,
  stage: "developing"
}, {
  band: "5.0\u20135.9",
  grade: "C+",
  percent: 54,
  stage: "developing"
}, {
  band: "4.0\u20134.9",
  grade: "C-",
  percent: 49,
  stage: "developing"
}, {
  band: "3.0\u20133.9",
  grade: "D",
  percent: 45,
  stage: "emerging"
}, {
  band: "2.0\u20132.9",
  grade: "E",
  percent: 36,
  stage: "emerging"
}, {
  band: "1.0\u20131.9",
  grade: "F",
  percent: 29,
  stage: "beginning"
}, {
  band: "Below 1.0",
  grade: "G",
  percent: 22,
  stage: "beginning"
}];
const FIVE_CS = ["Creativity", "Collaboration", "Critical Thinking", "Community", "Character"];

// Cognitive question categories (section 12)
const QUESTION_CATEGORIES = {
  R: {
    label: "Remember & Recognise",
    description: "Recall and basic recognition."
  },
  E: {
    label: "Explain & Examine",
    description: "Understanding and explanation."
  },
  A: {
    label: "Apply & Analyse",
    description: "Application to a context."
  },
  D: {
    label: "Decide & Defend",
    description: "Decision-making and justification."
  },
  C: {
    label: "Challenge & Connect",
    description: "Higher-order connections."
  }
};

// Supported question types (section 11). Each maps to a renderer component
// name; Phase 1 wires the plumbing, Phase 3 supplies real questions of
// each type for Section 1.
const QUESTION_TYPES = ["multiple_choice", "multiple_select", "true_false", "matching", "sorting", "fill_gap", "short_response", "extended_response", "improve_it", "decide_defend", "scenario_response"];
const OPEN_RESPONSE_TYPES = ["short_response", "extended_response", "improve_it", "decide_defend", "scenario_response"];

// Randomisation targets (section 16)
const ATTEMPT_TYPE_INFO = {
  micro: {
    label: "Micro Check",
    count: 2
  },
  section: {
    label: "Section Check",
    count: 5
  },
  checkpoint: {
    label: "Checkpoint Quiz",
    countRange: [8, 10]
  },
  endofunit: {
    label: "End-of-Unit Quiz",
    countRange: [15, 20]
  },
  final: {
    label: "Final Challenge",
    count: null
  } // not a random draw - a single integrated task
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
  return (acceptedIdeas || []).filter(idea => {
    const key = idea.toLowerCase().split(/\s+/).slice(0, 3).join(" "); // match on the idea's leading phrase
    return lower.includes(key) || idea.toLowerCase().split(/\s+/).some(w => w.length > 4 && lower.includes(w));
  }).length;
}
function suggestDTStage(responseText, question) {
  const text = (responseText || "").trim();
  const acceptedIdeas = question && question.acceptedIdeas || [];
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const keywordHits = text ? countAcceptedIdeaMatches(text, acceptedIdeas) : 0;
  const hasReasoning = REASONING_CONNECTORS.test(text);
  const hasJustification = JUSTIFICATION_SIGNALS.test(text);
  if (!text || keywordHits === 0 || wordCount < 4) {
    return {
      stage: "beginning",
      reasoning: acceptedIdeas.length ? "Doesn't yet clearly connect to the DT knowledge this question is looking for. Look again at what's being asked and identify the relevant idea." : "The response is very short or unclear \u2014 there isn't enough here yet to identify the key idea."
    };
  }
  if (keywordHits >= 2 && hasReasoning && wordCount >= 15 && hasJustification) {
    return {
      stage: "mastering",
      reasoning: `Identifies ${keywordHits} relevant idea${keywordHits === 1 ? "" : "s"}, explains the reasoning, and includes evidence, testing or comparison language \u2014 the hallmark of justifying a decision.`
    };
  }
  if (keywordHits >= 2 && hasReasoning && wordCount >= 15) {
    return {
      stage: "developing",
      reasoning: `Applies ${keywordHits} relevant ideas and explains the thinking within the design context, but doesn't yet reference evidence, testing or comparison to justify it.`
    };
  }
  if (keywordHits >= 1 && (hasReasoning || wordCount >= 8)) {
    return {
      stage: "emerging",
      reasoning: "Identifies a relevant idea and begins to explain it, but the reasoning is still limited \u2014 try developing why it matters in this specific situation."
    };
  }
  return {
    stage: "beginning",
    reasoning: "Identifies something relevant, but the answer isn't yet connected clearly to the design situation."
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

/* ===== dtf-u1s1-content.js ===== */
/* ------------------------------------------------------------------ */
/* UNIT 1 / SECTION 1 - "PROBLEM BEFORE PRODUCT"                       */
/* This is the reference-implementation content for the whole course - */
/* every future section follows this same shape.                      */
/* ------------------------------------------------------------------ */

const U1S1_META = {
  unitKey: "u1",
  sectionKey: "s1",
  number: "01",
  title: "Problem Before Product",
  sectionQuestion: "How do we make sure we are solving the right problem?",
  fiveCFocus: "Critical Thinking",
  welcome: "Every product around you started because somebody noticed something.\n\nMaybe something was difficult to use, uncomfortable, unsafe, frustrating, wasteful, difficult to carry, difficult to store, or simply could be better.\n\nDesigners don't just make things. They identify problems and opportunities and develop ways of responding to them.\n\nIn this section, you are going to start thinking like a designer by learning how to find the problem before the product.",
  wagbaHeadline: "Identifying a design problem before deciding what should be made.",
  wagbaBullets: ["recognise a design context", "identify problems, needs and opportunities", "tell the difference between a problem and a solution", "explore different design possibilities", "avoid getting stuck on your first idea"],
  stageLadder: {
    beginning: "I can recognise a design problem or solution with support.",
    emerging: "I can identify problems and possible solutions.",
    developing: "I can explain why designers should investigate a problem before choosing a solution.",
    mastering: "I can investigate a context, identify the underlying problem and justify different possible design directions."
  },
  gettingBetterAt: ["recognising a design problem, need or opportunity", "understanding what a design context is", "separating a problem from a solution", "identifying different design possibilities", "explaining why one problem can have several possible solutions", "avoiding jumping immediately to the first product idea", "recognising basic design fixation", "using evidence and investigation before making design decisions"],
  successCriteria: ["I can identify a design problem.", "I can explain the difference between a problem and a solution.", "I can recognise when a solution has been hidden inside a design context.", "I can suggest different design possibilities.", "I can explain why designers investigate before choosing a product.", "I can recognise basic design fixation."]
};
const U1S1_STARTING_POINT = {
  scenario: "Every lesson, students waste time searching through their bags for pens, pencils, rulers and other equipment.",
  prompt: "Which would be the best place for a designer to start?",
  options: ["Design a new pencil case.", "Investigate why students struggle to organise their equipment.", "Choose a material.", "Draw some storage boxes."],
  correct: "Investigate why students struggle to organise their equipment."
};
const U1S1_VOCAB = [{
  id: "u1s1-design",
  term: "Design",
  definition: "The process of developing ideas to solve a problem, meet a need or respond to an opportunity."
}, {
  id: "u1s1-context",
  term: "Design Context",
  definition: "The situation surrounding a design problem, need or opportunity."
}, {
  id: "u1s1-problem",
  term: "Problem",
  definition: "An issue or difficulty that could be improved or solved through design."
}, {
  id: "u1s1-need",
  term: "Need",
  definition: "Something necessary for a user or situation."
}, {
  id: "u1s1-opportunity",
  term: "Opportunity",
  definition: "A situation where design could improve something or create something useful."
}, {
  id: "u1s1-possibility",
  term: "Design Possibility",
  definition: "A possible solution or direction that could be developed from a design context."
}, {
  id: "u1s1-solution",
  term: "Solution",
  definition: "A way of responding to a problem, need or opportunity."
}, {
  id: "u1s1-fixation",
  term: "Design Fixation",
  definition: "Becoming too focused on one idea or type of solution and finding it difficult to explore alternatives."
}];
const U1S1_CARDS = [{
  type: "content",
  id: "learn-what-designers-do",
  heading: "What Does a Designer Actually Do?",
  body: "Students can easily think Design & Technology means \u201cI have to make something.\u201d\n\nMaking is part of DT, but good designing starts before making.\n\nA designer normally needs to understand: who has a problem? What is happening? Why is it a problem? What needs to improve?\n\nOnly then should they start deciding: what could I design?\n\nThis is why we use the idea of Problem Before Product. If you decide what to make too early, you might create a brilliant product that solves the wrong problem."
}, {
  type: "content",
  id: "learn-design-context",
  heading: "What Is a Design Context?",
  body: "Design Context: the situation surrounding a design problem, need or opportunity.\n\nA context gives us somewhere to start.\n\nStudents regularly struggle to organise and access the equipment they need during lessons.\n\nNotice what this doesn't say. It doesn't tell us what product to make, what material to use, what shape it should be, or what it should look like. That's deliberate \u2014 it gives the designer something to investigate."
}, {
  type: "content",
  id: "example-compare-contexts",
  heading: "Example: Compare the Contexts",
  body: "Context A gives us a product and a material already \u2014 the designer has very little freedom to investigate the actual problem.\n\nContext B leaves room to investigate what equipment students carry, what they lose, where they store it, when they need it, why existing solutions don't work, and what different students need. Only after that do we start thinking about possible products.",
  compare: {
    a: "Design a plywood pencil case.",
    b: "Students need a better way to organise and access the equipment they use during lessons."
  },
  footer: "A good design context gives us a problem to investigate, not simply a product to make."
}, {
  type: "touchpoint",
  id: "which-stronger-1",
  kind: "which_is_stronger",
  heading: "Quick Check",
  prompt: "Which is the stronger design context?",
  optionA: "Design a plywood pencil case.",
  optionB: "Students need a better way to organise and access the equipment they use during lessons.",
  correct: "b",
  feedbackCorrect: "Good thinking. B describes the situation and need without deciding what the final product or material must be.",
  feedbackIncorrect: "A has already decided the product (pencil case) and the material (plywood). Look again at B \u2014 what could you investigate that A doesn't allow?"
}, {
  type: "content",
  id: "learn-problem-need-opportunity",
  heading: "Problem, Need and Opportunity",
  body: "Problem: an issue or difficulty that could be improved through design.\nExample: students' water bottles are regularly knocked over during lessons.\n\nNeed: something necessary for a user or situation.\nExample: students need somewhere safe and accessible to keep their bottles.\n\nOpportunity: a situation where design could improve something or create something useful.\nExample: there is an opportunity to improve how bottles are stored around classroom desks.\n\nThese ideas are connected, but they are not exactly the same."
}, {
  type: "touchpoint",
  id: "pno-check-1",
  kind: "problem_need_opportunity",
  heading: "Check",
  prompt: "Sort each statement as a Problem, a Need, or an Opportunity.",
  items: [{
    text: "Wet umbrellas leave puddles that make the classroom floor slippery.",
    answer: "problem"
  }, {
    text: "Students need somewhere dry to keep umbrellas during lessons.",
    answer: "need"
  }, {
    text: "There is a chance to improve how the whole school stores umbrellas, not just one classroom.",
    answer: "opportunity"
  }, {
    text: "Headphones get tangled and lost inside bags.",
    answer: "problem"
  }, {
    text: "Students need a reliable way to keep headphones tidy.",
    answer: "need"
  }, {
    text: "A shared class charging station could improve equipment access for everyone.",
    answer: "opportunity"
  }]
}, {
  type: "content",
  id: "learn-problem-vs-solution",
  heading: "Problem vs Solution",
  body: "Your phone keeps falling off your desk while you work.\n\nThe problem is: my phone keeps falling from the desk.\n\nA need might be: I need a safe way to position my phone while working.\n\nPossible solutions might be: a phone stand, a non-slip surface, a clip, a desk pocket, or an adjustable holder.\n\n\u201cI don't have a phone stand\u201d isn't really the design problem \u2014 you've already decided that a stand is the answer."
}, {
  type: "touchpoint",
  id: "stop-sort-1",
  kind: "stop_sort",
  heading: "Stop & Sort",
  prompt: "Sort each statement into Problem or Solution.",
  items: [{
    text: "Students cannot easily find stationery in their bags.",
    answer: "problem"
  }, {
    text: "Modular bag organiser.",
    answer: "solution"
  }, {
    text: "Wet umbrellas leave water on the floor.",
    answer: "problem"
  }, {
    text: "Umbrella rack with drip tray.",
    answer: "solution"
  }, {
    text: "Water bottles are regularly knocked over.",
    answer: "problem"
  }, {
    text: "Desk-mounted bottle holder.",
    answer: "solution"
  }, {
    text: "Students struggle to carry specialist equipment.",
    answer: "problem"
  }, {
    text: "Equipment trolley.",
    answer: "solution"
  }]
}, {
  type: "content",
  id: "learn-one-problem-many-possibilities",
  heading: "One Problem, Many Possibilities",
  body: "Problem: students struggle to organise their equipment.\n\nThat one problem could lead to many different possibilities:",
  list: ["portable organiser", "bag insert", "desk storage", "shared classroom system", "equipment-checking system"],
  footer: "Notice that these aren't five different-looking pencil cases. They are different ways of responding to the problem."
}, {
  type: "touchpoint",
  id: "think-try-test-1",
  kind: "think_try_test",
  heading: "Practice: Your Turn",
  scenario: "Students regularly leave reusable water bottles on the floor beside their desks, where they are knocked over.",
  parts: [{
    key: "problem",
    label: "1. What is the actual problem?",
    placeholder: "Describe the real problem, not a solution..."
  }, {
    key: "possibilities",
    label: "2. Suggest three genuinely different design possibilities.",
    placeholder: "List three different directions, not variations of one idea..."
  }],
  teacherGuidance: "Model guidance: students do not have a safe and convenient place to store bottles during lessons, resulting in bottles being knocked over. Three differently shaped desk-mounted bottle holders should not automatically count as three different design possibilities \u2014 we are looking for different approaches to the problem, e.g. a desk-mounted holder, storage attached to furniture, a central bottle-storage system, or a bag attachment."
}, {
  type: "content",
  id: "learn-fixation-framing",
  heading: "When Your First Idea Gets in the Way",
  body: "Have you ever had an idea that you really liked, and then found yourself trying to make everything fit that idea?\n\nDesigners do this too.\n\nDesign Fixation: becoming too focused on one idea or type of solution and finding it difficult to explore alternatives."
}, {
  type: "content",
  id: "learn-fixation-example",
  heading: "Design Fixation in Practice",
  body: "Your design context is: students need a better way to organise classroom equipment.\n\nYour first action is searching online for \u201cBest classroom storage boxes.\u201d"
}, {
  type: "touchpoint",
  id: "spot-problem-fixation",
  kind: "spot_the_problem",
  heading: "Spot the Problem",
  prompt: "What could be wrong with searching \u201cBest classroom storage boxes\u201d before investigating the problem?",
  modelExplanation: "The search assumes that a storage box is the solution before the problem has been properly investigated. Looking at existing products is useful later, but the search terms we use can influence the solutions we discover."
}];
const U1S1_APPLY_TASK = {
  heading: "Design Detective",
  scenario: "During practical lessons, bags are placed around stools and workbenches. Students and teachers sometimes trip over them, but students need access to some of the equipment stored inside them during the lesson.",
  parts: [{
    key: "happening",
    label: "1. What is happening?",
    placeholder: "Describe the situation in your own words..."
  }, {
    key: "problem",
    label: "2. What is the design problem?",
    placeholder: "Describe the real problem, not a solution..."
  }, {
    key: "needs",
    label: "3. What do users appear to need?",
    placeholder: "Describe what students and teachers need..."
  }, {
    key: "possibilities",
    label: "4. Suggest three genuinely different design possibilities.",
    placeholder: "List three different directions..."
  }, {
    key: "priority",
    label: "5. Which would you investigate first, and why?",
    placeholder: "Explain your choice..."
  }],
  acceptedIdeas: ["bags cause a trip hazard", "bags block walkways or floor space", "need access to equipment during the lesson", "safe storage", "accessible storage", "genuinely different possibilities", "investigate first", "justified choice"],
  expectedKnowledge: "Applying problem/need identification and generating genuinely different possibilities in an unfamiliar scenario."
};
const U1S1_QUESTIONS = [{
  qid: "U1-S1-R01",
  category: "R",
  type: "mcq",
  prompt: "What is a design context?",
  options: ["A drawing of the final product", "The situation surrounding a problem, need or opportunity", "A materials list", "Manufacturing instructions"],
  correctAnswer: "The situation surrounding a problem, need or opportunity"
}, {
  qid: "U1-S1-R02",
  category: "R",
  type: "mcq",
  prompt: "What is a design possibility?",
  options: ["A finished product", "A possible solution or direction", "A manufacturing fault", "A customer complaint"],
  correctAnswer: "A possible solution or direction"
}, {
  qid: "U1-S1-R03",
  category: "R",
  type: "true_false",
  prompt: "True or false: a design context should always tell you exactly what to make.",
  correctAnswer: "False",
  feedback: "A context can stay broad so that different solutions can be investigated."
}, {
  qid: "U1-S1-R04",
  category: "R",
  type: "mcq",
  prompt: "Which of these is a design context?",
  options: ["Make a wooden pencil case.", "Use plywood.", "Students need a better way to organise equipment during lessons.", "Draw three storage boxes."],
  correctAnswer: "Students need a better way to organise equipment during lessons."
}, {
  qid: "U1-S1-R05",
  category: "R",
  type: "mcq",
  prompt: "Which of these is a solution?",
  options: ["Students lose stationery.", "Wet umbrellas make floors slippery.", "Wall-mounted umbrella storage.", "Students struggle to carry equipment."],
  correctAnswer: "Wall-mounted umbrella storage."
}, {
  qid: "U1-S1-R06",
  category: "R",
  type: "fill_gap",
  prompt: "Complete: good designers investigate the ______ before choosing the ______.",
  acceptedAnswers: ["problem, solution", "problem, product", "context, solution", "context, product"],
  feedback: "Good designers investigate the problem (or context) before choosing the solution (or product)."
}, {
  qid: "U1-S1-R07",
  category: "R",
  type: "short_response",
  prompt: "What is a design problem?",
  modelResponse: "An issue or difficulty that could be improved or solved through design.",
  expectedKnowledge: "The definition of 'problem' as distinct from a solution.",
  acceptedIdeas: ["issue", "difficulty", "something that could be improved", "something that needs solving"],
  marksAvailable: 1,
  markingGuidance: "Accept any answer that identifies an issue/difficulty rather than a product.",
  stageGuidance: {
    beginning: "Gives an unrelated or unclear answer.",
    emerging: "Mentions something being wrong but doesn't clearly define it as an issue to be solved.",
    developing: "Clearly identifies a problem as an issue or difficulty that design could address.",
    mastering: "Defines the problem clearly and distinguishes it from a solution."
  }
}, {
  qid: "U1-S1-R08",
  category: "R",
  type: "mcq",
  prompt: "Which of these is a design opportunity?",
  options: ["A product has been manufactured.", "Students could benefit from a better way to transport equipment.", "A product is blue.", "A sketch has been completed."],
  correctAnswer: "Students could benefit from a better way to transport equipment."
}, {
  qid: "U1-S1-R09",
  category: "R",
  type: "true_false",
  prompt: "True or false: there can be several suitable solutions to the same design problem.",
  correctAnswer: "True",
  feedback: "Different products or systems can meet the same underlying need in different ways."
}, {
  qid: "U1-S1-R10",
  category: "R",
  type: "mcq",
  prompt: "Which should normally happen first?",
  options: ["Manufacture", "Choose material", "Investigate context", "Decorate"],
  correctAnswer: "Investigate context"
}, {
  qid: "U1-S1-E01",
  category: "E",
  type: "extended_response",
  prompt: "Why shouldn't a designer immediately choose their first idea?",
  modelResponse: "The first idea may not be the best solution. Investigating alternatives allows the designer to compare possibilities and make a better-informed decision.",
  expectedKnowledge: "First ideas are not automatically the best; comparison requires investigation.",
  acceptedIdeas: ["may miss better solution", "insufficient investigation", "first idea may not meet need", "need alternatives", "comparison"],
  marksAvailable: 2,
  markingGuidance: "1 mark for identifying the risk of the first idea being weak; 1 mark for explaining why investigation/comparison helps.",
  stageGuidance: {
    beginning: "States that you shouldn't rush, without explaining why.",
    emerging: "Mentions that other ideas might be better but doesn't explain how investigation helps.",
    developing: "Explains that investigating alternatives allows fair comparison before deciding.",
    mastering: "Explains the risk of the first idea clearly and connects it to using evidence to compare options."
  }
}, {
  qid: "U1-S1-E02",
  category: "E",
  type: "short_response",
  prompt: "Explain the difference between a problem and a solution.",
  modelResponse: "A problem is the issue that needs addressing. A solution is a possible way of addressing it.",
  expectedKnowledge: "Problem vs solution distinction.",
  acceptedIdeas: ["problem is the issue", "solution is the response", "problem comes before solution"],
  marksAvailable: 2,
  markingGuidance: "1 mark for explaining problem; 1 mark for explaining solution.",
  stageGuidance: {
    beginning: "Defines only one of the two terms, or confuses them.",
    emerging: "Attempts both definitions but they overlap or are unclear.",
    developing: "Clearly explains both problem and solution as distinct ideas.",
    mastering: "Clearly distinguishes both terms and shows how one leads to the other."
  }
}, {
  qid: "U1-S1-E03",
  category: "E",
  type: "short_response",
  prompt: "Why is \u201cI am going to make a pencil case\u201d a weak starting point?",
  modelResponse: "It chooses the product before investigating the problem or considering alternatives.",
  expectedKnowledge: "Choosing a product early prevents investigation.",
  acceptedIdeas: ["chooses product early", "no investigation", "limits alternatives", "design fixation risk"],
  marksAvailable: 2,
  markingGuidance: "1 mark for identifying the product was chosen early; 1 mark for explaining the consequence.",
  stageExemplars: {
    beginning: {
      text: "Because it isn't a good context.",
      note: "Limited relevant understanding."
    },
    emerging: {
      text: "Because it already says to make a pencil case.",
      note: "Recognises the issue."
    },
    developing: {
      text: "It has already chosen the product, so the designer has less opportunity to explore different ways of solving the problem.",
      note: "Applies and explains the knowledge."
    },
    mastering: {
      text: "It specifies the product before the underlying problem has been investigated, which could cause design fixation. A broader context would allow the designer to gather evidence and compare different possible solutions before deciding what to develop.",
      note: "Applies, connects and justifies the design thinking."
    }
  },
  stageGuidance: {
    beginning: "Says it's weak without explaining what's wrong.",
    emerging: "Notices the product was named but doesn't explain the consequence.",
    developing: "Explains that naming the product early limits exploration.",
    mastering: "Connects this to design fixation and the value of investigating first."
  }
}, {
  qid: "U1-S1-E04",
  category: "E",
  type: "short_response",
  prompt: "Why is \u201cStudents need a better way to organise equipment during lessons\u201d a stronger starting point?",
  modelResponse: "It identifies a need without deciding the final product, allowing different solutions to be explored.",
  expectedKnowledge: "Broad contexts preserve room for investigation.",
  acceptedIdeas: ["no product decided", "allows exploration", "describes need not solution"],
  marksAvailable: 2,
  markingGuidance: "1 mark for noticing no product is named; 1 mark for explaining why that's useful.",
  stageGuidance: {
    beginning: "States it is stronger without explaining why.",
    emerging: "Notices no product is mentioned but doesn't explain the benefit.",
    developing: "Explains that it allows different solutions to be explored.",
    mastering: "Explains the benefit and links it to avoiding design fixation."
  }
}, {
  qid: "U1-S1-E05",
  category: "E",
  type: "short_response",
  prompt: "Why can one problem have several successful solutions?",
  modelResponse: "Different products or systems can meet the same underlying need in different ways.",
  expectedKnowledge: "Multiple valid solutions can meet one need.",
  acceptedIdeas: ["different approaches", "same need met differently", "no single correct solution"],
  marksAvailable: 1,
  markingGuidance: "Accept any answer explaining that different approaches can meet the same need.",
  stageGuidance: {
    beginning: "States that there can be more than one solution, without explaining why.",
    emerging: "Gives an example but doesn't generalise the reasoning.",
    developing: "Explains that different approaches can meet the same underlying need.",
    mastering: "Explains this clearly with a justified example."
  }
}, {
  qid: "U1-S1-E06",
  category: "E",
  type: "decide_defend_short",
  prompt: "A student draws four different pencil cases. Have they necessarily explored four different design possibilities?",
  correctAnswer: "No",
  modelResponse: "They have explored variations of one solution rather than different approaches to the problem.",
  expectedKnowledge: "Variations of one idea are not the same as different design possibilities.",
  acceptedIdeas: ["variations of one solution", "not genuinely different approaches", "same product type"],
  marksAvailable: 2,
  markingGuidance: "1 mark for 'No'; 1 mark for explaining why.",
  stageGuidance: {
    beginning: "Answers No or Yes without a clear reason.",
    emerging: "Says they are similar but doesn't explain why that's a problem.",
    developing: "Explains that these are variations of one solution, not different approaches.",
    mastering: "Explains this and links it to broader exploration of possibilities."
  }
}, {
  qid: "U1-S1-E07",
  category: "E",
  type: "short_response",
  prompt: "Why might a designer keep a design context broad?",
  modelResponse: "To allow investigation and exploration before committing to a solution.",
  expectedKnowledge: "Purpose of keeping context broad.",
  acceptedIdeas: ["allows investigation", "avoids early commitment", "keeps options open"],
  marksAvailable: 1,
  markingGuidance: "Accept any answer linking breadth to investigation/exploration.",
  stageGuidance: {
    beginning: "States that broad is better without explaining why.",
    emerging: "Mentions more options but doesn't connect this to investigation.",
    developing: "Explains that it allows investigation before committing to a solution.",
    mastering: "Explains this and connects it to evidence-based decision-making."
  }
}, {
  qid: "U1-S1-E08",
  category: "E",
  type: "short_response",
  prompt: "Explain what \u201cproblem before product\u201d means.",
  modelResponse: "Understand the problem first, then decide what type of solution is most appropriate.",
  expectedKnowledge: "The core principle of the section.",
  acceptedIdeas: ["understand problem first", "decide solution after", "investigate before deciding"],
  marksAvailable: 2,
  markingGuidance: "1 mark for the sequence (problem then product); 1 mark for explaining why.",
  stageGuidance: {
    beginning: "Repeats the phrase without explaining it.",
    emerging: "Shows a general sense of the idea but not clearly.",
    developing: "Explains that the problem should be understood before choosing a solution.",
    mastering: "Explains the sequence clearly and why it leads to better design decisions."
  }
}, {
  qid: "U1-S1-A01",
  category: "A",
  type: "short_response",
  scenario: "Students leave bottles beside desks where they are regularly knocked over.",
  prompt: "Identify the design problem in this scenario.",
  modelResponse: "Students do not have a safe/convenient place to store bottles during lessons.",
  expectedKnowledge: "Identifying a problem from a scenario, not naming a product.",
  acceptedIdeas: ["no safe place to store bottles", "bottles get knocked over", "no convenient storage"],
  marksAvailable: 1,
  markingGuidance: "Accept any answer describing the underlying issue, not a product.",
  stageGuidance: {
    beginning: "Names a product (e.g. \u201ca bottle holder\u201d) instead of a problem.",
    emerging: "Identifies something relevant but doesn't fully describe the problem.",
    developing: "Clearly identifies the lack of safe/convenient storage as the problem.",
    mastering: "Identifies the problem clearly and links it to the consequence (bottles being knocked over)."
  }
}, {
  qid: "U1-S1-A02",
  category: "A",
  type: "extended_response",
  scenario: "Students leave bottles beside desks where they are regularly knocked over.",
  prompt: "Suggest three different design possibilities that could respond to this problem.",
  modelResponse: "Desk-mounted holder, central storage, or a bag attachment are all different approaches.",
  expectedKnowledge: "Generating genuinely different possibilities, not variations of one idea.",
  acceptedIdeas: ["desk-mounted holder", "side storage", "central storage", "bag attachment", "under-desk storage"],
  marksAvailable: 3,
  markingGuidance: "1 mark per genuinely different possibility (up to 3). Variations of the same idea only count once.",
  stageGuidance: {
    beginning: "Suggests one idea, or several variations of the same idea.",
    emerging: "Suggests two different directions.",
    developing: "Suggests three different directions with brief explanation.",
    mastering: "Suggests three clearly different directions and explains why they differ."
  }
}, {
  qid: "U1-S1-A03",
  category: "A",
  type: "extended_response",
  scenario: "Students struggle to carry books, stationery and specialist equipment between classrooms.",
  prompt: "Suggest four different design directions that could respond to this problem.",
  modelResponse: "Modular bag insert, portable organiser, trolley, wearable system, or classroom storage are all different directions.",
  expectedKnowledge: "Generating a range of genuinely different possibilities.",
  acceptedIdeas: ["modular bag insert", "portable organiser", "trolley", "wearable system", "classroom storage", "equipment organisation system"],
  marksAvailable: 4,
  markingGuidance: "1 mark per genuinely different direction (up to 4).",
  stageGuidance: {
    beginning: "Suggests one or two similar ideas.",
    emerging: "Suggests two or three ideas with some overlap.",
    developing: "Suggests four different directions.",
    mastering: "Suggests four clearly different directions with brief justification for each."
  }
}, {
  qid: "U1-S1-A04",
  category: "A",
  type: "improve_it",
  prompt: "Rewrite \u201cDesign a laptop stand\u201d as a broader design context.",
  modelResponse: "Laptop users need a comfortable and practical way to position their laptop while working.",
  expectedKnowledge: "Removing the named product while keeping the underlying need.",
  acceptedIdeas: ["removes named product", "keeps underlying need", "broadens the context"],
  marksAvailable: 2,
  markingGuidance: "1 mark for removing the product; 1 mark for a sensible broader need.",
  stageGuidance: {
    beginning: "Barely changes the original sentence.",
    emerging: "Removes the product name but the context is still narrow.",
    developing: "Rewrites as a genuinely broader context.",
    mastering: "Rewrites as a broad, well-worded context that clearly opens up investigation."
  }
}, {
  qid: "U1-S1-A05",
  category: "A",
  type: "improve_it",
  prompt: "Rewrite \u201cMake a box for classroom stationery\u201d as a broader design context.",
  modelResponse: "Students and teachers need a practical way to organise and access frequently used classroom stationery.",
  expectedKnowledge: "Removing the named product while keeping the underlying need.",
  acceptedIdeas: ["removes named product (box)", "keeps underlying need", "broadens the context"],
  marksAvailable: 2,
  markingGuidance: "1 mark for removing 'box'; 1 mark for a sensible broader need.",
  stageGuidance: {
    beginning: "Barely changes the original sentence.",
    emerging: "Removes 'box' but the context is still narrow.",
    developing: "Rewrites as a genuinely broader context.",
    mastering: "Rewrites as a broad, well-worded context that clearly opens up investigation."
  }
}, {
  qid: "U1-S1-A06",
  category: "A",
  type: "extended_response",
  scenario: "Students often can't hear teacher instructions clearly because of background noise, and cheap headphones get tangled or lost in bags.",
  prompt: "Identify the underlying problem, then suggest two different design possibilities.",
  modelResponse: "The problem is that students don't have a reliable way to keep headphones tidy and accessible. Possibilities include a desk cable-tidy, a labelled storage pouch, or a class charging/storage station.",
  expectedKnowledge: "Separating the problem (tangled/lost headphones) from possible responses.",
  acceptedIdeas: ["headphones get tangled or lost", "no accessible storage", "cable tidy", "storage pouch", "charging station", "labelled storage"],
  marksAvailable: 3,
  markingGuidance: "1 mark for identifying the real problem; 2 marks for two genuinely different possibilities.",
  stageGuidance: {
    beginning: "Names a product instead of the problem.",
    emerging: "Identifies the problem but possibilities are similar to each other.",
    developing: "Identifies the problem and suggests two different possibilities.",
    mastering: "Identifies the problem clearly and justifies why the two possibilities are genuinely different."
  }
}, {
  qid: "U1-S1-A07",
  category: "A",
  type: "extended_response",
  scenario: "PE equipment (bibs, cones, balls) is often left scattered around the sports hall at the end of lessons, making the next class late starting.",
  prompt: "Identify the underlying problem, then suggest two different design possibilities.",
  modelResponse: "The problem is that there isn't an efficient way to collect and store equipment at the end of a lesson. Possibilities include a wheeled equipment trolley, colour-coded storage nets, or a class equipment-checklist system.",
  expectedKnowledge: "Separating the problem from possible responses in an unfamiliar scenario.",
  acceptedIdeas: ["equipment left scattered", "slow collection", "wheeled trolley", "storage nets", "checklist system", "colour-coding"],
  marksAvailable: 3,
  markingGuidance: "1 mark for identifying the real problem; 2 marks for two genuinely different possibilities.",
  stageGuidance: {
    beginning: "Names a product instead of the problem.",
    emerging: "Identifies the problem but possibilities are similar to each other.",
    developing: "Identifies the problem and suggests two different possibilities.",
    mastering: "Identifies the problem clearly and justifies why the two possibilities are genuinely different."
  }
}, {
  qid: "U1-S1-A08",
  category: "A",
  type: "improve_it",
  prompt: "Rewrite \u201cDesign a phone case\u201d as a broader design context.",
  modelResponse: "Phone users need a practical way to protect their phone from everyday drops and scratches.",
  expectedKnowledge: "Removing the named product while keeping the underlying need.",
  acceptedIdeas: ["removes named product", "keeps underlying need", "protection from damage"],
  marksAvailable: 2,
  markingGuidance: "1 mark for removing the product; 1 mark for a sensible broader need.",
  stageGuidance: {
    beginning: "Barely changes the original sentence.",
    emerging: "Removes the product name but the context is still narrow.",
    developing: "Rewrites as a genuinely broader context.",
    mastering: "Rewrites as a broad, well-worded context that clearly opens up investigation."
  }
}, {
  qid: "U1-S1-D01",
  category: "D",
  type: "decide_defend_short",
  scenario: "Student A: \u201cLet's design a better pencil case.\u201d Student B: \u201cLet's investigate why stationery is getting lost first.\u201d",
  prompt: "Who shows stronger design thinking?",
  correctAnswer: "B",
  modelResponse: "Student B, because they investigate the cause before choosing the solution.",
  expectedKnowledge: "Investigating cause before solving.",
  acceptedIdeas: ["investigates cause first", "avoids early solution", "evidence before decision"],
  marksAvailable: 2,
  markingGuidance: "1 mark for choosing B; 1 mark for a correct reason.",
  stageGuidance: {
    beginning: "Chooses without a clear reason.",
    emerging: "Gives a vague reason for the choice.",
    developing: "Explains that B investigates the cause before choosing a solution.",
    mastering: "Explains this clearly and connects it to avoiding design fixation."
  }
}, {
  qid: "U1-S1-D02",
  category: "D",
  type: "decide_defend_short",
  scenario: "A. \u201cDesign a storage box for art equipment.\u201d B. \u201cStudents need a safer and more organised way to transport art equipment between classrooms.\u201d",
  prompt: "Which is the stronger design context?",
  correctAnswer: "B",
  modelResponse: "B, because it doesn't decide the product and allows different solutions to be explored.",
  expectedKnowledge: "Recognising a hidden solution vs an open context.",
  acceptedIdeas: ["no product named", "allows exploration", "broader context"],
  marksAvailable: 2,
  markingGuidance: "1 mark for choosing B; 1 mark for a correct reason.",
  stageGuidance: {
    beginning: "Chooses without a clear reason.",
    emerging: "Gives a vague reason for the choice.",
    developing: "Explains that B doesn't name a product and stays open to investigation.",
    mastering: "Explains this clearly with reference to design fixation or evidence."
  }
}, {
  qid: "U1-S1-D03",
  category: "D",
  type: "short_response",
  prompt: "A designer finds one solution that seems to work. Should they immediately stop exploring? Explain your answer.",
  modelResponse: "Not necessarily. They should compare the idea with alternatives and use evidence to decide which is most appropriate.",
  expectedKnowledge: "One workable idea isn't necessarily the best idea.",
  acceptedIdeas: ["should compare alternatives", "one idea isn't necessarily best", "use evidence to decide"],
  marksAvailable: 2,
  markingGuidance: "1 mark for 'not necessarily'; 1 mark for explaining why comparison still matters.",
  stageGuidance: {
    beginning: "Answers yes or no without explanation.",
    emerging: "Suggests more exploring is good but doesn't explain why.",
    developing: "Explains that comparing alternatives helps confirm the best choice.",
    mastering: "Explains this and connects it to using evidence to justify the final decision."
  }
}, {
  qid: "U1-S1-D04",
  category: "D",
  type: "decide_defend_short",
  scenario: "A. \u201cLet's design a better umbrella stand.\u201d B. \u201cLet's find out why umbrellas end up dripping water across the classroom floor.\u201d",
  prompt: "Who shows stronger design thinking?",
  correctAnswer: "B",
  modelResponse: "Student B, because they're investigating the actual problem (water on the floor) rather than assuming the solution is a stand.",
  expectedKnowledge: "Investigating cause before solving, applied to a new scenario.",
  acceptedIdeas: ["investigates cause first", "avoids early solution", "doesn't assume the product"],
  marksAvailable: 2,
  markingGuidance: "1 mark for choosing B; 1 mark for a correct reason.",
  stageGuidance: {
    beginning: "Chooses without a clear reason.",
    emerging: "Gives a vague reason for the choice.",
    developing: "Explains that B investigates the real problem rather than assuming a stand is needed.",
    mastering: "Explains this clearly and connects it to avoiding an early, unjustified solution."
  }
}, {
  qid: "U1-S1-C01",
  category: "C",
  type: "short_response",
  prompt: "Why can choosing a product too early lead to design fixation?",
  modelResponse: "The designer can become attached to one solution and stop considering other potentially better approaches.",
  expectedKnowledge: "Link between early product choice and fixation.",
  acceptedIdeas: ["becomes attached to one idea", "stops considering alternatives", "narrows thinking early"],
  marksAvailable: 2,
  markingGuidance: "1 mark for the link to attachment; 1 mark for the consequence (missed alternatives).",
  stageGuidance: {
    beginning: "States that it's bad without explaining the link.",
    emerging: "Mentions fixation but the connection to early choice is unclear.",
    developing: "Explains that early choice makes it harder to consider alternatives.",
    mastering: "Explains the mechanism clearly and links it back to investigating the problem first."
  }
}, {
  qid: "U1-S1-C02",
  category: "C",
  type: "short_response",
  prompt: "A designer immediately searches \u201cClassroom storage boxes\u201d after being asked to improve classroom organisation. What problem could this create?",
  modelResponse: "The search assumes that a storage box is the solution and may limit exploration of other possibilities.",
  expectedKnowledge: "Search terms can pre-select the solution space.",
  acceptedIdeas: ["assumes the solution", "limits what's discovered", "search terms bias results"],
  marksAvailable: 2,
  markingGuidance: "1 mark for identifying the assumption; 1 mark for explaining the consequence.",
  stageGuidance: {
    beginning: "States it's a bad idea without explaining why.",
    emerging: "Mentions the search but doesn't explain the effect on exploration.",
    developing: "Explains that the search term already assumes the solution.",
    mastering: "Explains this and connects it to how search terms narrow what gets discovered."
  }
}, {
  qid: "U1-S1-C03",
  category: "C",
  type: "short_response",
  prompt: "How can investigating a problem early save time later in the design process?",
  modelResponse: "It reduces the chance of developing and prototyping something that does not solve the actual problem.",
  expectedKnowledge: "Early investigation prevents wasted development effort.",
  acceptedIdeas: ["avoids wasted development", "prevents building the wrong thing", "saves time overall"],
  marksAvailable: 2,
  markingGuidance: "1 mark for the general benefit; 1 mark for explaining the mechanism (avoiding wasted work).",
  stageGuidance: {
    beginning: "States it saves time without explaining how.",
    emerging: "Mentions avoiding mistakes but not clearly linked to time.",
    developing: "Explains that it prevents developing something that doesn't solve the problem.",
    mastering: "Explains this clearly, connecting early investigation to reduced wasted effort later."
  }
}, {
  qid: "U1-S1-C04",
  category: "C",
  type: "decide_defend_short",
  prompt: "Is a successful product always evidence that the correct problem was solved?",
  correctAnswer: "No",
  modelResponse: "A product may function well but still address the wrong problem or fail to meet the user's actual need.",
  expectedKnowledge: "Functioning well is not the same as solving the right problem.",
  acceptedIdeas: ["may solve wrong problem", "functions well but not needed", "success is not the same as correct problem"],
  marksAvailable: 2,
  markingGuidance: "1 mark for 'No'; 1 mark for a correct explanation.",
  stageGuidance: {
    beginning: "Answers without a clear reason.",
    emerging: "Suggests it might not be evidence but reasoning is unclear.",
    developing: "Explains that a product can work well but still miss the real problem.",
    mastering: "Explains this clearly with reference to investigating the actual user need."
  }
}, {
  qid: "U1-S1-C05",
  category: "C",
  type: "extended_response",
  prompt: "\u201cIf a designer investigates for too long, they'll never actually design anything.\u201d Do you agree? Explain your thinking.",
  modelResponse: "There's some truth to this \u2014 investigation shouldn't go on forever \u2014 but rushing past it to avoid wasting time often costs more time later, because the designer risks solving the wrong problem. Good designers balance enough investigation to be confident in the problem with moving on to explore solutions.",
  expectedKnowledge: "Balancing investigation against progress \u2014 a genuinely open, higher-order question.",
  acceptedIdeas: ["investigation has a limit", "rushing risks wrong problem", "balance needed", "some evidence is enough to proceed"],
  marksAvailable: 3,
  markingGuidance: "Reward genuine reasoning in either direction if it's justified with reference to problem/solution thinking; do not require a single 'correct' side.",
  stageGuidance: {
    beginning: "Gives an opinion with no reasoning.",
    emerging: "Gives an opinion with limited reasoning.",
    developing: "Explains their view with a reason connected to problem/solution thinking.",
    mastering: "Weighs both sides and reaches a justified, balanced conclusion."
  }
}];

/* ===== icons.jsx ===== */
/* ------------------------------------------------------------------ */
/* ICONS \u2014 served from local /icons/*.svg (no external CDN needed)    */
/* ------------------------------------------------------------------ */

const ICON_KEBAB = {
  Printer: "printer",
  Download: "download",
  RotateCcw: "rotate-ccw",
  Check: "check",
  X: "x",
  ChevronRight: "chevron-right",
  Wrench: "wrench",
  Volume2: "volume-2",
  Lightbulb: "lightbulb",
  ChevronDown: "chevron-down",
  PenLine: "pen-line",
  Search: "search",
  Palette: "palette",
  Coins: "coins",
  Users: "users",
  Leaf: "leaf",
  Ruler: "ruler",
  ShieldCheck: "shield-check",
  Settings: "settings",
  Layers: "layers",
  Repeat: "repeat",
  GitMerge: "git-merge",
  RefreshCw: "refresh-cw",
  SlidersHorizontal: "sliders-horizontal",
  Recycle: "recycle",
  Eraser: "eraser",
  ArrowLeftRight: "arrow-left-right",
  UserPlus: "user-plus",
  Key: "key",
  Trash2: "trash-2",
  FileDown: "file-down",
  UsersRound: "users-round",
  ClipboardList: "clipboard-list",
  LogOut: "log-out",
  Shield: "shield",
  GraduationCap: "graduation-cap"
};
const ICON_SVG_CACHE = {};
function useIconSvg(name) {
  const [svg, setSvg] = useState(ICON_SVG_CACHE[name] || null);
  useEffect(() => {
    if (!name) return;
    if (ICON_SVG_CACHE[name]) {
      setSvg(ICON_SVG_CACHE[name]);
      return;
    }
    const file = ICON_KEBAB[name] || name;
    fetch("/icons/" + file + ".svg").then(r => r.ok ? r.text() : Promise.reject(new Error("icon-fetch-failed"))).then(text => {
      ICON_SVG_CACHE[name] = text;
      setSvg(text);
    }).catch(() => {});
  }, [name]);
  return svg;
}
function IconGlyph({
  name,
  size = 16,
  className = "",
  style = {}
}) {
  const svg = useIconSvg(name);
  return /*#__PURE__*/React.createElement("span", {
    className: "icon-glyph " + className,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      flexShrink: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: svg || ""
    }
  });
}

/* ===== api.jsx ===== */
/* ------------------------------------------------------------------ */
/* API HELPER                                                          */
/* ------------------------------------------------------------------ */

async function api(path, options) {
  const res = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });
  let body = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch (e) {
      body = null;
    }
  }
  if (!res.ok) {
    const message = body && body.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}
const apiGet = path => api(path);
const apiPost = (path, data) => api(path, {
  method: "POST",
  body: JSON.stringify(data || {})
});
const apiPut = (path, data) => api(path, {
  method: "PUT",
  body: JSON.stringify(data || {})
});
const apiPatch = (path, data) => api(path, {
  method: "PATCH",
  body: JSON.stringify(data || {})
});
const apiDelete = path => api(path, {
  method: "DELETE"
});

/* ===== shared.jsx ===== */
/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function speak(text) {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  } catch (e) {/* speech not available */}
}
function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso.replace(" ", "T") + "Z");
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric"
    }) + " " + d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return iso;
  }
}

/* ------------------------------------------------------------------ */
/* SHARED UI PIECES                                                    */
/* ------------------------------------------------------------------ */

function LetterBadge({
  letter,
  tint,
  size = 40
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "letter-badge",
    style: {
      width: size,
      height: size,
      fontSize: size * 0.5,
      background: tint
    }
  }, letter);
}
function SpeakBtn({
  text,
  label
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "speak-btn",
    onClick: () => speak(text),
    "aria-label": label || "Read aloud",
    title: "Read aloud"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Volume2",
    size: 15
  }));
}
function FrameworkToggle({
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fw-toggle",
    role: "tablist",
    "aria-label": "Choose framework"
  }, Object.entries(FRAMEWORKS).map(([key, fw]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    role: "tab",
    "aria-selected": value === key,
    className: "fw-toggle-btn" + (value === key ? " active" : ""),
    style: value === key ? {
      background: fw.tint,
      borderColor: fw.tint
    } : {},
    onClick: () => onChange(key)
  }, fw.label)));
}

/* ------------------------------------------------------------------ */
/* LEARN TAB                                                           */
/* ------------------------------------------------------------------ */

function LearnTab({
  simpleMode
}) {
  const [fwKey, setFwKey] = useState("accessfm");
  const [openId, setOpenId] = useState(null);
  const fw = FRAMEWORKS[fwKey];
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Learn the letters"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, fw.full, ". Tap a tag to see what it means and try it yourself.")), /*#__PURE__*/React.createElement(FrameworkToggle, {
    value: fwKey,
    onChange: k => {
      setFwKey(k);
      setOpenId(null);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "pegboard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tag-grid"
  }, fw.items.map((item, i) => {
    const open = openId === item.id;
    const bodyText = simpleMode ? item.simple : item.desc;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      className: "tool-tag" + (open ? " open" : ""),
      style: {
        "--tint": fw.tint,
        "--rot": `${(i % 2 === 0 ? -1 : 1) * (2 + i % 3)}deg`
      },
      onClick: () => setOpenId(open ? null : item.id),
      "aria-expanded": open
    }, /*#__PURE__*/React.createElement("span", {
      className: "tag-hook"
    }), /*#__PURE__*/React.createElement("span", {
      className: "tag-hole"
    }), /*#__PURE__*/React.createElement("span", {
      className: "tag-top-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tag-letter"
    }, item.letter), /*#__PURE__*/React.createElement(IconGlyph, {
      name: item.icon,
      size: 20,
      className: "tag-icon"
    })), /*#__PURE__*/React.createElement("span", {
      className: "tag-word"
    }, item.word), open && /*#__PURE__*/React.createElement("span", {
      className: "tag-detail",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("span", {
      className: "tag-detail-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tag-detail-label"
    }, simpleMode ? "In simple words" : "What it means"), /*#__PURE__*/React.createElement(SpeakBtn, {
      text: bodyText,
      label: `Read explanation of ${item.word}`
    })), /*#__PURE__*/React.createElement("span", {
      className: "tag-detail-text"
    }, bodyText), /*#__PURE__*/React.createElement("span", {
      className: "tag-detail-label"
    }, "Example"), /*#__PURE__*/React.createElement("span", {
      className: "tag-detail-text"
    }, item.example)));
  }))));
}

/* ===== changepassword.jsx ===== */
function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  function reset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
  }
  function toggle() {
    setOpen(o => !o);
    reset();
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Fill in all three fields.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }
    setBusy(true);
    try {
      await apiPost("/api/change-password", {
        currentPassword,
        newPassword
      });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "change-password-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: toggle
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Key",
    size: 15
  }), " Change password"), open && /*#__PURE__*/React.createElement("div", {
    className: "change-password-panel no-print"
  }, success ? /*#__PURE__*/React.createElement("p", {
    className: "change-password-success"
  }, "Password updated \u2713") : /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "change-password-form"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Current password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: currentPassword,
    onChange: e => setCurrentPassword(e.target.value),
    autoFocus: true
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "New password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: newPassword,
    onChange: e => setNewPassword(e.target.value)
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Confirm new password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: confirmPassword,
    onChange: e => setConfirmPassword(e.target.value)
  })), error && /*#__PURE__*/React.createElement("p", {
    className: "login-error"
  }, error), /*#__PURE__*/React.createElement("div", {
    className: "change-password-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    type: "submit",
    disabled: busy
  }, busy ? "Saving..." : "Update password"), /*#__PURE__*/React.createElement("button", {
    className: "btn-text",
    type: "button",
    onClick: toggle
  }, "Cancel")))));
}

/* ===== notifications.jsx ===== */
function NotificationCenter({
  onNavigate
}) {
  const [pending, setPending] = useState({
    quizzes: [],
    tasks: []
  });
  const [loaded, setLoaded] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  function load() {
    Promise.all([apiGet("/api/quiz-sets/available").catch(() => []), apiGet("/api/tasks/available").catch(() => [])]).then(([quizzes, tasks]) => {
      setPending({
        quizzes: quizzes.filter(q => q.isAssigned && !q.isCompleted),
        tasks: tasks.filter(t => t.isAssigned && !t.isCompleted)
      });
      setLoaded(true);
    });
  }
  useEffect(load, []);
  const count = pending.quizzes.length + pending.tasks.length;
  const showPopup = loaded && count > 0 && !popupDismissed;
  function goTo(tabKey) {
    setPopupDismissed(true);
    setPanelOpen(false);
    onNavigate(tabKey);
  }
  if (!loaded || count === 0) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "notif-bell",
      disabled: true,
      "aria-label": "No new assigned work"
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "Lightbulb",
      size: 17
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "notif-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "notif-bell has-items",
    onClick: () => setPanelOpen(o => !o),
    "aria-label": `${count} assigned item${count === 1 ? "" : "s"} pending`
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Lightbulb",
    size: 17
  }), /*#__PURE__*/React.createElement("span", {
    className: "notif-badge"
  }, count)), (panelOpen || showPopup) && /*#__PURE__*/React.createElement(React.Fragment, null, showPopup && !panelOpen && /*#__PURE__*/React.createElement("div", {
    className: "notif-overlay",
    onClick: () => setPopupDismissed(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "notif-panel" + (showPopup && !panelOpen ? " notif-panel-popup" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "notif-panel-head"
  }, /*#__PURE__*/React.createElement("span", null, "Work assigned to you"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setPopupDismissed(true);
      setPanelOpen(false);
    },
    "aria-label": "Dismiss"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "X",
    size: 14
  }))), pending.quizzes.map(q => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: "q" + q.id,
    className: "notif-item",
    onClick: () => goTo("quiz")
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Wrench",
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, q.name))), pending.tasks.map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: "t" + t.id,
    className: "notif-item",
    onClick: () => goTo("worksheet")
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "PenLine",
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, t.title, t.dueAt ? ` \u00b7 due ${t.dueAt}` : ""))))));
}

/* ===== quiz.jsx ===== */
/* ------------------------------------------------------------------ */
/* QUIZ QUESTION BUILDERS                                              */
/* ------------------------------------------------------------------ */

function buildMcqQuestions(frameworkKeys) {
  let pool = [];
  frameworkKeys.forEach(fk => {
    const fw = FRAMEWORKS[fk];
    fw.items.forEach(item => {
      const wordPool = fw.items.filter(i => i.id !== item.id).map(i => i.word);
      const letterPool = fw.items.filter(i => i.id !== item.id).map(i => i.letter);
      pool.push({
        type: "mcq",
        qid: fk + "-" + item.id + "-word",
        prompt: `In ${fw.label}, what does the letter "${item.letter}" stand for?`,
        answer: item.word,
        options: shuffle([item.word, ...shuffle(wordPool).slice(0, 3)]),
        badge: item.letter,
        tint: fw.tint
      });
      pool.push({
        type: "mcq",
        qid: fk + "-" + item.id + "-letter",
        prompt: `In ${fw.label}, which letter stands for "${item.word}"?`,
        answer: item.letter,
        options: shuffle([...new Set([item.letter, ...shuffle(letterPool).slice(0, 3)])]),
        badge: "?",
        tint: fw.tint
      });
    });
  });
  return pool;
}
function buildScenarioQuestions(frameworkKeys) {
  let pool = [];
  frameworkKeys.forEach(fk => {
    const fw = FRAMEWORKS[fk];
    fw.items.forEach(item => {
      const letterPool = fw.items.filter(i => i.id !== item.id).map(i => i.letter);
      pool.push({
        type: "scenario",
        qid: fk + "-" + item.id + "-scenario",
        prompt: `${item.scenario}\n\nWhich letter of ${fw.label} does this best relate to?`,
        answer: item.letter,
        options: shuffle([...new Set([item.letter, ...shuffle(letterPool).slice(0, 3)])]),
        badge: "\u2605",
        tint: fw.tint
      });
    });
  });
  return pool;
}
function buildTypedQuestions(frameworkKeys) {
  let pool = [];
  frameworkKeys.forEach(fk => {
    const fw = FRAMEWORKS[fk];
    fw.items.forEach(item => {
      pool.push({
        type: "typed",
        qid: fk + "-" + item.id + "-typed",
        prompt: `In your own words: ${item.prompt}`,
        keywords: item.wordbank,
        modelAnswer: item.example,
        badge: item.letter,
        tint: fw.tint,
        letter: item.letter,
        word: item.word
      });
    });
  });
  return pool;
}
const DIFFICULTY_INFO = {
  standard: {
    label: "Standard",
    desc: "Multiple choice \u2014 match letters and words.",
    length: 10
  },
  challenge: {
    label: "Challenge",
    desc: "Adds scenario questions \u2014 apply the letters to mini case studies.",
    length: 12
  },
  extension: {
    label: "Extension",
    desc: "Adds short typed answers you mark yourself against a model answer.",
    length: 12
  }
};
function buildQuiz(frameworkKeys, difficulty) {
  const mcq = buildMcqQuestions(frameworkKeys);
  if (difficulty === "standard") return shuffle(mcq).slice(0, DIFFICULTY_INFO.standard.length);
  const scenarios = buildScenarioQuestions(frameworkKeys);
  if (difficulty === "challenge") {
    const mix = shuffle([...shuffle(mcq).slice(0, 8), ...shuffle(scenarios).slice(0, 4)]);
    return mix.slice(0, DIFFICULTY_INFO.challenge.length);
  }

  // extension
  const typed = buildTypedQuestions(frameworkKeys);
  const mix = shuffle([...shuffle(mcq).slice(0, 5), ...shuffle(scenarios).slice(0, 4), ...shuffle(typed).slice(0, 3)]);
  return mix.slice(0, DIFFICULTY_INFO.extension.length);
}
function typedAnswerLooksGood(text, keywords) {
  const trimmed = (text || "").trim();
  if (!trimmed) return false;
  const wordCount = trimmed.split(/\s+/).length;
  const lower = trimmed.toLowerCase();
  const hasKeyword = (keywords || []).some(k => lower.includes(k.toLowerCase().split(" ")[0]));
  return wordCount >= 6 || hasKeyword;
}
function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return "\u2014";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/* ------------------------------------------------------------------ */
/* QUIZ TAB                                                             */
/* ------------------------------------------------------------------ */

function QuizTab({
  currentUser
}) {
  const [mode, setMode] = useState("accessfm");
  const [difficulty, setDifficulty] = useState("standard");
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("answering"); // answering | reviewing | finished
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]); // {answer} for mcq/scenario, {text} for typed
  const [checkedTyped, setCheckedTyped] = useState({}); // idx -> true, shows model answer inline (self-help only)
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finishedDetails, setFinishedDetails] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [customSets, setCustomSets] = useState([]);
  const [activeCustomSetId, setActiveCustomSetId] = useState(null);
  const [activeCustomSetName, setActiveCustomSetName] = useState("");
  const startTimeRef = useRef(null);
  function loadHistory() {
    apiGet("/api/quiz-attempts").then(rows => {
      setHistory(rows);
      setHistoryLoaded(true);
    }).catch(() => setHistoryLoaded(true));
  }
  useEffect(loadHistory, []);
  function loadCustomSets() {
    apiGet("/api/quiz-sets/available").then(setCustomSets).catch(() => {});
  }
  useEffect(loadCustomSets, []);
  function beginQuiz(qs, customId, customName) {
    setQuestions(qs);
    setResponses(qs.map(() => ({})));
    setCheckedTyped({});
    setIdx(0);
    setScore(0);
    setFinishedDetails([]);
    setPhase("answering");
    setStarted(true);
    setActiveCustomSetId(customId || null);
    setActiveCustomSetName(customName || "");
    startTimeRef.current = Date.now();
  }
  function start() {
    const keys = mode === "mixed" ? ["accessfm", "scamper"] : [mode];
    beginQuiz(buildQuiz(keys, difficulty), null, "");
  }
  async function startCustomSet(setSummary) {
    try {
      const full = await apiGet(`/api/quiz-sets/${setSummary.id}`);
      const qs = full.questions.map(q => ({
        ...q,
        tint: q.tint || "#16324F",
        badge: q.badge || "?"
      }));
      beginQuiz(qs, full.id, full.name);
    } catch (e) {/* ignore */}
  }
  function selectOption(option) {
    setResponses(rs => rs.map((r, i) => i === idx ? {
      answer: option
    } : r));
  }
  function setTypedText(text) {
    setResponses(rs => rs.map((r, i) => i === idx ? {
      ...r,
      text
    } : r));
  }
  function toggleCheckTyped() {
    setCheckedTyped(c => ({
      ...c,
      [idx]: !c[idx]
    }));
  }
  function goNext() {
    if (idx + 1 >= questions.length) {
      setPhase("reviewing");
    } else {
      setIdx(i => i + 1);
    }
  }
  function goPrev() {
    if (idx > 0) setIdx(i => i - 1);
  }
  function jumpTo(i) {
    setIdx(i);
    setPhase("answering");
  }
  async function handIn() {
    let newScore = 0;
    const details = questions.map((q, i) => {
      const r = responses[i] || {};
      let isCorrect, studentAnswer, correctAnswer;
      if (q.type === "typed") {
        studentAnswer = r.text || "";
        correctAnswer = q.modelAnswer || null;
        isCorrect = typedAnswerLooksGood(studentAnswer, q.keywords);
      } else {
        studentAnswer = r.answer || "(not answered)";
        correctAnswer = q.answer;
        isCorrect = r.answer === q.answer;
      }
      if (isCorrect) newScore++;
      return {
        qid: q.qid,
        type: q.type,
        prompt: q.prompt,
        letter: q.badge,
        studentAnswer,
        correctAnswer,
        isCorrect
      };
    });
    setScore(newScore);
    setFinishedDetails(details);
    setPhase("finished");
    const durationSeconds = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : null;
    try {
      await apiPost("/api/quiz-attempts", {
        quizSet: mode,
        difficulty,
        score: newScore,
        total: questions.length,
        durationSeconds,
        details,
        quizSetId: activeCustomSetId
      });
      loadHistory();
      loadCustomSets();
    } catch (e) {/* non-fatal: quiz result just won't be saved */}
  }
  if (!started) {
    return /*#__PURE__*/React.createElement("div", {
      className: "tab-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "panel-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Quiz mode"), /*#__PURE__*/React.createElement("p", {
      className: "sub"
    }, "Pick a topic and a difficulty, then go."))), /*#__PURE__*/React.createElement("div", {
      className: "quiz-start"
    }, /*#__PURE__*/React.createElement("div", {
      className: "quiz-mode-grid"
    }, [{
      key: "accessfm",
      label: "ACCESSFM",
      tint: FRAMEWORKS.accessfm.tint
    }, {
      key: "scamper",
      label: "SCAMPER",
      tint: FRAMEWORKS.scamper.tint
    }, {
      key: "mixed",
      label: "Mixed",
      tint: "#16324F"
    }].map(m => /*#__PURE__*/React.createElement("button", {
      key: m.key,
      className: "quiz-mode-btn" + (mode === m.key ? " active" : ""),
      style: mode === m.key ? {
        borderColor: m.tint,
        color: m.tint
      } : {},
      onClick: () => setMode(m.key)
    }, m.label))), /*#__PURE__*/React.createElement("div", {
      className: "difficulty-grid"
    }, Object.entries(DIFFICULTY_INFO).map(([key, info]) => /*#__PURE__*/React.createElement("button", {
      key: key,
      className: "difficulty-card" + (difficulty === key ? " active" : ""),
      onClick: () => setDifficulty(key)
    }, /*#__PURE__*/React.createElement("span", {
      className: "difficulty-title"
    }, info.label), /*#__PURE__*/React.createElement("span", {
      className: "difficulty-desc"
    }, info.desc)))), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      onClick: start
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "Wrench",
      size: 18
    }), " Start quiz"), customSets.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "quiz-custom-sets"
    }, /*#__PURE__*/React.createElement("span", {
      className: "quiz-history-label"
    }, "Assigned & practice quizzes from your teacher"), /*#__PURE__*/React.createElement("div", {
      className: "quiz-custom-set-list"
    }, customSets.map(s => /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: s.id,
      className: "quiz-custom-set-card",
      onClick: () => startCustomSet(s)
    }, /*#__PURE__*/React.createElement("span", {
      className: "quiz-custom-set-name"
    }, s.name, " ", s.isAssigned && /*#__PURE__*/React.createElement("span", {
      className: "needs-marking-badge",
      style: {
        background: s.isCompleted ? "#EDF5EE" : "#FBEFC9",
        color: s.isCompleted ? "#2A5B37" : "#8A6A1E"
      }
    }, s.isCompleted ? "done" : "assigned"), !s.isAssigned && s.isPracticeBank && /*#__PURE__*/React.createElement("span", {
      className: "needs-marking-badge",
      style: {
        background: "#EDF5EE",
        color: "#2A5B37"
      }
    }, "practice")), s.description && /*#__PURE__*/React.createElement("span", {
      className: "sub"
    }, s.description), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, s.questionCount, " question", s.questionCount === 1 ? "" : "s"))))), historyLoaded && history.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "quiz-history"
    }, /*#__PURE__*/React.createElement("span", {
      className: "quiz-history-label"
    }, "Your recent attempts"), /*#__PURE__*/React.createElement("div", {
      className: "quiz-history-list"
    }, history.slice(0, 6).map(h => /*#__PURE__*/React.createElement(React.Fragment, {
      key: h.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "quiz-history-row",
      onClick: () => setExpandedHistoryId(expandedHistoryId === h.id ? null : h.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "quiz-history-pct"
    }, Math.round(h.score / h.total * 100), "%"), /*#__PURE__*/React.createElement("span", null, FRAMEWORKS[h.quizSet] ? FRAMEWORKS[h.quizSet].label : "Mixed"), /*#__PURE__*/React.createElement("span", {
      className: "quiz-history-diff"
    }, DIFFICULTY_INFO[h.difficulty] ? DIFFICULTY_INFO[h.difficulty].label : h.difficulty), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, h.score, "/", h.total), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, formatDuration(h.durationSeconds)), h.feedback && /*#__PURE__*/React.createElement(IconGlyph, {
      name: "Lightbulb",
      size: 14,
      style: {
        color: "#8A6A1E"
      }
    })), expandedHistoryId === h.id && h.feedback && /*#__PURE__*/React.createElement("div", {
      className: "quiz-history-feedback"
    }, /*#__PURE__*/React.createElement("span", {
      className: "help-label"
    }, "Feedback from your teacher"), /*#__PURE__*/React.createElement("p", null, h.feedback))))))));
  }
  if (phase === "finished") {
    const pct = Math.round(score / questions.length * 100);
    return /*#__PURE__*/React.createElement("div", {
      className: "tab-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "quiz-result"
    }, /*#__PURE__*/React.createElement("span", {
      className: "stamp",
      style: {
        borderColor: pct >= 70 ? "#3F7D4F" : "#C0392B",
        color: pct >= 70 ? "#3F7D4F" : "#C0392B"
      }
    }, pct >= 70 ? "PASSED" : "TRY AGAIN"), /*#__PURE__*/React.createElement("h2", null, score, " / ", questions.length), /*#__PURE__*/React.createElement("p", {
      className: "sub"
    }, "You scored ", pct, "% ", activeCustomSetName ? /*#__PURE__*/React.createElement(React.Fragment, null, "on \"", activeCustomSetName, "\"") : /*#__PURE__*/React.createElement(React.Fragment, null, "on ", DIFFICULTY_INFO[difficulty].label), ".", " ", pct >= 70 ? "Solid work \u2014 that's a strong grasp of the framework." : "Have another go and see if you can beat it."), /*#__PURE__*/React.createElement("details", {
      className: "quiz-finished-review"
    }, /*#__PURE__*/React.createElement("summary", null, "Review your answers"), /*#__PURE__*/React.createElement("div", {
      className: "quiz-review-questions"
    }, finishedDetails.map(d => /*#__PURE__*/React.createElement("div", {
      key: d.qid,
      className: "quiz-review-q" + (d.isCorrect ? " correct" : " wrong")
    }, /*#__PURE__*/React.createElement("p", {
      className: "quiz-review-prompt",
      style: {
        whiteSpace: "pre-line"
      }
    }, d.prompt), /*#__PURE__*/React.createElement("p", {
      className: "quiz-review-answer"
    }, /*#__PURE__*/React.createElement("strong", null, "Your answer:"), " ", d.studentAnswer, d.type !== "typed" && /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, " (correct: ", d.correctAnswer, ")")), d.type === "typed" && /*#__PURE__*/React.createElement("p", {
      className: "quiz-review-answer"
    }, /*#__PURE__*/React.createElement("strong", null, "Model answer:"), " ", d.correctAnswer))))), /*#__PURE__*/React.createElement("div", {
      className: "quiz-result-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      onClick: activeCustomSetId ? () => startCustomSet({
        id: activeCustomSetId,
        name: activeCustomSetName
      }) : start
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "RotateCcw",
      size: 18
    }), " Retake this quiz"), /*#__PURE__*/React.createElement("button", {
      className: "btn-secondary",
      onClick: () => setStarted(false)
    }, "Choose a different set"))));
  }
  if (phase === "reviewing") {
    const unansweredCount = responses.filter((r, i) => {
      const q = questions[i];
      return q.type === "typed" ? !(r.text || "").trim() : !r.answer;
    }).length;
    return /*#__PURE__*/React.createElement("div", {
      className: "tab-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "panel-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Check your answers"), /*#__PURE__*/React.createElement("p", {
      className: "sub"
    }, "Review everything below before you hand in \\u2014 tap any question to change your answer.", unansweredCount > 0 && /*#__PURE__*/React.createElement("strong", null, " ", unansweredCount, " question", unansweredCount === 1 ? "" : "s", " not answered yet.")))), /*#__PURE__*/React.createElement("div", {
      className: "quiz-review-list"
    }, questions.map((q, i) => {
      const r = responses[i] || {};
      const answered = q.type === "typed" ? !!(r.text || "").trim() : !!r.answer;
      const summary = q.type === "typed" ? (r.text || "").slice(0, 60) || "Not answered yet" : r.answer || "Not answered yet";
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        key: q.qid,
        className: "quiz-review-item" + (answered ? "" : " unanswered"),
        onClick: () => jumpTo(i)
      }, /*#__PURE__*/React.createElement(LetterBadge, {
        letter: q.badge,
        tint: q.tint,
        size: 30
      }), /*#__PURE__*/React.createElement("span", {
        className: "quiz-review-item-text"
      }, /*#__PURE__*/React.createElement("span", {
        className: "quiz-review-item-prompt"
      }, q.prompt.split("\n")[0]), /*#__PURE__*/React.createElement("span", {
        className: "quiz-review-item-answer"
      }, summary, q.type === "typed" && (r.text || "").length > 60 ? "\u2026" : "")), /*#__PURE__*/React.createElement(IconGlyph, {
        name: "PenLine",
        size: 14
      }));
    })), /*#__PURE__*/React.createElement("div", {
      className: "quiz-result-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      onClick: handIn
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "Check",
      size: 18
    }), " Hand in quiz"), /*#__PURE__*/React.createElement("button", {
      className: "btn-secondary",
      onClick: () => jumpTo(questions.length - 1)
    }, "Keep answering")));
  }

  // phase === "answering"
  const q = questions[idx];
  const r = responses[idx] || {};
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quiz-progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quiz-progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${(idx + 1) / questions.length * 100}%`,
      background: q.tint
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "Q", idx + 1, " / ", questions.length)), /*#__PURE__*/React.createElement("div", {
    className: "quiz-card"
  }, /*#__PURE__*/React.createElement(LetterBadge, {
    letter: q.badge,
    tint: q.tint,
    size: 48
  }), q.type !== "typed" && /*#__PURE__*/React.createElement("span", {
    className: "quiz-question-row"
  }, /*#__PURE__*/React.createElement("p", {
    className: "quiz-question",
    style: {
      whiteSpace: "pre-line"
    }
  }, q.prompt), /*#__PURE__*/React.createElement(SpeakBtn, {
    text: q.prompt,
    label: "Read question aloud"
  })), (q.type === "mcq" || q.type === "scenario") && /*#__PURE__*/React.createElement("div", {
    className: "quiz-options"
  }, q.options.map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt,
    className: "quiz-option" + (r.answer === opt ? " picked" : ""),
    onClick: () => selectOption(opt)
  }, /*#__PURE__*/React.createElement("span", null, opt), r.answer === opt && /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Check",
    size: 18
  })))), q.type === "typed" && /*#__PURE__*/React.createElement("div", {
    className: "typed-question"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quiz-question-row"
  }, /*#__PURE__*/React.createElement("p", {
    className: "quiz-question"
  }, q.prompt), /*#__PURE__*/React.createElement(SpeakBtn, {
    text: q.prompt,
    label: "Read question aloud"
  })), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: r.text || "",
    onChange: e => setTypedText(e.target.value),
    placeholder: "Type a short answer..."
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: toggleCheckTyped,
    disabled: !(r.text || "").trim()
  }, checkedTyped[idx] ? "Hide model answer" : "Check my answer"), checkedTyped[idx] && /*#__PURE__*/React.createElement("div", {
    className: "typed-feedback"
  }, /*#__PURE__*/React.createElement("span", {
    className: "typed-feedback-label"
  }, "Model answer to compare against \u2014 you can still change yours before handing in:"), /*#__PURE__*/React.createElement("span", {
    className: "typed-feedback-text"
  }, q.modelAnswer))), /*#__PURE__*/React.createElement("div", {
    className: "quiz-nav-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-secondary",
    onClick: goPrev,
    disabled: idx === 0
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16,
    style: {
      transform: "rotate(180deg)"
    }
  }), " Back"), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary quiz-next",
    onClick: goNext
  }, idx + 1 >= questions.length ? "Review answers" : "Next question", " ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 18
  })))));
}

/* ===== worksheet.jsx ===== */
function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.dataset.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("load-failed"));
    document.body.appendChild(s);
  });
}
function WorksheetTab({
  simpleMode,
  currentUser
}) {
  const [fwKey, setFwKey] = useState("accessfm");
  const [mode, setMode] = useState("create");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [answers, setAnswers] = useState({});
  const [helpOpen, setHelpOpen] = useState({});
  const [exportState, setExportState] = useState({
    pdf: "idle",
    word: "idle"
  });
  const [currentId, setCurrentId] = useState(null);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [currentStatus, setCurrentStatus] = useState("draft"); // draft | submitted
  const [savedList, setSavedList] = useState([]);
  const [savedListOpen, setSavedListOpen] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [availableTasks, setAvailableTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const textareaRefs = useRef({});
  const fw = FRAMEWORKS[fwKey];
  useEffect(() => {
    loadAvailableTasks();
  }, []);
  function loadAvailableTasks() {
    apiGet("/api/tasks/available").then(setAvailableTasks).catch(() => {});
  }
  function refreshSavedList() {
    apiGet("/api/submissions").then(setSavedList).catch(() => {});
  }
  useEffect(() => {
    refreshSavedList();
  }, []);
  function setAnswer(id, val) {
    setAnswers(a => ({
      ...a,
      [id]: val
    }));
    setSaveState("idle");
  }
  function insertText(id, text) {
    setAnswers(a => {
      const existing = a[id] || "";
      const next = existing.trim() ? existing.replace(/\s+$/, "") + " " + text : text;
      return {
        ...a,
        [id]: next
      };
    });
    setSaveState("idle");
    const ta = textareaRefs.current[id];
    if (ta) {
      ta.focus();
      setTimeout(() => {
        try {
          ta.selectionStart = ta.selectionEnd = ta.value.length;
        } catch (e) {}
      }, 0);
    }
  }
  function toggleHelp(id) {
    setHelpOpen(h => ({
      ...h,
      [id]: !h[id]
    }));
  }
  function startFresh(newFwKey, newMode) {
    setFwKey(newFwKey);
    setMode(newMode);
    setProductName("");
    setBrand("");
    setAnswers({});
    setCurrentId(null);
    setCurrentFeedback("");
    setCurrentStatus("draft");
    setActiveTask(null);
    setSaveState("idle");
  }
  function handleNewWorksheet() {
    const hasContent = productName.trim() || Object.values(answers).some(a => a && a.trim());
    const hasUnsavedChanges = hasContent && saveState !== "saved";
    if (hasUnsavedChanges && !window.confirm("Start a new blank worksheet? Any unsaved changes to this one will be lost. (Already-saved worksheets are safe in \"My saved work\".)")) {
      return;
    }
    startFresh(fwKey, mode);
  }
  async function startTask(taskSummary) {
    try {
      const full = await apiGet(`/api/tasks/${taskSummary.id}`);
      setFwKey(full.framework);
      setMode(full.taskType === "image" ? "analyze" : "create");
      setProductName(full.title);
      setBrand("");
      setAnswers({});
      setCurrentId(null);
      setCurrentFeedback("");
      setCurrentStatus("draft");
      setSaveState("idle");
      setActiveTask(full);
    } catch (e) {/* ignore */}
  }
  async function openSaved(item) {
    try {
      const full = await apiGet(`/api/submissions/${item.id}`);
      setFwKey(full.framework);
      setMode(full.toolMode);
      setProductName(full.productName || "");
      setBrand(full.brand || "");
      setAnswers(full.answers || {});
      setCurrentId(full.id);
      setCurrentFeedback(full.feedback || "");
      setCurrentStatus(full.status || "draft");
      setActiveTask(null);
      setSaveState("idle");
      setSavedListOpen(false);
    } catch (e) {/* ignore */}
  }
  async function deleteSaved(item, ev) {
    ev.stopPropagation();
    if (!window.confirm(`Delete "${item.productName || "Untitled"}"? This can't be undone.`)) return;
    try {
      await apiDelete(`/api/submissions/${item.id}`);
      if (currentId === item.id) {
        setCurrentId(null);
      }
      refreshSavedList();
    } catch (e) {/* ignore */}
  }
  async function handleSave(asNew) {
    setSaveState("saving");
    try {
      if (currentId && !asNew) {
        await apiPut(`/api/submissions/${currentId}`, {
          productName,
          brand,
          answers
        });
      } else {
        const created = await apiPost("/api/submissions", {
          toolMode: mode,
          framework: fwKey,
          productName,
          brand,
          answers,
          taskId: activeTask ? activeTask.id : null
        });
        setCurrentId(created.id);
        setCurrentStatus("draft");
      }
      setSaveState("saved");
      refreshSavedList();
    } catch (e) {
      setSaveState("error");
    }
  }
  async function handleHandIn() {
    if (!window.confirm("Hand in this worksheet? Your teacher will be able to see it and mark it. You can still make changes afterwards if needed.")) {
      return;
    }
    setSaveState("saving");
    try {
      let result;
      if (currentId) {
        result = await apiPost(`/api/submissions/${currentId}/hand-in`, {
          productName,
          brand,
          answers
        });
      } else {
        const created = await apiPost("/api/submissions", {
          toolMode: mode,
          framework: fwKey,
          productName,
          brand,
          answers,
          taskId: activeTask ? activeTask.id : null
        });
        result = await apiPost(`/api/submissions/${created.id}/hand-in`, {
          productName,
          brand,
          answers
        });
      }
      setCurrentId(result.id);
      setCurrentStatus(result.status);
      setSaveState("saved");
      refreshSavedList();
      if (activeTask) loadAvailableTasks();
    } catch (e) {
      setSaveState("error");
    }
  }
  const heading = mode === "analyze" ? `${fw.label} Product Analysis` : `${fw.label} Design Worksheet`;
  const filenameBase = `${(productName || "worksheet").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${fwKey}-${mode}`;
  function getItemText(item) {
    const q = simpleMode ? item.simple : mode === "analyze" ? item.analyzePrompt : item.prompt;
    const a = answers[item.id] || "(no answer yet)";
    return {
      q,
      a
    };
  }
  async function handleExportPDF() {
    setExportState(s => ({
      ...s,
      pdf: "busy"
    }));
    try {
      if (!window.jspdf) {
        await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      }
      const {
        jsPDF
      } = window.jspdf;
      const doc = new jsPDF({
        unit: "pt",
        format: "a4"
      });
      const marginX = 50;
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const maxWidth = pageW - marginX * 2;
      let y = 56;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(19);
      doc.setTextColor(22, 50, 79);
      doc.text(heading, marginX, y);
      y += 26;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(90, 100, 110);
      doc.text(`Name: ${currentUser.displayName}`, marginX, y);
      y += 15;
      doc.text(`Product: ${productName || "\u2014"}`, marginX, y);
      y += 15;
      if (mode === "analyze") {
        doc.text(`Made by: ${brand || "\u2014"}`, marginX, y);
        y += 15;
      }
      y += 8;
      doc.setDrawColor(216, 211, 196);
      doc.line(marginX, y, pageW - marginX, y);
      y += 22;
      fw.items.forEach(item => {
        const {
          q,
          a
        } = getItemText(item);
        const qLines = doc.splitTextToSize(q, maxWidth);
        const aLines = doc.splitTextToSize(a, maxWidth);
        const blockHeight = 20 + qLines.length * 13 + 6 + aLines.length * 14 + 16;
        if (y + blockHeight > pageH - 48) {
          doc.addPage();
          y = 56;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12.5);
        doc.setTextColor(22, 50, 79);
        doc.text(`${item.letter} \u2014 ${item.word}`, marginX, y);
        y += 17;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(90, 100, 110);
        doc.text(qLines, marginX, y);
        y += qLines.length * 13 + 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(30, 34, 38);
        doc.text(aLines, marginX, y);
        y += aLines.length * 14 + 20;
      });
      doc.save(`${filenameBase}.pdf`);
      setExportState(s => ({
        ...s,
        pdf: "idle"
      }));
    } catch (e) {
      setExportState(s => ({
        ...s,
        pdf: "error"
      }));
    }
  }
  function handleExportWord() {
    setExportState(s => ({
      ...s,
      word: "busy"
    }));
    try {
      let body = `<h1 style="font-family:Calibri,Arial,sans-serif;color:#16324F;font-size:22pt;margin-bottom:4pt;">${heading}</h1>`;
      body += `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#444;">Name: ${currentUser.displayName}</p>`;
      body += mode === "analyze" ? `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#444;">Product analysed: ${productName || "\u2014"}<br/>Made by: ${brand || "\u2014"}</p>` : `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#444;">Product: ${productName || "\u2014"}</p>`;
      body += `<hr style="border:none;border-top:1px solid #D8D3C4;margin:14pt 0;"/>`;
      fw.items.forEach(item => {
        const {
          q,
          a
        } = getItemText(item);
        body += `<h3 style="font-family:Calibri,Arial,sans-serif;color:${fw.tint};font-size:13pt;margin-bottom:2pt;">${item.letter} \u2014 ${item.word}</h3>`;
        body += `<p style="font-family:Calibri,Arial,sans-serif;font-size:10pt;color:#666;font-style:italic;margin:0 0 4pt 0;">${q}</p>`;
        body += `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#222;margin:0 0 12pt 0;">${(a || "").replace(/\n/g, "<br/>")}</p>`;
      });
      const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset="utf-8"><title>${heading}</title></head><body>${body}</body></html>`;
      const blob = new Blob(["\ufeff", html], {
        type: "application/msword"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filenameBase}.doc`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setExportState(s => ({
        ...s,
        word: "idle"
      }));
    } catch (e) {
      setExportState(s => ({
        ...s,
        word: "error"
      }));
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head no-print"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Worksheet"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, mode === "analyze" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Use ", fw.label, " to analyse an existing product.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Apply ", fw.label, " to your own product idea."), " ", "Tap ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Lightbulb",
    size: 12,
    style: {
      verticalAlign: "-1px"
    }
  }), " for words or starter ideas.")), /*#__PURE__*/React.createElement(FrameworkToggle, {
    value: fwKey,
    onChange: k => startFresh(k, mode)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mode-toggle no-print",
    role: "tablist",
    "aria-label": "Design or analyse"
  }, /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": mode === "create",
    className: "mode-toggle-btn" + (mode === "create" ? " active" : ""),
    onClick: () => startFresh(fwKey, "create")
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "PenLine",
    size: 15
  }), " Design my own idea"), /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": mode === "analyze",
    className: "mode-toggle-btn" + (mode === "analyze" ? " active" : ""),
    onClick: () => startFresh(fwKey, "analyze")
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Search",
    size: 15
  }), " Analyse an existing product"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mode-toggle-btn saved-toggle",
    onClick: () => setSavedListOpen(o => !o)
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ClipboardList",
    size: 15
  }), " My saved work (", savedList.length, ")"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mode-toggle-btn",
    onClick: handleNewWorksheet
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "PenLine",
    size: 15
  }), " New worksheet")), availableTasks.length > 0 && !activeTask && /*#__PURE__*/React.createElement("div", {
    className: "task-picker no-print"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quiz-history-label"
  }, "Assigned & practice tasks from your teacher"), /*#__PURE__*/React.createElement("div", {
    className: "task-picker-list"
  }, availableTasks.map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: t.id,
    className: "task-picker-card",
    onClick: () => startTask(t)
  }, t.imageUrl && /*#__PURE__*/React.createElement("img", {
    src: t.imageUrl,
    alt: t.title,
    className: "task-picker-thumb"
  }), /*#__PURE__*/React.createElement("span", {
    className: "task-picker-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "task-picker-title"
  }, t.title, " ", t.isPracticeBank && /*#__PURE__*/React.createElement("span", {
    className: "needs-marking-badge",
    style: {
      background: "#EDF5EE",
      color: "#2A5B37"
    }
  }, "practice")), t.dueAt && /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "Due ", t.dueAt)))))), activeTask && /*#__PURE__*/React.createElement("div", {
    className: "task-active-banner no-print"
  }, /*#__PURE__*/React.createElement("div", {
    className: "task-active-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "worksheet-feedback-label"
  }, "Task: ", activeTask.title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: () => setActiveTask(null)
  }, "Clear task")), activeTask.imageUrl && /*#__PURE__*/React.createElement("img", {
    src: activeTask.imageUrl,
    alt: activeTask.title,
    className: "task-active-image"
  }), activeTask.instructions && /*#__PURE__*/React.createElement("p", null, activeTask.instructions)), /*#__PURE__*/React.createElement("p", {
    className: "worksheet-editing-status sub no-print"
  }, currentId ? /*#__PURE__*/React.createElement(React.Fragment, null, "Editing a saved worksheet", productName ? /*#__PURE__*/React.createElement(React.Fragment, null, " \u2014 ", /*#__PURE__*/React.createElement("strong", null, productName)) : null, ".", " ", /*#__PURE__*/React.createElement("span", {
    className: "status-pill" + (currentStatus === "submitted" ? " submitted" : " draft")
  }, currentStatus === "submitted" ? "Handed in" : "Draft"), " ", "Changes save to this same one unless you use \"New worksheet\" or \"Save as new copy\".") : /*#__PURE__*/React.createElement(React.Fragment, null, "Starting a new, unsaved worksheet", productName ? /*#__PURE__*/React.createElement(React.Fragment, null, " \u2014 ", /*#__PURE__*/React.createElement("strong", null, productName)) : null, ".")), savedListOpen && /*#__PURE__*/React.createElement("div", {
    className: "saved-panel no-print"
  }, savedList.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Nothing saved yet \u2014 fill in a worksheet below and hit Save."), savedList.map(item => /*#__PURE__*/React.createElement("div", {
    className: "saved-row",
    key: item.id,
    onClick: () => openSaved(item)
  }, /*#__PURE__*/React.createElement("span", {
    className: "saved-row-fw",
    style: {
      color: FRAMEWORKS[item.framework].tint
    }
  }, FRAMEWORKS[item.framework].label), /*#__PURE__*/React.createElement("span", {
    className: "saved-row-name"
  }, item.productName || "Untitled", item.feedback && /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Lightbulb",
    size: 13,
    style: {
      color: "#8A6A1E",
      marginLeft: 6,
      verticalAlign: "-2px"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "status-pill" + (item.status === "submitted" ? " submitted" : " draft")
  }, item.status === "submitted" ? "Handed in" : "Draft")), /*#__PURE__*/React.createElement("span", {
    className: "saved-row-mode"
  }, item.toolMode === "analyze" ? "Analysis" : "Design"), /*#__PURE__*/React.createElement("span", {
    className: "saved-row-date mono"
  }, formatDate(item.updatedAt)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "saved-row-delete",
    onClick: e => deleteSaved(item, e),
    "aria-label": "Delete"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Trash2",
    size: 14
  }))))), currentFeedback && /*#__PURE__*/React.createElement("div", {
    className: "worksheet-feedback-callout no-print"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Lightbulb",
    size: 16,
    style: {
      color: "#8A6A1E"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "worksheet-feedback-label"
  }, "Feedback from your teacher"), /*#__PURE__*/React.createElement("p", null, currentFeedback))), /*#__PURE__*/React.createElement("div", {
    className: "worksheet-sheet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "worksheet-meta"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, mode === "analyze" ? "Product you're analysing" : "Product / project"), /*#__PURE__*/React.createElement("input", {
    value: productName,
    onChange: e => {
      setProductName(e.target.value);
      setSaveState("idle");
    },
    placeholder: mode === "analyze" ? "e.g. Dyson Airwrap" : "e.g. Reusable coffee cup"
  })), mode === "analyze" && /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Made by (optional)"), /*#__PURE__*/React.createElement("input", {
    value: brand,
    onChange: e => {
      setBrand(e.target.value);
      setSaveState("idle");
    },
    placeholder: "e.g. Dyson"
  })), /*#__PURE__*/React.createElement("span", {
    className: "worksheet-fw-label",
    style: {
      color: fw.tint
    }
  }, fw.label)), /*#__PURE__*/React.createElement("div", {
    className: "worksheet-items"
  }, fw.items.map(item => {
    const promptText = simpleMode ? item.simple : mode === "analyze" ? item.analyzePrompt : item.prompt;
    const starters = mode === "analyze" ? item.analyzeStarters : item.starters;
    const isHelpOpen = !!helpOpen[item.id];
    return /*#__PURE__*/React.createElement("div", {
      className: "worksheet-item",
      key: item.id
    }, /*#__PURE__*/React.createElement(LetterBadge, {
      letter: item.letter,
      tint: fw.tint,
      size: 36
    }), /*#__PURE__*/React.createElement("div", {
      className: "worksheet-item-body"
    }, /*#__PURE__*/React.createElement("span", {
      className: "worksheet-item-title"
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: item.icon,
      size: 15,
      className: "worksheet-item-icon",
      style: {
        color: fw.tint
      }
    }), item.word), /*#__PURE__*/React.createElement("span", {
      className: "worksheet-item-prompt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "worksheet-item-prompt"
    }, promptText), /*#__PURE__*/React.createElement("span", {
      className: "worksheet-item-controls no-print"
    }, /*#__PURE__*/React.createElement(SpeakBtn, {
      text: promptText,
      label: `Read question for ${item.word}`
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "help-toggle" + (isHelpOpen ? " active" : ""),
      onClick: () => toggleHelp(item.id)
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "Lightbulb",
      size: 14
    }), " Help ", /*#__PURE__*/React.createElement(IconGlyph, {
      name: "ChevronDown",
      size: 13,
      className: "chevron" + (isHelpOpen ? " up" : "")
    })))), isHelpOpen && /*#__PURE__*/React.createElement("div", {
      className: "help-panel no-print"
    }, /*#__PURE__*/React.createElement("div", {
      className: "help-block"
    }, /*#__PURE__*/React.createElement("span", {
      className: "help-label"
    }, "Useful words \u2014 tap to add one"), /*#__PURE__*/React.createElement("div", {
      className: "chip-row"
    }, item.wordbank.map(w => /*#__PURE__*/React.createElement("button", {
      key: w,
      type: "button",
      className: "chip chip-word",
      onClick: () => insertText(item.id, w)
    }, w)))), /*#__PURE__*/React.createElement("div", {
      className: "help-block"
    }, /*#__PURE__*/React.createElement("span", {
      className: "help-label"
    }, "Stuck? Try a sentence starter"), /*#__PURE__*/React.createElement("div", {
      className: "chip-row"
    }, starters.map(s => /*#__PURE__*/React.createElement("button", {
      key: s,
      type: "button",
      className: "chip chip-starter",
      onClick: () => insertText(item.id, s)
    }, s))))), /*#__PURE__*/React.createElement("textarea", {
      ref: el => {
        textareaRefs.current[item.id] = el;
      },
      rows: 3,
      value: answers[item.id] || "",
      onChange: e => setAnswer(item.id, e.target.value),
      placeholder: "Type your answer here..."
    })));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "worksheet-actions no-print"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-secondary",
    onClick: () => handleSave(false),
    disabled: saveState === "saving"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Download",
    size: 18
  }), " ", saveState === "saving" ? "Saving..." : currentId ? "Save draft" : "Save my work"), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: handleHandIn,
    disabled: saveState === "saving"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Check",
    size: 18
  }), " ", currentStatus === "submitted" ? "Update hand-in" : "Hand in"), currentId && /*#__PURE__*/React.createElement("button", {
    className: "btn-secondary",
    onClick: () => handleSave(true),
    disabled: saveState === "saving"
  }, "Save as new copy"), /*#__PURE__*/React.createElement("span", {
    className: "save-status mono"
  }, saveState === "saved" && "Saved \u2713", saveState === "error" && "Couldn't save \u2014 check your connection")), /*#__PURE__*/React.createElement("div", {
    className: "worksheet-actions no-print",
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-secondary",
    onClick: handleExportPDF,
    disabled: exportState.pdf === "busy"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "FileDown",
    size: 16
  }), " ", exportState.pdf === "busy" ? "Preparing PDF..." : "Export as PDF"), /*#__PURE__*/React.createElement("button", {
    className: "btn-secondary",
    onClick: handleExportWord,
    disabled: exportState.word === "busy"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "FileDown",
    size: 16
  }), " ", exportState.word === "busy" ? "Preparing..." : "Export as Word (.doc)")), exportState.pdf === "error" && /*#__PURE__*/React.createElement("p", {
    className: "export-error no-print"
  }, "Couldn't generate the PDF (needs an internet connection to load once)."), exportState.word === "error" && /*#__PURE__*/React.createElement("p", {
    className: "export-error no-print"
  }, "Something went wrong creating the Word file. Try again."));
}

/* ===== specbuilder.jsx ===== */
/* ------------------------------------------------------------------ */
/* SPEC LIST - "My specifications"                                     */
/* ------------------------------------------------------------------ */

function SpecList({
  onOpen,
  onCreate
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  function load() {
    setLoading(true);
    apiGet("/api/specs").then(setProjects).catch(() => {}).finally(() => setLoading(false));
  }
  useEffect(load, []);
  async function handleDelete(project, ev) {
    ev.stopPropagation();
    if (!window.confirm(`Delete "${project.projectName}"? This can't be undone.`)) return;
    try {
      await apiDelete(`/api/specs/${project.id}`);
      load();
    } catch (e) {/* ignore */}
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "My Specifications"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Build a clear and measurable design specification, step by step.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "PenLine",
    size: 16
  }), " New specification")), loading && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Loading..."), !loading && projects.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "You haven't started a specification yet. Click \"New specification\" to begin \u2014 you'll be guided through it category by category."), /*#__PURE__*/React.createElement("div", {
    className: "spec-list"
  }, projects.map(p => /*#__PURE__*/React.createElement("div", {
    className: "spec-list-row",
    key: p.id,
    onClick: () => onOpen(p.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "spec-list-name"
  }, p.projectName || "Untitled", p.feedback && /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Lightbulb",
    size: 13,
    style: {
      color: "#B25E00",
      marginLeft: 6,
      verticalAlign: "-2px"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "status-pill" + (p.status === "submitted" ? " submitted" : " draft")
  }, p.status === "submitted" ? "Handed in" : "Draft")), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, p.pointCount, " point", p.pointCount === 1 ? "" : "s"), /*#__PURE__*/React.createElement("span", {
    className: "saved-row-date mono"
  }, formatDate(p.updatedAt)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "saved-row-delete",
    onClick: e => handleDelete(p, e),
    "aria-label": "Delete"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Trash2",
    size: 14
  }))))));
}

/* ------------------------------------------------------------------ */
/* SPEC SETUP - project name / problem / user                          */
/* ------------------------------------------------------------------ */

function SpecSetup({
  existing,
  onSaved,
  onCancel
}) {
  const [projectName, setProjectName] = useState(existing ? existing.projectName : "");
  const [designProblem, setDesignProblem] = useState(existing ? existing.designProblem : "");
  const [intendedUser, setIntendedUser] = useState(existing ? existing.intendedUser : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function handleSave() {
    if (!projectName.trim()) {
      setError("Give your project a name.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        projectName,
        designProblem,
        intendedUser
      };
      const saved = existing ? await apiPut(`/api/specs/${existing.id}`, payload) : await apiPost("/api/specs", payload);
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, existing ? "Edit project details" : "Start a new specification"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "These stay visible while you build your specification, and you can edit them any time."))), /*#__PURE__*/React.createElement("div", {
    className: "spec-setup-form"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Project / product name"), /*#__PURE__*/React.createElement("input", {
    value: projectName,
    onChange: e => setProjectName(e.target.value),
    placeholder: "e.g. Desk organiser for a secondary school student",
    autoFocus: true
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Design problem \u2014 what are you designing, and why?"), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: designProblem,
    onChange: e => setDesignProblem(e.target.value),
    placeholder: "A short explanation of the problem you're solving..."
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Intended user \u2014 who is this for?"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: intendedUser,
    onChange: e => setIntendedUser(e.target.value),
    placeholder: "e.g. Year 10 secondary school student"
  }))), error && /*#__PURE__*/React.createElement("p", {
    className: "login-error"
  }, error), /*#__PURE__*/React.createElement("div", {
    className: "qb-save-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: handleSave,
    disabled: saving
  }, saving ? "Saving..." : existing ? "Save changes" : "Start building"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: onCancel
  }, "Cancel")));
}

/* ------------------------------------------------------------------ */
/* SPEC POINT FORM - Requirement / Reason / Testing, with live checker  */
/* ------------------------------------------------------------------ */

function SpecPointForm({
  category,
  onAdd
}) {
  const [requirement, setRequirement] = useState("");
  const [reason, setReason] = useState("");
  const [testingMethod, setTestingMethod] = useState("");
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState(false);
  const hint = touched ? checkSpecQuality(requirement) : null;
  async function handleAdd() {
    if (!requirement.trim()) return;
    setBusy(true);
    try {
      await onAdd({
        category: category.key,
        requirement,
        reason,
        testingMethod
      });
      setRequirement("");
      setReason("");
      setTestingMethod("");
      setTouched(false);
    } catch (e) {/* ignore */}
    setBusy(false);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "spec-point-form"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
    className: "spec-field-label requirement"
  }, "1. Requirement \u2014 what must the product do?"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: requirement,
    onChange: e => setRequirement(e.target.value),
    onBlur: () => setTouched(true),
    placeholder: category.example.better
  }), hint && /*#__PURE__*/React.createElement("div", {
    className: "spec-hint"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Lightbulb",
    size: 14,
    style: {
      color: "#B25E00",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", null, hint))), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
    className: "spec-field-label reason"
  }, "2. Reason \u2014 why is this important?"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: reason,
    onChange: e => setReason(e.target.value),
    placeholder: "e.g. The user only has this amount of space available."
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
    className: "spec-field-label testing"
  }, "3. Testing \u2014 how could you check this later?"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: testingMethod,
    onChange: e => setTestingMethod(e.target.value),
    placeholder: "e.g. Measure the final prototype and check it fits."
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: handleAdd,
    disabled: busy || !requirement.trim()
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Check",
    size: 16
  }), " ", busy ? "Adding..." : "Add this point"));
}

/* ------------------------------------------------------------------ */
/* SPEC WIZARD - one category at a time                                */
/* ------------------------------------------------------------------ */

function SpecWizard({
  project,
  onPointsChanged,
  onGoToReview,
  onGoToSummary,
  onBack
}) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [points, setPoints] = useState(project.points || []);
  const category = SPEC_CATEGORIES[categoryIndex];
  const pointsInCategory = points.filter(p => p.category === category.key);
  async function handleAdd(payload) {
    const created = await apiPost(`/api/specs/${project.id}/points`, payload);
    const next = [...points, created];
    setPoints(next);
    onPointsChanged(next);
  }
  async function handleRemove(point) {
    if (!window.confirm("Remove this specification point?")) return;
    try {
      await apiDelete(`/api/specs/${project.id}/points/${point.id}`);
      const next = points.filter(p => p.id !== point.id);
      setPoints(next);
      onPointsChanged(next);
    } catch (e) {/* ignore */}
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spec-context-banner no-print"
  }, /*#__PURE__*/React.createElement("span", {
    className: "spec-context-name"
  }, project.projectName), project.intendedUser && /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "For: ", project.intendedUser)), /*#__PURE__*/React.createElement("div", {
    className: "spec-wizard-progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quiz-history-label"
  }, "Category ", categoryIndex + 1, " of ", SPEC_CATEGORIES.length), /*#__PURE__*/React.createElement("div", {
    className: "quiz-progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${(categoryIndex + 1) / SPEC_CATEGORIES.length * 100}%`,
      background: "var(--blue)"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "spec-category-head"
  }, /*#__PURE__*/React.createElement(LetterBadge, {
    letter: category.label[0],
    tint: "var(--blue)",
    size: 40
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      marginBottom: 2
    }
  }, category.label), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, category.question))), /*#__PURE__*/React.createElement("div", {
    className: "spec-help-block"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "Things to think about"), /*#__PURE__*/React.createElement("ul", {
    className: "spec-prompt-list"
  }, category.prompts.map((p, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, p))), /*#__PURE__*/React.createElement("div", {
    className: "spec-example"
  }, /*#__PURE__*/React.createElement("span", {
    className: "spec-example-weak"
  }, /*#__PURE__*/React.createElement("strong", null, "Weak:"), " ", category.example.weak), /*#__PURE__*/React.createElement("span", {
    className: "spec-example-better"
  }, /*#__PURE__*/React.createElement("strong", null, "Better:"), " ", category.example.better))), pointsInCategory.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "spec-added-points"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "Added to ", category.label, " so far"), pointsInCategory.map(p => /*#__PURE__*/React.createElement("div", {
    className: "spec-added-point",
    key: p.id
  }, /*#__PURE__*/React.createElement("span", null, p.requirement), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "saved-row-delete",
    onClick: () => handleRemove(p),
    "aria-label": "Remove"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Trash2",
    size: 13
  }))))), /*#__PURE__*/React.createElement(SpecPointForm, {
    category: category,
    onAdd: handleAdd
  }), /*#__PURE__*/React.createElement("div", {
    className: "quiz-nav-row",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: () => setCategoryIndex(i => Math.max(0, i - 1)),
    disabled: categoryIndex === 0
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16,
    style: {
      transform: "rotate(180deg)"
    }
  }), " Previous"), categoryIndex + 1 < SPEC_CATEGORIES.length ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: () => setCategoryIndex(i => i + 1)
  }, "Next category ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  })) : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onGoToSummary
  }, "Write my summary ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "spec-wizard-footer no-print"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: onGoToReview
  }, "Skip to review"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: onBack
  }, "Save and exit")));
}

/* ------------------------------------------------------------------ */
/* SPEC SUMMARY - editable written-prose draft, generated from points   */
/* ------------------------------------------------------------------ */

function SpecSummary({
  project,
  points,
  onSaved,
  onContinue,
  onBack
}) {
  const [text, setText] = useState(project.summaryText || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const hasGenerated = useRef(false);
  useEffect(() => {
    if (!project.summaryText && !hasGenerated.current) {
      hasGenerated.current = true;
      setText(generateSpecSummaryDraft(project, points));
    }
  }, []);
  function handleRegenerate() {
    if (text.trim() && !window.confirm("Replace your current text with a fresh draft from your points? This can't be undone.")) return;
    setText(generateSpecSummaryDraft(project, points));
    setSaved(false);
  }
  async function handleSave() {
    setSaving(true);
    try {
      const updated = await apiPut(`/api/specs/${project.id}/summary`, {
        summaryText: text
      });
      onSaved(updated);
      setSaved(true);
    } catch (e) {/* ignore */}
    setSaving(false);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Write your summary"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "This draft is put together automatically from the points you've written \u2014 it's a starting point, not a finished specification. Read it through and rewrite it in your own words before you're done.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: handleRegenerate
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "RotateCcw",
    size: 15
  }), " Regenerate from my points")), /*#__PURE__*/React.createElement("textarea", {
    className: "spec-summary-textarea",
    rows: 16,
    value: text,
    onChange: e => {
      setText(e.target.value);
      setSaved(false);
    },
    placeholder: "Your written specification summary will appear here once you've added some points."
  }), /*#__PURE__*/React.createElement("div", {
    className: "qb-save-row",
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: handleSave,
    disabled: saving
  }, saving ? "Saving..." : "Save summary"), saved && /*#__PURE__*/React.createElement("span", {
    className: "change-password-success"
  }, "Saved \u2713"), onContinue && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: onContinue
  }, "Continue to review ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: onBack
  }, "Back")));
}

/* ------------------------------------------------------------------ */
/* SPEC POINT ROW (review screen) - edit / delete / move / recategorise */
/* ------------------------------------------------------------------ */

function SpecPointRow({
  point,
  index,
  onUpdated,
  onDeleted,
  onMove
}) {
  const [editing, setEditing] = useState(false);
  const [requirement, setRequirement] = useState(point.requirement);
  const [reason, setReason] = useState(point.reason);
  const [testingMethod, setTestingMethod] = useState(point.testingMethod);
  const [category, setCategory] = useState(point.category);
  const [saving, setSaving] = useState(false);
  async function handleSave() {
    setSaving(true);
    try {
      const updated = await apiPut(`/api/specs/${point.projectId}/points/${point.id}`, {
        requirement,
        reason,
        testingMethod,
        category
      });
      onUpdated(updated);
      setEditing(false);
    } catch (e) {/* ignore */}
    setSaving(false);
  }
  async function handleDelete() {
    if (!window.confirm("Delete this specification point?")) return;
    try {
      await apiDelete(`/api/specs/${point.projectId}/points/${point.id}`);
      onDeleted(point.id);
    } catch (e) {/* ignore */}
  }
  if (editing) {
    return /*#__PURE__*/React.createElement("div", {
      className: "spec-point-card editing"
    }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
      className: "spec-field-label requirement"
    }, "Requirement"), /*#__PURE__*/React.createElement("textarea", {
      rows: 2,
      value: requirement,
      onChange: e => setRequirement(e.target.value)
    })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
      className: "spec-field-label reason"
    }, "Reason"), /*#__PURE__*/React.createElement("textarea", {
      rows: 2,
      value: reason,
      onChange: e => setReason(e.target.value)
    })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
      className: "spec-field-label testing"
    }, "Testing"), /*#__PURE__*/React.createElement("textarea", {
      rows: 2,
      value: testingMethod,
      onChange: e => setTestingMethod(e.target.value)
    })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
      className: "spec-field-label"
    }, "Category"), /*#__PURE__*/React.createElement("select", {
      value: category,
      onChange: e => setCategory(e.target.value)
    }, SPEC_CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
      key: c.key,
      value: c.key
    }, c.label)))), /*#__PURE__*/React.createElement("div", {
      className: "qb-save-row"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-primary",
      onClick: handleSave,
      disabled: saving
    }, saving ? "Saving..." : "Save"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-text",
      onClick: () => setEditing(false)
    }, "Cancel")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "spec-point-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spec-point-number"
  }, index + 1), /*#__PURE__*/React.createElement("div", {
    className: "spec-point-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "spec-point-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "spec-field-label requirement"
  }, "Requirement"), " ", point.requirement), point.reason && /*#__PURE__*/React.createElement("p", {
    className: "spec-point-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "spec-field-label reason"
  }, "Reason"), " ", point.reason), point.testingMethod && /*#__PURE__*/React.createElement("p", {
    className: "spec-point-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "spec-field-label testing"
  }, "Testing"), " ", point.testingMethod)), /*#__PURE__*/React.createElement("div", {
    className: "spec-point-actions no-print"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "icon-btn",
    title: "Move up",
    onClick: () => onMove(point, "up")
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronDown",
    size: 14,
    style: {
      transform: "rotate(180deg)"
    }
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "icon-btn",
    title: "Move down",
    onClick: () => onMove(point, "down")
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronDown",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "icon-btn",
    title: "Edit",
    onClick: () => setEditing(true)
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "PenLine",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "icon-btn danger",
    title: "Delete",
    onClick: handleDelete
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Trash2",
    size: 14
  }))));
}

/* ------------------------------------------------------------------ */
/* SPEC REVIEW                                                          */
/* ------------------------------------------------------------------ */

function SpecReview({
  project,
  onProjectUpdated,
  onEditDetails,
  onAddMore,
  onGoToSummary,
  onBack,
  onExport
}) {
  const [points, setPoints] = useState(project.points || []);
  const [saveState, setSaveState] = useState("idle");
  function reload() {
    apiGet(`/api/specs/${project.id}`).then(full => {
      setPoints(full.points);
      onProjectUpdated(full);
    }).catch(() => {});
  }
  async function handleMove(point, direction) {
    try {
      await apiPost(`/api/specs/${project.id}/points/${point.id}/move`, {
        direction
      });
      reload();
    } catch (e) {/* ignore */}
  }
  function handlePointUpdated(updated) {
    setPoints(ps => ps.map(p => p.id === updated.id ? updated : p));
  }
  function handlePointDeleted(id) {
    setPoints(ps => ps.filter(p => p.id !== id));
  }
  async function handleHandIn() {
    if (!window.confirm("Hand in this specification? Your teacher will be able to see it and give feedback. You can still make changes afterwards if needed.")) return;
    setSaveState("saving");
    try {
      const updated = await apiPost(`/api/specs/${project.id}/hand-in`);
      onProjectUpdated(updated);
      setSaveState("saved");
    } catch (e) {
      setSaveState("error");
    }
  }
  const strength = specStrength(points);
  const grouped = SPEC_CATEGORIES.map(c => ({
    category: c,
    items: points.filter(p => p.category === c.key).sort((a, b) => a.order - b.order)
  })).filter(g => g.items.length > 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head no-print"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Design Specification"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Review, edit and organise your points before you hand it in.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: onEditDetails
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "PenLine",
    size: 14
  }), " Edit project details")), /*#__PURE__*/React.createElement("div", {
    className: "spec-context-banner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "spec-context-name"
  }, project.projectName), project.designProblem && /*#__PURE__*/React.createElement("p", {
    className: "sub",
    style: {
      margin: "4px 0 0 0"
    }
  }, project.designProblem), project.intendedUser && /*#__PURE__*/React.createElement("p", {
    className: "sub",
    style: {
      margin: "2px 0 0 0"
    }
  }, "For: ", project.intendedUser), /*#__PURE__*/React.createElement("span", {
    className: "status-pill" + (project.status === "submitted" ? " submitted" : " draft"),
    style: {
      marginTop: 8
    }
  }, project.status === "submitted" ? "Handed in" : "Draft")), project.feedback && /*#__PURE__*/React.createElement("div", {
    className: "worksheet-feedback-callout no-print"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Lightbulb",
    size: 16,
    style: {
      color: "#B25E00"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "worksheet-feedback-label"
  }, "Feedback from your teacher"), /*#__PURE__*/React.createElement("p", null, project.feedback))), /*#__PURE__*/React.createElement("div", {
    className: "spec-strength no-print"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "Specification strength (guidance, not a checklist)"), /*#__PURE__*/React.createElement("div", {
    className: "spec-strength-grid"
  }, strength.map(s => /*#__PURE__*/React.createElement("span", {
    key: s.key,
    className: "spec-strength-item " + s.status
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: s.status === "strong" ? "Check" : s.status === "partial" ? "Lightbulb" : "X",
    size: 12
  }), s.label)))), grouped.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "No specification points yet \u2014 add some from the wizard."), grouped.map(g => /*#__PURE__*/React.createElement("div", {
    className: "spec-review-group",
    key: g.category.key
  }, /*#__PURE__*/React.createElement("h3", {
    className: "spec-review-group-title"
  }, g.category.label), g.items.map((p, i) => /*#__PURE__*/React.createElement(SpecPointRow, {
    key: p.id,
    point: p,
    index: i,
    onUpdated: handlePointUpdated,
    onDeleted: handlePointDeleted,
    onMove: handleMove
  })))), /*#__PURE__*/React.createElement("div", {
    className: "quiz-result-actions no-print",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: onAddMore
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "PenLine",
    size: 16
  }), " Add more points"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: onGoToSummary
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ClipboardList",
    size: 16
  }), " Write-up / summary"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: handleHandIn,
    disabled: saveState === "saving"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Check",
    size: 16
  }), " ", project.status === "submitted" ? "Update hand-in" : "Hand in"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: onExport
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "FileDown",
    size: 16
  }), " View / print"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: onBack
  }, "Back to my specifications")));
}

/* ------------------------------------------------------------------ */
/* SPEC EXPORT / PRINT VIEW                                             */
/* ------------------------------------------------------------------ */

function SpecExportView({
  project,
  points,
  onBack
}) {
  const grouped = SPEC_CATEGORIES.map(c => ({
    category: c,
    items: points.filter(p => p.category === c.key).sort((a, b) => a.order - b.order)
  })).filter(g => g.items.length > 0);
  let n = 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content spec-export"
  }, /*#__PURE__*/React.createElement("div", {
    className: "worksheet-actions no-print",
    style: {
      padding: 0,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: () => window.print()
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Printer",
    size: 16
  }), " Print / save as PDF"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: onBack
  }, "Back to review")), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 26
    }
  }, "Design Specification"), /*#__PURE__*/React.createElement("p", {
    className: "spec-export-meta"
  }, /*#__PURE__*/React.createElement("strong", null, "Project:"), " ", project.projectName), project.intendedUser && /*#__PURE__*/React.createElement("p", {
    className: "spec-export-meta"
  }, /*#__PURE__*/React.createElement("strong", null, "User:"), " ", project.intendedUser), project.designProblem && /*#__PURE__*/React.createElement("p", {
    className: "spec-export-meta"
  }, /*#__PURE__*/React.createElement("strong", null, "Design problem:"), " ", project.designProblem), project.summaryText && /*#__PURE__*/React.createElement("div", {
    className: "spec-export-summary"
  }, /*#__PURE__*/React.createElement("h3", null, "Summary"), project.summaryText.split("\n\n").map((para, i) => /*#__PURE__*/React.createElement("p", {
    key: i
  }, para))), grouped.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.category.key,
    className: "spec-export-group"
  }, /*#__PURE__*/React.createElement("h3", null, g.category.label), g.items.map(p => {
    n++;
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "spec-export-point"
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, n, ". ", p.requirement)), p.reason && /*#__PURE__*/React.createElement("p", {
      className: "spec-export-sub"
    }, "Reason: ", p.reason), p.testingMethod && /*#__PURE__*/React.createElement("p", {
      className: "spec-export-sub"
    }, "Test: ", p.testingMethod));
  }))));
}

/* ------------------------------------------------------------------ */
/* SPEC BUILDER TOOL - orchestrates the views above                    */
/* ------------------------------------------------------------------ */

function SpecBuilderTool({
  user,
  onBack
}) {
  const [view, setView] = useState("list"); // list | setup | wizard | summary | review | export
  const [project, setProject] = useState(null);
  async function openProject(id) {
    try {
      const full = await apiGet(`/api/specs/${id}`);
      setProject(full);
      setView("review");
    } catch (e) {/* ignore */}
  }
  function handleCreated(newProject) {
    setProject({
      ...newProject,
      points: []
    });
    setView("wizard");
  }
  function handleSetupSaved(updated) {
    setProject(p => p ? {
      ...p,
      ...updated
    } : updated);
    setView(project && project.points ? "review" : "wizard");
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "tool-subheader no-print"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text back-btn",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 15,
    style: {
      transform: "rotate(180deg)"
    }
  }), " All tools")), view === "list" && /*#__PURE__*/React.createElement(SpecList, {
    onOpen: openProject,
    onCreate: () => {
      setProject(null);
      setView("setup");
    }
  }), view === "setup" && /*#__PURE__*/React.createElement(SpecSetup, {
    existing: project,
    onSaved: project ? handleSetupSaved : handleCreated,
    onCancel: () => setView(project ? "review" : "list")
  }), view === "wizard" && project && /*#__PURE__*/React.createElement(SpecWizard, {
    project: project,
    onPointsChanged: points => setProject(p => ({
      ...p,
      points
    })),
    onGoToReview: () => setView("review"),
    onGoToSummary: () => setView("summary"),
    onBack: () => setView("list")
  }), view === "summary" && project && /*#__PURE__*/React.createElement(SpecSummary, {
    project: project,
    points: project.points || [],
    onSaved: updated => setProject(p => ({
      ...p,
      ...updated
    })),
    onContinue: () => setView("review"),
    onBack: () => setView("review")
  }), view === "review" && project && /*#__PURE__*/React.createElement(SpecReview, {
    project: project,
    onProjectUpdated: updated => setProject(p => ({
      ...p,
      ...updated
    })),
    onEditDetails: () => setView("setup"),
    onAddMore: () => setView("wizard"),
    onGoToSummary: () => setView("summary"),
    onBack: () => setView("list"),
    onExport: () => setView("export")
  }), view === "export" && project && /*#__PURE__*/React.createElement(SpecExportView, {
    project: project,
    points: project.points || [],
    onBack: () => setView("review")
  }));
}

/* ===== dtf.jsx ===== */
function DTFStagePill({
  stage
}) {
  if (!stage) return /*#__PURE__*/React.createElement("span", {
    className: "status-pill draft"
  }, "Not enough evidence yet");
  const info = DT_STAGE_INFO[stage];
  return /*#__PURE__*/React.createElement("span", {
    className: "dtf-stage-pill",
    style: {
      background: info.tint + "22",
      color: info.tint
    }
  }, info.label);
}

// Only Section 1 has a real flow built so far; sections without one just
// show no progress bar (nothing to measure yet) rather than a fake 0%.
function getSectionFlowLength(sectionKey) {
  if (sectionKey === "s1") return buildSectionFlow(U1S1_META, U1S1_CARDS).length;
  return null;
}
function sectionProgressPercent(sectionKey, progressRow) {
  const flowLength = getSectionFlowLength(sectionKey);
  if (!flowLength || flowLength <= 1) return null;
  if (!progressRow) return 0;
  const stepIndex = progressRow.sessionState && typeof progressRow.sessionState.stepIndex === "number" ? progressRow.sessionState.stepIndex : 0;
  return Math.min(100, Math.round(stepIndex / (flowLength - 1) * 100));
}
function DTFDashboard({
  sections,
  onOpenSection
}) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiGet("/api/dtf/progress").then(setProgress).catch(() => {}).finally(() => setLoading(false));
  }, []);
  const byKey = {};
  progress.forEach(p => {
    byKey[p.sectionKey] = p;
  });
  const completedCount = sections.filter(s => byKey[s.key] && byKey[s.key].completedAt).length;
  const coursePct = sections.length ? Math.round(completedCount / sections.length * 100) : 0;
  const scored = progress.filter(p => p.knowledgeScore !== null && p.knowledgeScore !== undefined);
  const knowledgeConfidence = scored.length ? Math.round(scored.reduce((sum, p) => sum + p.knowledgeScore, 0) / scored.length) : null;
  const stagedSections = progress.filter(p => p.confirmedStage || p.suggestedStage);
  let currentStage = null;
  if (stagedSections.length) {
    const counts = {};
    stagedSections.forEach(p => {
      const s = p.confirmedStage || p.suggestedStage;
      counts[s] = (counts[s] || 0) + 1;
    });
    currentStage = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Discovering Design"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Big Question: How do designers discover the right problem to solve?"))), loading && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Loading..."), !loading && /*#__PURE__*/React.createElement("div", {
    className: "dtf-summary-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dtf-summary-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "Course progress"), /*#__PURE__*/React.createElement("span", {
    className: "dtf-summary-value"
  }, coursePct, "%")), /*#__PURE__*/React.createElement("div", {
    className: "dtf-summary-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "Knowledge confidence"), /*#__PURE__*/React.createElement("span", {
    className: "dtf-summary-value"
  }, knowledgeConfidence !== null ? `${knowledgeConfidence}%` : "\u2014")), /*#__PURE__*/React.createElement("div", {
    className: "dtf-summary-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "Current DT stage"), /*#__PURE__*/React.createElement(DTFStagePill, {
    stage: currentStage
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dtf-section-list"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "Sections"), sections.map(s => {
    const p = byKey[s.key];
    const available = !!s.available;
    const percent = available ? sectionProgressPercent(s.key, p) : null;
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: s.key,
      className: "dtf-section-row" + (available ? " clickable" : " disabled"),
      onClick: () => available && onOpenSection(s.key),
      disabled: !available
    }, /*#__PURE__*/React.createElement("div", {
      className: "dtf-section-row-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dtf-section-name"
    }, s.number, ". ", s.title, !available && /*#__PURE__*/React.createElement("span", {
      className: "status-pill draft",
      style: {
        marginLeft: 8
      }
    }, "Coming soon")), /*#__PURE__*/React.createElement(DTFStagePill, {
      stage: p ? p.confirmedStage || p.suggestedStage : null
    })), percent !== null && /*#__PURE__*/React.createElement("div", {
      className: "dtf-section-progress-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "quiz-progress-bar dtf-section-progress-bar"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${percent}%`,
        background: percent >= 100 ? "var(--green)" : "var(--blue)"
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, percent, "%")));
  })));
}
const UNIT_1_SECTIONS = [{
  key: "s1",
  number: "01",
  title: "Problem Before Product",
  available: true
}, {
  key: "s2",
  number: "02",
  title: "People Before Products"
}, {
  key: "s3",
  number: "03",
  title: "Needs Before Nice-to-Haves"
}, {
  key: "s4",
  number: "04",
  title: "Profiling People"
}, {
  key: "s5",
  number: "05",
  title: "Research Before Response"
}, {
  key: "s6",
  number: "06",
  title: "Question, Query, Qualify"
}, {
  key: "s7",
  number: "07",
  title: "Surveys Seek Scale"
}, {
  key: "s8",
  number: "08",
  title: "Watch, Wonder, Work It Out"
}, {
  key: "s9",
  number: "09",
  title: "Measure Before Making"
}, {
  key: "s10",
  number: "10",
  title: "Products Provide Proof"
}, {
  key: "s11",
  number: "11",
  title: "Analyse, Don't Imitate"
}, {
  key: "s12",
  number: "12",
  title: "Discuss, Debate, Decide"
}, {
  key: "s13",
  number: "13",
  title: "Culture Changes Context"
}, {
  key: "s14",
  number: "14",
  title: "Evidence Before Decisions"
}, {
  key: "s15",
  number: "15",
  title: "Brief Before Build"
}, {
  key: "s16",
  number: "16",
  title: "Limits Lead Design"
}, {
  key: "s17",
  number: "17",
  title: "Specific Before Successful"
}];

/* ------------------------------------------------------------------ */
/* TOUCHPOINT RENDERERS (the interactive moments inside a section)      */
/* ------------------------------------------------------------------ */

function saveTouchpointResponse(sectionKey, kind, text) {
  if (!text || !text.trim()) return;
  apiPost(`/api/dtf/responses/U1-${sectionKey.toUpperCase()}-TP-${kind}`, {
    text
  }).catch(() => {});
}
function TP_PausePredict({
  card,
  sectionKey,
  onContinue
}) {
  const [text, setText] = useState("");
  return /*#__PURE__*/React.createElement("div", {
    className: "dtf-touchpoint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-touchpoint-label"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Lightbulb",
    size: 14
  }), " ", card.heading), /*#__PURE__*/React.createElement("p", {
    className: "dtf-touchpoint-prompt"
  }, card.prompt), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: text,
    onChange: e => setText(e.target.value),
    placeholder: "Type what you're thinking..."
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: () => {
      saveTouchpointResponse(sectionKey, "pause_predict", text);
      onContinue();
    }
  }, "Continue ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  })));
}
function TP_WhichIsStronger({
  card,
  onContinue
}) {
  const [picked, setPicked] = useState(null);
  const isCorrect = picked === card.correct;
  return /*#__PURE__*/React.createElement("div", {
    className: "dtf-touchpoint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-touchpoint-label"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ArrowLeftRight",
    size: 14
  }), " ", card.heading), /*#__PURE__*/React.createElement("p", {
    className: "dtf-touchpoint-prompt"
  }, card.prompt), /*#__PURE__*/React.createElement("div", {
    className: "dtf-choice-grid"
  }, ["a", "b"].map(key => /*#__PURE__*/React.createElement("button", {
    key: key,
    type: "button",
    className: "dtf-choice-card" + (picked === key ? isCorrect ? " correct" : " wrong" : ""),
    onClick: () => !picked && setPicked(key),
    disabled: !!picked
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-choice-letter"
  }, key.toUpperCase()), /*#__PURE__*/React.createElement("span", null, key === "a" ? card.optionA : card.optionB)))), picked && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dtf-feedback" + (isCorrect ? " correct" : "")
  }, isCorrect ? card.feedbackCorrect : card.feedbackIncorrect), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onContinue
  }, "Continue ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))));
}
function TP_QuickCheck({
  card,
  onContinue
}) {
  const [picked, setPicked] = useState(null);
  const options = useMemo(() => shuffle(card.options), [card]);
  return /*#__PURE__*/React.createElement("div", {
    className: "dtf-touchpoint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-touchpoint-label"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Check",
    size: 14
  }), " ", card.heading), /*#__PURE__*/React.createElement("p", {
    className: "dtf-touchpoint-prompt"
  }, card.prompt), /*#__PURE__*/React.createElement("div", {
    className: "quiz-options"
  }, options.map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt,
    className: "quiz-option" + (picked === opt ? opt === card.correct ? " correct" : " wrong" : ""),
    onClick: () => !picked && setPicked(opt),
    disabled: !!picked
  }, /*#__PURE__*/React.createElement("span", null, opt)))), picked && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dtf-feedback correct"
  }, card.feedback), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onContinue
  }, "Continue ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))));
}
function TP_StopSort({
  card,
  onContinue
}) {
  const [answers, setAnswers] = useState({});
  const allDone = card.items.every((_, i) => answers[i] !== undefined);
  function pick(i, val) {
    if (answers[i] !== undefined) return;
    setAnswers(a => ({
      ...a,
      [i]: val
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "dtf-touchpoint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-touchpoint-label"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "SlidersHorizontal",
    size: 14
  }), " ", card.heading), /*#__PURE__*/React.createElement("p", {
    className: "dtf-touchpoint-prompt"
  }, card.prompt), /*#__PURE__*/React.createElement("div", {
    className: "dtf-sort-list"
  }, card.items.map((item, i) => /*#__PURE__*/React.createElement("div", {
    className: "dtf-sort-row",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-sort-text"
  }, item.text), /*#__PURE__*/React.createElement("div", {
    className: "dtf-sort-buttons"
  }, ["problem", "solution"].map(val => /*#__PURE__*/React.createElement("button", {
    key: val,
    type: "button",
    className: "chip" + (answers[i] === val ? val === item.answer ? " active-correct" : " active-wrong" : ""),
    onClick: () => pick(i, val),
    disabled: answers[i] !== undefined
  }, val === "problem" ? "Problem" : "Solution")))))), allDone && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onContinue
  }, "Continue ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  })));
}
function TP_ProblemNeedOpportunity({
  card,
  onContinue
}) {
  const [answers, setAnswers] = useState({});
  const allDone = card.items.every((_, i) => answers[i] !== undefined);
  function pick(i, val) {
    if (answers[i] !== undefined) return;
    setAnswers(a => ({
      ...a,
      [i]: val
    }));
  }
  const labels = {
    problem: "Problem",
    need: "Need",
    opportunity: "Opportunity"
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "dtf-touchpoint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-touchpoint-label"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "SlidersHorizontal",
    size: 14
  }), " ", card.heading), /*#__PURE__*/React.createElement("p", {
    className: "dtf-touchpoint-prompt"
  }, card.prompt), /*#__PURE__*/React.createElement("div", {
    className: "dtf-sort-list"
  }, card.items.map((item, i) => /*#__PURE__*/React.createElement("div", {
    className: "dtf-sort-row",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-sort-text"
  }, item.text), /*#__PURE__*/React.createElement("div", {
    className: "dtf-sort-buttons"
  }, ["problem", "need", "opportunity"].map(val => /*#__PURE__*/React.createElement("button", {
    key: val,
    type: "button",
    className: "chip" + (answers[i] === val ? val === item.answer ? " active-correct" : " active-wrong" : ""),
    onClick: () => pick(i, val),
    disabled: answers[i] !== undefined
  }, labels[val])))))), allDone && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onContinue
  }, "Continue ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  })));
}
function TP_RevealExplanation({
  card,
  sectionKey,
  onContinue
}) {
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "dtf-touchpoint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-touchpoint-label"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Search",
    size: 14
  }), " ", card.heading), /*#__PURE__*/React.createElement("p", {
    className: "dtf-touchpoint-prompt",
    style: {
      whiteSpace: "pre-line"
    }
  }, card.prompt), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: text,
    onChange: e => setText(e.target.value),
    placeholder: "Have a go first...",
    disabled: revealed
  }), !revealed && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: () => {
      saveTouchpointResponse(sectionKey, card.id, text);
      setRevealed(true);
    },
    disabled: !text.trim()
  }, "Check my thinking"), revealed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dtf-feedback correct"
  }, card.modelExplanation), card.improvedVersion && /*#__PURE__*/React.createElement("div", {
    className: "dtf-improved-version"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "Improved version"), /*#__PURE__*/React.createElement("p", null, card.improvedVersion)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onContinue
  }, "Continue ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))));
}
function TP_ThinkTryTest({
  card,
  sectionKey,
  onContinue
}) {
  const [values, setValues] = useState({});
  const [revealed, setRevealed] = useState(false);
  const allFilled = card.parts.every(p => (values[p.key] || "").trim());
  return /*#__PURE__*/React.createElement("div", {
    className: "dtf-touchpoint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-touchpoint-label"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Wrench",
    size: 14
  }), " ", card.heading), /*#__PURE__*/React.createElement("p", {
    className: "dtf-touchpoint-prompt"
  }, card.scenario), card.parts.map(p => /*#__PURE__*/React.createElement("label", {
    key: p.key,
    className: "dtf-ttt-part"
  }, /*#__PURE__*/React.createElement("span", {
    className: "spec-field-label requirement"
  }, p.label), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: values[p.key] || "",
    onChange: e => setValues(v => ({
      ...v,
      [p.key]: e.target.value
    })),
    placeholder: p.placeholder,
    disabled: revealed
  }))), !revealed && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: () => {
      saveTouchpointResponse(sectionKey, "think_try_test", Object.values(values).join("\n\n"));
      setRevealed(true);
    },
    disabled: !allFilled
  }, "Check my thinking"), revealed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dtf-feedback correct"
  }, card.teacherGuidance), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onContinue
  }, "Continue ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))));
}
function TP_DecideDefend({
  card,
  sectionKey,
  onContinue
}) {
  const [picked, setPicked] = useState(null);
  const [why, setWhy] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = picked === card.correct;
  return /*#__PURE__*/React.createElement("div", {
    className: "dtf-touchpoint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-touchpoint-label"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "GitMerge",
    size: 14
  }), " ", card.heading), /*#__PURE__*/React.createElement("p", {
    className: "dtf-touchpoint-prompt"
  }, card.scenario), /*#__PURE__*/React.createElement("div", {
    className: "dtf-choice-grid"
  }, ["a", "b"].map(key => {
    const opt = key === "a" ? card.optionA : card.optionB;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      type: "button",
      className: "dtf-choice-card" + (picked === key ? key === card.correct ? " correct" : " wrong" : ""),
      onClick: () => !picked && setPicked(key),
      disabled: !!picked
    }, /*#__PURE__*/React.createElement("span", {
      className: "dtf-choice-letter"
    }, opt.label), /*#__PURE__*/React.createElement("span", null, opt.text));
  })), picked && !submitted && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", {
    className: "spec-field-label requirement"
  }, card.prompt), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: why,
    onChange: e => setWhy(e.target.value),
    placeholder: "Explain your thinking..."
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: () => {
      saveTouchpointResponse(sectionKey, "decide_defend", why);
      setSubmitted(true);
    },
    disabled: !why.trim()
  }, "Check my thinking")), submitted && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dtf-feedback" + (isCorrect ? " correct" : "")
  }, card.modelResponse), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onContinue
  }, "Continue ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))));
}
const TOUCHPOINT_RENDERERS = {
  pause_predict: TP_PausePredict,
  which_is_stronger: TP_WhichIsStronger,
  quick_check: TP_QuickCheck,
  stop_sort: TP_StopSort,
  problem_need_opportunity: TP_ProblemNeedOpportunity,
  spot_hidden_solution: TP_RevealExplanation,
  spot_the_problem: TP_RevealExplanation,
  think_try_test: TP_ThinkTryTest,
  decide_defend: TP_DecideDefend
};

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* MID-FLOW KNOWLEDGE CHECK - 3-5 questions on material taught so far   */
/* Pulled from Remember & Recognise + Explain & Examine only, since     */
/* Apply/Decide/Challenge questions test things not yet covered by the  */
/* point this step appears at in the flow.                              */
/* ------------------------------------------------------------------ */

function pickKnowledgeCheckQuestions(bank) {
  const byCat = {
    R: [],
    E: []
  };
  bank.forEach(q => {
    if (byCat[q.category]) byCat[q.category].push(q);
  });

  // Randomise the total (4-5) and the R/E split each time, rather than a
  // fixed 3+2 every single time - guarantee at least one of each so it
  // never accidentally becomes all-recall or all-explain.
  const total = 4 + Math.floor(Math.random() * 2); // 4 or 5
  const remaining = total - 2;
  const extraR = Math.floor(Math.random() * (remaining + 1));
  const rCount = Math.min(1 + extraR, byCat.R.length);
  const eCount = Math.min(total - rCount, byCat.E.length);
  const picked = [...shuffle(byCat.R).slice(0, rCount), ...shuffle(byCat.E).slice(0, eCount)];
  return shuffle(picked);
}
const OPEN_TYPES = ["short_response", "extended_response", "improve_it", "decide_defend_short"];
function DTFQuestionRenderer({
  question,
  response,
  onRespond
}) {
  const [text, setText] = useState(response ? response.text : "");
  const [picked, setPicked] = useState(response ? response.picked : null);
  const mcqOptions = useMemo(() => question.type === "mcq" ? shuffle(question.options) : null, [question]);
  function submitObjective(answer, isCorrect) {
    onRespond({
      picked: answer,
      isCorrect,
      text: ""
    });
  }
  function submitOpen() {
    const suggestion = suggestDTStage(text, question);
    onRespond({
      text,
      picked: null,
      isCorrect: null,
      suggestion
    });
    apiPost(`/api/dtf/responses/${question.qid}`, {
      text,
      suggestedStage: suggestion.stage,
      stageReasoning: suggestion.reasoning
    }).catch(() => {});
  }
  if (response) {
    return /*#__PURE__*/React.createElement("div", {
      className: "dtf-answered"
    }, question.type === "mcq" && /*#__PURE__*/React.createElement("p", {
      className: "dtf-feedback" + (response.isCorrect ? " correct" : "")
    }, "You answered: ", response.picked, !response.isCorrect && /*#__PURE__*/React.createElement(React.Fragment, null, " \u2014 correct answer: ", question.correctAnswer)), question.type === "true_false" && /*#__PURE__*/React.createElement("p", {
      className: "dtf-feedback" + (response.isCorrect ? " correct" : "")
    }, question.feedback), question.type === "fill_gap" && /*#__PURE__*/React.createElement("p", {
      className: "dtf-feedback" + (response.isCorrect ? " correct" : "")
    }, question.feedback), OPEN_TYPES.includes(question.type) && response.suggestion && /*#__PURE__*/React.createElement("div", {
      className: "dtf-stage-suggestion"
    }, /*#__PURE__*/React.createElement(DTFStagePill, {
      stage: response.suggestion.stage
    }), /*#__PURE__*/React.createElement("p", {
      className: "sub"
    }, stageNextStepFeedback(response.suggestion.stage))));
  }
  if (question.type === "mcq") {
    return /*#__PURE__*/React.createElement("div", {
      className: "quiz-options"
    }, mcqOptions.map(opt => /*#__PURE__*/React.createElement("button", {
      key: opt,
      className: "quiz-option",
      onClick: () => submitObjective(opt, opt === question.correctAnswer)
    }, opt)));
  }
  if (question.type === "true_false") {
    return /*#__PURE__*/React.createElement("div", {
      className: "quiz-options"
    }, ["True", "False"].map(opt => /*#__PURE__*/React.createElement("button", {
      key: opt,
      className: "quiz-option",
      onClick: () => submitObjective(opt, opt === question.correctAnswer)
    }, opt)));
  }
  if (question.type === "fill_gap") {
    return /*#__PURE__*/React.createElement("div", {
      className: "dtf-fillgap"
    }, /*#__PURE__*/React.createElement("input", {
      value: text,
      onChange: e => setText(e.target.value),
      placeholder: "Type your answer..."
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-primary",
      onClick: () => {
        const isCorrect = question.acceptedAnswers.some(a => a.toLowerCase().replace(/\s+/g, "") === text.toLowerCase().replace(/\s+/g, ""));
        onRespond({
          picked: text,
          isCorrect,
          text
        });
      }
    }, "Submit"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "dtf-open-response"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: text,
    onChange: e => setText(e.target.value),
    placeholder: "Type your answer..."
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: submitOpen,
    disabled: !text.trim()
  }, "Submit"));
}
function DTFKnowledgeCheckStep({
  meta,
  bank,
  onEvidence,
  onContinue
}) {
  const [questions] = useState(() => pickKnowledgeCheckQuestions(bank));
  const [responses, setResponses] = useState({});
  const startTimeRef = useRef(Date.now());
  const allAnswered = questions.every(q => responses[q.qid]);
  const [submitted, setSubmitted] = useState(false);
  function respond(qid, r) {
    setResponses(rs => ({
      ...rs,
      [qid]: r
    }));
  }
  async function finish() {
    const objective = questions.filter(q => !OPEN_TYPES.includes(q.type));
    const score = objective.filter(q => responses[q.qid] && responses[q.qid].isCorrect).length;
    const details = questions.map(q => ({
      qid: q.qid,
      prompt: q.prompt,
      studentAnswer: responses[q.qid] ? responses[q.qid].text || responses[q.qid].picked : "",
      correctAnswer: q.correctAnswer || null,
      isCorrect: responses[q.qid] ? responses[q.qid].isCorrect : null
    }));
    const openStages = questions.filter(q => OPEN_TYPES.includes(q.type)).map(q => responses[q.qid] && responses[q.qid].suggestion && responses[q.qid].suggestion.stage).filter(Boolean);
    try {
      await apiPost("/api/dtf/attempts", {
        unitKey: meta.unitKey,
        sectionKey: meta.sectionKey,
        attemptType: "micro",
        score,
        total: objective.length || 1,
        details,
        durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000)
      });
    } catch (e) {/* ignore */}
    onEvidence(openStages);
    setSubmitted(true);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Knowledge Check"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "A quick check on what you've just learned \u2014 nothing beyond that yet."))), /*#__PURE__*/React.createElement("div", {
    className: "dtf-section-check-list"
  }, questions.map((q, i) => /*#__PURE__*/React.createElement("div", {
    className: "dtf-question-block",
    key: q.qid
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-question-number"
  }, "Q", i + 1, " \xB7 ", QUESTION_CATEGORIES[q.category].label), q.scenario && /*#__PURE__*/React.createElement("p", {
    className: "sub dtf-scenario"
  }, q.scenario), /*#__PURE__*/React.createElement("p", {
    className: "dtf-question-prompt"
  }, q.prompt), /*#__PURE__*/React.createElement(DTFQuestionRenderer, {
    question: q,
    response: responses[q.qid],
    onRespond: r => respond(q.qid, r)
  })))), /*#__PURE__*/React.createElement("div", {
    className: "quiz-result-actions",
    style: {
      marginTop: 20
    }
  }, !submitted && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: finish,
    disabled: !allAnswered
  }, allAnswered ? "Check my answers" : `Answer all ${questions.length} to continue`, " ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  })), submitted && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onContinue
  }, "Continue ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))));
}

/* ------------------------------------------------------------------ */
/* APPLY - Design Detective (unfamiliar scenario, 5-part response)     */
/* ------------------------------------------------------------------ */

function DTFApplyStep({
  meta,
  task,
  onEvidence,
  onContinue
}) {
  const [values, setValues] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const allFilled = task.parts.every(p => (values[p.key] || "").trim());
  async function submit() {
    const combined = task.parts.map(p => values[p.key] || "").join("\n\n");
    const s = suggestDTStage(combined, {
      acceptedIdeas: task.acceptedIdeas
    });
    setSuggestion(s);
    setSubmitted(true);
    onEvidence([s.stage]);
    apiPost(`/api/dtf/responses/U1-${meta.sectionKey.toUpperCase()}-APPLY`, {
      text: combined,
      suggestedStage: s.stage,
      stageReasoning: s.reasoning
    }).catch(() => {});
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Apply: ", task.heading), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "A new, unfamiliar scenario \u2014 use what you've learned in this section."))), /*#__PURE__*/React.createElement("p", {
    className: "dtf-scenario"
  }, task.scenario), /*#__PURE__*/React.createElement("div", {
    className: "spec-setup-form"
  }, task.parts.map(p => /*#__PURE__*/React.createElement("label", {
    key: p.key
  }, /*#__PURE__*/React.createElement("span", null, p.label), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: values[p.key] || "",
    onChange: e => setValues(v => ({
      ...v,
      [p.key]: e.target.value
    })),
    placeholder: p.placeholder,
    disabled: submitted
  })))), !submitted && /*#__PURE__*/React.createElement("div", {
    className: "qb-save-row",
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: submit,
    disabled: !allFilled
  }, "Submit")), submitted && suggestion && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dtf-stage-suggestion",
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(DTFStagePill, {
    stage: suggestion.stage
  }), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, stageNextStepFeedback(suggestion.stage))), /*#__PURE__*/React.createElement("div", {
    className: "qb-save-row",
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onContinue
  }, "Continue ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  })))));
}

/* ------------------------------------------------------------------ */
/* FIXED FLOW STEPS - welcome, WAGBA, stage ladder, starting point,    */
/* starting-point review, vocab review, next step                     */
/* ------------------------------------------------------------------ */

function DTFStepShell({
  children,
  onNext,
  onBack,
  nextLabel
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, children, /*#__PURE__*/React.createElement("div", {
    className: "quiz-nav-row",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16,
    style: {
      transform: "rotate(180deg)"
    }
  }), " Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onNext
  }, nextLabel || "Next", " ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))));
}
function DTFWelcomeStep({
  meta,
  onNext,
  onBack
}) {
  return /*#__PURE__*/React.createElement(DTFStepShell, {
    onNext: onNext,
    onBack: onBack,
    nextLabel: "Let's begin"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dtf-content-card"
  }, /*#__PURE__*/React.createElement("h2", null, "Welcome"), /*#__PURE__*/React.createElement("p", {
    className: "dtf-card-body",
    style: {
      whiteSpace: "pre-line"
    }
  }, meta.welcome)));
}
function DTFWagbaStep({
  meta,
  onNext,
  onBack
}) {
  return /*#__PURE__*/React.createElement(DTFStepShell, {
    onNext: onNext,
    onBack: onBack
  }, /*#__PURE__*/React.createElement("div", {
    className: "dtf-content-card"
  }, /*#__PURE__*/React.createElement("h2", null, "What We Are Getting Better At"), /*#__PURE__*/React.createElement("p", {
    className: "dtf-card-body"
  }, meta.wagbaHeadline), /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "You will learn how to"), /*#__PURE__*/React.createElement("ul", {
    className: "spec-prompt-list"
  }, meta.wagbaBullets.map((b, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, b)))));
}
function DTFStageLadderStep({
  meta,
  onNext,
  onBack,
  highlightStage,
  title
}) {
  return /*#__PURE__*/React.createElement(DTFStepShell, {
    onNext: onNext,
    onBack: onBack
  }, /*#__PURE__*/React.createElement("div", {
    className: "dtf-content-card"
  }, /*#__PURE__*/React.createElement("h2", null, title || "How We Show Success"), !highlightStage && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "By the end, you should be able to say one of these:"), highlightStage && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Based on what you've shown in this section, here's where you currently sit \u2014 you and your teacher can always discuss and adjust this."), /*#__PURE__*/React.createElement("div", {
    className: "dtf-ladder"
  }, DT_STAGES.map(stage => /*#__PURE__*/React.createElement("div", {
    key: stage,
    className: "dtf-ladder-row" + (highlightStage === stage ? " current" : "")
  }, /*#__PURE__*/React.createElement(DTFStagePill, {
    stage: stage
  }), /*#__PURE__*/React.createElement("p", null, meta.stageLadder[stage]))))));
}
function DTFStartingPointStep({
  meta,
  question,
  onNext,
  onBack
}) {
  const [picked, setPicked] = useState(null);
  function choose(opt) {
    if (picked) return;
    setPicked(opt);
    saveTouchpointResponse(meta.sectionKey, "starting_point", opt);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "What Do You Think?"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Imagine this situation:"))), /*#__PURE__*/React.createElement("p", {
    className: "dtf-scenario"
  }, question.scenario), /*#__PURE__*/React.createElement("p", {
    className: "dtf-question-prompt"
  }, question.prompt), /*#__PURE__*/React.createElement("div", {
    className: "quiz-options"
  }, question.options.map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt,
    className: "quiz-option" + (picked === opt ? " picked" : ""),
    onClick: () => choose(opt),
    disabled: !!picked
  }, opt))), picked && /*#__PURE__*/React.createElement("div", {
    className: "dtf-feedback",
    style: {
      marginTop: 14
    }
  }, "Don't worry if you're unsure \u2014 this is your starting point, not your final test. Keep your answer in mind, we'll return to this idea later."), /*#__PURE__*/React.createElement("div", {
    className: "quiz-nav-row",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16,
    style: {
      transform: "rotate(180deg)"
    }
  }), " Back"), picked && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: () => onNext(picked)
  }, "Next ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))));
}
function DTFStartingPointReviewStep({
  meta,
  startingPointText,
  onNext,
  onBack
}) {
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);
  async function save() {
    if (reflection.trim()) saveTouchpointResponse(meta.sectionKey, "starting_point_reflection", reflection);
    setSaved(true);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Look Back at Your Starting Point"))), /*#__PURE__*/React.createElement("div", {
    className: "spec-context-banner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "At the beginning you said"), /*#__PURE__*/React.createElement("p", {
    className: "spec-context-name",
    style: {
      fontWeight: 500
    }
  }, "\u201C", startingPointText || "(no answer recorded)", "\u201D")), /*#__PURE__*/React.createElement("div", {
    className: "spec-setup-form"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Would you give the same answer now? Why or why not?"), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: reflection,
    onChange: e => setReflection(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "quiz-nav-row",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16,
    style: {
      transform: "rotate(180deg)"
    }
  }), " Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: async () => {
      await save();
      onNext();
    }
  }, "Next ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))));
}
function DTFVocabReviewStep({
  vocab,
  onNext,
  onBack
}) {
  const [flipped, setFlipped] = useState({});
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Words We've Worked With"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Tap a card to see the definition."))), /*#__PURE__*/React.createElement("div", {
    className: "tool-picker-grid"
  }, vocab.map(v => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: v.id,
    className: "tool-picker-card",
    onClick: () => setFlipped(f => ({
      ...f,
      [v.id]: !f[v.id]
    }))
  }, /*#__PURE__*/React.createElement("span", {
    className: "tool-picker-title"
  }, v.term), flipped[v.id] && /*#__PURE__*/React.createElement("span", {
    className: "tool-picker-desc"
  }, v.definition), !flipped[v.id] && /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "Tap to reveal")))), /*#__PURE__*/React.createElement("div", {
    className: "quiz-nav-row",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16,
    style: {
      transform: "rotate(180deg)"
    }
  }), " Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: onNext
  }, "Continue ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))));
}
function DTFNextStepStep({
  meta,
  onDone
}) {
  const [understand, setUnderstand] = useState("");
  const [practise, setPractise] = useState("");
  const [saved, setSaved] = useState(false);
  async function handleSave() {
    if (understand.trim()) saveTouchpointResponse(meta.sectionKey, "reflect_understand", understand);
    if (practise.trim()) saveTouchpointResponse(meta.sectionKey, "reflect_practise", practise);
    setSaved(true);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Reflect & Refine"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Section complete \u2014 nice work."))), /*#__PURE__*/React.createElement("div", {
    className: "spec-setup-form"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Something I understand better now is\u2026"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: understand,
    onChange: e => setUnderstand(e.target.value)
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Something I still need to practise is\u2026"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: practise,
    onChange: e => setPractise(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "qb-save-row",
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: handleSave,
    disabled: saved
  }, saved ? "Saved" : "Save my reflection"), saved && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: onDone
  }, "Back to Design Fundamentals ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  }))));
}

/* ------------------------------------------------------------------ */
/* SECTION SHELL - builds the full WAGBA-framed flow and resumes from  */
/* wherever the student left off, so a refresh never restarts them.    */
/* ------------------------------------------------------------------ */

function buildSectionFlow(meta, cards) {
  return [{
    stepType: "welcome"
  }, {
    stepType: "wagba"
  }, {
    stepType: "stage-ladder"
  }, {
    stepType: "starting-point"
  }, ...cards.map(c => ({
    stepType: c.type,
    card: c
  })), {
    stepType: "knowledge-check"
  }, {
    stepType: "apply"
  }, {
    stepType: "wagba-return"
  }, {
    stepType: "starting-point-review"
  }, {
    stepType: "vocab-review"
  }, {
    stepType: "next-step"
  }];
}
function DTFSectionShell({
  meta,
  cards,
  bank,
  vocab,
  applyTask,
  startingPointQuestion,
  onExit
}) {
  const flow = useMemo(() => buildSectionFlow(meta, cards), [meta, cards]);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [startingPointText, setStartingPointText] = useState("");
  const [stageEvidence, setStageEvidence] = useState([]);
  const [resumed, setResumed] = useState(false);
  useEffect(() => {
    apiGet("/api/dtf/progress").then(rows => {
      const existing = rows.find(r => r.unitKey === meta.unitKey && r.sectionKey === meta.sectionKey);
      const state = existing ? existing.sessionState : null;
      if (state && typeof state.stepIndex === "number" && state.stepIndex > 0) {
        setStepIndex(Math.min(state.stepIndex, flow.length - 1));
        setStartingPointText(state.startingPointText || "");
        setResumed(true);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function saveSession(extra) {
    const sessionState = {
      stepIndex,
      startingPointText,
      ...extra
    };
    apiPut(`/api/dtf/progress/${meta.unitKey}/${meta.sectionKey}`, {
      sessionState
    }).catch(() => {});
  }
  function goTo(nextIndex, extra) {
    setStepIndex(nextIndex);
    const sessionState = {
      stepIndex: nextIndex,
      startingPointText: extra && extra.startingPointText || startingPointText
    };
    apiPut(`/api/dtf/progress/${meta.unitKey}/${meta.sectionKey}`, {
      sessionState
    }).catch(() => {});
  }
  function next() {
    goTo(Math.min(stepIndex + 1, flow.length - 1));
  }
  function back() {
    stepIndex === 0 ? onExit() : goTo(stepIndex - 1);
  }
  function addEvidence(stages) {
    setStageEvidence(s => [...s, ...stages]);
  }
  function finalStageSuggestion() {
    if (!stageEvidence.length) return null;
    const counts = {};
    stageEvidence.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }
  async function finishKnowledgeOrApplyStep() {
    const stage = finalStageSuggestion();
    if (stage) {
      await apiPut(`/api/dtf/progress/${meta.unitKey}/${meta.sectionKey}`, {
        suggestedStage: stage,
        stageReasoning: `Based on ${stageEvidence.length} piece${stageEvidence.length === 1 ? "" : "s"} of evidence from this section's Knowledge Check and Apply task, most closely matching the "${DT_STAGE_INFO[stage].label}" stage.`,
        completed: true
      });
    } else {
      await apiPut(`/api/dtf/progress/${meta.unitKey}/${meta.sectionKey}`, {
        completed: true
      });
    }
    next();
  }
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "tab-content"
    }, /*#__PURE__*/React.createElement("p", {
      className: "sub"
    }, "Loading..."));
  }
  const step = flow[stepIndex];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "tool-subheader no-print"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text back-btn",
    onClick: onExit
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 15,
    style: {
      transform: "rotate(180deg)"
    }
  }), " Design Fundamentals")), resumed && stepIndex > 0 && /*#__PURE__*/React.createElement("div", {
    className: "admin-banner no-print",
    style: {
      margin: "0 14px 0 14px"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Welcome back \u2014 picking up where you left off."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setResumed(false),
    "aria-label": "Dismiss"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "X",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "spec-wizard-progress",
    style: {
      margin: "16px 14px 0 14px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "quiz-history-label"
  }, "Section ", meta.number, " of 17 \xB7 ", meta.title), /*#__PURE__*/React.createElement("div", {
    className: "quiz-progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${(stepIndex + 1) / flow.length * 100}%`,
      background: "var(--blue)"
    }
  }))), step.stepType === "welcome" && /*#__PURE__*/React.createElement(DTFWelcomeStep, {
    meta: meta,
    onNext: next,
    onBack: back
  }), step.stepType === "wagba" && /*#__PURE__*/React.createElement(DTFWagbaStep, {
    meta: meta,
    onNext: next,
    onBack: back
  }), step.stepType === "stage-ladder" && /*#__PURE__*/React.createElement(DTFStageLadderStep, {
    meta: meta,
    onNext: next,
    onBack: back
  }), step.stepType === "starting-point" && /*#__PURE__*/React.createElement(DTFStartingPointStep, {
    meta: meta,
    question: startingPointQuestion,
    onBack: back,
    onNext: answerText => {
      setStartingPointText(answerText);
      goTo(stepIndex + 1, {
        startingPointText: answerText
      });
    }
  }), (step.stepType === "content" || step.stepType === "touchpoint") && /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, step.stepType === "content" && /*#__PURE__*/React.createElement("div", {
    className: "dtf-content-card"
  }, /*#__PURE__*/React.createElement("h2", null, step.card.heading), /*#__PURE__*/React.createElement("p", {
    className: "dtf-card-body",
    style: {
      whiteSpace: "pre-line"
    }
  }, step.card.body), step.card.compare && /*#__PURE__*/React.createElement("div", {
    className: "dtf-compare-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dtf-compare-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-choice-letter"
  }, "A"), /*#__PURE__*/React.createElement("p", null, step.card.compare.a)), /*#__PURE__*/React.createElement("div", {
    className: "dtf-compare-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dtf-choice-letter"
  }, "B"), /*#__PURE__*/React.createElement("p", null, step.card.compare.b))), step.card.list && /*#__PURE__*/React.createElement("div", {
    className: "chip-row"
  }, step.card.list.map((item, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "chip chip-word"
  }, item))), step.card.footer && /*#__PURE__*/React.createElement("p", {
    className: "sub",
    style: {
      marginTop: 10
    }
  }, step.card.footer)), step.stepType === "touchpoint" && (() => {
    const Touchpoint = TOUCHPOINT_RENDERERS[step.card.kind];
    return Touchpoint ? /*#__PURE__*/React.createElement(Touchpoint, {
      card: step.card,
      sectionKey: meta.sectionKey,
      onContinue: next
    }) : null;
  })(), /*#__PURE__*/React.createElement("div", {
    className: "quiz-nav-row",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: back
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16,
    style: {
      transform: "rotate(180deg)"
    }
  }), " Back"), step.stepType === "content" && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: next
  }, "Next ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 16
  })))), step.stepType === "knowledge-check" && /*#__PURE__*/React.createElement(DTFKnowledgeCheckStep, {
    meta: meta,
    bank: bank,
    onEvidence: addEvidence,
    onContinue: next
  }), step.stepType === "apply" && /*#__PURE__*/React.createElement(DTFApplyStep, {
    meta: meta,
    task: applyTask,
    onEvidence: addEvidence,
    onContinue: finishKnowledgeOrApplyStep
  }), step.stepType === "wagba-return" && /*#__PURE__*/React.createElement(DTFStageLadderStep, {
    meta: meta,
    onNext: next,
    onBack: back,
    highlightStage: finalStageSuggestion(),
    title: "Return to WAGBA"
  }), step.stepType === "starting-point-review" && /*#__PURE__*/React.createElement(DTFStartingPointReviewStep, {
    meta: meta,
    startingPointText: startingPointText,
    onNext: next,
    onBack: back
  }), step.stepType === "vocab-review" && /*#__PURE__*/React.createElement(DTFVocabReviewStep, {
    vocab: vocab,
    onNext: next,
    onBack: back
  }), step.stepType === "next-step" && /*#__PURE__*/React.createElement(DTFNextStepStep, {
    meta: meta,
    onDone: onExit
  }));
}
function DesignFundamentalsTool({
  user,
  onBack
}) {
  const [openSectionKey, setOpenSectionKey] = useState(null);
  if (openSectionKey === "s1") {
    return /*#__PURE__*/React.createElement(DTFSectionShell, {
      meta: U1S1_META,
      cards: U1S1_CARDS,
      bank: U1S1_QUESTIONS,
      vocab: U1S1_VOCAB,
      applyTask: U1S1_APPLY_TASK,
      startingPointQuestion: U1S1_STARTING_POINT,
      onExit: () => setOpenSectionKey(null)
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "tool-subheader no-print"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text back-btn",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 15,
    style: {
      transform: "rotate(180deg)"
    }
  }), " All tools")), /*#__PURE__*/React.createElement(DTFDashboard, {
    sections: UNIT_1_SECTIONS,
    onOpenSection: setOpenSectionKey
  }));
}

/* ===== login.jsx ===== */
function LoginScreen({
  onLogin
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setBusy(true);
    setError("");
    try {
      const user = await apiPost("/api/login", {
        username: username.trim(),
        password
      });
      onLogin(user);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "login-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-card"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "app-title login-title"
  }, "DT Classroom ", /*#__PURE__*/React.createElement("span", null, "Helper")), /*#__PURE__*/React.createElement("p", {
    className: "app-sub",
    style: {
      marginBottom: 24
    }
  }, "Sign in to continue"), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "login-form"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Username"), /*#__PURE__*/React.createElement("input", {
    value: username,
    onChange: e => setUsername(e.target.value),
    autoComplete: "username",
    autoFocus: true
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: password,
    onChange: e => setPassword(e.target.value),
    autoComplete: "current-password"
  })), error && /*#__PURE__*/React.createElement("p", {
    className: "login-error"
  }, error), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    type: "submit",
    disabled: busy,
    style: {
      justifyContent: "center",
      marginTop: 4
    }
  }, busy ? "Signing in..." : "Sign in")), /*#__PURE__*/React.createElement("p", {
    className: "login-hint"
  }, "Ask your teacher if you've forgotten your login.")));
}

/* ===== studentapp.jsx ===== */
function AccessfmScamperTool({
  user,
  tab,
  setTab,
  onBack
}) {
  const [simpleMode, setSimpleMode] = useState(false);
  const tabs = useMemo(() => [{
    key: "learn",
    label: "Learn"
  }, {
    key: "quiz",
    label: "Quiz"
  }, {
    key: "worksheet",
    label: "Worksheet"
  }], []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "tool-subheader no-print"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text back-btn",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 15,
    style: {
      transform: "rotate(180deg)"
    }
  }), " All tools"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "simple-toggle",
    onClick: () => setSimpleMode(s => !s),
    "aria-pressed": simpleMode
  }, /*#__PURE__*/React.createElement("span", null, "Simple English"), /*#__PURE__*/React.createElement("span", {
    className: "switch" + (simpleMode ? " on" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "switch-knob"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "tabs no-print"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "tab-btn" + (tab === t.key ? " active" : ""),
    onClick: () => setTab(t.key)
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, tab === "learn" && /*#__PURE__*/React.createElement(LearnTab, {
    simpleMode: simpleMode
  }), tab === "quiz" && /*#__PURE__*/React.createElement(QuizTab, {
    currentUser: user
  }), tab === "worksheet" && /*#__PURE__*/React.createElement(WorksheetTab, {
    simpleMode: simpleMode,
    currentUser: user
  })));
}
function ToolPicker({
  onSelect
}) {
  const tools = [{
    key: "accessfm-scamper",
    title: "ACCESSFM & SCAMPER",
    icon: "Wrench",
    description: "Learn, quiz yourself, and apply these two design tools to your own ideas or an existing product."
  }, {
    key: "spec-builder",
    title: "Specification Builder",
    icon: "ClipboardList",
    description: "Turn your research into a clear, measurable design specification \u2014 step by step, not a blank text box."
  }, {
    key: "design-fundamentals",
    title: "Discovering Design",
    icon: "GraduationCap",
    description: "A KS3 course on how designers move from problem to evidence to a measurable specification."
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content tool-picker no-print"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Design Tools"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Pick what you want to work on."))), /*#__PURE__*/React.createElement("div", {
    className: "tool-picker-grid"
  }, tools.map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: t.key,
    className: "tool-picker-card",
    onClick: () => onSelect(t.key)
  }, /*#__PURE__*/React.createElement("span", {
    className: "tool-picker-icon"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: t.icon,
    size: 26
  })), /*#__PURE__*/React.createElement("span", {
    className: "tool-picker-title"
  }, t.title), /*#__PURE__*/React.createElement("span", {
    className: "tool-picker-desc"
  }, t.description)))));
}
function StudentApp({
  user,
  onLogout
}) {
  const [activeTool, setActiveTool] = useState(null); // null | "accessfm-scamper" | "spec-builder"
  const [accessfmTab, setAccessfmTab] = useState("learn");
  function handleNotificationNavigate(tabKey) {
    setActiveTool("accessfm-scamper");
    setAccessfmTab(tabKey);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "app-header no-print"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "app-title"
  }, "DT Classroom ", /*#__PURE__*/React.createElement("span", null, "Helper")), /*#__PURE__*/React.createElement("p", {
    className: "app-sub"
  }, "Signed in as ", user.displayName, user.classGroup ? ` \u00b7 ${user.classGroup}` : "")), /*#__PURE__*/React.createElement("div", {
    className: "header-controls"
  }, /*#__PURE__*/React.createElement(NotificationCenter, {
    onNavigate: handleNotificationNavigate
  }), /*#__PURE__*/React.createElement(ChangePasswordForm, null), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text logout-btn",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "LogOut",
    size: 15
  }), " Log out"))), activeTool === null && /*#__PURE__*/React.createElement(ToolPicker, {
    onSelect: setActiveTool
  }), activeTool === "accessfm-scamper" && /*#__PURE__*/React.createElement(AccessfmScamperTool, {
    user: user,
    tab: accessfmTab,
    setTab: setAccessfmTab,
    onBack: () => setActiveTool(null)
  }), activeTool === "spec-builder" && /*#__PURE__*/React.createElement(SpecBuilderTool, {
    user: user,
    onBack: () => setActiveTool(null)
  }), activeTool === "design-fundamentals" && /*#__PURE__*/React.createElement(DesignFundamentalsTool, {
    user: user,
    onBack: () => setActiveTool(null)
  }));
}

/* ===== admin-csvimport.jsx ===== */
function CsvImportPanel({
  onImported,
  onBanner
}) {
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result || ""));
    reader.readAsText(file);
  }
  async function handleImport() {
    if (!csvText.trim()) {
      setError("Paste CSV text or choose a file first.");
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await apiPost("/api/admin/users/import-csv", {
        csv: csvText
      });
      setResult(res);
      if (res.createdCount > 0) {
        onImported();
        onBanner({
          text: `Imported ${res.createdCount} student${res.createdCount === 1 ? "" : "s"}${res.failedCount > 0 ? `, ${res.failedCount} row${res.failedCount === 1 ? "" : "s"} failed \u2014 see details below` : ""}.`
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "csv-import-panel no-print"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "CSV needs a header row with ", /*#__PURE__*/React.createElement("code", null, "username"), ", ", /*#__PURE__*/React.createElement("code", null, "displayName"), ", ", /*#__PURE__*/React.createElement("code", null, "yearGroup"), " and", " ", /*#__PURE__*/React.createElement("code", null, "classGroup"), " columns (all required), plus an optional ", /*#__PURE__*/React.createElement("code", null, "password"), " column \u2014 leave password blank per row to auto-generate one.", " ", /*#__PURE__*/React.createElement("a", {
    href: "/api/admin/users/import-template.csv",
    className: "csv-template-link"
  }, "Download a template")), /*#__PURE__*/React.createElement("div", {
    className: "csv-import-controls"
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".csv,text/csv",
    onChange: handleFile
  }), fileName && /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, fileName)), /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    value: csvText,
    onChange: e => {
      setCsvText(e.target.value);
      setResult(null);
    },
    placeholder: "Or paste CSV text directly here..."
  }), error && /*#__PURE__*/React.createElement("p", {
    className: "login-error"
  }, error), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: handleImport,
    disabled: busy
  }, busy ? "Importing..." : "Import students"), result && /*#__PURE__*/React.createElement("div", {
    className: "csv-import-result"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, /*#__PURE__*/React.createElement("strong", null, result.createdCount), " created, ", /*#__PURE__*/React.createElement("strong", null, result.failedCount), " failed."), result.created.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "csv-import-created"
  }, result.created.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.username,
    className: "mono"
  }, c.username, ": ", c.temporaryPassword))), result.failed.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "csv-import-failed"
  }, result.failed.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.row,
    className: "mono"
  }, "Row ", f.row, " (", f.username || "?", "): ", f.error)))));
}

/* ===== admin-classes.jsx ===== */
function ClassesPanel() {
  const [classGroups, setClassGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedKey, setExpandedKey] = useState(null);
  function load() {
    setLoading(true);
    apiGet("/api/admin/classes").then(setClassGroups).catch(e => setError(e.message)).finally(() => setLoading(false));
  }
  useEffect(load, []);
  const byYear = {};
  classGroups.forEach(c => {
    const y = c.yearGroup || "No year set";
    byYear[y] = byYear[y] || [];
    byYear[y].push(c);
  });
  const years = Object.keys(byYear).sort();
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content admin-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Classes"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Every year group and class currently in use, with a quick look at who's in each one."))), loading && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Loading..."), error && /*#__PURE__*/React.createElement("p", {
    className: "export-error"
  }, error), !loading && classGroups.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "No classes yet \u2014 add students with a year and class from the Students tab."), years.map(year => /*#__PURE__*/React.createElement("div", {
    className: "year-section",
    key: year
  }, /*#__PURE__*/React.createElement("h3", {
    className: "year-section-title"
  }, year), /*#__PURE__*/React.createElement("div", {
    className: "class-card-grid"
  }, byYear[year].map(c => {
    const key = `${c.yearGroup}|${c.classGroup}`;
    const isOpen = expandedKey === key;
    return /*#__PURE__*/React.createElement("div", {
      className: "class-card",
      key: key
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "class-card-head",
      onClick: () => setExpandedKey(isOpen ? null : key)
    }, /*#__PURE__*/React.createElement("span", {
      className: "class-card-name"
    }, c.classGroup || "No class set"), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, c.students.length, " student", c.students.length === 1 ? "" : "s"), /*#__PURE__*/React.createElement(IconGlyph, {
      name: "ChevronDown",
      size: 14,
      className: "chevron" + (isOpen ? " up" : "")
    })), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "class-card-roster"
    }, c.students.map(s => /*#__PURE__*/React.createElement("div", {
      className: "class-card-student",
      key: s.id
    }, /*#__PURE__*/React.createElement("span", null, s.displayName), /*#__PURE__*/React.createElement("span", {
      className: "mono student-username"
    }, "@", s.username)))));
  })))));
}

/* ===== admin-quizzes.jsx ===== */
function emptyQuestion(type) {
  const base = {
    qid: "q" + Math.random().toString(36).slice(2, 10),
    type,
    prompt: "",
    badge: "?",
    tint: "#2F8FA6"
  };
  if (type === "mcq" || type === "scenario") return {
    ...base,
    options: ["", "", "", ""],
    answer: ""
  };
  return {
    ...base,
    keywords: [],
    modelAnswer: ""
  };
}
function QuestionEditor({
  question,
  onChange,
  onRemove
}) {
  function update(patch) {
    onChange({
      ...question,
      ...patch
    });
  }
  function updateOption(idx, val) {
    const options = [...question.options];
    options[idx] = val;
    update({
      options
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "qb-question-editor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qb-question-head"
  }, /*#__PURE__*/React.createElement("select", {
    value: question.type,
    onChange: e => onChange(emptyQuestion(e.target.value))
  }, /*#__PURE__*/React.createElement("option", {
    value: "mcq"
  }, "Multiple choice"), /*#__PURE__*/React.createElement("option", {
    value: "scenario"
  }, "Scenario (multiple choice)"), /*#__PURE__*/React.createElement("option", {
    value: "typed"
  }, "Typed answer")), /*#__PURE__*/React.createElement("input", {
    className: "qb-badge-input",
    value: question.badge,
    onChange: e => update({
      badge: e.target.value
    }),
    placeholder: "Badge",
    maxLength: 2
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "icon-btn danger",
    onClick: onRemove,
    title: "Remove question"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Trash2",
    size: 14
  }))), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: question.prompt,
    onChange: e => update({
      prompt: e.target.value
    }),
    placeholder: "Question prompt..."
  }), (question.type === "mcq" || question.type === "scenario") && /*#__PURE__*/React.createElement("div", {
    className: "qb-options"
  }, question.options.map((opt, i) => /*#__PURE__*/React.createElement("div", {
    className: "qb-option-row",
    key: i
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: `answer-${question.qid}`,
    checked: question.answer === opt && opt !== "",
    onChange: () => update({
      answer: opt
    })
  }), /*#__PURE__*/React.createElement("input", {
    value: opt,
    onChange: e => {
      updateOption(i, e.target.value);
      if (question.answer === opt) update({
        answer: e.target.value
      });
    },
    placeholder: `Option ${i + 1}`
  }))), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "Tick the radio button next to the correct answer.")), question.type === "typed" && /*#__PURE__*/React.createElement("div", {
    className: "qb-typed"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Keywords (comma-separated, used to self-check answers)"), /*#__PURE__*/React.createElement("input", {
    value: (question.keywords || []).join(", "),
    onChange: e => update({
      keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean)
    })
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Model answer (shown to students for comparison)"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: question.modelAnswer,
    onChange: e => update({
      modelAnswer: e.target.value
    })
  }))));
}
function QuizSetBuilder({
  existing,
  onSaved,
  onCancel
}) {
  const [name, setName] = useState(existing ? existing.name : "");
  const [description, setDescription] = useState(existing ? existing.description : "");
  const [isPracticeBank, setIsPracticeBank] = useState(existing ? existing.isPracticeBank : false);
  const [questions, setQuestions] = useState(existing ? existing.questions : [emptyQuestion("mcq")]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvBusy, setCsvBusy] = useState(false);
  const [csvResult, setCsvResult] = useState(null);
  const [csvError, setCsvError] = useState("");
  function addQuestion(type) {
    setQuestions(qs => [...qs, emptyQuestion(type)]);
  }
  function updateQuestion(idx, q) {
    setQuestions(qs => qs.map((old, i) => i === idx ? q : old));
  }
  function removeQuestion(idx) {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  }
  function handleCsvFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result || ""));
    reader.readAsText(file);
  }
  async function handleCsvImport() {
    if (!csvText.trim()) {
      setCsvError("Paste CSV text or choose a file first.");
      return;
    }
    setCsvBusy(true);
    setCsvError("");
    setCsvResult(null);
    try {
      const res = await apiPost("/api/admin/quiz-sets/parse-csv", {
        csv: csvText
      });
      setCsvResult(res);
      if (res.questions.length > 0) {
        setQuestions(qs => [...qs, ...res.questions]);
      }
    } catch (err) {
      setCsvError(err.message);
    } finally {
      setCsvBusy(false);
    }
  }
  function importFromBuiltIn(frameworkKey) {
    const fw = FRAMEWORKS[frameworkKey];
    const imported = fw.items.map(item => ({
      qid: `builtin-${frameworkKey}-${item.id}-${Math.random().toString(36).slice(2, 6)}`,
      type: "mcq",
      prompt: `In ${fw.label}, what does the letter "${item.letter}" stand for?`,
      options: shuffle([item.word, ...fw.items.filter(i => i.id !== item.id).map(i => i.word).slice(0, 3)]),
      answer: item.word,
      badge: item.letter,
      tint: fw.tint
    }));
    setQuestions(qs => [...qs, ...imported]);
  }
  async function handleSave() {
    if (!name.trim()) {
      setError("Give the quiz a name.");
      return;
    }
    const cleaned = questions.filter(q => q.prompt.trim());
    if (cleaned.length === 0) {
      setError("Add at least one question with a prompt.");
      return;
    }
    for (const q of cleaned) {
      if ((q.type === "mcq" || q.type === "scenario") && (!q.answer || q.options.filter(o => o.trim()).length < 2)) {
        setError(`"${q.prompt.slice(0, 40)}..." needs at least 2 options and a selected correct answer.`);
        return;
      }
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        questions: cleaned,
        isPracticeBank
      };
      const saved = existing ? await apiPut(`/api/admin/quiz-sets/${existing.id}`, payload) : await apiPost("/api/admin/quiz-sets", payload);
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "qb-builder"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qb-meta"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Quiz name"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "e.g. ACCESSFM Recap",
    autoFocus: true
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Description (optional)"), /*#__PURE__*/React.createElement("input", {
    value: description,
    onChange: e => setDescription(e.target.value),
    placeholder: "Shown to students in the quiz picker"
  })), /*#__PURE__*/React.createElement("label", {
    className: "qb-checkbox-label"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: isPracticeBank,
    onChange: e => setIsPracticeBank(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "Practice bank \u2014 any student can do this any time (in addition to any class you assign it to)"))), /*#__PURE__*/React.createElement("div", {
    className: "qb-import-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "Quick-add from the built-in question set"), /*#__PURE__*/React.createElement("div", {
    className: "chip-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chip chip-word",
    onClick: () => importFromBuiltIn("accessfm")
  }, "+ All ACCESSFM letters"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chip chip-word",
    onClick: () => importFromBuiltIn("scamper")
  }, "+ All SCAMPER letters")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: () => setShowCsvImport(s => !s),
    style: {
      alignSelf: "flex-start",
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "FileDown",
    size: 15
  }), " ", showCsvImport ? "Cancel CSV import" : "Import questions from CSV")), showCsvImport && /*#__PURE__*/React.createElement("div", {
    className: "csv-import-panel"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Header row: ", /*#__PURE__*/React.createElement("code", null, "type,prompt,option1,option2,option3,option4,answer,badge,keywords,modelAnswer"), ".", " ", /*#__PURE__*/React.createElement("code", null, "type"), " is ", /*#__PURE__*/React.createElement("code", null, "mcq"), ", ", /*#__PURE__*/React.createElement("code", null, "scenario"), " or ", /*#__PURE__*/React.createElement("code", null, "typed"), ". For mcq/scenario, fill in 2\u20134 options and make ", /*#__PURE__*/React.createElement("code", null, "answer"), " match one exactly. For typed, fill in", " ", /*#__PURE__*/React.createElement("code", null, "keywords"), " (comma-separated \u2014 quote the cell) and ", /*#__PURE__*/React.createElement("code", null, "modelAnswer"), " instead."), /*#__PURE__*/React.createElement("div", {
    className: "csv-import-controls"
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".csv,text/csv",
    onChange: handleCsvFile
  })), /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    value: csvText,
    onChange: e => {
      setCsvText(e.target.value);
      setCsvResult(null);
    },
    placeholder: "Or paste CSV text directly here..."
  }), csvError && /*#__PURE__*/React.createElement("p", {
    className: "login-error"
  }, csvError), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: handleCsvImport,
    disabled: csvBusy
  }, csvBusy ? "Importing..." : "Add these questions"), csvResult && /*#__PURE__*/React.createElement("div", {
    className: "csv-import-result"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, /*#__PURE__*/React.createElement("strong", null, csvResult.importedCount), " question", csvResult.importedCount === 1 ? "" : "s", " added, ", /*#__PURE__*/React.createElement("strong", null, csvResult.failedCount), " row", csvResult.failedCount === 1 ? "" : "s", " skipped."), csvResult.errors.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "csv-import-failed"
  }, csvResult.errors.map(e => /*#__PURE__*/React.createElement("div", {
    key: e.row,
    className: "mono"
  }, "Row ", e.row, ": ", e.error))))), /*#__PURE__*/React.createElement("div", {
    className: "qb-questions"
  }, questions.map((q, i) => /*#__PURE__*/React.createElement(QuestionEditor, {
    key: q.qid,
    question: q,
    onChange: nq => updateQuestion(i, nq),
    onRemove: () => removeQuestion(i)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "qb-add-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: () => addQuestion("mcq")
  }, "+ Multiple choice"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: () => addQuestion("scenario")
  }, "+ Scenario"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: () => addQuestion("typed")
  }, "+ Typed answer")), error && /*#__PURE__*/React.createElement("p", {
    className: "login-error"
  }, error), /*#__PURE__*/React.createElement("div", {
    className: "qb-save-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: handleSave,
    disabled: saving
  }, saving ? "Saving..." : existing ? "Save changes" : "Create quiz"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: onCancel
  }, "Cancel")));
}
function AssignPanel({
  itemLabel,
  onAssign,
  existingAssignments,
  onUnassign,
  classGroups
}) {
  const [yearGroup, setYearGroup] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [busy, setBusy] = useState(false);
  const yearOptions = [...new Set(classGroups.map(c => c.yearGroup).filter(Boolean))].sort();
  const classOptions = [...new Set(classGroups.map(c => c.classGroup).filter(Boolean))].sort();
  async function handleAssign() {
    if (!yearGroup && !classGroup) return;
    setBusy(true);
    try {
      await onAssign({
        yearGroup,
        classGroup,
        dueAt: dueAt || null
      });
      setYearGroup("");
      setClassGroup("");
      setDueAt("");
    } catch (e) {/* ignore */}
    setBusy(false);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "assign-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "assign-row"
  }, /*#__PURE__*/React.createElement("select", {
    value: yearGroup,
    onChange: e => setYearGroup(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Any year"), yearOptions.map(y => /*#__PURE__*/React.createElement("option", {
    key: y,
    value: y
  }, y))), /*#__PURE__*/React.createElement("select", {
    value: classGroup,
    onChange: e => setClassGroup(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Any class"), classOptions.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c))), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: dueAt,
    onChange: e => setDueAt(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: handleAssign,
    disabled: busy || !yearGroup && !classGroup
  }, "Assign ", itemLabel)), yearOptions.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "No classes exist yet \u2014 add students with a year/class first."), existingAssignments.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "assign-list"
  }, existingAssignments.map(a => /*#__PURE__*/React.createElement("span", {
    key: a.id,
    className: "assign-chip"
  }, a.yearGroup || "Any year", " ", a.classGroup ? `\u00b7 ${a.classGroup}` : "", a.dueAt ? ` \u00b7 due ${a.dueAt}` : "", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onUnassign(a.id),
    "aria-label": "Remove assignment"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "X",
    size: 11
  }))))));
}
function QuizManagerPanel() {
  const [sets, setSets] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [classGroups, setClassGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | "new" | quizSet object
  const [expandedId, setExpandedId] = useState(null);
  const [banner, setBanner] = useState(null);
  function load() {
    setLoading(true);
    Promise.all([apiGet("/api/admin/quiz-sets"), apiGet("/api/admin/quiz-assignments"), apiGet("/api/admin/classes")]).then(([s, a, c]) => {
      setSets(s);
      setAssignments(a);
      setClassGroups(c);
    }).catch(() => {}).finally(() => setLoading(false));
  }
  useEffect(load, []);
  async function handleDelete(set) {
    if (!window.confirm(`Delete quiz "${set.name}"? This cannot be undone.`)) return;
    try {
      await apiDelete(`/api/admin/quiz-sets/${set.id}`);
      load();
    } catch (e) {/* ignore */}
  }
  async function handleAssign(setId, payload) {
    await apiPost("/api/admin/quiz-assignments", {
      quizSetId: setId,
      ...payload
    });
    load();
  }
  async function handleUnassign(assignmentId) {
    await apiDelete(`/api/admin/quiz-assignments/${assignmentId}`);
    load();
  }
  if (editing) {
    return /*#__PURE__*/React.createElement("div", {
      className: "tab-content admin-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "panel-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, editing === "new" ? "New quiz" : `Edit "${editing.name}"`))), /*#__PURE__*/React.createElement(QuizSetBuilder, {
      existing: editing === "new" ? null : editing,
      onSaved: () => {
        setEditing(null);
        load();
      },
      onCancel: () => setEditing(null)
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content admin-content"
  }, banner && /*#__PURE__*/React.createElement("div", {
    className: "admin-banner" + (banner.isError ? " error" : "")
  }, /*#__PURE__*/React.createElement("span", null, banner.text), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setBanner(null),
    "aria-label": "Dismiss"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "X",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Quizzes"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Write your own quizzes, mix in built-in questions, then assign to a class or mark as a practice bank.")), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: () => setEditing("new")
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "UserPlus",
    size: 18
  }), " New quiz")), loading && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Loading..."), !loading && sets.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "No custom quizzes yet."), /*#__PURE__*/React.createElement("div", {
    className: "qb-set-list"
  }, sets.map(set => {
    const setAssignments = assignments.filter(a => a.quizSetId === set.id);
    const isOpen = expandedId === set.id;
    return /*#__PURE__*/React.createElement("div", {
      className: "qb-set-card",
      key: set.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "qb-set-head",
      onClick: () => setExpandedId(isOpen ? null : set.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "qb-set-name"
    }, set.name, " ", set.isPracticeBank && /*#__PURE__*/React.createElement("span", {
      className: "needs-marking-badge",
      style: {
        background: "#EDF5EE",
        color: "#2A5B37"
      }
    }, "practice bank")), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, set.questions.length, " question", set.questions.length === 1 ? "" : "s"), /*#__PURE__*/React.createElement(IconGlyph, {
      name: "ChevronDown",
      size: 14,
      className: "chevron" + (isOpen ? " up" : "")
    })), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "qb-set-body"
    }, set.description && /*#__PURE__*/React.createElement("p", {
      className: "sub"
    }, set.description), /*#__PURE__*/React.createElement("div", {
      className: "qb-set-actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-secondary",
      onClick: () => setEditing(set)
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "PenLine",
      size: 14
    }), " Edit"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-text",
      onClick: () => handleDelete(set)
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "Trash2",
      size: 14
    }), " Delete")), /*#__PURE__*/React.createElement("span", {
      className: "help-label"
    }, "Assign to a class"), /*#__PURE__*/React.createElement(AssignPanel, {
      itemLabel: "quiz",
      existingAssignments: setAssignments,
      onAssign: payload => handleAssign(set.id, payload),
      onUnassign: handleUnassign,
      classGroups: classGroups
    })));
  })));
}

/* ===== admin-tasks.jsx ===== */
function TaskBuilder({
  onSaved,
  onCancel
}) {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("written");
  const [framework, setFramework] = useState("accessfm");
  const [instructions, setInstructions] = useState("");
  const [isPracticeBank, setIsPracticeBank] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
  async function handleSave() {
    if (!title.trim()) {
      setError("Give the task a title.");
      return;
    }
    if (taskType === "image" && !imageFile) {
      setError("Choose an image to upload for an image task.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("taskType", taskType);
      formData.append("framework", framework);
      formData.append("instructions", instructions.trim());
      formData.append("isPracticeBank", isPracticeBank ? "true" : "false");
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        credentials: "same-origin",
        body: formData
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Could not create task.");
      onSaved(body);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "qb-builder"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qb-meta"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Task title"), /*#__PURE__*/React.createElement("input", {
    value: title,
    onChange: e => setTitle(e.target.value),
    placeholder: "e.g. Analyse this kettle",
    autoFocus: true
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Task type"), /*#__PURE__*/React.createElement("select", {
    value: taskType,
    onChange: e => setTaskType(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "written"
  }, "Written task (a prompt to respond to)"), /*#__PURE__*/React.createElement("option", {
    value: "image"
  }, "Image task (upload a photo to analyse)"))), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Framework"), /*#__PURE__*/React.createElement("select", {
    value: framework,
    onChange: e => setFramework(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "accessfm"
  }, "ACCESSFM"), /*#__PURE__*/React.createElement("option", {
    value: "scamper"
  }, "SCAMPER"))), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Instructions ", taskType === "image" ? "(optional, shown alongside the photo)" : ""), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: instructions,
    onChange: e => setInstructions(e.target.value),
    placeholder: "What should students do?"
  })), taskType === "image" && /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Upload image"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/jpeg,image/png,image/webp,image/gif",
    onChange: handleImageChange
  })), imagePreview && /*#__PURE__*/React.createElement("img", {
    src: imagePreview,
    alt: "Preview",
    className: "qb-image-preview"
  }), /*#__PURE__*/React.createElement("label", {
    className: "qb-checkbox-label"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: isPracticeBank,
    onChange: e => setIsPracticeBank(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "Practice bank \u2014 any student can do this any time (in addition to any class you assign it to)"))), error && /*#__PURE__*/React.createElement("p", {
    className: "login-error"
  }, error), /*#__PURE__*/React.createElement("div", {
    className: "qb-save-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: handleSave,
    disabled: saving
  }, saving ? "Saving..." : "Create task"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: onCancel
  }, "Cancel")));
}
function TaskManagerPanel() {
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [classGroups, setClassGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  function load() {
    setLoading(true);
    Promise.all([apiGet("/api/admin/tasks"), apiGet("/api/admin/task-assignments"), apiGet("/api/admin/classes")]).then(([t, a, c]) => {
      setTasks(t);
      setAssignments(a);
      setClassGroups(c);
    }).catch(() => {}).finally(() => setLoading(false));
  }
  useEffect(load, []);
  async function handleDelete(task) {
    if (!window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) return;
    try {
      await apiDelete(`/api/admin/tasks/${task.id}`);
      load();
    } catch (e) {/* ignore */}
  }
  async function handleAssign(taskId, payload) {
    await apiPost("/api/admin/task-assignments", {
      taskId,
      ...payload
    });
    load();
  }
  async function handleUnassign(assignmentId) {
    await apiDelete(`/api/admin/task-assignments/${assignmentId}`);
    load();
  }
  if (creating) {
    return /*#__PURE__*/React.createElement("div", {
      className: "tab-content admin-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "panel-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "New task"))), /*#__PURE__*/React.createElement(TaskBuilder, {
      onSaved: () => {
        setCreating(false);
        load();
      },
      onCancel: () => setCreating(false)
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content admin-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Tasks"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Assign a specific written or image-analysis task to a class, or add it to the practice bank.")), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: () => setCreating(true)
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "UserPlus",
    size: 18
  }), " New task")), loading && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Loading..."), !loading && tasks.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "No tasks yet."), /*#__PURE__*/React.createElement("div", {
    className: "qb-set-list"
  }, tasks.map(task => {
    const taskAssignments = assignments.filter(a => a.taskId === task.id);
    const isOpen = expandedId === task.id;
    return /*#__PURE__*/React.createElement("div", {
      className: "qb-set-card",
      key: task.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "qb-set-head",
      onClick: () => setExpandedId(isOpen ? null : task.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "qb-set-name"
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: task.taskType === "image" ? "Palette" : "PenLine",
      size: 14,
      style: {
        marginRight: 6,
        verticalAlign: "-2px"
      }
    }), task.title, " ", task.isPracticeBank && /*#__PURE__*/React.createElement("span", {
      className: "needs-marking-badge",
      style: {
        background: "#EDF5EE",
        color: "#2A5B37"
      }
    }, "practice bank")), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, FRAMEWORKS[task.framework] ? FRAMEWORKS[task.framework].label : task.framework), /*#__PURE__*/React.createElement(IconGlyph, {
      name: "ChevronDown",
      size: 14,
      className: "chevron" + (isOpen ? " up" : "")
    })), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "qb-set-body"
    }, task.imageUrl && /*#__PURE__*/React.createElement("img", {
      src: task.imageUrl,
      alt: task.title,
      className: "qb-image-preview"
    }), task.instructions && /*#__PURE__*/React.createElement("p", {
      className: "sub"
    }, task.instructions), /*#__PURE__*/React.createElement("div", {
      className: "qb-set-actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-text",
      onClick: () => handleDelete(task)
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "Trash2",
      size: 14
    }), " Delete")), /*#__PURE__*/React.createElement("span", {
      className: "help-label"
    }, "Assign to a class"), /*#__PURE__*/React.createElement(AssignPanel, {
      itemLabel: "task",
      existingAssignments: taskAssignments,
      onAssign: payload => handleAssign(task.id, payload),
      onUnassign: handleUnassign,
      classGroups: classGroups
    })));
  })));
}

/* ===== admin-gradebook.jsx ===== */
function GradebookPanel() {
  const [students, setStudents] = useState([]);
  const [yearGroup, setYearGroup] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    apiGet("/api/admin/users").then(setStudents).catch(() => {});
  }, []);
  const yearOptions = [...new Set(students.map(s => s.yearGroup).filter(Boolean))].sort();
  const classOptions = [...new Set(students.map(s => s.classGroup).filter(Boolean))].sort();
  function loadGradebook() {
    if (!yearGroup && !classGroup) {
      setError("Pick a year and/or class first.");
      return;
    }
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      yearGroup,
      classGroup
    }).toString();
    apiGet(`/api/admin/gradebook?${params}`).then(setData).catch(e => setError(e.message)).finally(() => setLoading(false));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content admin-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Gradebook"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Pick a year and/or class to see everyone's scores on assigned quizzes and tasks, side by side."))), /*#__PURE__*/React.createElement("div", {
    className: "student-filters no-print"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Year"), /*#__PURE__*/React.createElement("select", {
    value: yearGroup,
    onChange: e => setYearGroup(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Any year"), yearOptions.map(y => /*#__PURE__*/React.createElement("option", {
    key: y,
    value: y
  }, y)))), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Class"), /*#__PURE__*/React.createElement("select", {
    value: classGroup,
    onChange: e => setClassGroup(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Any class"), classOptions.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c)))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-primary",
    onClick: loadGradebook,
    disabled: loading
  }, loading ? "Loading..." : "Show gradebook")), error && /*#__PURE__*/React.createElement("p", {
    className: "export-error"
  }, error), data && /*#__PURE__*/React.createElement(React.Fragment, null, data.students.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "No students match that year/class."), data.quizItems.length === 0 && data.taskItems.length === 0 && data.students.length > 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "No quizzes or tasks have been assigned to this class yet \u2014 assign some from the Quizzes or Tasks tab."), data.students.length > 0 && (data.quizItems.length > 0 || data.taskItems.length > 0) && /*#__PURE__*/React.createElement("div", {
    className: "gradebook-scroll"
  }, /*#__PURE__*/React.createElement("table", {
    className: "gradebook-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "gradebook-student-col"
  }, "Student"), data.quizItems.map(qi => /*#__PURE__*/React.createElement("th", {
    key: "q" + qi.assignmentId
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Wrench",
    size: 13
  }), " ", qi.name)), data.taskItems.map(ti => /*#__PURE__*/React.createElement("th", {
    key: "t" + ti.assignmentId
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "PenLine",
    size: 13
  }), " ", ti.title)))), /*#__PURE__*/React.createElement("tbody", null, data.students.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "gradebook-student-col"
  }, s.displayName), data.quizItems.map(qi => {
    const cell = data.quizCells[s.id] && data.quizCells[s.id][qi.quizSetId];
    if (!cell) return /*#__PURE__*/React.createElement("td", {
      key: "q" + qi.assignmentId,
      className: "gradebook-cell empty"
    }, "\u2014");
    const pct = cell.total > 0 ? Math.round(cell.score / cell.total * 100) : 0;
    return /*#__PURE__*/React.createElement("td", {
      key: "q" + qi.assignmentId,
      className: "gradebook-cell" + (cell.markedComplete ? " marked" : " unmarked")
    }, pct, "% ", /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, "(", cell.score, "/", cell.total, ")"), !cell.markedComplete && /*#__PURE__*/React.createElement(IconGlyph, {
      name: "Lightbulb",
      size: 11,
      style: {
        color: "#8A6A1E",
        marginLeft: 4
      }
    }));
  }), data.taskItems.map(ti => {
    const cell = data.taskCells[s.id] && data.taskCells[s.id][ti.taskId];
    if (!cell) return /*#__PURE__*/React.createElement("td", {
      key: "t" + ti.assignmentId,
      className: "gradebook-cell empty"
    }, "Not started");
    const label = cell.markedComplete ? "Marked" : cell.status === "submitted" ? "Submitted" : "Draft only";
    const cellClass = cell.markedComplete ? "marked" : cell.status === "submitted" ? "unmarked" : "empty";
    return /*#__PURE__*/React.createElement("td", {
      key: "t" + ti.assignmentId,
      className: "gradebook-cell " + cellClass
    }, label, !cell.markedComplete && cell.status === "submitted" && /*#__PURE__*/React.createElement(IconGlyph, {
      name: "Lightbulb",
      size: 11,
      style: {
        color: "#8A6A1E",
        marginLeft: 4
      }
    }));
  })))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "gradebook-student-col"
  }, /*#__PURE__*/React.createElement("strong", null, "Class average")), data.quizItems.map(qi => /*#__PURE__*/React.createElement("td", {
    key: "q" + qi.assignmentId,
    className: "gradebook-cell average"
  }, data.quizAverages[qi.quizSetId] !== null && data.quizAverages[qi.quizSetId] !== undefined ? `${data.quizAverages[qi.quizSetId]}%` : "\u2014")), data.taskItems.map(ti => /*#__PURE__*/React.createElement("td", {
    key: "t" + ti.assignmentId,
    className: "gradebook-cell average"
  }, "\u2014"))))))));
}

/* ===== admin.jsx ===== */
/* ------------------------------------------------------------------ */
/* PDF EXPORT HELPERS (admin side)                                     */
/* ------------------------------------------------------------------ */

async function exportSubmissionPDF(student, sub) {
  if (!window.jspdf) {
    await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  }
  const {
    jsPDF
  } = window.jspdf;
  const fw = FRAMEWORKS[sub.framework];
  const doc = new jsPDF({
    unit: "pt",
    format: "a4"
  });
  const marginX = 50;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxWidth = pageW - marginX * 2;
  let y = 56;
  const heading = `${fw.label} ${sub.toolMode === "analyze" ? "Product Analysis" : "Design Worksheet"}`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(22, 50, 79);
  doc.text(heading, marginX, y);
  y += 26;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(90, 100, 110);
  doc.text(`Student: ${student.displayName} (@${student.username})`, marginX, y);
  y += 15;
  doc.text(`Product: ${sub.productName || "\u2014"}`, marginX, y);
  y += 15;
  if (sub.brand) {
    doc.text(`Made by: ${sub.brand}`, marginX, y);
    y += 15;
  }
  y += 8;
  doc.setDrawColor(216, 211, 196);
  doc.line(marginX, y, pageW - marginX, y);
  y += 22;
  fw.items.forEach(item => {
    const q = sub.toolMode === "analyze" ? item.analyzePrompt : item.prompt;
    const a = sub.answers[item.id] || "(no answer)";
    const qLines = doc.splitTextToSize(q, maxWidth);
    const aLines = doc.splitTextToSize(a, maxWidth);
    const blockHeight = 20 + qLines.length * 13 + 6 + aLines.length * 14 + 16;
    if (y + blockHeight > pageH - 48) {
      doc.addPage();
      y = 56;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(22, 50, 79);
    doc.text(`${item.letter} \u2014 ${item.word}`, marginX, y);
    y += 17;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(90, 100, 110);
    doc.text(qLines, marginX, y);
    y += qLines.length * 13 + 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 34, 38);
    doc.text(aLines, marginX, y);
    y += aLines.length * 14 + 20;
  });
  if (sub.feedback) {
    if (y + 60 > pageH - 48) {
      doc.addPage();
      y = 56;
    }
    doc.setDrawColor(226, 96, 28);
    doc.line(marginX, y, pageW - marginX, y);
    y += 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(226, 96, 28);
    doc.text("Teacher feedback", marginX, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 34, 38);
    const fbLines = doc.splitTextToSize(sub.feedback, maxWidth);
    doc.text(fbLines, marginX, y);
  }
  const filenameBase = `${student.username}-${(sub.productName || "worksheet").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  doc.save(`${filenameBase}.pdf`);
}
async function exportQuizAttemptPDF(student, attempt) {
  if (!window.jspdf) {
    await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  }
  const {
    jsPDF
  } = window.jspdf;
  const doc = new jsPDF({
    unit: "pt",
    format: "a4"
  });
  const marginX = 50;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxWidth = pageW - marginX * 2;
  let y = 56;
  const setLabel = FRAMEWORKS[attempt.quizSet] ? FRAMEWORKS[attempt.quizSet].label : "Mixed";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(22, 50, 79);
  doc.text(`${setLabel} Quiz \u2014 ${attempt.difficulty}`, marginX, y);
  y += 26;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(90, 100, 110);
  doc.text(`Student: ${student.displayName} (@${student.username})`, marginX, y);
  y += 15;
  doc.text(`Score: ${attempt.score} / ${attempt.total}  \u00b7  Time taken: ${formatDuration(attempt.durationSeconds)}  \u00b7  ${formatDate(attempt.takenAt)}`, marginX, y);
  y += 15;
  y += 8;
  doc.setDrawColor(216, 211, 196);
  doc.line(marginX, y, pageW - marginX, y);
  y += 22;
  (attempt.details || []).forEach((d, i) => {
    const qLines = doc.splitTextToSize(`${i + 1}. ${d.prompt}`, maxWidth);
    const ansLine = `Answer: ${d.studentAnswer}${d.correctAnswer ? `   (correct: ${d.correctAnswer})` : ""}`;
    const ansLines = doc.splitTextToSize(ansLine, maxWidth);
    const blockHeight = qLines.length * 13 + 6 + ansLines.length * 13 + 18;
    if (y + blockHeight > pageH - 48) {
      doc.addPage();
      y = 56;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(22, 50, 79);
    doc.text(qLines, marginX, y);
    y += qLines.length * 13 + 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(d.isCorrect ? 63 : 192, d.isCorrect ? 125 : 57, d.isCorrect ? 79 : 34);
    doc.text((d.isCorrect ? "\u2713 " : "\u2717 ") + ansLines[0], marginX, y);
    if (ansLines.length > 1) doc.text(ansLines.slice(1), marginX + 14, y + 13);
    y += ansLines.length * 13 + 14;
  });
  if (attempt.feedback) {
    if (y + 60 > pageH - 48) {
      doc.addPage();
      y = 56;
    }
    doc.setDrawColor(226, 96, 28);
    doc.line(marginX, y, pageW - marginX, y);
    y += 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(226, 96, 28);
    doc.text("Teacher feedback", marginX, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 34, 38);
    const fbLines = doc.splitTextToSize(attempt.feedback, maxWidth);
    doc.text(fbLines, marginX, y);
  }
  doc.save(`${student.username}-quiz-${setLabel.toLowerCase()}-${attempt.id}.pdf`);
}

/* ------------------------------------------------------------------ */
/* QUIZ ATTEMPT REVIEW (expandable, with manual override)              */
/* ------------------------------------------------------------------ */

function QuizAttemptReview({
  student,
  attemptSummary,
  onUpdated
}) {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbackDraft, setFeedbackDraft] = useState(attemptSummary.feedback || "");
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  async function toggleOpen() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (!full) {
      setLoading(true);
      try {
        const data = await apiGet(`/api/admin/quiz-attempts/${attemptSummary.id}`);
        setFull(data);
        setFeedbackDraft(data.feedback || "");
      } catch (e) {/* ignore */}
      setLoading(false);
    }
  }
  async function handleOverride(qid, isCorrect) {
    try {
      const res = await apiPatch(`/api/admin/quiz-attempts/${attemptSummary.id}/override`, {
        qid,
        isCorrect
      });
      setFull(f => ({
        ...f,
        score: res.score,
        details: res.details
      }));
      onUpdated({
        ...attemptSummary,
        score: res.score
      });
    } catch (e) {/* ignore */}
  }
  async function saveFeedback() {
    setFeedbackSaving(true);
    setFeedbackSaved(false);
    try {
      await apiPut(`/api/admin/quiz-attempts/${attemptSummary.id}/feedback`, {
        feedback: feedbackDraft
      });
      setFeedbackSaved(true);
      onUpdated({
        ...attemptSummary,
        feedback: feedbackDraft
      });
    } catch (e) {/* ignore */}
    setFeedbackSaving(false);
  }
  async function toggleMarkComplete() {
    const next = !attemptSummary.markedComplete;
    try {
      await apiPatch(`/api/admin/quiz-attempts/${attemptSummary.id}/mark-complete`, {
        complete: next
      });
      onUpdated({
        ...attemptSummary,
        markedComplete: next
      });
    } catch (e) {/* ignore */}
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "quiz-review"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quiz-history-row",
    onClick: toggleOpen
  }, /*#__PURE__*/React.createElement("span", {
    className: "quiz-history-pct"
  }, Math.round(attemptSummary.score / attemptSummary.total * 100), "%"), /*#__PURE__*/React.createElement("span", null, FRAMEWORKS[attemptSummary.quizSet] ? FRAMEWORKS[attemptSummary.quizSet].label : "Mixed"), /*#__PURE__*/React.createElement("span", {
    className: "quiz-history-diff"
  }, attemptSummary.difficulty), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, attemptSummary.score, "/", attemptSummary.total), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, formatDuration(attemptSummary.durationSeconds)), !attemptSummary.markedComplete && /*#__PURE__*/React.createElement("span", {
    className: "needs-marking-badge"
  }, "unmarked"), /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronDown",
    size: 14,
    className: "chevron" + (open ? " up" : "")
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "quiz-review-panel"
  }, loading && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Loading..."), full && !loading && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "quiz-review-questions"
  }, (full.details || []).length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "No question-by-question detail was saved for this attempt."), (full.details || []).map(d => /*#__PURE__*/React.createElement("div", {
    key: d.qid,
    className: "quiz-review-q" + (d.isCorrect ? " correct" : " wrong")
  }, /*#__PURE__*/React.createElement("p", {
    className: "quiz-review-prompt",
    style: {
      whiteSpace: "pre-line"
    }
  }, d.prompt), /*#__PURE__*/React.createElement("p", {
    className: "quiz-review-answer"
  }, /*#__PURE__*/React.createElement("strong", null, "Answer:"), " ", d.studentAnswer, d.correctAnswer ? /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, " (correct: ", d.correctAnswer, ")") : null, d.overridden && /*#__PURE__*/React.createElement("span", {
    className: "quiz-review-overridden"
  }, "manually marked")), /*#__PURE__*/React.createElement("div", {
    className: "quiz-review-toggle"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chip" + (d.isCorrect ? " active-correct" : ""),
    onClick: () => handleOverride(d.qid, true)
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Check",
    size: 13
  }), " Correct"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chip" + (!d.isCorrect ? " active-wrong" : ""),
    onClick: () => handleOverride(d.qid, false)
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "X",
    size: 13
  }), " Incorrect"))))), /*#__PURE__*/React.createElement("div", {
    className: "feedback-editor"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "Feedback for this quiz"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: feedbackDraft,
    onChange: e => {
      setFeedbackDraft(e.target.value);
      setFeedbackSaved(false);
    },
    placeholder: "Write feedback the student will see..."
  }), /*#__PURE__*/React.createElement("div", {
    className: "feedback-editor-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: saveFeedback,
    disabled: feedbackSaving
  }, feedbackSaving ? "Saving..." : "Save feedback"), feedbackSaved && /*#__PURE__*/React.createElement("span", {
    className: "change-password-success"
  }, "Saved \u2713"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text mark-complete-btn" + (attemptSummary.markedComplete ? " is-complete" : ""),
    onClick: toggleMarkComplete
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: attemptSummary.markedComplete ? "Check" : "ClipboardList",
    size: 14
  }), " ", attemptSummary.markedComplete ? "Marked complete" : "Mark as complete"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: () => exportQuizAttemptPDF(student, {
      ...full,
      feedback: feedbackDraft
    })
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "FileDown",
    size: 14
  }), " Export PDF"))))));
}

/* ------------------------------------------------------------------ */
/* ADMIN CONSOLE SHELL (header + sub-tab navigation)                   */
/* ------------------------------------------------------------------ */

function AdminConsole({
  user,
  onLogout
}) {
  const [subTab, setSubTab] = useState("students");
  const subTabs = [{
    key: "students",
    label: "Students"
  }, {
    key: "classes",
    label: "Classes"
  }, {
    key: "quizzes",
    label: "Quizzes"
  }, {
    key: "tasks",
    label: "Tasks"
  }, {
    key: "gradebook",
    label: "Gradebook"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "app-root admin-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "app-header no-print"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "app-title"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Shield",
    size: 26,
    style: {
      marginRight: 8,
      verticalAlign: "-4px"
    }
  }), "Admin ", /*#__PURE__*/React.createElement("span", null, "Console")), /*#__PURE__*/React.createElement("p", {
    className: "app-sub"
  }, "Signed in as ", user.displayName)), /*#__PURE__*/React.createElement("div", {
    className: "header-controls"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn-secondary",
    href: "/api/admin/export.csv"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "FileDown",
    size: 16
  }), " Export class CSV"), /*#__PURE__*/React.createElement(ChangePasswordForm, null), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text logout-btn",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "LogOut",
    size: 15
  }), " Log out"))), /*#__PURE__*/React.createElement("div", {
    className: "tabs no-print"
  }, subTabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "tab-btn" + (subTab === t.key ? " active" : ""),
    onClick: () => setSubTab(t.key)
  }, t.label))), subTab === "students" && /*#__PURE__*/React.createElement(StudentsPanel, {
    user: user
  }), subTab === "classes" && /*#__PURE__*/React.createElement(ClassesPanel, null), subTab === "quizzes" && /*#__PURE__*/React.createElement(QuizManagerPanel, null), subTab === "tasks" && /*#__PURE__*/React.createElement(TaskManagerPanel, null), subTab === "gradebook" && /*#__PURE__*/React.createElement(GradebookPanel, null));
}

/* ------------------------------------------------------------------ */
/* SUBMISSION REVIEW (worksheet, with feedback)                        */
/* ------------------------------------------------------------------ */

function SubmissionReview({
  student,
  sub,
  onUpdated
}) {
  const [feedbackDraft, setFeedbackDraft] = useState(sub.feedback || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  async function saveFeedback() {
    setSaving(true);
    setSaved(false);
    try {
      await apiPut(`/api/admin/submissions/${sub.id}/feedback`, {
        feedback: feedbackDraft
      });
      setSaved(true);
      onUpdated({
        ...sub,
        feedback: feedbackDraft
      });
    } catch (e) {/* ignore */}
    setSaving(false);
  }
  async function toggleMarkComplete() {
    const next = !sub.markedComplete;
    try {
      await apiPatch(`/api/admin/submissions/${sub.id}/mark-complete`, {
        complete: next
      });
      onUpdated({
        ...sub,
        markedComplete: next
      });
    } catch (e) {/* ignore */}
  }
  return /*#__PURE__*/React.createElement("details", {
    className: "submission-detail"
  }, /*#__PURE__*/React.createElement("summary", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: FRAMEWORKS[sub.framework].tint
    }
  }, FRAMEWORKS[sub.framework].label), " \u00b7 ", sub.toolMode === "analyze" ? "Analysis" : "Design", " \u00b7 ", sub.productName || "Untitled", " \u00b7 ", /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, formatDate(sub.updatedAt)), sub.feedback && /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Lightbulb",
    size: 13,
    style: {
      color: "#8A6A1E",
      marginLeft: 6
    }
  }), !sub.markedComplete && /*#__PURE__*/React.createElement("span", {
    className: "needs-marking-badge"
  }, "unmarked")), /*#__PURE__*/React.createElement("div", {
    className: "submission-answers"
  }, FRAMEWORKS[sub.framework].items.map(item => sub.answers[item.id] ? /*#__PURE__*/React.createElement("p", {
    key: item.id
  }, /*#__PURE__*/React.createElement("strong", null, item.letter, " \\u2014 ", item.word, ":"), " ", sub.answers[item.id]) : null)), /*#__PURE__*/React.createElement("div", {
    className: "feedback-editor"
  }, /*#__PURE__*/React.createElement("span", {
    className: "help-label"
  }, "Feedback for this worksheet"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: feedbackDraft,
    onChange: e => {
      setFeedbackDraft(e.target.value);
      setSaved(false);
    },
    placeholder: "Write feedback the student will see..."
  }), /*#__PURE__*/React.createElement("div", {
    className: "feedback-editor-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-secondary",
    onClick: saveFeedback,
    disabled: saving
  }, saving ? "Saving..." : "Save feedback"), saved && /*#__PURE__*/React.createElement("span", {
    className: "change-password-success"
  }, "Saved \u2713"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text mark-complete-btn" + (sub.markedComplete ? " is-complete" : ""),
    onClick: toggleMarkComplete
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: sub.markedComplete ? "Check" : "ClipboardList",
    size: 14
  }), " ", sub.markedComplete ? "Marked complete" : "Mark as complete"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: () => exportSubmissionPDF(student, {
      ...sub,
      feedback: feedbackDraft
    })
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "FileDown",
    size: 14
  }), " Export PDF"))));
}

/* ------------------------------------------------------------------ */
/* ADMIN CONSOLE                                                        */
/* ------------------------------------------------------------------ */

function StudentsPanel({
  user
}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [detail, setDetail] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newClassGroup, setNewClassGroup] = useState("");
  const [newYearGroup, setNewYearGroup] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addBusy, setAddBusy] = useState(false);
  const [addError, setAddError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    displayName: "",
    classGroup: "",
    yearGroup: ""
  });
  const [filterYear, setFilterYear] = useState("");
  const [filterClass, setFilterClass] = useState("");
  function loadStudents() {
    setLoading(true);
    apiGet("/api/admin/users").then(rows => {
      setStudents(rows);
      setError("");
    }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }
  useEffect(loadStudents, []);
  async function handleAddStudent(e) {
    e.preventDefault();
    if (!newUsername.trim() || !newDisplayName.trim()) return;
    if (!newYearGroup.trim() || !newClassGroup.trim()) {
      setAddError("Year group and class group are both required.");
      return;
    }
    if (newPassword.trim() && newPassword.trim().length < 6) {
      setAddError("Password must be at least 6 characters (or leave it blank to auto-generate one).");
      return;
    }
    setAddBusy(true);
    setAddError("");
    try {
      const created = await apiPost("/api/admin/users", {
        username: newUsername.trim(),
        displayName: newDisplayName.trim(),
        classGroup: newClassGroup.trim(),
        yearGroup: newYearGroup.trim(),
        password: newPassword.trim() || undefined
      });
      setBanner({
        text: `Created "${created.username}" \u2014 password: ${created.temporaryPassword}`
      });
      setNewUsername("");
      setNewDisplayName("");
      setNewClassGroup("");
      setNewYearGroup("");
      setNewPassword("");
      setShowAddForm(false);
      loadStudents();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddBusy(false);
    }
  }
  async function handleResetPassword(student) {
    const chosen = window.prompt(`Set a new password for ${student.displayName} (${student.username}).\n\nType a specific password (at least 6 characters), or leave this blank to auto-generate a random one.`, "");
    if (chosen === null) return;
    const trimmed = chosen.trim();
    if (trimmed && trimmed.length < 6) {
      setBanner({
        text: "Password must be at least 6 characters (or leave it blank to auto-generate one).",
        isError: true
      });
      return;
    }
    try {
      const res = await apiPost(`/api/admin/users/${student.id}/reset-password`, trimmed ? {
        password: trimmed
      } : {});
      setBanner({
        text: `New password for ${student.username}: ${res.temporaryPassword}`
      });
    } catch (err) {
      setBanner({
        text: `Couldn't reset password: ${err.message}`,
        isError: true
      });
    }
  }
  async function handleDelete(student) {
    if (!window.confirm(`Delete ${student.displayName} (${student.username})? This removes their account and all saved work permanently.`)) return;
    try {
      await apiDelete(`/api/admin/users/${student.id}`);
      loadStudents();
    } catch (err) {
      setBanner({
        text: `Couldn't delete: ${err.message}`,
        isError: true
      });
    }
  }
  function startEdit(student, ev) {
    ev.stopPropagation();
    setEditingId(student.id);
    setEditDraft({
      displayName: student.displayName,
      classGroup: student.classGroup || "",
      yearGroup: student.yearGroup || ""
    });
  }
  async function saveEdit(student, ev) {
    ev.stopPropagation();
    try {
      await apiPatch(`/api/admin/users/${student.id}`, editDraft);
      setEditingId(null);
      loadStudents();
    } catch (err) {
      setBanner({
        text: `Couldn't update: ${err.message}`,
        isError: true
      });
    }
  }
  async function toggleExpand(student) {
    if (expandedId === student.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(student.id);
    if (!detail[student.id]) {
      setDetail(d => ({
        ...d,
        [student.id]: {
          loading: true
        }
      }));
      try {
        const [submissions, quizAttempts] = await Promise.all([apiGet(`/api/admin/users/${student.id}/submissions`), apiGet(`/api/admin/users/${student.id}/quiz-attempts`)]);
        setDetail(d => ({
          ...d,
          [student.id]: {
            submissions,
            quizAttempts,
            loading: false
          }
        }));
      } catch (err) {
        setDetail(d => ({
          ...d,
          [student.id]: {
            error: err.message,
            loading: false
          }
        }));
      }
    }
  }
  function updateDetailSubmission(studentId, updatedSub) {
    setDetail(d => {
      const entry = d[studentId];
      if (!entry) return d;
      return {
        ...d,
        [studentId]: {
          ...entry,
          submissions: entry.submissions.map(s => s.id === updatedSub.id ? updatedSub : s)
        }
      };
    });
  }
  function updateDetailQuizAttempt(studentId, updatedAttempt) {
    setDetail(d => {
      const entry = d[studentId];
      if (!entry) return d;
      return {
        ...d,
        [studentId]: {
          ...entry,
          quizAttempts: entry.quizAttempts.map(q => q.id === updatedAttempt.id ? {
            ...q,
            ...updatedAttempt
          } : q)
        }
      };
    });
  }
  const yearOptions = [...new Set(students.map(s => s.yearGroup).filter(Boolean))].sort();
  const classOptions = [...new Set(students.map(s => s.classGroup).filter(Boolean))].sort();
  const visibleStudents = students.filter(s => (!filterYear || s.yearGroup === filterYear) && (!filterClass || s.classGroup === filterClass));
  const classBlocks = (() => {
    const map = new Map();
    students.forEach(s => {
      const key = `${s.yearGroup || "\u2014"}|${s.classGroup || "\u2014"}`;
      if (!map.has(key)) map.set(key, {
        yearGroup: s.yearGroup,
        classGroup: s.classGroup,
        count: 0,
        needsMarking: 0
      });
      const entry = map.get(key);
      entry.count++;
      entry.needsMarking += s.needsMarkingCount || 0;
    });
    return [...map.values()].sort((a, b) => (a.yearGroup || "").localeCompare(b.yearGroup || "") || (a.classGroup || "").localeCompare(b.classGroup || ""));
  })();
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-content admin-content"
  }, banner && /*#__PURE__*/React.createElement("div", {
    className: "admin-banner" + (banner.isError ? " error" : "")
  }, /*#__PURE__*/React.createElement("span", null, banner.text), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setBanner(null),
    "aria-label": "Dismiss"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "X",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Students"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, students.length, " account", students.length === 1 ? "" : "s", ". Click a row to see their saved work and quiz scores.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-secondary",
    onClick: () => setShowCsvImport(s => !s)
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "FileDown",
    size: 16
  }), " ", showCsvImport ? "Cancel" : "Import CSV"), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: () => setShowAddForm(s => !s)
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "UserPlus",
    size: 18
  }), " ", showAddForm ? "Cancel" : "Add student"))), showCsvImport && /*#__PURE__*/React.createElement(CsvImportPanel, {
    onImported: () => {
      loadStudents();
    },
    onBanner: setBanner
  }), showAddForm && /*#__PURE__*/React.createElement("form", {
    className: "add-student-form",
    onSubmit: handleAddStudent
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Username"), /*#__PURE__*/React.createElement("input", {
    value: newUsername,
    onChange: e => setNewUsername(e.target.value),
    placeholder: "e.g. jsmith",
    autoFocus: true
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Display name"), /*#__PURE__*/React.createElement("input", {
    value: newDisplayName,
    onChange: e => setNewDisplayName(e.target.value),
    placeholder: "e.g. Jamie Smith"
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Year group *"), /*#__PURE__*/React.createElement("input", {
    value: newYearGroup,
    onChange: e => setNewYearGroup(e.target.value),
    placeholder: "e.g. Year 9",
    list: "year-group-options",
    required: true
  }), /*#__PURE__*/React.createElement("datalist", {
    id: "year-group-options"
  }, yearOptions.map(y => /*#__PURE__*/React.createElement("option", {
    key: y,
    value: y
  })))), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Class group *"), /*#__PURE__*/React.createElement("input", {
    value: newClassGroup,
    onChange: e => setNewClassGroup(e.target.value),
    placeholder: "e.g. 9A",
    list: "class-group-options",
    required: true
  }), /*#__PURE__*/React.createElement("datalist", {
    id: "class-group-options"
  }, classOptions.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  })))), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Password (optional)"), /*#__PURE__*/React.createElement("input", {
    value: newPassword,
    onChange: e => setNewPassword(e.target.value),
    placeholder: "Leave blank to auto-generate"
  })), addError && /*#__PURE__*/React.createElement("p", {
    className: "login-error",
    style: {
      gridColumn: "1 / -1"
    }
  }, addError), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    type: "submit",
    disabled: addBusy,
    style: {
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Key",
    size: 16
  }), " ", addBusy ? "Creating..." : "Create account")), classBlocks.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "class-blocks no-print"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "class-block" + (!filterYear && !filterClass ? " active" : ""),
    onClick: () => {
      setFilterYear("");
      setFilterClass("");
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "class-block-name"
  }, "All students"), /*#__PURE__*/React.createElement("span", {
    className: "class-block-count"
  }, students.length)), classBlocks.map(b => /*#__PURE__*/React.createElement("button", {
    key: `${b.yearGroup}|${b.classGroup}`,
    type: "button",
    className: "class-block" + (filterYear === (b.yearGroup || "") && filterClass === (b.classGroup || "") ? " active" : ""),
    onClick: () => {
      setFilterYear(b.yearGroup || "");
      setFilterClass(b.classGroup || "");
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "class-block-name"
  }, b.yearGroup || "No year", " ", b.classGroup ? `\u00b7 ${b.classGroup}` : ""), /*#__PURE__*/React.createElement("span", {
    className: "class-block-count"
  }, b.count), b.needsMarking > 0 && /*#__PURE__*/React.createElement("span", {
    className: "class-block-badge"
  }, b.needsMarking, " to mark")))), students.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "student-filters no-print"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Year"), /*#__PURE__*/React.createElement("select", {
    value: filterYear,
    onChange: e => setFilterYear(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All years"), yearOptions.map(y => /*#__PURE__*/React.createElement("option", {
    key: y,
    value: y
  }, y)))), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Class"), /*#__PURE__*/React.createElement("select", {
    value: filterClass,
    onChange: e => setFilterClass(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All classes"), classOptions.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c)))), (filterYear || filterClass) && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text",
    onClick: () => {
      setFilterYear("");
      setFilterClass("");
    }
  }, "Clear filters")), loading && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Loading students..."), error && /*#__PURE__*/React.createElement("p", {
    className: "export-error"
  }, error), !loading && students.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "No students yet \u2014 add your first account above."), !loading && students.length > 0 && visibleStudents.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "No students match this filter."), !loading && visibleStudents.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "student-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "student-table-head"
  }, /*#__PURE__*/React.createElement("span", null, "Student"), /*#__PURE__*/React.createElement("span", null, "Year"), /*#__PURE__*/React.createElement("span", null, "Class"), /*#__PURE__*/React.createElement("span", null, "Saved work"), /*#__PURE__*/React.createElement("span", null, "Quizzes"), /*#__PURE__*/React.createElement("span", null, "Last active"), /*#__PURE__*/React.createElement("span", null)), visibleStudents.map(s => {
    const isOpen = expandedId === s.id;
    const isEditing = editingId === s.id;
    const d = detail[s.id];
    const lastActive = [s.lastWorkAt, s.lastQuizAt].filter(Boolean).sort().pop();
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: s.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "student-row",
      onClick: () => !isEditing && toggleExpand(s)
    }, /*#__PURE__*/React.createElement("span", {
      className: "student-row-name"
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "ChevronDown",
      size: 14,
      className: "chevron" + (isOpen ? " up" : "")
    }), s.displayName, " ", /*#__PURE__*/React.createElement("span", {
      className: "mono student-username"
    }, "@", s.username), s.needsMarkingCount > 0 && /*#__PURE__*/React.createElement("span", {
      className: "needs-marking-badge"
    }, s.needsMarkingCount, " to mark")), /*#__PURE__*/React.createElement("span", null, s.yearGroup || "\u2014"), /*#__PURE__*/React.createElement("span", null, s.classGroup || "\u2014"), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, s.submissionCount), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, s.quizCount), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, lastActive ? formatDate(lastActive) : "Never"), /*#__PURE__*/React.createElement("span", {
      className: "student-row-actions",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "icon-btn",
      title: "Edit class/year",
      onClick: e => isEditing ? setEditingId(null) : startEdit(s, e)
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "PenLine",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "icon-btn",
      title: "Reset password",
      onClick: () => handleResetPassword(s)
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "Key",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "icon-btn danger",
      title: "Delete student",
      onClick: () => handleDelete(s)
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "Trash2",
      size: 15
    })))), isEditing && /*#__PURE__*/React.createElement("div", {
      className: "student-edit-row",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Display name"), /*#__PURE__*/React.createElement("input", {
      value: editDraft.displayName,
      onChange: e => setEditDraft(d => ({
        ...d,
        displayName: e.target.value
      }))
    })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Year group"), /*#__PURE__*/React.createElement("input", {
      value: editDraft.yearGroup,
      onChange: e => setEditDraft(d => ({
        ...d,
        yearGroup: e.target.value
      })),
      placeholder: "e.g. Year 10"
    })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Class group"), /*#__PURE__*/React.createElement("input", {
      value: editDraft.classGroup,
      onChange: e => setEditDraft(d => ({
        ...d,
        classGroup: e.target.value
      })),
      placeholder: "e.g. 10B"
    })), /*#__PURE__*/React.createElement("div", {
      className: "student-edit-actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-primary",
      onClick: e => saveEdit(s, e)
    }, "Save"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-text",
      onClick: () => setEditingId(null)
    }, "Cancel"))), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "student-detail"
    }, (!d || d.loading) && /*#__PURE__*/React.createElement("p", {
      className: "sub"
    }, "Loading..."), d && d.error && /*#__PURE__*/React.createElement("p", {
      className: "export-error"
    }, d.error), d && !d.loading && !d.error && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "student-detail-col"
    }, /*#__PURE__*/React.createElement("span", {
      className: "help-label"
    }, "Saved worksheets"), d.submissions.length === 0 && /*#__PURE__*/React.createElement("p", {
      className: "sub"
    }, "None saved yet."), d.submissions.map(sub => /*#__PURE__*/React.createElement(SubmissionReview, {
      key: sub.id,
      student: s,
      sub: sub,
      onUpdated: u => updateDetailSubmission(s.id, u)
    }))), /*#__PURE__*/React.createElement("div", {
      className: "student-detail-col"
    }, /*#__PURE__*/React.createElement("span", {
      className: "help-label"
    }, "Quiz history"), d.quizAttempts.length === 0 && /*#__PURE__*/React.createElement("p", {
      className: "sub"
    }, "No attempts yet."), d.quizAttempts.map(q => /*#__PURE__*/React.createElement(QuizAttemptReview, {
      key: q.id,
      student: s,
      attemptSummary: q,
      onUpdated: u => updateDetailQuizAttempt(s.id, u)
    }))))));
  })));
}

/* ===== root.jsx ===== */
function App() {
  const [user, setUser] = useState(undefined); // undefined = checking, null = logged out

  useEffect(() => {
    apiGet("/api/me").then(setUser).catch(() => setUser(null));
  }, []);
  async function handleLogout() {
    try {
      await apiPost("/api/logout", {});
    } catch (e) {/* ignore */}
    setUser(null);
  }
  if (user === undefined) {
    return /*#__PURE__*/React.createElement("div", {
      className: "loading-screen"
    }, "Loading DT Classroom Helper\u2026");
  }
  if (!user) {
    return /*#__PURE__*/React.createElement(LoginScreen, {
      onLogin: setUser
    });
  }
  if (user.role === "admin") {
    return /*#__PURE__*/React.createElement(AdminConsole, {
      user: user,
      onLogout: handleLogout
    });
  }
  return /*#__PURE__*/React.createElement(StudentApp, {
    user: user,
    onLogout: handleLogout
  });
}
const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(/*#__PURE__*/React.createElement(App, null));
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
    tint: "#2F8FA6"
  },
  scamper: {
    label: "SCAMPER",
    full: "A toolkit for generating new ideas and improving existing designs",
    items: SCAMPER,
    tint: "#E2601B"
  }
};

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
  Shield: "shield"
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

/* ------------------------------------------------------------------ */
/* QUIZ TAB                                                             */
/* ------------------------------------------------------------------ */

function QuizTab({
  currentUser
}) {
  const [mode, setMode] = useState("accessfm");
  const [difficulty, setDifficulty] = useState("standard");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [typedValue, setTypedValue] = useState("");
  const [typedChecked, setTypedChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  useEffect(() => {
    apiGet("/api/quiz-attempts").then(rows => {
      setHistory(rows);
      setHistoryLoaded(true);
    }).catch(() => setHistoryLoaded(true));
  }, []);
  function start() {
    const keys = mode === "mixed" ? ["accessfm", "scamper"] : [mode];
    const qs = buildQuiz(keys, difficulty);
    setQuestions(qs);
    setIdx(0);
    setScore(0);
    setPicked(null);
    setTypedValue("");
    setTypedChecked(false);
    setFinished(false);
    setStarted(true);
  }
  function choose(option) {
    if (picked) return;
    setPicked(option);
    if (option === questions[idx].answer) setScore(s => s + 1);
  }
  function checkTyped() {
    if (typedChecked) return;
    setTypedChecked(true);
    if (typedAnswerLooksGood(typedValue, questions[idx].keywords)) setScore(s => s + 1);
  }
  async function next() {
    if (idx + 1 >= questions.length) {
      setFinished(true);
      try {
        await apiPost("/api/quiz-attempts", {
          quizSet: mode,
          difficulty,
          score,
          total: questions.length
        });
        const rows = await apiGet("/api/quiz-attempts");
        setHistory(rows);
      } catch (e) {/* non-fatal: quiz result just won't be saved */}
    } else {
      setIdx(i => i + 1);
      setPicked(null);
      setTypedValue("");
      setTypedChecked(false);
    }
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
    }), " Start quiz"), historyLoaded && history.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "quiz-history"
    }, /*#__PURE__*/React.createElement("span", {
      className: "quiz-history-label"
    }, "Your recent attempts"), /*#__PURE__*/React.createElement("div", {
      className: "quiz-history-list"
    }, history.slice(0, 6).map(h => /*#__PURE__*/React.createElement("div", {
      className: "quiz-history-row",
      key: h.id
    }, /*#__PURE__*/React.createElement("span", {
      className: "quiz-history-pct"
    }, Math.round(h.score / h.total * 100), "%"), /*#__PURE__*/React.createElement("span", null, FRAMEWORKS[h.quizSet] ? FRAMEWORKS[h.quizSet].label : "Mixed"), /*#__PURE__*/React.createElement("span", {
      className: "quiz-history-diff"
    }, DIFFICULTY_INFO[h.difficulty] ? DIFFICULTY_INFO[h.difficulty].label : h.difficulty), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, h.score, "/", h.total)))))));
  }
  if (finished) {
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
    }, "You scored ", pct, "% on ", DIFFICULTY_INFO[difficulty].label, ". ", pct >= 70 ? "Solid work \u2014 that's a strong grasp of the framework." : "Have another go and see if you can beat it."), /*#__PURE__*/React.createElement("div", {
      className: "quiz-result-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      onClick: start
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "RotateCcw",
      size: 18
    }), " Retake this quiz"), /*#__PURE__*/React.createElement("button", {
      className: "btn-secondary",
      onClick: () => setStarted(false)
    }, "Choose a different set"))));
  }
  const q = questions[idx];
  const isCorrect = opt => picked && opt === q.answer;
  const isWrongPick = opt => picked && opt === picked && opt !== q.answer;
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quiz-progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quiz-progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${idx / questions.length * 100}%`,
      background: q.tint
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "Q", idx + 1, " / ", questions.length), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "Score ", score)), /*#__PURE__*/React.createElement("div", {
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
    className: "quiz-option" + (isCorrect(opt) ? " correct" : "") + (isWrongPick(opt) ? " wrong" : ""),
    onClick: () => choose(opt),
    disabled: !!picked
  }, /*#__PURE__*/React.createElement("span", null, opt), isCorrect(opt) && /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Check",
    size: 18
  }), isWrongPick(opt) && /*#__PURE__*/React.createElement(IconGlyph, {
    name: "X",
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
    value: typedValue,
    onChange: e => setTypedValue(e.target.value),
    placeholder: "Type a short answer...",
    disabled: typedChecked
  }), !typedChecked && /*#__PURE__*/React.createElement("button", {
    className: "btn-secondary",
    onClick: checkTyped,
    disabled: !typedValue.trim()
  }, "Check my answer"), typedChecked && /*#__PURE__*/React.createElement("div", {
    className: "typed-feedback" + (typedAnswerLooksGood(typedValue, q.keywords) ? " good" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "typed-feedback-label"
  }, typedAnswerLooksGood(typedValue, q.keywords) ? "Nice \u2014 that counts! Compare with a model answer:" : "Have a look at a model answer \u2014 try adding more detail next time:"), /*#__PURE__*/React.createElement("span", {
    className: "typed-feedback-text"
  }, q.modelAnswer))), (picked || q.type === "typed" && typedChecked) && /*#__PURE__*/React.createElement("button", {
    className: "btn-primary quiz-next",
    onClick: next
  }, idx + 1 >= questions.length ? "See results" : "Next question", " ", /*#__PURE__*/React.createElement(IconGlyph, {
    name: "ChevronRight",
    size: 18
  }))));
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
  const [savedList, setSavedList] = useState([]);
  const [savedListOpen, setSavedListOpen] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const textareaRefs = useRef({});
  const fw = FRAMEWORKS[fwKey];
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
    setSaveState("idle");
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
          answers
        });
        setCurrentId(created.id);
      }
      setSaveState("saved");
      refreshSavedList();
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
  }), " My saved work (", savedList.length, ")")), savedListOpen && /*#__PURE__*/React.createElement("div", {
    className: "saved-panel no-print"
  }, savedList.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Nothing saved yet \\u2014 fill in a worksheet below and hit Save."), savedList.map(item => /*#__PURE__*/React.createElement("div", {
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
  }, item.productName || "Untitled"), /*#__PURE__*/React.createElement("span", {
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
  }))))), /*#__PURE__*/React.createElement("div", {
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
    }, "Useful words \\u2014 tap to add one"), /*#__PURE__*/React.createElement("div", {
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
    className: "btn-primary",
    onClick: () => handleSave(false),
    disabled: saveState === "saving"
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Download",
    size: 18
  }), " ", saveState === "saving" ? "Saving..." : currentId ? "Save changes" : "Save my work"), currentId && /*#__PURE__*/React.createElement("button", {
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
  }), " ", exportState.word === "busy" ? "Preparing..." : "Export as Word (.doc)"), /*#__PURE__*/React.createElement("button", {
    className: "btn-text",
    onClick: () => window.print()
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "Printer",
    size: 15
  }), " Print instead")), exportState.pdf === "error" && /*#__PURE__*/React.createElement("p", {
    className: "export-error no-print"
  }, "Couldn't generate the PDF (needs an internet connection to load once). Try \"Print instead\"."), exportState.word === "error" && /*#__PURE__*/React.createElement("p", {
    className: "export-error no-print"
  }, "Something went wrong creating the Word file. Try again, or use \"Print instead\"."));
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
function StudentApp({
  user,
  onLogout
}) {
  const [tab, setTab] = useState("learn");
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
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "simple-toggle",
    onClick: () => setSimpleMode(s => !s),
    "aria-pressed": simpleMode
  }, /*#__PURE__*/React.createElement("span", null, "Simple English"), /*#__PURE__*/React.createElement("span", {
    className: "switch" + (simpleMode ? " on" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "switch-knob"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text logout-btn",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "LogOut",
    size: 15
  }), " Log out"))), /*#__PURE__*/React.createElement("div", {
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

/* ===== admin.jsx ===== */
function AdminConsole({
  user,
  onLogout
}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState(null); // { text }
  const [expandedId, setExpandedId] = useState(null);
  const [detail, setDetail] = useState({}); // id -> { submissions, quizAttempts, loading }
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newClassGroup, setNewClassGroup] = useState("");
  const [addBusy, setAddBusy] = useState(false);
  const [addError, setAddError] = useState("");
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
    setAddBusy(true);
    setAddError("");
    try {
      const created = await apiPost("/api/admin/users", {
        username: newUsername.trim(),
        displayName: newDisplayName.trim(),
        classGroup: newClassGroup.trim()
      });
      setBanner({
        text: `Created "${created.username}" \u2014 temporary password: ${created.temporaryPassword}`
      });
      setNewUsername("");
      setNewDisplayName("");
      setNewClassGroup("");
      setShowAddForm(false);
      loadStudents();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddBusy(false);
    }
  }
  async function handleResetPassword(student) {
    if (!window.confirm(`Reset the password for ${student.displayName} (${student.username})?`)) return;
    try {
      const res = await apiPost(`/api/admin/users/${student.id}/reset-password`, {});
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
  }), " Export class CSV"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-text logout-btn",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "LogOut",
    size: 15
  }), " Log out"))), /*#__PURE__*/React.createElement("div", {
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
  }, students.length, " account", students.length === 1 ? "" : "s", ". Click a row to see their saved work and quiz scores.")), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: () => setShowAddForm(s => !s)
  }, /*#__PURE__*/React.createElement(IconGlyph, {
    name: "UserPlus",
    size: 18
  }), " ", showAddForm ? "Cancel" : "Add student")), showAddForm && /*#__PURE__*/React.createElement("form", {
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
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Class / group (optional)"), /*#__PURE__*/React.createElement("input", {
    value: newClassGroup,
    onChange: e => setNewClassGroup(e.target.value),
    placeholder: "e.g. 9A"
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
  }), " ", addBusy ? "Creating..." : "Create account")), loading && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Loading students..."), error && /*#__PURE__*/React.createElement("p", {
    className: "export-error"
  }, error), !loading && students.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "No students yet \\u2014 add your first account above."), !loading && students.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "student-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "student-table-head"
  }, /*#__PURE__*/React.createElement("span", null, "Student"), /*#__PURE__*/React.createElement("span", null, "Class"), /*#__PURE__*/React.createElement("span", null, "Saved work"), /*#__PURE__*/React.createElement("span", null, "Quizzes"), /*#__PURE__*/React.createElement("span", null, "Last active"), /*#__PURE__*/React.createElement("span", null)), students.map(s => {
    const isOpen = expandedId === s.id;
    const d = detail[s.id];
    const lastActive = [s.lastWorkAt, s.lastQuizAt].filter(Boolean).sort().pop();
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: s.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "student-row",
      onClick: () => toggleExpand(s)
    }, /*#__PURE__*/React.createElement("span", {
      className: "student-row-name"
    }, /*#__PURE__*/React.createElement(IconGlyph, {
      name: "ChevronDown",
      size: 14,
      className: "chevron" + (isOpen ? " up" : "")
    }), s.displayName, " ", /*#__PURE__*/React.createElement("span", {
      className: "mono student-username"
    }, "@", s.username)), /*#__PURE__*/React.createElement("span", null, s.classGroup || "\u2014"), /*#__PURE__*/React.createElement("span", {
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
    })))), isOpen && /*#__PURE__*/React.createElement("div", {
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
    }, "None saved yet."), d.submissions.map(sub => /*#__PURE__*/React.createElement("details", {
      key: sub.id,
      className: "submission-detail"
    }, /*#__PURE__*/React.createElement("summary", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: FRAMEWORKS[sub.framework].tint
      }
    }, FRAMEWORKS[sub.framework].label), " \u00b7 ", sub.toolMode === "analyze" ? "Analysis" : "Design", " \u00b7 ", sub.productName || "Untitled", " \u00b7 ", /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, formatDate(sub.updatedAt))), /*#__PURE__*/React.createElement("div", {
      className: "submission-answers"
    }, FRAMEWORKS[sub.framework].items.map(item => sub.answers[item.id] ? /*#__PURE__*/React.createElement("p", {
      key: item.id
    }, /*#__PURE__*/React.createElement("strong", null, item.letter, " \\u2014 ", item.word, ":"), " ", sub.answers[item.id]) : null))))), /*#__PURE__*/React.createElement("div", {
      className: "student-detail-col"
    }, /*#__PURE__*/React.createElement("span", {
      className: "help-label"
    }, "Quiz history"), d.quizAttempts.length === 0 && /*#__PURE__*/React.createElement("p", {
      className: "sub"
    }, "No attempts yet."), d.quizAttempts.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "quiz-history-list"
    }, d.quizAttempts.map(q => /*#__PURE__*/React.createElement("div", {
      className: "quiz-history-row",
      key: q.id
    }, /*#__PURE__*/React.createElement("span", {
      className: "quiz-history-pct"
    }, Math.round(q.score / q.total * 100), "%"), /*#__PURE__*/React.createElement("span", null, FRAMEWORKS[q.quizSet] ? FRAMEWORKS[q.quizSet].label : "Mixed"), /*#__PURE__*/React.createElement("span", {
      className: "quiz-history-diff"
    }, q.difficulty), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, q.score, "/", q.total), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, formatDate(q.takenAt)))))))));
  }))));
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
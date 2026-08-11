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
  }, /*#__PURE__*/React.createElement(NotificationCenter, {
    onNavigate: setTab
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "simple-toggle",
    onClick: () => setSimpleMode(s => !s),
    "aria-pressed": simpleMode
  }, /*#__PURE__*/React.createElement("span", null, "Simple English"), /*#__PURE__*/React.createElement("span", {
    className: "switch" + (simpleMode ? " on" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "switch-knob"
  }))), /*#__PURE__*/React.createElement(ChangePasswordForm, null), /*#__PURE__*/React.createElement("button", {
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
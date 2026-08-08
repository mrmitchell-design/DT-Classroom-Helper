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
  } catch (e) { /* speech not available */ }
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso.replace(" ", "T") + "Z");
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) +
      " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  } catch (e) { return iso; }
}

/* ------------------------------------------------------------------ */
/* SHARED UI PIECES                                                    */
/* ------------------------------------------------------------------ */

function LetterBadge({ letter, tint, size = 40 }) {
  return (
    <span className="letter-badge" style={{ width: size, height: size, fontSize: size * 0.5, background: tint }}>
      {letter}
    </span>
  );
}

function SpeakBtn({ text, label }) {
  return (
    <button type="button" className="speak-btn" onClick={() => speak(text)} aria-label={label || "Read aloud"} title="Read aloud">
      <IconGlyph name="Volume2" size={15} />
    </button>
  );
}

function FrameworkToggle({ value, onChange }) {
  return (
    <div className="fw-toggle" role="tablist" aria-label="Choose framework">
      {Object.entries(FRAMEWORKS).map(([key, fw]) => (
        <button
          key={key}
          role="tab"
          aria-selected={value === key}
          className={"fw-toggle-btn" + (value === key ? " active" : "")}
          style={value === key ? { background: fw.tint, borderColor: fw.tint } : {}}
          onClick={() => onChange(key)}
        >
          {fw.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LEARN TAB                                                           */
/* ------------------------------------------------------------------ */

function LearnTab({ simpleMode }) {
  const [fwKey, setFwKey] = useState("accessfm");
  const [openId, setOpenId] = useState(null);
  const fw = FRAMEWORKS[fwKey];

  return (
    <div className="tab-panel">
      <div className="panel-head">
        <div>
          <h2>Learn the letters</h2>
          <p className="sub">{fw.full}. Tap a tag to see what it means and try it yourself.</p>
        </div>
        <FrameworkToggle value={fwKey} onChange={(k) => { setFwKey(k); setOpenId(null); }} />
      </div>

      <div className="pegboard">
        <div className="tag-grid">
          {fw.items.map((item, i) => {
            const open = openId === item.id;
            const bodyText = simpleMode ? item.simple : item.desc;
            return (
              <button
                key={item.id}
                className={"tool-tag" + (open ? " open" : "")}
                style={{ "--tint": fw.tint, "--rot": `${(i % 2 === 0 ? -1 : 1) * (2 + (i % 3))}deg` }}
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
              >
                <span className="tag-hook" />
                <span className="tag-hole" />
                <span className="tag-top-row">
                  <span className="tag-letter">{item.letter}</span>
                  <IconGlyph name={item.icon} size={20} className="tag-icon" />
                </span>
                <span className="tag-word">{item.word}</span>
                {open && (
                  <span className="tag-detail" onClick={(e) => e.stopPropagation()}>
                    <span className="tag-detail-row">
                      <span className="tag-detail-label">{simpleMode ? "In simple words" : "What it means"}</span>
                      <SpeakBtn text={bodyText} label={`Read explanation of ${item.word}`} />
                    </span>
                    <span className="tag-detail-text">{bodyText}</span>
                    <span className="tag-detail-label">Example</span>
                    <span className="tag-detail-text">{item.example}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VOCABULARY DASHBOARD                                                 */
/* ------------------------------------------------------------------ */

function VocabFamiliarityPill({ familiarity }) {
  const info = {
    not_started: { label: "Not Started", tint: "#7C877F" },
    learning: { label: "Learning", tint: "#294DFF" },
    practising: { label: "Practising", tint: "#FF7907" },
    confident: { label: "Confident", tint: "#00843D" },
  }[familiarity || "not_started"];
  return <span className="dtf-stage-pill" style={{ background: info.tint + "22", color: info.tint }}>{info.label}</span>;
}

function VocabDashboard({ onBrowse, onCategory, onFlashcards, onTargeted }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/vocab/progress").then(setProgress).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const byId = {};
  progress.forEach((p) => { byId[p.termId] = p; });
  const counts = { not_started: 0, learning: 0, practising: 0, confident: 0 };
  VOCAB_TERMS.forEach((t) => {
    const fam = (byId[t.id] && byId[t.id].familiarity) || "not_started";
    counts[fam]++;
  });
  const strugglingCount = progress.filter((p) => p.markedForPractice || p.familiarity === "practising").length;

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <h2>Words We Need to Work With</h2>
          <p className="sub">Learn, practise and check the key language used in Design &amp; Technology.</p>
        </div>
      </div>

      {!loading && (
        <div className="dtf-summary-grid">
          <div className="dtf-summary-card">
            <span className="help-label">{VOCAB_TERMS.length} Words</span>
            <span className="dtf-summary-value">{counts.confident} Confident</span>
          </div>
          <div className="dtf-summary-card">
            <span className="help-label">Learning</span>
            <span className="dtf-summary-value">{counts.learning}</span>
          </div>
          <div className="dtf-summary-card">
            <span className="help-label">Practising</span>
            <span className="dtf-summary-value">{counts.practising}</span>
          </div>
        </div>
      )}

      <div className="vocab-mode-grid">
        <button type="button" className="tool-picker-card" onClick={onBrowse}>
          <span className="tool-picker-icon"><IconGlyph name="Search" size={24} /></span>
          <span className="tool-picker-title">Browse &amp; Search</span>
          <span className="tool-picker-desc">Look up any word, or browse a category. Not a quiz.</span>
        </button>
        <button type="button" className="tool-picker-card" onClick={onFlashcards}>
          <span className="tool-picker-icon"><IconGlyph name="RotateCcw" size={24} /></span>
          <span className="tool-picker-title">Flip &amp; Find</span>
          <span className="tool-picker-desc">Flashcards — see the word, try to recall it, then reveal.</span>
        </button>
        <button type="button" className="tool-picker-card" onClick={onTargeted} disabled={strugglingCount === 0}>
          <span className="tool-picker-icon"><IconGlyph name="Repeat" size={24} /></span>
          <span className="tool-picker-title">Practise Words I Struggle With</span>
          <span className="tool-picker-desc">{strugglingCount > 0 ? `${strugglingCount} word${strugglingCount === 1 ? "" : "s"} to revisit.` : "Nothing marked yet — come back after some practice."}</span>
        </button>
      </div>

      <div className="dtf-section-list" style={{ marginTop: 24 }}>
        <span className="help-label">Browse by category</span>
        {VOCAB_CATEGORIES.map((c) => {
          const count = vocabTermsByCategory(c.key).length;
          return (
            <button type="button" key={c.key} className="dtf-section-row clickable" onClick={() => onCategory(c.key)}>
              <div className="dtf-section-row-top">
                <span className="dtf-section-name">{c.label}</span>
                <span className="mono">{count} words</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BROWSE / SEARCH                                                      */
/* ------------------------------------------------------------------ */

function vocabSearch(query, categoryFilter) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return VOCAB_TERMS.filter((t) => {
    if (categoryFilter && t.category !== categoryFilter) return false;
    if (words.length === 0) return true;
    const haystack = [t.term, t.simpleDefinition, t.definition, t.example, ...(t.aliases || [])].filter(Boolean).join(" ").toLowerCase();
    // every query word must appear somewhere in the haystack - not
    // necessarily as one contiguous phrase, so "body measurements" still
    // finds "Measurements of the human body" even though the words are
    // in a different order.
    return words.every((w) => haystack.includes(w));
  });
}

function VocabBrowse({ initialCategory, onOpenWord, onBack }) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || "");
  const results = vocabSearch(query, categoryFilter);

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <h2>Browse &amp; Search</h2>
          <p className="sub">{results.length} word{results.length === 1 ? "" : "s"}</p>
        </div>
      </div>
      <div className="student-filters no-print" style={{ marginBottom: 16 }}>
        <label style={{ flex: 1, minWidth: 220 }}>
          <span>Search</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a word or definition..." style={{ width: "100%", fontFamily: "inherit", fontSize: 14, padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }} />
        </label>
        <label>
          <span>Category</span>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All categories</option>
            {VOCAB_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </label>
      </div>

      {results.length === 0 && <p className="sub">No words match — try a different search.</p>}

      <div className="vocab-word-grid">
        {results.map((t) => (
          <button type="button" key={t.id} className="spec-list-row" style={{ display: "grid", gridTemplateColumns: "1fr" }} onClick={() => onOpenWord(t.id, results.map((r) => r.id))}>
            <span className="spec-list-name">{t.term}</span>
            <span className="sub" style={{ margin: 0 }}>{t.simpleDefinition}</span>
          </button>
        ))}
      </div>

      <div className="quiz-nav-row" style={{ marginTop: 20 }}>
        <button type="button" className="btn-secondary" onClick={onBack}>
          <IconGlyph name="ChevronRight" size={16} style={{ transform: "rotate(180deg)" }} /> Back
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WORD CARD                                                            */
/* ------------------------------------------------------------------ */

function VocabWordCard({ termId, wordList, onNavigate, onBack }) {
  const term = vocabTermById(termId);
  const idx = wordList.indexOf(termId);
  const [markedForPractice, setMarkedForPractice] = useState(false);

  useEffect(() => {
    apiPost(`/api/vocab/progress/${termId}/viewed`, {}).catch(() => {});
    apiGet("/api/vocab/progress").then((rows) => {
      const row = rows.find((r) => r.termId === termId);
      setMarkedForPractice(row ? row.markedForPractice : false);
    }).catch(() => {});
  }, [termId]);

  async function toggleMark() {
    const next = !markedForPractice;
    setMarkedForPractice(next);
    try { await apiPost(`/api/vocab/progress/${termId}/mark`, { marked: next }); } catch (e) { /* ignore */ }
  }

  if (!term) return null;
  const confused = (term.commonlyConfusedWith || []).map(vocabTermById).filter(Boolean);

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <span className="help-label">{VOCAB_CATEGORIES.find((c) => c.key === term.category).label}</span>
          <h2>{term.term}</h2>
        </div>
        <button type="button" className={"mark-complete-btn" + (markedForPractice ? " is-complete" : "")} onClick={toggleMark}>
          <IconGlyph name={markedForPractice ? "Check" : "Repeat"} size={14} /> {markedForPractice ? "Marked for practice" : "Mark for Practice"}
        </button>
      </div>

      <div className="vocab-card-block">
        <span className="spec-field-label requirement">Simple Meaning</span>
        <p>{term.simpleDefinition}</p>
      </div>
      <div className="vocab-card-block">
        <span className="spec-field-label reason">DT Meaning</span>
        <p>{term.definition}</p>
      </div>
      {term.example && (
        <div className="vocab-card-block">
          <span className="spec-field-label testing">In Design &amp; Technology</span>
          <p>{term.example}</p>
        </div>
      )}
      {confused.length > 0 && (
        <div className="vocab-card-block">
          <span className="help-label">Commonly Confused With</span>
          <div className="chip-row">
            {confused.map((c) => (
              <button type="button" key={c.id} className="chip chip-word" onClick={() => onNavigate(c.id, wordList)}>{c.term}</button>
            ))}
          </div>
        </div>
      )}

      <div className="quiz-nav-row" style={{ marginTop: 20 }}>
        <button type="button" className="btn-secondary" onClick={() => (idx > 0 ? onNavigate(wordList[idx - 1], wordList) : onBack())}>
          <IconGlyph name="ChevronRight" size={16} style={{ transform: "rotate(180deg)" }} /> Previous
        </button>
        {idx >= 0 && idx + 1 < wordList.length ? (
          <button type="button" className="btn-primary" onClick={() => onNavigate(wordList[idx + 1], wordList)}>Next Word <IconGlyph name="ChevronRight" size={16} /></button>
        ) : (
          <button type="button" className="btn-primary" onClick={onBack}>Done <IconGlyph name="Check" size={16} /></button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FLIP & FIND (flashcards)                                             */
/* ------------------------------------------------------------------ */

function VocabFlashcards({ terms, onBack, onDone }) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const term = terms[idx];

  async function respond(gotIt) {
    try { await apiPost(`/api/vocab/progress/${term.id}/attempt`, { correct: gotIt, questionType: "flashcard" }); } catch (e) { /* ignore */ }
    if (idx + 1 >= terms.length) onDone();
    else { setIdx((i) => i + 1); setRevealed(false); }
  }

  if (!term) return null;

  return (
    <div className="tab-content">
      <div className="spec-wizard-progress">
        <span className="quiz-history-label">Flip &amp; Find · Card {idx + 1} of {terms.length}</span>
        <div className="quiz-progress-bar"><div style={{ width: `${((idx + 1) / terms.length) * 100}%`, background: "var(--blue)" }} /></div>
      </div>

      <div className="vocab-flashcard">
        <span className="vocab-flashcard-term">{term.term}</span>
        {!revealed && (
          <button type="button" className="btn-primary" onClick={() => setRevealed(true)}>Reveal Meaning</button>
        )}
        {revealed && (
          <div className="vocab-flashcard-back">
            <p><strong>Simple Meaning:</strong> {term.simpleDefinition}</p>
            <p><strong>DT Meaning:</strong> {term.definition}</p>
          </div>
        )}
      </div>

      {revealed && (
        <div className="quiz-result-actions" style={{ marginTop: 20 }}>
          <button type="button" className="btn-secondary" onClick={() => respond(false)}>Practise Again</button>
          <button type="button" className="btn-primary" onClick={() => respond(true)}>Got It</button>
        </div>
      )}
      {!revealed && (
        <div className="quiz-nav-row" style={{ marginTop: 20 }}>
          <button type="button" className="btn-text" onClick={onBack}>Exit</button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TARGETED PRACTICE                                                    */
/* ------------------------------------------------------------------ */

function VocabTargetedPractice({ onBack, onOpenWord }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiGet("/api/vocab/progress").then(setProgress).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const struggling = progress
    .filter((p) => p.markedForPractice || p.familiarity === "practising")
    .map((p) => vocabTermById(p.termId))
    .filter(Boolean);

  return (
    <div className="tab-content">
      <div className="panel-head"><div><h2>Practise Words I Struggle With</h2><p className="sub">Terms you've marked, or that aren't consistent yet.</p></div></div>
      {loading && <p className="sub">Loading...</p>}
      {!loading && struggling.length === 0 && <p className="sub">Nothing here yet — keep practising and this will fill up.</p>}
      <div className="vocab-word-grid">
        {struggling.map((t) => (
          <button type="button" key={t.id} className="spec-list-row" style={{ display: "grid", gridTemplateColumns: "1fr" }} onClick={() => onOpenWord(t.id, struggling.map((s) => s.id))}>
            <span className="spec-list-name">{t.term}</span>
            <span className="sub" style={{ margin: 0 }}>{t.simpleDefinition}</span>
          </button>
        ))}
      </div>
      <div className="quiz-nav-row" style={{ marginTop: 20 }}>
        <button type="button" className="btn-secondary" onClick={onBack}><IconGlyph name="ChevronRight" size={16} style={{ transform: "rotate(180deg)" }} /> Back</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VOCABULARY TOOL SHELL                                                */
/* ------------------------------------------------------------------ */

function VocabularyTool({ user, onBack }) {
  const [view, setView] = useState("dashboard");
  const [activeWordId, setActiveWordId] = useState(null);
  const [activeWordList, setActiveWordList] = useState([]);
  const [browseCategory, setBrowseCategory] = useState("");

  function openWord(id, list) {
    setActiveWordId(id);
    setActiveWordList(list || VOCAB_TERMS.map((t) => t.id));
    setView("word");
  }

  return (
    <>
      <div className="tool-subheader no-print">
        <button type="button" className="btn-text back-btn" onClick={() => (view === "dashboard" ? onBack() : setView("dashboard"))}>
          <IconGlyph name="ChevronRight" size={15} style={{ transform: "rotate(180deg)" }} /> {view === "dashboard" ? "All tools" : "Words We Need to Work With"}
        </button>
      </div>

      {view === "dashboard" && (
        <VocabDashboard
          onBrowse={() => { setBrowseCategory(""); setView("browse"); }}
          onCategory={(cat) => { setBrowseCategory(cat); setView("browse"); }}
          onFlashcards={() => setView("flashcards-setup")}
          onTargeted={() => setView("targeted")}
        />
      )}

      {view === "browse" && (
        <VocabBrowse initialCategory={browseCategory} onOpenWord={openWord} onBack={() => setView("dashboard")} />
      )}

      {view === "word" && activeWordId && (
        <VocabWordCard termId={activeWordId} wordList={activeWordList} onNavigate={openWord} onBack={() => setView("dashboard")} />
      )}

      {view === "flashcards-setup" && (
        <div className="tab-content">
          <div className="panel-head"><div><h2>Flip &amp; Find</h2><p className="sub">Pick a category, or practise a mixed set.</p></div></div>
          <div className="dtf-section-list">
            <button type="button" className="dtf-section-row clickable" onClick={() => { setActiveWordList(shuffle(VOCAB_TERMS.map((t) => t.id)).slice(0, 10)); setView("flashcards"); }}>
              <div className="dtf-section-row-top"><span className="dtf-section-name">Mixed (10 random words)</span></div>
            </button>
            {VOCAB_CATEGORIES.map((c) => (
              <button type="button" key={c.key} className="dtf-section-row clickable" onClick={() => { setActiveWordList(vocabTermsByCategory(c.key).map((t) => t.id)); setView("flashcards"); }}>
                <div className="dtf-section-row-top"><span className="dtf-section-name">{c.label}</span><span className="mono">{vocabTermsByCategory(c.key).length} words</span></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === "flashcards" && (
        <VocabFlashcards terms={activeWordList.map(vocabTermById).filter(Boolean)} onBack={() => setView("dashboard")} onDone={() => setView("dashboard")} />
      )}

      {view === "targeted" && (
        <VocabTargetedPractice onBack={() => setView("dashboard")} onOpenWord={openWord} />
      )}
    </>
  );
}

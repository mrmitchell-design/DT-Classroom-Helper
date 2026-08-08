/* ------------------------------------------------------------------ */
/* QUIZ QUESTION BUILDERS                                              */
/* ------------------------------------------------------------------ */

function buildMcqQuestions(frameworkKeys) {
  let pool = [];
  frameworkKeys.forEach((fk) => {
    const fw = FRAMEWORKS[fk];
    fw.items.forEach((item) => {
      const wordPool = fw.items.filter((i) => i.id !== item.id).map((i) => i.word);
      const letterPool = fw.items.filter((i) => i.id !== item.id).map((i) => i.letter);
      pool.push({
        type: "mcq",
        qid: fk + "-" + item.id + "-word",
        prompt: `In ${fw.label}, what does the letter "${item.letter}" stand for?`,
        answer: item.word,
        options: shuffle([item.word, ...shuffle(wordPool).slice(0, 3)]),
        badge: item.letter,
        tint: fw.tint,
      });
      pool.push({
        type: "mcq",
        qid: fk + "-" + item.id + "-letter",
        prompt: `In ${fw.label}, which letter stands for "${item.word}"?`,
        answer: item.letter,
        options: shuffle([...new Set([item.letter, ...shuffle(letterPool).slice(0, 3)])]),
        badge: "?",
        tint: fw.tint,
      });
    });
  });
  return pool;
}

function buildScenarioQuestions(frameworkKeys) {
  let pool = [];
  frameworkKeys.forEach((fk) => {
    const fw = FRAMEWORKS[fk];
    fw.items.forEach((item) => {
      const letterPool = fw.items.filter((i) => i.id !== item.id).map((i) => i.letter);
      pool.push({
        type: "scenario",
        qid: fk + "-" + item.id + "-scenario",
        prompt: `${item.scenario}\n\nWhich letter of ${fw.label} does this best relate to?`,
        answer: item.letter,
        options: shuffle([...new Set([item.letter, ...shuffle(letterPool).slice(0, 3)])]),
        badge: "\u2605",
        tint: fw.tint,
      });
    });
  });
  return pool;
}

function buildTypedQuestions(frameworkKeys) {
  let pool = [];
  frameworkKeys.forEach((fk) => {
    const fw = FRAMEWORKS[fk];
    fw.items.forEach((item) => {
      pool.push({
        type: "typed",
        qid: fk + "-" + item.id + "-typed",
        prompt: `In your own words: ${item.prompt}`,
        keywords: item.wordbank,
        modelAnswer: item.example,
        badge: item.letter,
        tint: fw.tint,
        letter: item.letter,
        word: item.word,
      });
    });
  });
  return pool;
}

const DIFFICULTY_INFO = {
  standard: { label: "Standard", desc: "Multiple choice \u2014 match letters and words.", length: 10 },
  challenge: { label: "Challenge", desc: "Adds scenario questions \u2014 apply the letters to mini case studies.", length: 12 },
  extension: { label: "Extension", desc: "Adds short typed answers you mark yourself against a model answer.", length: 12 },
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
  const mix = shuffle([
    ...shuffle(mcq).slice(0, 5),
    ...shuffle(scenarios).slice(0, 4),
    ...shuffle(typed).slice(0, 3),
  ]);
  return mix.slice(0, DIFFICULTY_INFO.extension.length);
}

function typedAnswerLooksGood(text, keywords) {
  const trimmed = (text || "").trim();
  if (!trimmed) return false;
  const wordCount = trimmed.split(/\s+/).length;
  const lower = trimmed.toLowerCase();
  const hasKeyword = (keywords || []).some((k) => lower.includes(k.toLowerCase().split(" ")[0]));
  return wordCount >= 6 || hasKeyword;
}

/* ------------------------------------------------------------------ */
/* QUIZ TAB                                                             */
/* ------------------------------------------------------------------ */

function QuizTab({ currentUser }) {
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
    apiGet("/api/quiz-attempts")
      .then((rows) => { setHistory(rows); setHistoryLoaded(true); })
      .catch(() => setHistoryLoaded(true));
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
    if (option === questions[idx].answer) setScore((s) => s + 1);
  }

  function checkTyped() {
    if (typedChecked) return;
    setTypedChecked(true);
    if (typedAnswerLooksGood(typedValue, questions[idx].keywords)) setScore((s) => s + 1);
  }

  async function next() {
    if (idx + 1 >= questions.length) {
      setFinished(true);
      try {
        await apiPost("/api/quiz-attempts", { quizSet: mode, difficulty, score, total: questions.length });
        const rows = await apiGet("/api/quiz-attempts");
        setHistory(rows);
      } catch (e) { /* non-fatal: quiz result just won't be saved */ }
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
      setTypedValue("");
      setTypedChecked(false);
    }
  }

  if (!started) {
    return (
      <div className="tab-panel">
        <div className="panel-head">
          <div>
            <h2>Quiz mode</h2>
            <p className="sub">Pick a topic and a difficulty, then go.</p>
          </div>
        </div>
        <div className="quiz-start">
          <div className="quiz-mode-grid">
            {[
              { key: "accessfm", label: "ACCESSFM", tint: FRAMEWORKS.accessfm.tint },
              { key: "scamper", label: "SCAMPER", tint: FRAMEWORKS.scamper.tint },
              { key: "mixed", label: "Mixed", tint: "#16324F" },
            ].map((m) => (
              <button
                key={m.key}
                className={"quiz-mode-btn" + (mode === m.key ? " active" : "")}
                style={mode === m.key ? { borderColor: m.tint, color: m.tint } : {}}
                onClick={() => setMode(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="difficulty-grid">
            {Object.entries(DIFFICULTY_INFO).map(([key, info]) => (
              <button
                key={key}
                className={"difficulty-card" + (difficulty === key ? " active" : "")}
                onClick={() => setDifficulty(key)}
              >
                <span className="difficulty-title">{info.label}</span>
                <span className="difficulty-desc">{info.desc}</span>
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={start}><IconGlyph name="Wrench" size={18} /> Start quiz</button>

          {historyLoaded && history.length > 0 && (
            <div className="quiz-history">
              <span className="quiz-history-label">Your recent attempts</span>
              <div className="quiz-history-list">
                {history.slice(0, 6).map((h) => (
                  <div className="quiz-history-row" key={h.id}>
                    <span className="quiz-history-pct">{Math.round((h.score / h.total) * 100)}%</span>
                    <span>{FRAMEWORKS[h.quizSet] ? FRAMEWORKS[h.quizSet].label : "Mixed"}</span>
                    <span className="quiz-history-diff">{DIFFICULTY_INFO[h.difficulty] ? DIFFICULTY_INFO[h.difficulty].label : h.difficulty}</span>
                    <span className="mono">{h.score}/{h.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="tab-panel">
        <div className="quiz-result">
          <span className="stamp" style={{ borderColor: pct >= 70 ? "#3F7D4F" : "#C0392B", color: pct >= 70 ? "#3F7D4F" : "#C0392B" }}>
            {pct >= 70 ? "PASSED" : "TRY AGAIN"}
          </span>
          <h2>{score} / {questions.length}</h2>
          <p className="sub">You scored {pct}% on {DIFFICULTY_INFO[difficulty].label}. {pct >= 70 ? "Solid work \u2014 that's a strong grasp of the framework." : "Have another go and see if you can beat it."}</p>
          <div className="quiz-result-actions">
            <button className="btn-primary" onClick={start}><IconGlyph name="RotateCcw" size={18} /> Retake this quiz</button>
            <button className="btn-secondary" onClick={() => setStarted(false)}>Choose a different set</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const isCorrect = (opt) => picked && opt === q.answer;
  const isWrongPick = (opt) => picked && opt === picked && opt !== q.answer;

  return (
    <div className="tab-panel">
      <div className="quiz-progress">
        <div className="quiz-progress-bar"><div style={{ width: `${(idx / questions.length) * 100}%`, background: q.tint }} /></div>
        <span className="mono">Q{idx + 1} / {questions.length}</span>
        <span className="mono">Score {score}</span>
      </div>

      <div className="quiz-card">
        <LetterBadge letter={q.badge} tint={q.tint} size={48} />

        {q.type !== "typed" && (
          <span className="quiz-question-row">
            <p className="quiz-question" style={{ whiteSpace: "pre-line" }}>{q.prompt}</p>
            <SpeakBtn text={q.prompt} label="Read question aloud" />
          </span>
        )}

        {(q.type === "mcq" || q.type === "scenario") && (
          <div className="quiz-options">
            {q.options.map((opt) => (
              <button
                key={opt}
                className={"quiz-option" + (isCorrect(opt) ? " correct" : "") + (isWrongPick(opt) ? " wrong" : "")}
                onClick={() => choose(opt)}
                disabled={!!picked}
              >
                <span>{opt}</span>
                {isCorrect(opt) && <IconGlyph name="Check" size={18} />}
                {isWrongPick(opt) && <IconGlyph name="X" size={18} />}
              </button>
            ))}
          </div>
        )}

        {q.type === "typed" && (
          <div className="typed-question">
            <span className="quiz-question-row">
              <p className="quiz-question">{q.prompt}</p>
              <SpeakBtn text={q.prompt} label="Read question aloud" />
            </span>
            <textarea
              rows={3}
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              placeholder="Type a short answer..."
              disabled={typedChecked}
            />
            {!typedChecked && (
              <button className="btn-secondary" onClick={checkTyped} disabled={!typedValue.trim()}>Check my answer</button>
            )}
            {typedChecked && (
              <div className={"typed-feedback" + (typedAnswerLooksGood(typedValue, q.keywords) ? " good" : "")}>
                <span className="typed-feedback-label">
                  {typedAnswerLooksGood(typedValue, q.keywords) ? "Nice \u2014 that counts! Compare with a model answer:" : "Have a look at a model answer \u2014 try adding more detail next time:"}
                </span>
                <span className="typed-feedback-text">{q.modelAnswer}</span>
              </div>
            )}
          </div>
        )}

        {(picked || (q.type === "typed" && typedChecked)) && (
          <button className="btn-primary quiz-next" onClick={next}>
            {idx + 1 >= questions.length ? "See results" : "Next question"} <IconGlyph name="ChevronRight" size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

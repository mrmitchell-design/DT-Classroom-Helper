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

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return "\u2014";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/* ------------------------------------------------------------------ */
/* QUIZ TAB                                                             */
/* ------------------------------------------------------------------ */

function QuizTab({ currentUser }) {
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
    apiGet("/api/quiz-attempts")
      .then((rows) => { setHistory(rows); setHistoryLoaded(true); })
      .catch(() => setHistoryLoaded(true));
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
      const qs = full.questions.map((q) => ({ ...q, tint: q.tint || "#16324F", badge: q.badge || "?" }));
      beginQuiz(qs, full.id, full.name);
    } catch (e) { /* ignore */ }
  }

  function selectOption(option) {
    setResponses((rs) => rs.map((r, i) => (i === idx ? { answer: option } : r)));
  }

  function setTypedText(text) {
    setResponses((rs) => rs.map((r, i) => (i === idx ? { ...r, text } : r)));
  }

  function toggleCheckTyped() {
    setCheckedTyped((c) => ({ ...c, [idx]: !c[idx] }));
  }

  function goNext() {
    if (idx + 1 >= questions.length) {
      setPhase("reviewing");
    } else {
      setIdx((i) => i + 1);
    }
  }
  function goPrev() {
    if (idx > 0) setIdx((i) => i - 1);
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
      return { qid: q.qid, type: q.type, prompt: q.prompt, letter: q.badge, studentAnswer, correctAnswer, isCorrect };
    });

    setScore(newScore);
    setFinishedDetails(details);
    setPhase("finished");

    const durationSeconds = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : null;
    try {
      await apiPost("/api/quiz-attempts", {
        quizSet: mode, difficulty, score: newScore, total: questions.length,
        durationSeconds, details, quizSetId: activeCustomSetId,
      });
      loadHistory();
      loadCustomSets();
    } catch (e) { /* non-fatal: quiz result just won't be saved */ }
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

          {customSets.length > 0 && (
            <div className="quiz-custom-sets">
              <span className="quiz-history-label">Assigned &amp; practice quizzes from your teacher</span>
              <div className="quiz-custom-set-list">
                {customSets.map((s) => (
                  <button type="button" key={s.id} className="quiz-custom-set-card" onClick={() => startCustomSet(s)}>
                    <span className="quiz-custom-set-name">
                      {s.name}{" "}
                      {s.isAssigned && <span className="needs-marking-badge" style={{ background: s.isCompleted ? "#EDF5EE" : "#FBEFC9", color: s.isCompleted ? "#2A5B37" : "#8A6A1E" }}>{s.isCompleted ? "done" : "assigned"}</span>}
                      {!s.isAssigned && s.isPracticeBank && <span className="needs-marking-badge" style={{ background: "#EDF5EE", color: "#2A5B37" }}>practice</span>}
                    </span>
                    {s.description && <span className="sub">{s.description}</span>}
                    <span className="mono">{s.questionCount} question{s.questionCount === 1 ? "" : "s"}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {historyLoaded && history.length > 0 && (
            <div className="quiz-history">
              <span className="quiz-history-label">Your recent attempts</span>
              <div className="quiz-history-list">
                {history.slice(0, 6).map((h) => (
                  <React.Fragment key={h.id}>
                    <div className="quiz-history-row" onClick={() => setExpandedHistoryId(expandedHistoryId === h.id ? null : h.id)}>
                      <span className="quiz-history-pct">{Math.round((h.score / h.total) * 100)}%</span>
                      <span>{FRAMEWORKS[h.quizSet] ? FRAMEWORKS[h.quizSet].label : "Mixed"}</span>
                      <span className="quiz-history-diff">{DIFFICULTY_INFO[h.difficulty] ? DIFFICULTY_INFO[h.difficulty].label : h.difficulty}</span>
                      <span className="mono">{h.score}/{h.total}</span>
                      <span className="mono">{formatDuration(h.durationSeconds)}</span>
                      {h.feedback && <IconGlyph name="Lightbulb" size={14} style={{ color: "#8A6A1E" }} />}
                    </div>
                    {expandedHistoryId === h.id && h.feedback && (
                      <div className="quiz-history-feedback">
                        <span className="help-label">Feedback from your teacher</span>
                        <p>{h.feedback}</p>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "finished") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="tab-panel">
        <div className="quiz-result">
          <span className="stamp" style={{ borderColor: pct >= 70 ? "#3F7D4F" : "#C0392B", color: pct >= 70 ? "#3F7D4F" : "#C0392B" }}>
            {pct >= 70 ? "PASSED" : "TRY AGAIN"}
          </span>
          <h2>{score} / {questions.length}</h2>
          <p className="sub">
            You scored {pct}% {activeCustomSetName ? <>on "{activeCustomSetName}"</> : <>on {DIFFICULTY_INFO[difficulty].label}</>}.{" "}
            {pct >= 70 ? "Solid work \u2014 that's a strong grasp of the framework." : "Have another go and see if you can beat it."}
          </p>

          <details className="quiz-finished-review">
            <summary>Review your answers</summary>
            <div className="quiz-review-questions">
              {finishedDetails.map((d) => (
                <div key={d.qid} className={"quiz-review-q" + (d.isCorrect ? " correct" : " wrong")}>
                  <p className="quiz-review-prompt" style={{ whiteSpace: "pre-line" }}>{d.prompt}</p>
                  <p className="quiz-review-answer">
                    <strong>Your answer:</strong> {d.studentAnswer}
                    {d.type !== "typed" && <span className="mono"> (correct: {d.correctAnswer})</span>}
                  </p>
                  {d.type === "typed" && <p className="quiz-review-answer"><strong>Model answer:</strong> {d.correctAnswer}</p>}
                </div>
              ))}
            </div>
          </details>

          <div className="quiz-result-actions">
            <button className="btn-primary" onClick={activeCustomSetId ? () => startCustomSet({ id: activeCustomSetId, name: activeCustomSetName }) : start}>
              <IconGlyph name="RotateCcw" size={18} /> Retake this quiz
            </button>
            <button className="btn-secondary" onClick={() => setStarted(false)}>Choose a different set</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "reviewing") {
    const unansweredCount = responses.filter((r, i) => {
      const q = questions[i];
      return q.type === "typed" ? !(r.text || "").trim() : !r.answer;
    }).length;
    return (
      <div className="tab-panel">
        <div className="panel-head">
          <div>
            <h2>Check your answers</h2>
            <p className="sub">
              Review everything below before you hand in \u2014 tap any question to change your answer.
              {unansweredCount > 0 && <strong> {unansweredCount} question{unansweredCount === 1 ? "" : "s"} not answered yet.</strong>}
            </p>
          </div>
        </div>
        <div className="quiz-review-list">
          {questions.map((q, i) => {
            const r = responses[i] || {};
            const answered = q.type === "typed" ? !!(r.text || "").trim() : !!r.answer;
            const summary = q.type === "typed" ? (r.text || "").slice(0, 60) || "Not answered yet" : (r.answer || "Not answered yet");
            return (
              <button type="button" key={q.qid} className={"quiz-review-item" + (answered ? "" : " unanswered")} onClick={() => jumpTo(i)}>
                <LetterBadge letter={q.badge} tint={q.tint} size={30} />
                <span className="quiz-review-item-text">
                  <span className="quiz-review-item-prompt">{q.prompt.split("\n")[0]}</span>
                  <span className="quiz-review-item-answer">{summary}{q.type === "typed" && (r.text || "").length > 60 ? "\u2026" : ""}</span>
                </span>
                <IconGlyph name="PenLine" size={14} />
              </button>
            );
          })}
        </div>
        <div className="quiz-result-actions">
          <button className="btn-primary" onClick={handIn}><IconGlyph name="Check" size={18} /> Hand in quiz</button>
          <button className="btn-secondary" onClick={() => jumpTo(questions.length - 1)}>Keep answering</button>
        </div>
      </div>
    );
  }

  // phase === "answering"
  const q = questions[idx];
  const r = responses[idx] || {};

  return (
    <div className="tab-panel">
      <div className="quiz-progress">
        <div className="quiz-progress-bar"><div style={{ width: `${((idx + 1) / questions.length) * 100}%`, background: q.tint }} /></div>
        <span className="mono">Q{idx + 1} / {questions.length}</span>
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
                className={"quiz-option" + (r.answer === opt ? " picked" : "")}
                onClick={() => selectOption(opt)}
              >
                <span>{opt}</span>
                {r.answer === opt && <IconGlyph name="Check" size={18} />}
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
              value={r.text || ""}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder="Type a short answer..."
            />
            <button type="button" className="btn-secondary" onClick={toggleCheckTyped} disabled={!(r.text || "").trim()}>
              {checkedTyped[idx] ? "Hide model answer" : "Check my answer"}
            </button>
            {checkedTyped[idx] && (
              <div className="typed-feedback">
                <span className="typed-feedback-label">Model answer to compare against — you can still change yours before handing in:</span>
                <span className="typed-feedback-text">{q.modelAnswer}</span>
              </div>
            )}
          </div>
        )}

        <div className="quiz-nav-row">
          <button className="btn-secondary" onClick={goPrev} disabled={idx === 0}><IconGlyph name="ChevronRight" size={16} style={{ transform: "rotate(180deg)" }} /> Back</button>
          <button className="btn-primary quiz-next" onClick={goNext}>
            {idx + 1 >= questions.length ? "Review answers" : "Next question"} <IconGlyph name="ChevronRight" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

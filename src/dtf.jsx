function DTFStagePill({ stage }) {
  if (!stage) return <span className="status-pill draft">Not enough evidence yet</span>;
  const info = DT_STAGE_INFO[stage];
  return <span className="dtf-stage-pill" style={{ background: info.tint + "22", color: info.tint }}>{info.label}</span>;
}

function DTFDashboard({ sections, onOpenSection }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/dtf/progress").then(setProgress).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const byKey = {};
  progress.forEach((p) => { byKey[p.sectionKey] = p; });
  const completedCount = sections.filter((s) => byKey[s.key] && byKey[s.key].completedAt).length;
  const coursePct = sections.length ? Math.round((completedCount / sections.length) * 100) : 0;
  const scored = progress.filter((p) => p.knowledgeScore !== null && p.knowledgeScore !== undefined);
  const knowledgeConfidence = scored.length ? Math.round(scored.reduce((sum, p) => sum + p.knowledgeScore, 0) / scored.length) : null;

  const stagedSections = progress.filter((p) => p.confirmedStage || p.suggestedStage);
  let currentStage = null;
  if (stagedSections.length) {
    const counts = {};
    stagedSections.forEach((p) => {
      const s = p.confirmedStage || p.suggestedStage;
      counts[s] = (counts[s] || 0) + 1;
    });
    currentStage = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <h2>Discovering Design</h2>
          <p className="sub">Big Question: How do designers discover the right problem to solve?</p>
        </div>
      </div>

      {loading && <p className="sub">Loading...</p>}

      {!loading && (
        <div className="dtf-summary-grid">
          <div className="dtf-summary-card">
            <span className="help-label">Course progress</span>
            <span className="dtf-summary-value">{coursePct}%</span>
          </div>
          <div className="dtf-summary-card">
            <span className="help-label">Knowledge confidence</span>
            <span className="dtf-summary-value">{knowledgeConfidence !== null ? `${knowledgeConfidence}%` : "\u2014"}</span>
          </div>
          <div className="dtf-summary-card">
            <span className="help-label">Current DT stage</span>
            <DTFStagePill stage={currentStage} />
          </div>
        </div>
      )}

      <div className="dtf-section-list">
        <span className="help-label">Sections</span>
        {sections.map((s) => {
          const p = byKey[s.key];
          const available = !!s.available;
          return (
            <button
              type="button"
              key={s.key}
              className={"dtf-section-row" + (available ? " clickable" : " disabled")}
              onClick={() => available && onOpenSection(s.key)}
              disabled={!available}
            >
              <span className="dtf-section-name">{s.number}. {s.title}{!available && <span className="status-pill draft" style={{ marginLeft: 8 }}>Coming soon</span>}</span>
              <DTFStagePill stage={p ? (p.confirmedStage || p.suggestedStage) : null} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

const UNIT_1_SECTIONS = [
  { key: "s1", number: "01", title: "Problem Before Product", available: true },
  { key: "s2", number: "02", title: "People Before Products" },
  { key: "s3", number: "03", title: "Needs Before Nice-to-Haves" },
  { key: "s4", number: "04", title: "Profiling People" },
  { key: "s5", number: "05", title: "Research Before Response" },
  { key: "s6", number: "06", title: "Question, Query, Qualify" },
  { key: "s7", number: "07", title: "Surveys Seek Scale" },
  { key: "s8", number: "08", title: "Watch, Wonder, Work It Out" },
  { key: "s9", number: "09", title: "Measure Before Making" },
  { key: "s10", number: "10", title: "Products Provide Proof" },
  { key: "s11", number: "11", title: "Analyse, Don't Imitate" },
  { key: "s12", number: "12", title: "Discuss, Debate, Decide" },
  { key: "s13", number: "13", title: "Culture Changes Context" },
  { key: "s14", number: "14", title: "Evidence Before Decisions" },
  { key: "s15", number: "15", title: "Brief Before Build" },
  { key: "s16", number: "16", title: "Limits Lead Design" },
  { key: "s17", number: "17", title: "Specific Before Successful" },
];

/* ------------------------------------------------------------------ */
/* TOUCHPOINT RENDERERS (the interactive moments inside a section)      */
/* ------------------------------------------------------------------ */

function saveTouchpointResponse(sectionKey, kind, text) {
  if (!text || !text.trim()) return;
  apiPost(`/api/dtf/responses/U1-${sectionKey.toUpperCase()}-TP-${kind}`, { text }).catch(() => {});
}

function TP_PausePredict({ card, sectionKey, onContinue }) {
  const [text, setText] = useState("");
  return (
    <div className="dtf-touchpoint">
      <span className="dtf-touchpoint-label"><IconGlyph name="Lightbulb" size={14} /> {card.heading}</span>
      <p className="dtf-touchpoint-prompt">{card.prompt}</p>
      <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type what you're thinking..." />
      <button type="button" className="btn-primary" onClick={() => { saveTouchpointResponse(sectionKey, "pause_predict", text); onContinue(); }}>
        Continue <IconGlyph name="ChevronRight" size={16} />
      </button>
    </div>
  );
}

function TP_WhichIsStronger({ card, onContinue }) {
  const [picked, setPicked] = useState(null);
  const isCorrect = picked === card.correct;
  return (
    <div className="dtf-touchpoint">
      <span className="dtf-touchpoint-label"><IconGlyph name="ArrowLeftRight" size={14} /> {card.heading}</span>
      <p className="dtf-touchpoint-prompt">{card.prompt}</p>
      <div className="dtf-choice-grid">
        {["a", "b"].map((key) => (
          <button
            key={key}
            type="button"
            className={"dtf-choice-card" + (picked === key ? (isCorrect ? " correct" : " wrong") : "")}
            onClick={() => !picked && setPicked(key)}
            disabled={!!picked}
          >
            <span className="dtf-choice-letter">{key.toUpperCase()}</span>
            <span>{key === "a" ? card.optionA : card.optionB}</span>
          </button>
        ))}
      </div>
      {picked && (
        <>
          <div className={"dtf-feedback" + (isCorrect ? " correct" : "")}>
            {isCorrect ? card.feedbackCorrect : card.feedbackIncorrect}
          </div>
          <button type="button" className="btn-primary" onClick={onContinue}>Continue <IconGlyph name="ChevronRight" size={16} /></button>
        </>
      )}
    </div>
  );
}

function TP_QuickCheck({ card, onContinue }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="dtf-touchpoint">
      <span className="dtf-touchpoint-label"><IconGlyph name="Check" size={14} /> {card.heading}</span>
      <p className="dtf-touchpoint-prompt">{card.prompt}</p>
      <div className="quiz-options">
        {card.options.map((opt) => (
          <button
            key={opt}
            className={"quiz-option" + (picked === opt ? (opt === card.correct ? " correct" : " wrong") : "")}
            onClick={() => !picked && setPicked(opt)}
            disabled={!!picked}
          >
            <span>{opt}</span>
          </button>
        ))}
      </div>
      {picked && (
        <>
          <div className="dtf-feedback correct">{card.feedback}</div>
          <button type="button" className="btn-primary" onClick={onContinue}>Continue <IconGlyph name="ChevronRight" size={16} /></button>
        </>
      )}
    </div>
  );
}

function TP_StopSort({ card, onContinue }) {
  const [answers, setAnswers] = useState({});
  const allDone = card.items.every((_, i) => answers[i] !== undefined);
  function pick(i, val) {
    if (answers[i] !== undefined) return;
    setAnswers((a) => ({ ...a, [i]: val }));
  }
  return (
    <div className="dtf-touchpoint">
      <span className="dtf-touchpoint-label"><IconGlyph name="SlidersHorizontal" size={14} /> {card.heading}</span>
      <p className="dtf-touchpoint-prompt">{card.prompt}</p>
      <div className="dtf-sort-list">
        {card.items.map((item, i) => (
          <div className="dtf-sort-row" key={i}>
            <span className="dtf-sort-text">{item.text}</span>
            <div className="dtf-sort-buttons">
              {["problem", "solution"].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={"chip" + (answers[i] === val ? (val === item.answer ? " active-correct" : " active-wrong") : "")}
                  onClick={() => pick(i, val)}
                  disabled={answers[i] !== undefined}
                >
                  {val === "problem" ? "Problem" : "Solution"}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {allDone && <button type="button" className="btn-primary" onClick={onContinue}>Continue <IconGlyph name="ChevronRight" size={16} /></button>}
    </div>
  );
}

function TP_ProblemNeedOpportunity({ card, onContinue }) {
  const [answers, setAnswers] = useState({});
  const allDone = card.items.every((_, i) => answers[i] !== undefined);
  function pick(i, val) {
    if (answers[i] !== undefined) return;
    setAnswers((a) => ({ ...a, [i]: val }));
  }
  const labels = { problem: "Problem", need: "Need", opportunity: "Opportunity" };
  return (
    <div className="dtf-touchpoint">
      <span className="dtf-touchpoint-label"><IconGlyph name="SlidersHorizontal" size={14} /> {card.heading}</span>
      <p className="dtf-touchpoint-prompt">{card.prompt}</p>
      <div className="dtf-sort-list">
        {card.items.map((item, i) => (
          <div className="dtf-sort-row" key={i}>
            <span className="dtf-sort-text">{item.text}</span>
            <div className="dtf-sort-buttons">
              {["problem", "need", "opportunity"].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={"chip" + (answers[i] === val ? (val === item.answer ? " active-correct" : " active-wrong") : "")}
                  onClick={() => pick(i, val)}
                  disabled={answers[i] !== undefined}
                >
                  {labels[val]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {allDone && <button type="button" className="btn-primary" onClick={onContinue}>Continue <IconGlyph name="ChevronRight" size={16} /></button>}
    </div>
  );
}

function TP_RevealExplanation({ card, sectionKey, onContinue }) {
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="dtf-touchpoint">
      <span className="dtf-touchpoint-label"><IconGlyph name="Search" size={14} /> {card.heading}</span>
      <p className="dtf-touchpoint-prompt" style={{ whiteSpace: "pre-line" }}>{card.prompt}</p>
      <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Have a go first..." disabled={revealed} />
      {!revealed && (
        <button type="button" className="btn-secondary" onClick={() => { saveTouchpointResponse(sectionKey, card.id, text); setRevealed(true); }} disabled={!text.trim()}>
          Check my thinking
        </button>
      )}
      {revealed && (
        <>
          <div className="dtf-feedback correct">{card.modelExplanation}</div>
          {card.improvedVersion && (
            <div className="dtf-improved-version">
              <span className="help-label">Improved version</span>
              <p>{card.improvedVersion}</p>
            </div>
          )}
          <button type="button" className="btn-primary" onClick={onContinue}>Continue <IconGlyph name="ChevronRight" size={16} /></button>
        </>
      )}
    </div>
  );
}

function TP_ThinkTryTest({ card, sectionKey, onContinue }) {
  const [values, setValues] = useState({});
  const [revealed, setRevealed] = useState(false);
  const allFilled = card.parts.every((p) => (values[p.key] || "").trim());
  return (
    <div className="dtf-touchpoint">
      <span className="dtf-touchpoint-label"><IconGlyph name="Wrench" size={14} /> {card.heading}</span>
      <p className="dtf-touchpoint-prompt">{card.scenario}</p>
      {card.parts.map((p) => (
        <label key={p.key} className="dtf-ttt-part">
          <span className="spec-field-label requirement">{p.label}</span>
          <textarea rows={2} value={values[p.key] || ""} onChange={(e) => setValues((v) => ({ ...v, [p.key]: e.target.value }))} placeholder={p.placeholder} disabled={revealed} />
        </label>
      ))}
      {!revealed && (
        <button type="button" className="btn-secondary" onClick={() => { saveTouchpointResponse(sectionKey, "think_try_test", Object.values(values).join("\n\n")); setRevealed(true); }} disabled={!allFilled}>
          Check my thinking
        </button>
      )}
      {revealed && (
        <>
          <div className="dtf-feedback correct">{card.teacherGuidance}</div>
          <button type="button" className="btn-primary" onClick={onContinue}>Continue <IconGlyph name="ChevronRight" size={16} /></button>
        </>
      )}
    </div>
  );
}

function TP_DecideDefend({ card, sectionKey, onContinue }) {
  const [picked, setPicked] = useState(null);
  const [why, setWhy] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = picked === card.correct;
  return (
    <div className="dtf-touchpoint">
      <span className="dtf-touchpoint-label"><IconGlyph name="GitMerge" size={14} /> {card.heading}</span>
      <p className="dtf-touchpoint-prompt">{card.scenario}</p>
      <div className="dtf-choice-grid">
        {["a", "b"].map((key) => {
          const opt = key === "a" ? card.optionA : card.optionB;
          return (
            <button
              key={key}
              type="button"
              className={"dtf-choice-card" + (picked === key ? (key === card.correct ? " correct" : " wrong") : "")}
              onClick={() => !picked && setPicked(key)}
              disabled={!!picked}
            >
              <span className="dtf-choice-letter">{opt.label}</span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>
      {picked && !submitted && (
        <>
          <label>
            <span className="spec-field-label requirement">{card.prompt}</span>
            <textarea rows={2} value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Explain your thinking..." />
          </label>
          <button type="button" className="btn-secondary" onClick={() => { saveTouchpointResponse(sectionKey, "decide_defend", why); setSubmitted(true); }} disabled={!why.trim()}>
            Check my thinking
          </button>
        </>
      )}
      {submitted && (
        <>
          <div className={"dtf-feedback" + (isCorrect ? " correct" : "")}>{card.modelResponse}</div>
          <button type="button" className="btn-primary" onClick={onContinue}>Continue <IconGlyph name="ChevronRight" size={16} /></button>
        </>
      )}
    </div>
  );
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
  decide_defend: TP_DecideDefend,
};

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* MID-FLOW KNOWLEDGE CHECK - 3-5 questions on material taught so far   */
/* Pulled from Remember & Recognise + Explain & Examine only, since     */
/* Apply/Decide/Challenge questions test things not yet covered by the  */
/* point this step appears at in the flow.                              */
/* ------------------------------------------------------------------ */

function pickKnowledgeCheckQuestions(bank) {
  const byCat = { R: [], E: [] };
  bank.forEach((q) => { if (byCat[q.category]) byCat[q.category].push(q); });
  return [...shuffle(byCat.R).slice(0, 3), ...shuffle(byCat.E).slice(0, 2)].filter(Boolean);
}

const OPEN_TYPES = ["short_response", "extended_response", "improve_it", "decide_defend_short"];

function DTFQuestionRenderer({ question, response, onRespond }) {
  const [text, setText] = useState(response ? response.text : "");
  const [picked, setPicked] = useState(response ? response.picked : null);

  function submitObjective(answer, isCorrect) {
    onRespond({ picked: answer, isCorrect, text: "" });
  }
  function submitOpen() {
    const suggestion = suggestDTStage(text, question);
    onRespond({ text, picked: null, isCorrect: null, suggestion });
    apiPost(`/api/dtf/responses/${question.qid}`, { text, suggestedStage: suggestion.stage, stageReasoning: suggestion.reasoning }).catch(() => {});
  }

  if (response) {
    return (
      <div className="dtf-answered">
        {question.type === "mcq" && <p className={"dtf-feedback" + (response.isCorrect ? " correct" : "")}>You answered: {response.picked}{!response.isCorrect && <> — correct answer: {question.correctAnswer}</>}</p>}
        {question.type === "true_false" && <p className={"dtf-feedback" + (response.isCorrect ? " correct" : "")}>{question.feedback}</p>}
        {question.type === "fill_gap" && <p className={"dtf-feedback" + (response.isCorrect ? " correct" : "")}>{question.feedback}</p>}
        {OPEN_TYPES.includes(question.type) && response.suggestion && (
          <div className="dtf-stage-suggestion">
            <DTFStagePill stage={response.suggestion.stage} />
            <p className="sub">{stageNextStepFeedback(response.suggestion.stage)}</p>
          </div>
        )}
      </div>
    );
  }

  if (question.type === "mcq") {
    return (
      <div className="quiz-options">
        {question.options.map((opt) => (
          <button key={opt} className="quiz-option" onClick={() => submitObjective(opt, opt === question.correctAnswer)}>{opt}</button>
        ))}
      </div>
    );
  }
  if (question.type === "true_false") {
    return (
      <div className="quiz-options">
        {["True", "False"].map((opt) => (
          <button key={opt} className="quiz-option" onClick={() => submitObjective(opt, opt === question.correctAnswer)}>{opt}</button>
        ))}
      </div>
    );
  }
  if (question.type === "fill_gap") {
    return (
      <div className="dtf-fillgap">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your answer..." />
        <button type="button" className="btn-primary" onClick={() => {
          const isCorrect = question.acceptedAnswers.some((a) => a.toLowerCase().replace(/\s+/g, "") === text.toLowerCase().replace(/\s+/g, ""));
          onRespond({ picked: text, isCorrect, text });
        }}>Submit</button>
      </div>
    );
  }
  return (
    <div className="dtf-open-response">
      <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your answer..." />
      <button type="button" className="btn-primary" onClick={submitOpen} disabled={!text.trim()}>Submit</button>
    </div>
  );
}

function DTFKnowledgeCheckStep({ meta, bank, onEvidence, onContinue }) {
  const [questions] = useState(() => pickKnowledgeCheckQuestions(bank));
  const [responses, setResponses] = useState({});
  const startTimeRef = useRef(Date.now());
  const allAnswered = questions.every((q) => responses[q.qid]);
  const [submitted, setSubmitted] = useState(false);

  function respond(qid, r) {
    setResponses((rs) => ({ ...rs, [qid]: r }));
  }

  async function finish() {
    const objective = questions.filter((q) => !OPEN_TYPES.includes(q.type));
    const score = objective.filter((q) => responses[q.qid] && responses[q.qid].isCorrect).length;
    const details = questions.map((q) => ({
      qid: q.qid, prompt: q.prompt,
      studentAnswer: responses[q.qid] ? (responses[q.qid].text || responses[q.qid].picked) : "",
      correctAnswer: q.correctAnswer || null,
      isCorrect: responses[q.qid] ? responses[q.qid].isCorrect : null,
    }));
    const openStages = questions
      .filter((q) => OPEN_TYPES.includes(q.type))
      .map((q) => responses[q.qid] && responses[q.qid].suggestion && responses[q.qid].suggestion.stage)
      .filter(Boolean);
    try {
      await apiPost("/api/dtf/attempts", {
        unitKey: meta.unitKey, sectionKey: meta.sectionKey, attemptType: "micro",
        score, total: objective.length || 1, details, durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
      });
    } catch (e) { /* ignore */ }
    onEvidence(openStages);
    setSubmitted(true);
  }

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <h2>Knowledge Check</h2>
          <p className="sub">A quick check on what you've just learned — nothing beyond that yet.</p>
        </div>
      </div>
      <div className="dtf-section-check-list">
        {questions.map((q, i) => (
          <div className="dtf-question-block" key={q.qid}>
            <span className="dtf-question-number">Q{i + 1} · {QUESTION_CATEGORIES[q.category].label}</span>
            {q.scenario && <p className="sub dtf-scenario">{q.scenario}</p>}
            <p className="dtf-question-prompt">{q.prompt}</p>
            <DTFQuestionRenderer question={q} response={responses[q.qid]} onRespond={(r) => respond(q.qid, r)} />
          </div>
        ))}
      </div>
      <div className="quiz-result-actions" style={{ marginTop: 20 }}>
        {!submitted && (
          <button type="button" className="btn-primary" onClick={finish} disabled={!allAnswered}>
            {allAnswered ? "Check my answers" : `Answer all ${questions.length} to continue`} <IconGlyph name="ChevronRight" size={16} />
          </button>
        )}
        {submitted && (
          <button type="button" className="btn-primary" onClick={onContinue}>Continue <IconGlyph name="ChevronRight" size={16} /></button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* APPLY - Design Detective (unfamiliar scenario, 5-part response)     */
/* ------------------------------------------------------------------ */

function DTFApplyStep({ meta, task, onEvidence, onContinue }) {
  const [values, setValues] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const allFilled = task.parts.every((p) => (values[p.key] || "").trim());

  async function submit() {
    const combined = task.parts.map((p) => values[p.key] || "").join("\n\n");
    const s = suggestDTStage(combined, { acceptedIdeas: task.acceptedIdeas });
    setSuggestion(s);
    setSubmitted(true);
    onEvidence([s.stage]);
    apiPost(`/api/dtf/responses/U1-${meta.sectionKey.toUpperCase()}-APPLY`, { text: combined, suggestedStage: s.stage, stageReasoning: s.reasoning }).catch(() => {});
  }

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <h2>Apply: {task.heading}</h2>
          <p className="sub">A new, unfamiliar scenario — use what you've learned in this section.</p>
        </div>
      </div>
      <p className="dtf-scenario">{task.scenario}</p>
      <div className="spec-setup-form">
        {task.parts.map((p) => (
          <label key={p.key}>
            <span>{p.label}</span>
            <textarea rows={2} value={values[p.key] || ""} onChange={(e) => setValues((v) => ({ ...v, [p.key]: e.target.value }))} placeholder={p.placeholder} disabled={submitted} />
          </label>
        ))}
      </div>
      {!submitted && (
        <div className="qb-save-row" style={{ marginTop: 14 }}>
          <button type="button" className="btn-primary" onClick={submit} disabled={!allFilled}>Submit</button>
        </div>
      )}
      {submitted && suggestion && (
        <>
          <div className="dtf-stage-suggestion" style={{ marginTop: 14 }}>
            <DTFStagePill stage={suggestion.stage} />
            <p className="sub">{stageNextStepFeedback(suggestion.stage)}</p>
          </div>
          <div className="qb-save-row" style={{ marginTop: 14 }}>
            <button type="button" className="btn-primary" onClick={onContinue}>Continue <IconGlyph name="ChevronRight" size={16} /></button>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FIXED FLOW STEPS - welcome, WAGBA, stage ladder, starting point,    */
/* starting-point review, vocab review, next step                     */
/* ------------------------------------------------------------------ */

function DTFStepShell({ children, onNext, onBack, nextLabel }) {
  return (
    <div className="tab-content">
      {children}
      <div className="quiz-nav-row" style={{ marginTop: 20 }}>
        <button type="button" className="btn-secondary" onClick={onBack}>
          <IconGlyph name="ChevronRight" size={16} style={{ transform: "rotate(180deg)" }} /> Back
        </button>
        <button type="button" className="btn-primary" onClick={onNext}>
          {nextLabel || "Next"} <IconGlyph name="ChevronRight" size={16} />
        </button>
      </div>
    </div>
  );
}

function DTFWelcomeStep({ meta, onNext, onBack }) {
  return (
    <DTFStepShell onNext={onNext} onBack={onBack} nextLabel="Let's begin">
      <div className="dtf-content-card">
        <h2>Welcome</h2>
        <p className="dtf-card-body" style={{ whiteSpace: "pre-line" }}>{meta.welcome}</p>
      </div>
    </DTFStepShell>
  );
}

function DTFWagbaStep({ meta, onNext, onBack }) {
  return (
    <DTFStepShell onNext={onNext} onBack={onBack}>
      <div className="dtf-content-card">
        <h2>What We Are Getting Better At</h2>
        <p className="dtf-card-body">{meta.wagbaHeadline}</p>
        <span className="help-label">You will learn how to</span>
        <ul className="spec-prompt-list">
          {meta.wagbaBullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>
    </DTFStepShell>
  );
}

function DTFStageLadderStep({ meta, onNext, onBack, highlightStage, title }) {
  return (
    <DTFStepShell onNext={onNext} onBack={onBack}>
      <div className="dtf-content-card">
        <h2>{title || "How We Show Success"}</h2>
        {!highlightStage && <p className="sub">By the end, you should be able to say one of these:</p>}
        {highlightStage && <p className="sub">Based on what you've shown in this section, here's where you currently sit — you and your teacher can always discuss and adjust this.</p>}
        <div className="dtf-ladder">
          {DT_STAGES.map((stage) => (
            <div key={stage} className={"dtf-ladder-row" + (highlightStage === stage ? " current" : "")}>
              <DTFStagePill stage={stage} />
              <p>{meta.stageLadder[stage]}</p>
            </div>
          ))}
        </div>
      </div>
    </DTFStepShell>
  );
}

function DTFStartingPointStep({ meta, question, onNext, onBack }) {
  const [picked, setPicked] = useState(null);

  function choose(opt) {
    if (picked) return;
    setPicked(opt);
    saveTouchpointResponse(meta.sectionKey, "starting_point", opt);
  }

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <h2>What Do You Think?</h2>
          <p className="sub">Imagine this situation:</p>
        </div>
      </div>
      <p className="dtf-scenario">{question.scenario}</p>
      <p className="dtf-question-prompt">{question.prompt}</p>
      <div className="quiz-options">
        {question.options.map((opt) => (
          <button key={opt} className={"quiz-option" + (picked === opt ? " picked" : "")} onClick={() => choose(opt)} disabled={!!picked}>{opt}</button>
        ))}
      </div>
      {picked && (
        <div className="dtf-feedback" style={{ marginTop: 14 }}>
          Don't worry if you're unsure — this is your starting point, not your final test. Keep your answer in mind, we'll return to this idea later.
        </div>
      )}
      <div className="quiz-nav-row" style={{ marginTop: 20 }}>
        <button type="button" className="btn-secondary" onClick={onBack}>
          <IconGlyph name="ChevronRight" size={16} style={{ transform: "rotate(180deg)" }} /> Back
        </button>
        {picked && <button type="button" className="btn-primary" onClick={() => onNext(picked)}>Next <IconGlyph name="ChevronRight" size={16} /></button>}
      </div>
    </div>
  );
}

function DTFStartingPointReviewStep({ meta, startingPointText, onNext, onBack }) {
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);

  async function save() {
    if (reflection.trim()) saveTouchpointResponse(meta.sectionKey, "starting_point_reflection", reflection);
    setSaved(true);
  }

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div><h2>Look Back at Your Starting Point</h2></div>
      </div>
      <div className="spec-context-banner">
        <span className="help-label">At the beginning you said</span>
        <p className="spec-context-name" style={{ fontWeight: 500 }}>“{startingPointText || "(no answer recorded)"}”</p>
      </div>
      <div className="spec-setup-form">
        <label>
          <span>Would you give the same answer now? Why or why not?</span>
          <textarea rows={3} value={reflection} onChange={(e) => setReflection(e.target.value)} />
        </label>
      </div>
      <div className="quiz-nav-row" style={{ marginTop: 20 }}>
        <button type="button" className="btn-secondary" onClick={onBack}>
          <IconGlyph name="ChevronRight" size={16} style={{ transform: "rotate(180deg)" }} /> Back
        </button>
        <button type="button" className="btn-primary" onClick={async () => { await save(); onNext(); }}>Next <IconGlyph name="ChevronRight" size={16} /></button>
      </div>
    </div>
  );
}

function DTFVocabReviewStep({ vocab, onNext, onBack }) {
  const [flipped, setFlipped] = useState({});
  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <h2>Words We've Worked With</h2>
          <p className="sub">Tap a card to see the definition.</p>
        </div>
      </div>
      <div className="tool-picker-grid">
        {vocab.map((v) => (
          <button type="button" key={v.id} className="tool-picker-card" onClick={() => setFlipped((f) => ({ ...f, [v.id]: !f[v.id] }))}>
            <span className="tool-picker-title">{v.term}</span>
            {flipped[v.id] && <span className="tool-picker-desc">{v.definition}</span>}
            {!flipped[v.id] && <span className="sub">Tap to reveal</span>}
          </button>
        ))}
      </div>
      <div className="quiz-nav-row" style={{ marginTop: 20 }}>
        <button type="button" className="btn-secondary" onClick={onBack}>
          <IconGlyph name="ChevronRight" size={16} style={{ transform: "rotate(180deg)" }} /> Back
        </button>
        <button type="button" className="btn-primary" onClick={onNext}>Continue <IconGlyph name="ChevronRight" size={16} /></button>
      </div>
    </div>
  );
}

function DTFNextStepStep({ meta, onDone }) {
  const [understand, setUnderstand] = useState("");
  const [practise, setPractise] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (understand.trim()) saveTouchpointResponse(meta.sectionKey, "reflect_understand", understand);
    if (practise.trim()) saveTouchpointResponse(meta.sectionKey, "reflect_practise", practise);
    setSaved(true);
  }

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <h2>Reflect &amp; Refine</h2>
          <p className="sub">Section complete — nice work.</p>
        </div>
      </div>
      <div className="spec-setup-form">
        <label>
          <span>Something I understand better now is…</span>
          <textarea rows={2} value={understand} onChange={(e) => setUnderstand(e.target.value)} />
        </label>
        <label>
          <span>Something I still need to practise is…</span>
          <textarea rows={2} value={practise} onChange={(e) => setPractise(e.target.value)} />
        </label>
      </div>
      <div className="qb-save-row" style={{ marginTop: 14 }}>
        <button type="button" className="btn-primary" onClick={handleSave} disabled={saved}>{saved ? "Saved" : "Save my reflection"}</button>
        {saved && <button type="button" className="btn-secondary" onClick={onDone}>Back to Design Fundamentals <IconGlyph name="ChevronRight" size={16} /></button>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION SHELL - builds the full WAGBA-framed flow and resumes from  */
/* wherever the student left off, so a refresh never restarts them.    */
/* ------------------------------------------------------------------ */

function buildSectionFlow(meta, cards) {
  return [
    { stepType: "welcome" },
    { stepType: "wagba" },
    { stepType: "stage-ladder" },
    { stepType: "starting-point" },
    ...cards.map((c) => ({ stepType: c.type, card: c })),
    { stepType: "knowledge-check" },
    { stepType: "apply" },
    { stepType: "wagba-return" },
    { stepType: "starting-point-review" },
    { stepType: "vocab-review" },
    { stepType: "next-step" },
  ];
}

function DTFSectionShell({ meta, cards, bank, vocab, applyTask, startingPointQuestion, onExit }) {
  const flow = useMemo(() => buildSectionFlow(meta, cards), [meta, cards]);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [startingPointText, setStartingPointText] = useState("");
  const [stageEvidence, setStageEvidence] = useState([]);
  const [resumed, setResumed] = useState(false);

  useEffect(() => {
    apiGet("/api/dtf/progress").then((rows) => {
      const existing = rows.find((r) => r.unitKey === meta.unitKey && r.sectionKey === meta.sectionKey);
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
    const sessionState = { stepIndex, startingPointText, ...extra };
    apiPut(`/api/dtf/progress/${meta.unitKey}/${meta.sectionKey}`, { sessionState }).catch(() => {});
  }

  function goTo(nextIndex, extra) {
    setStepIndex(nextIndex);
    const sessionState = { stepIndex: nextIndex, startingPointText: (extra && extra.startingPointText) || startingPointText };
    apiPut(`/api/dtf/progress/${meta.unitKey}/${meta.sectionKey}`, { sessionState }).catch(() => {});
  }

  function next() { goTo(Math.min(stepIndex + 1, flow.length - 1)); }
  function back() { stepIndex === 0 ? onExit() : goTo(stepIndex - 1); }

  function addEvidence(stages) {
    setStageEvidence((s) => [...s, ...stages]);
  }

  function finalStageSuggestion() {
    if (!stageEvidence.length) return null;
    const counts = {};
    stageEvidence.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  async function finishKnowledgeOrApplyStep() {
    const stage = finalStageSuggestion();
    if (stage) {
      await apiPut(`/api/dtf/progress/${meta.unitKey}/${meta.sectionKey}`, {
        suggestedStage: stage,
        stageReasoning: `Based on ${stageEvidence.length} piece${stageEvidence.length === 1 ? "" : "s"} of evidence from this section's Knowledge Check and Apply task, most closely matching the "${DT_STAGE_INFO[stage].label}" stage.`,
        completed: true,
      });
    } else {
      await apiPut(`/api/dtf/progress/${meta.unitKey}/${meta.sectionKey}`, { completed: true });
    }
    next();
  }

  if (loading) {
    return (
      <div className="tab-content">
        <p className="sub">Loading...</p>
      </div>
    );
  }

  const step = flow[stepIndex];

  return (
    <>
      <div className="tool-subheader no-print">
        <button type="button" className="btn-text back-btn" onClick={onExit}>
          <IconGlyph name="ChevronRight" size={15} style={{ transform: "rotate(180deg)" }} /> Design Fundamentals
        </button>
      </div>

      {resumed && stepIndex > 0 && (
        <div className="admin-banner no-print" style={{ margin: "0 14px 0 14px" }}>
          <span>Welcome back — picking up where you left off.</span>
          <button type="button" onClick={() => setResumed(false)} aria-label="Dismiss"><IconGlyph name="X" size={14} /></button>
        </div>
      )}

      <div className="spec-wizard-progress" style={{ margin: "16px 14px 0 14px" }}>
        <span className="quiz-history-label">Section {meta.number} of 17 · {meta.title}</span>
        <div className="quiz-progress-bar"><div style={{ width: `${((stepIndex + 1) / flow.length) * 100}%`, background: "var(--blue)" }} /></div>
      </div>

      {step.stepType === "welcome" && <DTFWelcomeStep meta={meta} onNext={next} onBack={back} />}
      {step.stepType === "wagba" && <DTFWagbaStep meta={meta} onNext={next} onBack={back} />}
      {step.stepType === "stage-ladder" && <DTFStageLadderStep meta={meta} onNext={next} onBack={back} />}
      {step.stepType === "starting-point" && (
        <DTFStartingPointStep
          meta={meta} question={startingPointQuestion} onBack={back}
          onNext={(answerText) => { setStartingPointText(answerText); goTo(stepIndex + 1, { startingPointText: answerText }); }}
        />
      )}

      {(step.stepType === "content" || step.stepType === "touchpoint") && (
        <div className="tab-content">
          {step.stepType === "content" && (
            <div className="dtf-content-card">
              <h2>{step.card.heading}</h2>
              <p className="dtf-card-body" style={{ whiteSpace: "pre-line" }}>{step.card.body}</p>
              {step.card.compare && (
                <div className="dtf-compare-grid">
                  <div className="dtf-compare-item"><span className="dtf-choice-letter">A</span><p>{step.card.compare.a}</p></div>
                  <div className="dtf-compare-item"><span className="dtf-choice-letter">B</span><p>{step.card.compare.b}</p></div>
                </div>
              )}
              {step.card.list && (
                <div className="chip-row">
                  {step.card.list.map((item, i) => <span key={i} className="chip chip-word">{item}</span>)}
                </div>
              )}
              {step.card.footer && <p className="sub" style={{ marginTop: 10 }}>{step.card.footer}</p>}
            </div>
          )}
          {step.stepType === "touchpoint" && (() => {
            const Touchpoint = TOUCHPOINT_RENDERERS[step.card.kind];
            return Touchpoint ? <Touchpoint card={step.card} sectionKey={meta.sectionKey} onContinue={next} /> : null;
          })()}
          <div className="quiz-nav-row" style={{ marginTop: 20 }}>
            <button type="button" className="btn-secondary" onClick={back}>
              <IconGlyph name="ChevronRight" size={16} style={{ transform: "rotate(180deg)" }} /> Back
            </button>
            {step.stepType === "content" && (
              <button type="button" className="btn-primary" onClick={next}>Next <IconGlyph name="ChevronRight" size={16} /></button>
            )}
          </div>
        </div>
      )}

      {step.stepType === "knowledge-check" && (
        <DTFKnowledgeCheckStep meta={meta} bank={bank} onEvidence={addEvidence} onContinue={next} />
      )}
      {step.stepType === "apply" && (
        <DTFApplyStep meta={meta} task={applyTask} onEvidence={addEvidence} onContinue={finishKnowledgeOrApplyStep} />
      )}
      {step.stepType === "wagba-return" && (
        <DTFStageLadderStep meta={meta} onNext={next} onBack={back} highlightStage={finalStageSuggestion()} title="Return to WAGBA" />
      )}
      {step.stepType === "starting-point-review" && (
        <DTFStartingPointReviewStep meta={meta} startingPointText={startingPointText} onNext={next} onBack={back} />
      )}
      {step.stepType === "vocab-review" && (
        <DTFVocabReviewStep vocab={vocab} onNext={next} onBack={back} />
      )}
      {step.stepType === "next-step" && (
        <DTFNextStepStep meta={meta} onDone={onExit} />
      )}
    </>
  );
}

function DesignFundamentalsTool({ user, onBack }) {
  const [openSectionKey, setOpenSectionKey] = useState(null);

  if (openSectionKey === "s1") {
    return (
      <DTFSectionShell
        meta={U1S1_META}
        cards={U1S1_CARDS}
        bank={U1S1_QUESTIONS}
        vocab={U1S1_VOCAB}
        applyTask={U1S1_APPLY_TASK}
        startingPointQuestion={U1S1_STARTING_POINT}
        onExit={() => setOpenSectionKey(null)}
      />
    );
  }

  return (
    <>
      <div className="tool-subheader no-print">
        <button type="button" className="btn-text back-btn" onClick={onBack}>
          <IconGlyph name="ChevronRight" size={15} style={{ transform: "rotate(180deg)" }} /> All tools
        </button>
      </div>
      <DTFDashboard sections={UNIT_1_SECTIONS} onOpenSection={setOpenSectionKey} />
    </>
  );
}

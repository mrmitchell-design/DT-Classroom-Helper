function emptyQuestion(type) {
  const base = { qid: "q" + Math.random().toString(36).slice(2, 10), type, prompt: "", badge: "?", tint: "#2F8FA6" };
  if (type === "mcq" || type === "scenario") return { ...base, options: ["", "", "", ""], answer: "" };
  return { ...base, keywords: [], modelAnswer: "" };
}

function QuestionEditor({ question, onChange, onRemove }) {
  function update(patch) { onChange({ ...question, ...patch }); }
  function updateOption(idx, val) {
    const options = [...question.options];
    options[idx] = val;
    update({ options });
  }
  return (
    <div className="qb-question-editor">
      <div className="qb-question-head">
        <select value={question.type} onChange={(e) => onChange(emptyQuestion(e.target.value))}>
          <option value="mcq">Multiple choice</option>
          <option value="scenario">Scenario (multiple choice)</option>
          <option value="typed">Typed answer</option>
        </select>
        <input className="qb-badge-input" value={question.badge} onChange={(e) => update({ badge: e.target.value })} placeholder="Badge" maxLength={2} />
        <button type="button" className="icon-btn danger" onClick={onRemove} title="Remove question"><IconGlyph name="Trash2" size={14} /></button>
      </div>
      <textarea rows={2} value={question.prompt} onChange={(e) => update({ prompt: e.target.value })} placeholder="Question prompt..." />
      {(question.type === "mcq" || question.type === "scenario") && (
        <div className="qb-options">
          {question.options.map((opt, i) => (
            <div className="qb-option-row" key={i}>
              <input
                type="radio"
                name={`answer-${question.qid}`}
                checked={question.answer === opt && opt !== ""}
                onChange={() => update({ answer: opt })}
              />
              <input value={opt} onChange={(e) => { updateOption(i, e.target.value); if (question.answer === opt) update({ answer: e.target.value }); }} placeholder={`Option ${i + 1}`} />
            </div>
          ))}
          <span className="sub">Tick the radio button next to the correct answer.</span>
        </div>
      )}
      {question.type === "typed" && (
        <div className="qb-typed">
          <label>
            <span>Keywords (comma-separated, used to self-check answers)</span>
            <input value={(question.keywords || []).join(", ")} onChange={(e) => update({ keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })} />
          </label>
          <label>
            <span>Model answer (shown to students for comparison)</span>
            <textarea rows={2} value={question.modelAnswer} onChange={(e) => update({ modelAnswer: e.target.value })} />
          </label>
        </div>
      )}
    </div>
  );
}

function QuizSetBuilder({ existing, onSaved, onCancel }) {
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

  function addQuestion(type) { setQuestions((qs) => [...qs, emptyQuestion(type)]); }
  function updateQuestion(idx, q) { setQuestions((qs) => qs.map((old, i) => (i === idx ? q : old))); }
  function removeQuestion(idx) { setQuestions((qs) => qs.filter((_, i) => i !== idx)); }

  function handleCsvFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result || ""));
    reader.readAsText(file);
  }

  async function handleCsvImport() {
    if (!csvText.trim()) { setCsvError("Paste CSV text or choose a file first."); return; }
    setCsvBusy(true);
    setCsvError("");
    setCsvResult(null);
    try {
      const res = await apiPost("/api/admin/quiz-sets/parse-csv", { csv: csvText });
      setCsvResult(res);
      if (res.questions.length > 0) {
        setQuestions((qs) => [...qs, ...res.questions]);
      }
    } catch (err) {
      setCsvError(err.message);
    } finally {
      setCsvBusy(false);
    }
  }

  function importFromBuiltIn(frameworkKey) {
    const fw = FRAMEWORKS[frameworkKey];
    const imported = fw.items.map((item) => ({
      qid: `builtin-${frameworkKey}-${item.id}-${Math.random().toString(36).slice(2, 6)}`,
      type: "mcq",
      prompt: `In ${fw.label}, what does the letter "${item.letter}" stand for?`,
      options: shuffle([item.word, ...fw.items.filter((i) => i.id !== item.id).map((i) => i.word).slice(0, 3)]),
      answer: item.word,
      badge: item.letter,
      tint: fw.tint,
    }));
    setQuestions((qs) => [...qs, ...imported]);
  }

  async function handleSave() {
    if (!name.trim()) { setError("Give the quiz a name."); return; }
    const cleaned = questions.filter((q) => q.prompt.trim());
    if (cleaned.length === 0) { setError("Add at least one question with a prompt."); return; }
    for (const q of cleaned) {
      if ((q.type === "mcq" || q.type === "scenario") && (!q.answer || q.options.filter((o) => o.trim()).length < 2)) {
        setError(`"${q.prompt.slice(0, 40)}..." needs at least 2 options and a selected correct answer.`);
        return;
      }
    }
    setSaving(true);
    setError("");
    try {
      const payload = { name: name.trim(), description: description.trim(), questions: cleaned, isPracticeBank };
      const saved = existing ? await apiPut(`/api/admin/quiz-sets/${existing.id}`, payload) : await apiPost("/api/admin/quiz-sets", payload);
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="qb-builder">
      <div className="qb-meta">
        <label>
          <span>Quiz name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. ACCESSFM Recap" autoFocus />
        </label>
        <label>
          <span>Description (optional)</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Shown to students in the quiz picker" />
        </label>
        <label className="qb-checkbox-label">
          <input type="checkbox" checked={isPracticeBank} onChange={(e) => setIsPracticeBank(e.target.checked)} />
          <span>Practice bank — any student can do this any time (in addition to any class you assign it to)</span>
        </label>
      </div>

      <div className="qb-import-row">
        <span className="help-label">Quick-add from the built-in question set</span>
        <div className="chip-row">
          <button type="button" className="chip chip-word" onClick={() => importFromBuiltIn("accessfm")}>+ All ACCESSFM letters</button>
          <button type="button" className="chip chip-word" onClick={() => importFromBuiltIn("scamper")}>+ All SCAMPER letters</button>
        </div>
        <button type="button" className="btn-secondary" onClick={() => setShowCsvImport((s) => !s)} style={{ alignSelf: "flex-start", marginTop: 6 }}>
          <IconGlyph name="FileDown" size={15} /> {showCsvImport ? "Cancel CSV import" : "Import questions from CSV"}
        </button>
      </div>

      {showCsvImport && (
        <div className="csv-import-panel">
          <p className="sub">
            Header row: <code>type,prompt,option1,option2,option3,option4,answer,badge,keywords,modelAnswer</code>.{" "}
            <code>type</code> is <code>mcq</code>, <code>scenario</code> or <code>typed</code>. For mcq/scenario,
            fill in 2–4 options and make <code>answer</code> match one exactly. For typed, fill in{" "}
            <code>keywords</code> (comma-separated — quote the cell) and <code>modelAnswer</code> instead.
          </p>
          <div className="csv-import-controls">
            <input type="file" accept=".csv,text/csv" onChange={handleCsvFile} />
          </div>
          <textarea rows={4} value={csvText} onChange={(e) => { setCsvText(e.target.value); setCsvResult(null); }} placeholder="Or paste CSV text directly here..." />
          {csvError && <p className="login-error">{csvError}</p>}
          <button type="button" className="btn-primary" onClick={handleCsvImport} disabled={csvBusy}>{csvBusy ? "Importing..." : "Add these questions"}</button>
          {csvResult && (
            <div className="csv-import-result">
              <p className="sub"><strong>{csvResult.importedCount}</strong> question{csvResult.importedCount === 1 ? "" : "s"} added, <strong>{csvResult.failedCount}</strong> row{csvResult.failedCount === 1 ? "" : "s"} skipped.</p>
              {csvResult.errors.length > 0 && (
                <div className="csv-import-failed">
                  {csvResult.errors.map((e) => <div key={e.row} className="mono">Row {e.row}: {e.error}</div>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="qb-questions">
        {questions.map((q, i) => (
          <QuestionEditor key={q.qid} question={q} onChange={(nq) => updateQuestion(i, nq)} onRemove={() => removeQuestion(i)} />
        ))}
      </div>

      <div className="qb-add-row">
        <button type="button" className="btn-secondary" onClick={() => addQuestion("mcq")}>+ Multiple choice</button>
        <button type="button" className="btn-secondary" onClick={() => addQuestion("scenario")}>+ Scenario</button>
        <button type="button" className="btn-secondary" onClick={() => addQuestion("typed")}>+ Typed answer</button>
      </div>

      {error && <p className="login-error">{error}</p>}
      <div className="qb-save-row">
        <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : existing ? "Save changes" : "Create quiz"}</button>
        <button type="button" className="btn-text" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function AssignPanel({ itemLabel, onAssign, existingAssignments, onUnassign, classGroups }) {
  const [yearGroup, setYearGroup] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [busy, setBusy] = useState(false);

  const yearOptions = [...new Set(classGroups.map((c) => c.yearGroup).filter(Boolean))].sort();
  const classOptions = [...new Set(classGroups.map((c) => c.classGroup).filter(Boolean))].sort();

  async function handleAssign() {
    if (!yearGroup && !classGroup) return;
    setBusy(true);
    try {
      await onAssign({ yearGroup, classGroup, dueAt: dueAt || null });
      setYearGroup(""); setClassGroup(""); setDueAt("");
    } catch (e) { /* ignore */ }
    setBusy(false);
  }

  return (
    <div className="assign-panel">
      <div className="assign-row">
        <select value={yearGroup} onChange={(e) => setYearGroup(e.target.value)}>
          <option value="">Any year</option>
          {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={classGroup} onChange={(e) => setClassGroup(e.target.value)}>
          <option value="">Any class</option>
          {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
        <button type="button" className="btn-secondary" onClick={handleAssign} disabled={busy || (!yearGroup && !classGroup)}>Assign {itemLabel}</button>
      </div>
      {yearOptions.length === 0 && <p className="sub">No classes exist yet — add students with a year/class first.</p>}
      {existingAssignments.length > 0 && (
        <div className="assign-list">
          {existingAssignments.map((a) => (
            <span key={a.id} className="assign-chip">
              {a.yearGroup || "Any year"} {a.classGroup ? `\u00b7 ${a.classGroup}` : ""}{a.dueAt ? ` \u00b7 due ${a.dueAt}` : ""}
              <button type="button" onClick={() => onUnassign(a.id)} aria-label="Remove assignment"><IconGlyph name="X" size={11} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
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
    Promise.all([apiGet("/api/admin/quiz-sets"), apiGet("/api/admin/quiz-assignments"), apiGet("/api/admin/classes")])
      .then(([s, a, c]) => { setSets(s); setAssignments(a); setClassGroups(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleDelete(set) {
    if (!window.confirm(`Delete quiz "${set.name}"? This cannot be undone.`)) return;
    try { await apiDelete(`/api/admin/quiz-sets/${set.id}`); load(); } catch (e) { /* ignore */ }
  }

  async function handleAssign(setId, payload) {
    await apiPost("/api/admin/quiz-assignments", { quizSetId: setId, ...payload });
    load();
  }

  async function handleUnassign(assignmentId) {
    await apiDelete(`/api/admin/quiz-assignments/${assignmentId}`);
    load();
  }

  if (editing) {
    return (
      <div className="tab-content admin-content">
        <div className="panel-head">
          <div><h2>{editing === "new" ? "New quiz" : `Edit "${editing.name}"`}</h2></div>
        </div>
        <QuizSetBuilder
          existing={editing === "new" ? null : editing}
          onSaved={() => { setEditing(null); load(); }}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div className="tab-content admin-content">
      {banner && (
        <div className={"admin-banner" + (banner.isError ? " error" : "")}>
          <span>{banner.text}</span>
          <button type="button" onClick={() => setBanner(null)} aria-label="Dismiss"><IconGlyph name="X" size={14} /></button>
        </div>
      )}
      <div className="panel-head">
        <div>
          <h2>Quizzes</h2>
          <p className="sub">Write your own quizzes, mix in built-in questions, then assign to a class or mark as a practice bank.</p>
        </div>
        <button className="btn-primary" onClick={() => setEditing("new")}><IconGlyph name="UserPlus" size={18} /> New quiz</button>
      </div>

      {loading && <p className="sub">Loading...</p>}
      {!loading && sets.length === 0 && <p className="sub">No custom quizzes yet.</p>}

      <div className="qb-set-list">
        {sets.map((set) => {
          const setAssignments = assignments.filter((a) => a.quizSetId === set.id);
          const isOpen = expandedId === set.id;
          return (
            <div className="qb-set-card" key={set.id}>
              <div className="qb-set-head" onClick={() => setExpandedId(isOpen ? null : set.id)}>
                <span className="qb-set-name">{set.name} {set.isPracticeBank && <span className="needs-marking-badge" style={{ background: "#EDF5EE", color: "#2A5B37" }}>practice bank</span>}</span>
                <span className="mono">{set.questions.length} question{set.questions.length === 1 ? "" : "s"}</span>
                <IconGlyph name="ChevronDown" size={14} className={"chevron" + (isOpen ? " up" : "")} />
              </div>
              {isOpen && (
                <div className="qb-set-body">
                  {set.description && <p className="sub">{set.description}</p>}
                  <div className="qb-set-actions">
                    <button type="button" className="btn-secondary" onClick={() => setEditing(set)}><IconGlyph name="PenLine" size={14} /> Edit</button>
                    <button type="button" className="btn-text" onClick={() => handleDelete(set)}><IconGlyph name="Trash2" size={14} /> Delete</button>
                  </div>
                  <span className="help-label">Assign to a class</span>
                  <AssignPanel
                    itemLabel="quiz"
                    existingAssignments={setAssignments}
                    onAssign={(payload) => handleAssign(set.id, payload)}
                    onUnassign={handleUnassign}
                    classGroups={classGroups}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

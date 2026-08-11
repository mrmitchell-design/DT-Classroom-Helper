/* ------------------------------------------------------------------ */
/* SPEC LIST - "My specifications"                                     */
/* ------------------------------------------------------------------ */

function SpecList({ onOpen, onCreate }) {
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
    try { await apiDelete(`/api/specs/${project.id}`); load(); } catch (e) { /* ignore */ }
  }

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <h2>My Specifications</h2>
          <p className="sub">Build a clear and measurable design specification, step by step.</p>
        </div>
        <button type="button" className="btn-primary" onClick={onCreate}><IconGlyph name="PenLine" size={16} /> New specification</button>
      </div>

      {loading && <p className="sub">Loading...</p>}
      {!loading && projects.length === 0 && (
        <p className="sub">You haven't started a specification yet. Click "New specification" to begin — you'll be guided through it category by category.</p>
      )}

      <div className="spec-list">
        {projects.map((p) => (
          <div className="spec-list-row" key={p.id} onClick={() => onOpen(p.id)}>
            <span className="spec-list-name">
              {p.projectName || "Untitled"}
              {p.feedback && <IconGlyph name="Lightbulb" size={13} style={{ color: "#B25E00", marginLeft: 6, verticalAlign: "-2px" }} />}
              <span className={"status-pill" + (p.status === "submitted" ? " submitted" : " draft")}>{p.status === "submitted" ? "Handed in" : "Draft"}</span>
            </span>
            <span className="mono">{p.pointCount} point{p.pointCount === 1 ? "" : "s"}</span>
            <span className="saved-row-date mono">{formatDate(p.updatedAt)}</span>
            <button type="button" className="saved-row-delete" onClick={(e) => handleDelete(p, e)} aria-label="Delete"><IconGlyph name="Trash2" size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SPEC SETUP - project name / problem / user                          */
/* ------------------------------------------------------------------ */

function SpecSetup({ existing, onSaved, onCancel }) {
  const [projectName, setProjectName] = useState(existing ? existing.projectName : "");
  const [designProblem, setDesignProblem] = useState(existing ? existing.designProblem : "");
  const [intendedUser, setIntendedUser] = useState(existing ? existing.intendedUser : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!projectName.trim()) { setError("Give your project a name."); return; }
    setSaving(true);
    setError("");
    try {
      const payload = { projectName, designProblem, intendedUser };
      const saved = existing ? await apiPut(`/api/specs/${existing.id}`, payload) : await apiPost("/api/specs", payload);
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <h2>{existing ? "Edit project details" : "Start a new specification"}</h2>
          <p className="sub">These stay visible while you build your specification, and you can edit them any time.</p>
        </div>
      </div>

      <div className="spec-setup-form">
        <label>
          <span>Project / product name</span>
          <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. Desk organiser for a secondary school student" autoFocus />
        </label>
        <label>
          <span>Design problem — what are you designing, and why?</span>
          <textarea rows={3} value={designProblem} onChange={(e) => setDesignProblem(e.target.value)} placeholder="A short explanation of the problem you're solving..." />
        </label>
        <label>
          <span>Intended user — who is this for?</span>
          <textarea rows={2} value={intendedUser} onChange={(e) => setIntendedUser(e.target.value)} placeholder="e.g. Year 10 secondary school student" />
        </label>
      </div>

      {error && <p className="login-error">{error}</p>}
      <div className="qb-save-row">
        <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : existing ? "Save changes" : "Start building"}
        </button>
        <button type="button" className="btn-text" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SPEC POINT FORM - Requirement / Reason / Testing, with live checker  */
/* ------------------------------------------------------------------ */

function SpecPointForm({ category, onAdd }) {
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
      await onAdd({ category: category.key, requirement, reason, testingMethod });
      setRequirement(""); setReason(""); setTestingMethod(""); setTouched(false);
    } catch (e) { /* ignore */ }
    setBusy(false);
  }

  return (
    <div className="spec-point-form">
      <label>
        <span className="spec-field-label requirement">1. Requirement — what must the product do?</span>
        <textarea
          rows={2}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={category.example.better}
        />
        {hint && (
          <div className="spec-hint">
            <IconGlyph name="Lightbulb" size={14} style={{ color: "#B25E00", flexShrink: 0 }} />
            <span>{hint}</span>
          </div>
        )}
      </label>
      <label>
        <span className="spec-field-label reason">2. Reason — why is this important?</span>
        <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. The user only has this amount of space available." />
      </label>
      <label>
        <span className="spec-field-label testing">3. Testing — how could you check this later?</span>
        <textarea rows={2} value={testingMethod} onChange={(e) => setTestingMethod(e.target.value)} placeholder="e.g. Measure the final prototype and check it fits." />
      </label>
      <button type="button" className="btn-primary" onClick={handleAdd} disabled={busy || !requirement.trim()}>
        <IconGlyph name="Check" size={16} /> {busy ? "Adding..." : "Add this point"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SPEC WIZARD - one category at a time                                */
/* ------------------------------------------------------------------ */

function SpecWizard({ project, onPointsChanged, onGoToReview, onGoToSummary, onBack }) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [points, setPoints] = useState(project.points || []);
  const category = SPEC_CATEGORIES[categoryIndex];
  const pointsInCategory = points.filter((p) => p.category === category.key);

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
      const next = points.filter((p) => p.id !== point.id);
      setPoints(next);
      onPointsChanged(next);
    } catch (e) { /* ignore */ }
  }

  return (
    <div className="tab-content">
      <div className="spec-context-banner no-print">
        <span className="spec-context-name">{project.projectName}</span>
        {project.intendedUser && <span className="sub">For: {project.intendedUser}</span>}
      </div>

      <div className="spec-wizard-progress">
        <span className="quiz-history-label">Category {categoryIndex + 1} of {SPEC_CATEGORIES.length}</span>
        <div className="quiz-progress-bar"><div style={{ width: `${((categoryIndex + 1) / SPEC_CATEGORIES.length) * 100}%`, background: "var(--blue)" }} /></div>
      </div>

      <div className="spec-category-head">
        <LetterBadge letter={category.label[0]} tint="var(--blue)" size={40} />
        <div>
          <h2 style={{ marginBottom: 2 }}>{category.label}</h2>
          <p className="sub">{category.question}</p>
        </div>
      </div>

      <div className="spec-help-block">
        <span className="help-label">Things to think about</span>
        <ul className="spec-prompt-list">
          {category.prompts.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
        <div className="spec-example">
          <span className="spec-example-weak"><strong>Weak:</strong> {category.example.weak}</span>
          <span className="spec-example-better"><strong>Better:</strong> {category.example.better}</span>
        </div>
      </div>

      {pointsInCategory.length > 0 && (
        <div className="spec-added-points">
          <span className="help-label">Added to {category.label} so far</span>
          {pointsInCategory.map((p) => (
            <div className="spec-added-point" key={p.id}>
              <span>{p.requirement}</span>
              <button type="button" className="saved-row-delete" onClick={() => handleRemove(p)} aria-label="Remove"><IconGlyph name="Trash2" size={13} /></button>
            </div>
          ))}
        </div>
      )}

      <SpecPointForm category={category} onAdd={handleAdd} />

      <div className="quiz-nav-row" style={{ marginTop: 24 }}>
        <button type="button" className="btn-secondary" onClick={() => setCategoryIndex((i) => Math.max(0, i - 1))} disabled={categoryIndex === 0}>
          <IconGlyph name="ChevronRight" size={16} style={{ transform: "rotate(180deg)" }} /> Previous
        </button>
        {categoryIndex + 1 < SPEC_CATEGORIES.length ? (
          <button type="button" className="btn-primary" onClick={() => setCategoryIndex((i) => i + 1)}>
            Next category <IconGlyph name="ChevronRight" size={16} />
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={onGoToSummary}>
            Write my summary <IconGlyph name="ChevronRight" size={16} />
          </button>
        )}
      </div>
      <div className="spec-wizard-footer no-print">
        <button type="button" className="btn-text" onClick={onGoToReview}>Skip to review</button>
        <button type="button" className="btn-text" onClick={onBack}>Save and exit</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SPEC SUMMARY - editable written-prose draft, generated from points   */
/* ------------------------------------------------------------------ */

function SpecSummary({ project, points, onSaved, onContinue, onBack }) {
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
      const updated = await apiPut(`/api/specs/${project.id}/summary`, { summaryText: text });
      onSaved(updated);
      setSaved(true);
    } catch (e) { /* ignore */ }
    setSaving(false);
  }

  return (
    <div className="tab-content">
      <div className="panel-head">
        <div>
          <h2>Write your summary</h2>
          <p className="sub">
            This draft is put together automatically from the points you've written — it's a starting point, not a
            finished specification. Read it through and rewrite it in your own words before you're done.
          </p>
        </div>
        <button type="button" className="btn-secondary" onClick={handleRegenerate}><IconGlyph name="RotateCcw" size={15} /> Regenerate from my points</button>
      </div>

      <textarea
        className="spec-summary-textarea"
        rows={16}
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false); }}
        placeholder="Your written specification summary will appear here once you've added some points."
      />

      <div className="qb-save-row" style={{ marginTop: 14 }}>
        <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save summary"}</button>
        {saved && <span className="change-password-success">Saved ✓</span>}
        {onContinue && <button type="button" className="btn-secondary" onClick={onContinue}>Continue to review <IconGlyph name="ChevronRight" size={16} /></button>}
        <button type="button" className="btn-text" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SPEC POINT ROW (review screen) - edit / delete / move / recategorise */
/* ------------------------------------------------------------------ */

function SpecPointRow({ point, index, onUpdated, onDeleted, onMove }) {
  const [editing, setEditing] = useState(false);
  const [requirement, setRequirement] = useState(point.requirement);
  const [reason, setReason] = useState(point.reason);
  const [testingMethod, setTestingMethod] = useState(point.testingMethod);
  const [category, setCategory] = useState(point.category);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await apiPut(`/api/specs/${point.projectId}/points/${point.id}`, { requirement, reason, testingMethod, category });
      onUpdated(updated);
      setEditing(false);
    } catch (e) { /* ignore */ }
    setSaving(false);
  }

  async function handleDelete() {
    if (!window.confirm("Delete this specification point?")) return;
    try { await apiDelete(`/api/specs/${point.projectId}/points/${point.id}`); onDeleted(point.id); } catch (e) { /* ignore */ }
  }

  if (editing) {
    return (
      <div className="spec-point-card editing">
        <label>
          <span className="spec-field-label requirement">Requirement</span>
          <textarea rows={2} value={requirement} onChange={(e) => setRequirement(e.target.value)} />
        </label>
        <label>
          <span className="spec-field-label reason">Reason</span>
          <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <label>
          <span className="spec-field-label testing">Testing</span>
          <textarea rows={2} value={testingMethod} onChange={(e) => setTestingMethod(e.target.value)} />
        </label>
        <label>
          <span className="spec-field-label">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {SPEC_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </label>
        <div className="qb-save-row">
          <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button type="button" className="btn-text" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="spec-point-card">
      <div className="spec-point-number">{index + 1}</div>
      <div className="spec-point-body">
        <p className="spec-point-line"><span className="spec-field-label requirement">Requirement</span> {point.requirement}</p>
        {point.reason && <p className="spec-point-line"><span className="spec-field-label reason">Reason</span> {point.reason}</p>}
        {point.testingMethod && <p className="spec-point-line"><span className="spec-field-label testing">Testing</span> {point.testingMethod}</p>}
      </div>
      <div className="spec-point-actions no-print">
        <button type="button" className="icon-btn" title="Move up" onClick={() => onMove(point, "up")}><IconGlyph name="ChevronDown" size={14} style={{ transform: "rotate(180deg)" }} /></button>
        <button type="button" className="icon-btn" title="Move down" onClick={() => onMove(point, "down")}><IconGlyph name="ChevronDown" size={14} /></button>
        <button type="button" className="icon-btn" title="Edit" onClick={() => setEditing(true)}><IconGlyph name="PenLine" size={14} /></button>
        <button type="button" className="icon-btn danger" title="Delete" onClick={handleDelete}><IconGlyph name="Trash2" size={14} /></button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SPEC REVIEW                                                          */
/* ------------------------------------------------------------------ */

function SpecReview({ project, onProjectUpdated, onEditDetails, onAddMore, onGoToSummary, onBack, onExport }) {
  const [points, setPoints] = useState(project.points || []);
  const [saveState, setSaveState] = useState("idle");

  function reload() {
    apiGet(`/api/specs/${project.id}`).then((full) => { setPoints(full.points); onProjectUpdated(full); }).catch(() => {});
  }

  async function handleMove(point, direction) {
    try {
      await apiPost(`/api/specs/${project.id}/points/${point.id}/move`, { direction });
      reload();
    } catch (e) { /* ignore */ }
  }

  function handlePointUpdated(updated) {
    setPoints((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
  }
  function handlePointDeleted(id) {
    setPoints((ps) => ps.filter((p) => p.id !== id));
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
  const grouped = SPEC_CATEGORIES
    .map((c) => ({ category: c, items: points.filter((p) => p.category === c.key).sort((a, b) => a.order - b.order) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="tab-content">
      <div className="panel-head no-print">
        <div>
          <h2>Design Specification</h2>
          <p className="sub">Review, edit and organise your points before you hand it in.</p>
        </div>
        <button type="button" className="btn-text" onClick={onEditDetails}><IconGlyph name="PenLine" size={14} /> Edit project details</button>
      </div>

      <div className="spec-context-banner">
        <span className="spec-context-name">{project.projectName}</span>
        {project.designProblem && <p className="sub" style={{ margin: "4px 0 0 0" }}>{project.designProblem}</p>}
        {project.intendedUser && <p className="sub" style={{ margin: "2px 0 0 0" }}>For: {project.intendedUser}</p>}
        <span className={"status-pill" + (project.status === "submitted" ? " submitted" : " draft")} style={{ marginTop: 8 }}>
          {project.status === "submitted" ? "Handed in" : "Draft"}
        </span>
      </div>

      {project.feedback && (
        <div className="worksheet-feedback-callout no-print">
          <IconGlyph name="Lightbulb" size={16} style={{ color: "#B25E00" }} />
          <div>
            <span className="worksheet-feedback-label">Feedback from your teacher</span>
            <p>{project.feedback}</p>
          </div>
        </div>
      )}

      <div className="spec-strength no-print">
        <span className="help-label">Specification strength (guidance, not a checklist)</span>
        <div className="spec-strength-grid">
          {strength.map((s) => (
            <span key={s.key} className={"spec-strength-item " + s.status}>
              <IconGlyph name={s.status === "strong" ? "Check" : s.status === "partial" ? "Lightbulb" : "X"} size={12} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {grouped.length === 0 && <p className="sub">No specification points yet — add some from the wizard.</p>}

      {grouped.map((g) => (
        <div className="spec-review-group" key={g.category.key}>
          <h3 className="spec-review-group-title">{g.category.label}</h3>
          {g.items.map((p, i) => (
            <SpecPointRow key={p.id} point={p} index={i} onUpdated={handlePointUpdated} onDeleted={handlePointDeleted} onMove={handleMove} />
          ))}
        </div>
      ))}

      <div className="quiz-result-actions no-print" style={{ marginTop: 20 }}>
        <button type="button" className="btn-secondary" onClick={onAddMore}><IconGlyph name="PenLine" size={16} /> Add more points</button>
        <button type="button" className="btn-secondary" onClick={onGoToSummary}><IconGlyph name="ClipboardList" size={16} /> Write-up / summary</button>
        <button type="button" className="btn-primary" onClick={handleHandIn} disabled={saveState === "saving"}>
          <IconGlyph name="Check" size={16} /> {project.status === "submitted" ? "Update hand-in" : "Hand in"}
        </button>
        <button type="button" className="btn-secondary" onClick={onExport}><IconGlyph name="FileDown" size={16} /> View / print</button>
        <button type="button" className="btn-text" onClick={onBack}>Back to my specifications</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SPEC EXPORT / PRINT VIEW                                             */
/* ------------------------------------------------------------------ */

function SpecExportView({ project, points, onBack }) {
  const grouped = SPEC_CATEGORIES
    .map((c) => ({ category: c, items: points.filter((p) => p.category === c.key).sort((a, b) => a.order - b.order) }))
    .filter((g) => g.items.length > 0);
  let n = 0;

  return (
    <div className="tab-content spec-export">
      <div className="worksheet-actions no-print" style={{ padding: 0, marginBottom: 20 }}>
        <button type="button" className="btn-primary" onClick={() => window.print()}><IconGlyph name="Printer" size={16} /> Print / save as PDF</button>
        <button type="button" className="btn-text" onClick={onBack}>Back to review</button>
      </div>

      <h2 style={{ fontSize: 26 }}>Design Specification</h2>
      <p className="spec-export-meta"><strong>Project:</strong> {project.projectName}</p>
      {project.intendedUser && <p className="spec-export-meta"><strong>User:</strong> {project.intendedUser}</p>}
      {project.designProblem && <p className="spec-export-meta"><strong>Design problem:</strong> {project.designProblem}</p>}

      {project.summaryText && (
        <div className="spec-export-summary">
          <h3>Summary</h3>
          {project.summaryText.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
        </div>
      )}

      {grouped.map((g) => (
        <div key={g.category.key} className="spec-export-group">
          <h3>{g.category.label}</h3>
          {g.items.map((p) => {
            n++;
            return (
              <div key={p.id} className="spec-export-point">
                <p><strong>{n}. {p.requirement}</strong></p>
                {p.reason && <p className="spec-export-sub">Reason: {p.reason}</p>}
                {p.testingMethod && <p className="spec-export-sub">Test: {p.testingMethod}</p>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SPEC BUILDER TOOL - orchestrates the views above                    */
/* ------------------------------------------------------------------ */

function SpecBuilderTool({ user, onBack }) {
  const [view, setView] = useState("list"); // list | setup | wizard | summary | review | export
  const [project, setProject] = useState(null);

  async function openProject(id) {
    try {
      const full = await apiGet(`/api/specs/${id}`);
      setProject(full);
      setView("review");
    } catch (e) { /* ignore */ }
  }

  function handleCreated(newProject) {
    setProject({ ...newProject, points: [] });
    setView("wizard");
  }

  function handleSetupSaved(updated) {
    setProject((p) => (p ? { ...p, ...updated } : updated));
    setView(project && project.points ? "review" : "wizard");
  }

  return (
    <>
      <div className="tool-subheader no-print">
        <button type="button" className="btn-text back-btn" onClick={onBack}>
          <IconGlyph name="ChevronRight" size={15} style={{ transform: "rotate(180deg)" }} /> All tools
        </button>
      </div>

      {view === "list" && (
        <SpecList onOpen={openProject} onCreate={() => { setProject(null); setView("setup"); }} />
      )}

      {view === "setup" && (
        <SpecSetup
          existing={project}
          onSaved={project ? handleSetupSaved : handleCreated}
          onCancel={() => setView(project ? "review" : "list")}
        />
      )}

      {view === "wizard" && project && (
        <SpecWizard
          project={project}
          onPointsChanged={(points) => setProject((p) => ({ ...p, points }))}
          onGoToReview={() => setView("review")}
          onGoToSummary={() => setView("summary")}
          onBack={() => setView("list")}
        />
      )}

      {view === "summary" && project && (
        <SpecSummary
          project={project}
          points={project.points || []}
          onSaved={(updated) => setProject((p) => ({ ...p, ...updated }))}
          onContinue={() => setView("review")}
          onBack={() => setView("review")}
        />
      )}

      {view === "review" && project && (
        <SpecReview
          project={project}
          onProjectUpdated={(updated) => setProject((p) => ({ ...p, ...updated }))}
          onEditDetails={() => setView("setup")}
          onAddMore={() => setView("wizard")}
          onGoToSummary={() => setView("summary")}
          onBack={() => setView("list")}
          onExport={() => setView("export")}
        />
      )}

      {view === "export" && project && (
        <SpecExportView project={project} points={project.points || []} onBack={() => setView("review")} />
      )}
    </>
  );
}

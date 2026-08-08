/* ------------------------------------------------------------------ */
/* PDF EXPORT HELPERS (admin side)                                     */
/* ------------------------------------------------------------------ */

async function exportSubmissionPDF(student, sub) {
  if (!window.jspdf) {
    await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  }
  const { jsPDF } = window.jspdf;
  const fw = FRAMEWORKS[sub.framework];
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 50;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxWidth = pageW - marginX * 2;
  let y = 56;

  const heading = `${fw.label} ${sub.toolMode === "analyze" ? "Product Analysis" : "Design Worksheet"}`;
  doc.setFont("helvetica", "bold"); doc.setFontSize(19); doc.setTextColor(22, 50, 79);
  doc.text(heading, marginX, y); y += 26;

  doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); doc.setTextColor(90, 100, 110);
  doc.text(`Student: ${student.displayName} (@${student.username})`, marginX, y); y += 15;
  doc.text(`Product: ${sub.productName || "\u2014"}`, marginX, y); y += 15;
  if (sub.brand) { doc.text(`Made by: ${sub.brand}`, marginX, y); y += 15; }
  y += 8;
  doc.setDrawColor(216, 211, 196);
  doc.line(marginX, y, pageW - marginX, y);
  y += 22;

  fw.items.forEach((item) => {
    const q = sub.toolMode === "analyze" ? item.analyzePrompt : item.prompt;
    const a = sub.answers[item.id] || "(no answer)";
    const qLines = doc.splitTextToSize(q, maxWidth);
    const aLines = doc.splitTextToSize(a, maxWidth);
    const blockHeight = 20 + qLines.length * 13 + 6 + aLines.length * 14 + 16;
    if (y + blockHeight > pageH - 48) { doc.addPage(); y = 56; }

    doc.setFont("helvetica", "bold"); doc.setFontSize(12.5); doc.setTextColor(22, 50, 79);
    doc.text(`${item.letter} \u2014 ${item.word}`, marginX, y); y += 17;
    doc.setFont("helvetica", "italic"); doc.setFontSize(10); doc.setTextColor(90, 100, 110);
    doc.text(qLines, marginX, y); y += qLines.length * 13 + 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(30, 34, 38);
    doc.text(aLines, marginX, y); y += aLines.length * 14 + 20;
  });

  if (sub.feedback) {
    if (y + 60 > pageH - 48) { doc.addPage(); y = 56; }
    doc.setDrawColor(226, 96, 28);
    doc.line(marginX, y, pageW - marginX, y); y += 18;
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(226, 96, 28);
    doc.text("Teacher feedback", marginX, y); y += 16;
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(30, 34, 38);
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
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 50;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxWidth = pageW - marginX * 2;
  let y = 56;

  const setLabel = FRAMEWORKS[attempt.quizSet] ? FRAMEWORKS[attempt.quizSet].label : "Mixed";
  doc.setFont("helvetica", "bold"); doc.setFontSize(19); doc.setTextColor(22, 50, 79);
  doc.text(`${setLabel} Quiz \u2014 ${attempt.difficulty}`, marginX, y); y += 26;

  doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); doc.setTextColor(90, 100, 110);
  doc.text(`Student: ${student.displayName} (@${student.username})`, marginX, y); y += 15;
  doc.text(`Score: ${attempt.score} / ${attempt.total}  \u00b7  Time taken: ${formatDuration(attempt.durationSeconds)}  \u00b7  ${formatDate(attempt.takenAt)}`, marginX, y); y += 15;
  y += 8;
  doc.setDrawColor(216, 211, 196);
  doc.line(marginX, y, pageW - marginX, y);
  y += 22;

  (attempt.details || []).forEach((d, i) => {
    const qLines = doc.splitTextToSize(`${i + 1}. ${d.prompt}`, maxWidth);
    const ansLine = `Answer: ${d.studentAnswer}${d.correctAnswer ? `   (correct: ${d.correctAnswer})` : ""}`;
    const ansLines = doc.splitTextToSize(ansLine, maxWidth);
    const blockHeight = qLines.length * 13 + 6 + ansLines.length * 13 + 18;
    if (y + blockHeight > pageH - 48) { doc.addPage(); y = 56; }

    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(22, 50, 79);
    doc.text(qLines, marginX, y); y += qLines.length * 13 + 4;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10.5);
    doc.setTextColor(d.isCorrect ? 63 : 192, d.isCorrect ? 125 : 57, d.isCorrect ? 79 : 34);
    doc.text((d.isCorrect ? "\u2713 " : "\u2717 ") + ansLines[0], marginX, y);
    if (ansLines.length > 1) doc.text(ansLines.slice(1), marginX + 14, y + 13);
    y += ansLines.length * 13 + 14;
  });

  if (attempt.feedback) {
    if (y + 60 > pageH - 48) { doc.addPage(); y = 56; }
    doc.setDrawColor(226, 96, 28);
    doc.line(marginX, y, pageW - marginX, y); y += 18;
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(226, 96, 28);
    doc.text("Teacher feedback", marginX, y); y += 16;
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(30, 34, 38);
    const fbLines = doc.splitTextToSize(attempt.feedback, maxWidth);
    doc.text(fbLines, marginX, y);
  }

  doc.save(`${student.username}-quiz-${setLabel.toLowerCase()}-${attempt.id}.pdf`);
}

/* ------------------------------------------------------------------ */
/* QUIZ ATTEMPT REVIEW (expandable, with manual override)              */
/* ------------------------------------------------------------------ */

function QuizAttemptReview({ student, attemptSummary, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbackDraft, setFeedbackDraft] = useState(attemptSummary.feedback || "");
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  async function toggleOpen() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    if (!full) {
      setLoading(true);
      try {
        const data = await apiGet(`/api/admin/quiz-attempts/${attemptSummary.id}`);
        setFull(data);
        setFeedbackDraft(data.feedback || "");
      } catch (e) { /* ignore */ }
      setLoading(false);
    }
  }

  async function handleOverride(qid, isCorrect) {
    try {
      const res = await apiPatch(`/api/admin/quiz-attempts/${attemptSummary.id}/override`, { qid, isCorrect });
      setFull((f) => ({ ...f, score: res.score, details: res.details }));
      onUpdated({ ...attemptSummary, score: res.score });
    } catch (e) { /* ignore */ }
  }

  async function saveFeedback() {
    setFeedbackSaving(true);
    setFeedbackSaved(false);
    try {
      await apiPut(`/api/admin/quiz-attempts/${attemptSummary.id}/feedback`, { feedback: feedbackDraft });
      setFeedbackSaved(true);
      onUpdated({ ...attemptSummary, feedback: feedbackDraft });
    } catch (e) { /* ignore */ }
    setFeedbackSaving(false);
  }

  async function toggleMarkComplete() {
    const next = !attemptSummary.markedComplete;
    try {
      await apiPatch(`/api/admin/quiz-attempts/${attemptSummary.id}/mark-complete`, { complete: next });
      onUpdated({ ...attemptSummary, markedComplete: next });
    } catch (e) { /* ignore */ }
  }

  return (
    <div className="quiz-review">
      <div className="quiz-history-row" onClick={toggleOpen}>
        <span className="quiz-history-pct">{Math.round((attemptSummary.score / attemptSummary.total) * 100)}%</span>
        <span>{FRAMEWORKS[attemptSummary.quizSet] ? FRAMEWORKS[attemptSummary.quizSet].label : "Mixed"}</span>
        <span className="quiz-history-diff">{attemptSummary.difficulty}</span>
        <span className="mono">{attemptSummary.score}/{attemptSummary.total}</span>
        <span className="mono">{formatDuration(attemptSummary.durationSeconds)}</span>
        {!attemptSummary.markedComplete && <span className="needs-marking-badge">unmarked</span>}
        <IconGlyph name="ChevronDown" size={14} className={"chevron" + (open ? " up" : "")} />
      </div>

      {open && (
        <div className="quiz-review-panel">
          {loading && <p className="sub">Loading...</p>}
          {full && !loading && (
            <>
              <div className="quiz-review-questions">
                {(full.details || []).length === 0 && <p className="sub">No question-by-question detail was saved for this attempt.</p>}
                {(full.details || []).map((d) => (
                  <div key={d.qid} className={"quiz-review-q" + (d.isCorrect ? " correct" : " wrong")}>
                    <p className="quiz-review-prompt" style={{ whiteSpace: "pre-line" }}>{d.prompt}</p>
                    <p className="quiz-review-answer">
                      <strong>Answer:</strong> {d.studentAnswer}
                      {d.correctAnswer ? <span className="mono"> (correct: {d.correctAnswer})</span> : null}
                      {d.overridden && <span className="quiz-review-overridden">manually marked</span>}
                    </p>
                    <div className="quiz-review-toggle">
                      <button type="button" className={"chip" + (d.isCorrect ? " active-correct" : "")} onClick={() => handleOverride(d.qid, true)}>
                        <IconGlyph name="Check" size={13} /> Correct
                      </button>
                      <button type="button" className={"chip" + (!d.isCorrect ? " active-wrong" : "")} onClick={() => handleOverride(d.qid, false)}>
                        <IconGlyph name="X" size={13} /> Incorrect
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="feedback-editor">
                <span className="help-label">Feedback for this quiz</span>
                <textarea rows={2} value={feedbackDraft} onChange={(e) => { setFeedbackDraft(e.target.value); setFeedbackSaved(false); }} placeholder="Write feedback the student will see..." />
                <div className="feedback-editor-actions">
                  <button type="button" className="btn-secondary" onClick={saveFeedback} disabled={feedbackSaving}>{feedbackSaving ? "Saving..." : "Save feedback"}</button>
                  {feedbackSaved && <span className="change-password-success">Saved ✓</span>}
                  <button type="button" className={"btn-text mark-complete-btn" + (attemptSummary.markedComplete ? " is-complete" : "")} onClick={toggleMarkComplete}>
                    <IconGlyph name={attemptSummary.markedComplete ? "Check" : "ClipboardList"} size={14} /> {attemptSummary.markedComplete ? "Marked complete" : "Mark as complete"}
                  </button>
                  <button type="button" className="btn-text" onClick={() => exportQuizAttemptPDF(student, { ...full, feedback: feedbackDraft })}>
                    <IconGlyph name="FileDown" size={14} /> Export PDF
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ADMIN CONSOLE SHELL (header + sub-tab navigation)                   */
/* ------------------------------------------------------------------ */

function AdminConsole({ user, onLogout }) {
  const [subTab, setSubTab] = useState("students");

  const subTabs = [
    { key: "students", label: "Students" },
    { key: "quizzes", label: "Quizzes" },
    { key: "tasks", label: "Tasks" },
    { key: "gradebook", label: "Gradebook" },
  ];

  return (
    <div className="app-root admin-root">
      <div className="app-header no-print">
        <div>
          <h1 className="app-title"><IconGlyph name="Shield" size={26} style={{ marginRight: 8, verticalAlign: "-4px" }} />Admin <span>Console</span></h1>
          <p className="app-sub">Signed in as {user.displayName}</p>
        </div>
        <div className="header-controls">
          <a className="btn-secondary" href="/api/admin/export.csv"><IconGlyph name="FileDown" size={16} /> Export class CSV</a>
          <ChangePasswordForm />
          <button type="button" className="btn-text logout-btn" onClick={onLogout}><IconGlyph name="LogOut" size={15} /> Log out</button>
        </div>
      </div>

      <div className="tabs no-print">
        {subTabs.map((t) => (
          <button key={t.key} className={"tab-btn" + (subTab === t.key ? " active" : "")} onClick={() => setSubTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {subTab === "students" && <StudentsPanel user={user} />}
      {subTab === "quizzes" && <QuizManagerPanel />}
      {subTab === "tasks" && <TaskManagerPanel />}
      {subTab === "gradebook" && <GradebookPanel />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SUBMISSION REVIEW (worksheet, with feedback)                        */
/* ------------------------------------------------------------------ */

function SubmissionReview({ student, sub, onUpdated }) {
  const [feedbackDraft, setFeedbackDraft] = useState(sub.feedback || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function saveFeedback() {
    setSaving(true);
    setSaved(false);
    try {
      await apiPut(`/api/admin/submissions/${sub.id}/feedback`, { feedback: feedbackDraft });
      setSaved(true);
      onUpdated({ ...sub, feedback: feedbackDraft });
    } catch (e) { /* ignore */ }
    setSaving(false);
  }

  async function toggleMarkComplete() {
    const next = !sub.markedComplete;
    try {
      await apiPatch(`/api/admin/submissions/${sub.id}/mark-complete`, { complete: next });
      onUpdated({ ...sub, markedComplete: next });
    } catch (e) { /* ignore */ }
  }

  return (
    <details className="submission-detail">
      <summary>
        <span style={{ color: FRAMEWORKS[sub.framework].tint }}>{FRAMEWORKS[sub.framework].label}</span>
        {" \u00b7 "}{sub.toolMode === "analyze" ? "Analysis" : "Design"}
        {" \u00b7 "}{sub.productName || "Untitled"}
        {" \u00b7 "}<span className="mono">{formatDate(sub.updatedAt)}</span>
        {sub.feedback && <IconGlyph name="Lightbulb" size={13} style={{ color: "#8A6A1E", marginLeft: 6 }} />}
        {!sub.markedComplete && <span className="needs-marking-badge">unmarked</span>}
      </summary>
      <div className="submission-answers">
        {FRAMEWORKS[sub.framework].items.map((item) => (
          sub.answers[item.id] ? (
            <p key={item.id}><strong>{item.letter} \u2014 {item.word}:</strong> {sub.answers[item.id]}</p>
          ) : null
        ))}
      </div>
      <div className="feedback-editor">
        <span className="help-label">Feedback for this worksheet</span>
        <textarea rows={2} value={feedbackDraft} onChange={(e) => { setFeedbackDraft(e.target.value); setSaved(false); }} placeholder="Write feedback the student will see..." />
        <div className="feedback-editor-actions">
          <button type="button" className="btn-secondary" onClick={saveFeedback} disabled={saving}>{saving ? "Saving..." : "Save feedback"}</button>
          {saved && <span className="change-password-success">Saved ✓</span>}
          <button type="button" className={"btn-text mark-complete-btn" + (sub.markedComplete ? " is-complete" : "")} onClick={toggleMarkComplete}>
            <IconGlyph name={sub.markedComplete ? "Check" : "ClipboardList"} size={14} /> {sub.markedComplete ? "Marked complete" : "Mark as complete"}
          </button>
          <button type="button" className="btn-text" onClick={() => exportSubmissionPDF(student, { ...sub, feedback: feedbackDraft })}>
            <IconGlyph name="FileDown" size={14} /> Export PDF
          </button>
        </div>
      </div>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* ADMIN CONSOLE                                                        */
/* ------------------------------------------------------------------ */

function StudentsPanel({ user }) {
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
  const [editDraft, setEditDraft] = useState({ displayName: "", classGroup: "", yearGroup: "" });
  const [filterYear, setFilterYear] = useState("");
  const [filterClass, setFilterClass] = useState("");

  function loadStudents() {
    setLoading(true);
    apiGet("/api/admin/users")
      .then((rows) => { setStudents(rows); setError(""); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  useEffect(loadStudents, []);

  async function handleAddStudent(e) {
    e.preventDefault();
    if (!newUsername.trim() || !newDisplayName.trim()) return;
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
        password: newPassword.trim() || undefined,
      });
      setBanner({ text: `Created "${created.username}" \u2014 password: ${created.temporaryPassword}` });
      setNewUsername(""); setNewDisplayName(""); setNewClassGroup(""); setNewYearGroup(""); setNewPassword(""); setShowAddForm(false);
      loadStudents();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddBusy(false);
    }
  }

  async function handleResetPassword(student) {
    const chosen = window.prompt(
      `Set a new password for ${student.displayName} (${student.username}).\n\nType a specific password (at least 6 characters), or leave this blank to auto-generate a random one.`,
      ""
    );
    if (chosen === null) return;
    const trimmed = chosen.trim();
    if (trimmed && trimmed.length < 6) {
      setBanner({ text: "Password must be at least 6 characters (or leave it blank to auto-generate one).", isError: true });
      return;
    }
    try {
      const res = await apiPost(`/api/admin/users/${student.id}/reset-password`, trimmed ? { password: trimmed } : {});
      setBanner({ text: `New password for ${student.username}: ${res.temporaryPassword}` });
    } catch (err) {
      setBanner({ text: `Couldn't reset password: ${err.message}`, isError: true });
    }
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete ${student.displayName} (${student.username})? This removes their account and all saved work permanently.`)) return;
    try {
      await apiDelete(`/api/admin/users/${student.id}`);
      loadStudents();
    } catch (err) {
      setBanner({ text: `Couldn't delete: ${err.message}`, isError: true });
    }
  }

  function startEdit(student, ev) {
    ev.stopPropagation();
    setEditingId(student.id);
    setEditDraft({ displayName: student.displayName, classGroup: student.classGroup || "", yearGroup: student.yearGroup || "" });
  }

  async function saveEdit(student, ev) {
    ev.stopPropagation();
    try {
      await apiPatch(`/api/admin/users/${student.id}`, editDraft);
      setEditingId(null);
      loadStudents();
    } catch (err) {
      setBanner({ text: `Couldn't update: ${err.message}`, isError: true });
    }
  }

  async function toggleExpand(student) {
    if (expandedId === student.id) { setExpandedId(null); return; }
    setExpandedId(student.id);
    if (!detail[student.id]) {
      setDetail((d) => ({ ...d, [student.id]: { loading: true } }));
      try {
        const [submissions, quizAttempts] = await Promise.all([
          apiGet(`/api/admin/users/${student.id}/submissions`),
          apiGet(`/api/admin/users/${student.id}/quiz-attempts`),
        ]);
        setDetail((d) => ({ ...d, [student.id]: { submissions, quizAttempts, loading: false } }));
      } catch (err) {
        setDetail((d) => ({ ...d, [student.id]: { error: err.message, loading: false } }));
      }
    }
  }

  function updateDetailSubmission(studentId, updatedSub) {
    setDetail((d) => {
      const entry = d[studentId];
      if (!entry) return d;
      return { ...d, [studentId]: { ...entry, submissions: entry.submissions.map((s) => (s.id === updatedSub.id ? updatedSub : s)) } };
    });
  }

  function updateDetailQuizAttempt(studentId, updatedAttempt) {
    setDetail((d) => {
      const entry = d[studentId];
      if (!entry) return d;
      return { ...d, [studentId]: { ...entry, quizAttempts: entry.quizAttempts.map((q) => (q.id === updatedAttempt.id ? { ...q, ...updatedAttempt } : q)) } };
    });
  }

  const yearOptions = [...new Set(students.map((s) => s.yearGroup).filter(Boolean))].sort();
  const classOptions = [...new Set(students.map((s) => s.classGroup).filter(Boolean))].sort();
  const visibleStudents = students.filter((s) =>
    (!filterYear || s.yearGroup === filterYear) && (!filterClass || s.classGroup === filterClass)
  );

  const classBlocks = (() => {
    const map = new Map();
    students.forEach((s) => {
      const key = `${s.yearGroup || "\u2014"}|${s.classGroup || "\u2014"}`;
      if (!map.has(key)) map.set(key, { yearGroup: s.yearGroup, classGroup: s.classGroup, count: 0, needsMarking: 0 });
      const entry = map.get(key);
      entry.count++;
      entry.needsMarking += s.needsMarkingCount || 0;
    });
    return [...map.values()].sort((a, b) => (a.yearGroup || "").localeCompare(b.yearGroup || "") || (a.classGroup || "").localeCompare(b.classGroup || ""));
  })();

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
            <h2>Students</h2>
            <p className="sub">{students.length} account{students.length === 1 ? "" : "s"}. Click a row to see their saved work and quiz scores.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-secondary" onClick={() => setShowCsvImport((s) => !s)}>
              <IconGlyph name="FileDown" size={16} /> {showCsvImport ? "Cancel" : "Import CSV"}
            </button>
            <button className="btn-primary" onClick={() => setShowAddForm((s) => !s)}>
              <IconGlyph name="UserPlus" size={18} /> {showAddForm ? "Cancel" : "Add student"}
            </button>
          </div>
        </div>

        {showCsvImport && <CsvImportPanel onImported={() => { loadStudents(); }} onBanner={setBanner} />}

        {showAddForm && (
          <form className="add-student-form" onSubmit={handleAddStudent}>
            <label>
              <span>Username</span>
              <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="e.g. jsmith" autoFocus />
            </label>
            <label>
              <span>Display name</span>
              <input value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} placeholder="e.g. Jamie Smith" />
            </label>
            <label>
              <span>Year group (optional)</span>
              <input value={newYearGroup} onChange={(e) => setNewYearGroup(e.target.value)} placeholder="e.g. Year 9" />
            </label>
            <label>
              <span>Class / group (optional)</span>
              <input value={newClassGroup} onChange={(e) => setNewClassGroup(e.target.value)} placeholder="e.g. 9A" />
            </label>
            <label>
              <span>Password (optional)</span>
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to auto-generate" />
            </label>
            {addError && <p className="login-error" style={{ gridColumn: "1 / -1" }}>{addError}</p>}
            <button className="btn-primary" type="submit" disabled={addBusy} style={{ justifyContent: "center" }}>
              <IconGlyph name="Key" size={16} /> {addBusy ? "Creating..." : "Create account"}
            </button>
          </form>
        )}

        {classBlocks.length > 1 && (
          <div className="class-blocks no-print">
            <button
              type="button"
              className={"class-block" + (!filterYear && !filterClass ? " active" : "")}
              onClick={() => { setFilterYear(""); setFilterClass(""); }}
            >
              <span className="class-block-name">All students</span>
              <span className="class-block-count">{students.length}</span>
            </button>
            {classBlocks.map((b) => (
              <button
                key={`${b.yearGroup}|${b.classGroup}`}
                type="button"
                className={"class-block" + (filterYear === (b.yearGroup || "") && filterClass === (b.classGroup || "") ? " active" : "")}
                onClick={() => { setFilterYear(b.yearGroup || ""); setFilterClass(b.classGroup || ""); }}
              >
                <span className="class-block-name">{b.yearGroup || "No year"} {b.classGroup ? `\u00b7 ${b.classGroup}` : ""}</span>
                <span className="class-block-count">{b.count}</span>
                {b.needsMarking > 0 && <span className="class-block-badge">{b.needsMarking} to mark</span>}
              </button>
            ))}
          </div>
        )}

        {students.length > 0 && (
          <div className="student-filters no-print">
            <label>
              <span>Year</span>
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                <option value="">All years</option>
                {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <label>
              <span>Class</span>
              <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                <option value="">All classes</option>
                {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            {(filterYear || filterClass) && (
              <button type="button" className="btn-text" onClick={() => { setFilterYear(""); setFilterClass(""); }}>Clear filters</button>
            )}
          </div>
        )}

        {loading && <p className="sub">Loading students...</p>}
        {error && <p className="export-error">{error}</p>}

        {!loading && students.length === 0 && (
          <p className="sub">No students yet — add your first account above.</p>
        )}

        {!loading && students.length > 0 && visibleStudents.length === 0 && (
          <p className="sub">No students match this filter.</p>
        )}

        {!loading && visibleStudents.length > 0 && (
          <div className="student-table">
            <div className="student-table-head">
              <span>Student</span><span>Year</span><span>Class</span><span>Saved work</span><span>Quizzes</span><span>Last active</span><span></span>
            </div>
            {visibleStudents.map((s) => {
              const isOpen = expandedId === s.id;
              const isEditing = editingId === s.id;
              const d = detail[s.id];
              const lastActive = [s.lastWorkAt, s.lastQuizAt].filter(Boolean).sort().pop();
              return (
                <React.Fragment key={s.id}>
                  <div className="student-row" onClick={() => !isEditing && toggleExpand(s)}>
                    <span className="student-row-name">
                      <IconGlyph name="ChevronDown" size={14} className={"chevron" + (isOpen ? " up" : "")} />
                      {s.displayName} <span className="mono student-username">@{s.username}</span>
                      {s.needsMarkingCount > 0 && <span className="needs-marking-badge">{s.needsMarkingCount} to mark</span>}
                    </span>
                    <span>{s.yearGroup || "\u2014"}</span>
                    <span>{s.classGroup || "\u2014"}</span>
                    <span className="mono">{s.submissionCount}</span>
                    <span className="mono">{s.quizCount}</span>
                    <span className="mono">{lastActive ? formatDate(lastActive) : "Never"}</span>
                    <span className="student-row-actions" onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="icon-btn" title="Edit class/year" onClick={(e) => (isEditing ? setEditingId(null) : startEdit(s, e))}><IconGlyph name="PenLine" size={15} /></button>
                      <button type="button" className="icon-btn" title="Reset password" onClick={() => handleResetPassword(s)}><IconGlyph name="Key" size={15} /></button>
                      <button type="button" className="icon-btn danger" title="Delete student" onClick={() => handleDelete(s)}><IconGlyph name="Trash2" size={15} /></button>
                    </span>
                  </div>

                  {isEditing && (
                    <div className="student-edit-row" onClick={(e) => e.stopPropagation()}>
                      <label>
                        <span>Display name</span>
                        <input value={editDraft.displayName} onChange={(e) => setEditDraft((d) => ({ ...d, displayName: e.target.value }))} />
                      </label>
                      <label>
                        <span>Year group</span>
                        <input value={editDraft.yearGroup} onChange={(e) => setEditDraft((d) => ({ ...d, yearGroup: e.target.value }))} placeholder="e.g. Year 10" />
                      </label>
                      <label>
                        <span>Class group</span>
                        <input value={editDraft.classGroup} onChange={(e) => setEditDraft((d) => ({ ...d, classGroup: e.target.value }))} placeholder="e.g. 10B" />
                      </label>
                      <div className="student-edit-actions">
                        <button type="button" className="btn-primary" onClick={(e) => saveEdit(s, e)}>Save</button>
                        <button type="button" className="btn-text" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {isOpen && (
                    <div className="student-detail">
                      {(!d || d.loading) && <p className="sub">Loading...</p>}
                      {d && d.error && <p className="export-error">{d.error}</p>}
                      {d && !d.loading && !d.error && (
                        <>
                          <div className="student-detail-col">
                            <span className="help-label">Saved worksheets</span>
                            {d.submissions.length === 0 && <p className="sub">None saved yet.</p>}
                            {d.submissions.map((sub) => (
                              <SubmissionReview key={sub.id} student={s} sub={sub} onUpdated={(u) => updateDetailSubmission(s.id, u)} />
                            ))}
                          </div>
                          <div className="student-detail-col">
                            <span className="help-label">Quiz history</span>
                            {d.quizAttempts.length === 0 && <p className="sub">No attempts yet.</p>}
                            {d.quizAttempts.map((q) => (
                              <QuizAttemptReview key={q.id} student={s} attemptSummary={q} onUpdated={(u) => updateDetailQuizAttempt(s.id, u)} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
  );
}

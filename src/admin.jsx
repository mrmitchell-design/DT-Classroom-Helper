function AdminConsole({ user, onLogout }) {
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
  const [newPassword, setNewPassword] = useState("");
  const [addBusy, setAddBusy] = useState(false);
  const [addError, setAddError] = useState("");

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
        password: newPassword.trim() || undefined,
      });
      setBanner({ text: `Created "${created.username}" \u2014 password: ${created.temporaryPassword}` });
      setNewUsername(""); setNewDisplayName(""); setNewClassGroup(""); setNewPassword(""); setShowAddForm(false);
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
    if (chosen === null) return; // cancelled
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
          <button className="btn-primary" onClick={() => setShowAddForm((s) => !s)}>
            <IconGlyph name="UserPlus" size={18} /> {showAddForm ? "Cancel" : "Add student"}
          </button>
        </div>

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

        {loading && <p className="sub">Loading students...</p>}
        {error && <p className="export-error">{error}</p>}

        {!loading && students.length === 0 && (
          <p className="sub">No students yet — add your first account above.</p>
        )}

        {!loading && students.length > 0 && (
          <div className="student-table">
            <div className="student-table-head">
              <span>Student</span><span>Class</span><span>Saved work</span><span>Quizzes</span><span>Last active</span><span></span>
            </div>
            {students.map((s) => {
              const isOpen = expandedId === s.id;
              const d = detail[s.id];
              const lastActive = [s.lastWorkAt, s.lastQuizAt].filter(Boolean).sort().pop();
              return (
                <React.Fragment key={s.id}>
                  <div className="student-row" onClick={() => toggleExpand(s)}>
                    <span className="student-row-name">
                      <IconGlyph name="ChevronDown" size={14} className={"chevron" + (isOpen ? " up" : "")} />
                      {s.displayName} <span className="mono student-username">@{s.username}</span>
                    </span>
                    <span>{s.classGroup || "\u2014"}</span>
                    <span className="mono">{s.submissionCount}</span>
                    <span className="mono">{s.quizCount}</span>
                    <span className="mono">{lastActive ? formatDate(lastActive) : "Never"}</span>
                    <span className="student-row-actions" onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="icon-btn" title="Reset password" onClick={() => handleResetPassword(s)}><IconGlyph name="Key" size={15} /></button>
                      <button type="button" className="icon-btn danger" title="Delete student" onClick={() => handleDelete(s)}><IconGlyph name="Trash2" size={15} /></button>
                    </span>
                  </div>

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
                              <details key={sub.id} className="submission-detail">
                                <summary>
                                  <span style={{ color: FRAMEWORKS[sub.framework].tint }}>{FRAMEWORKS[sub.framework].label}</span>
                                  {" \u00b7 "}{sub.toolMode === "analyze" ? "Analysis" : "Design"}
                                  {" \u00b7 "}{sub.productName || "Untitled"}
                                  {" \u00b7 "}<span className="mono">{formatDate(sub.updatedAt)}</span>
                                </summary>
                                <div className="submission-answers">
                                  {FRAMEWORKS[sub.framework].items.map((item) => (
                                    sub.answers[item.id] ? (
                                      <p key={item.id}><strong>{item.letter} — {item.word}:</strong> {sub.answers[item.id]}</p>
                                    ) : null
                                  ))}
                                </div>
                              </details>
                            ))}
                          </div>
                          <div className="student-detail-col">
                            <span className="help-label">Quiz history</span>
                            {d.quizAttempts.length === 0 && <p className="sub">No attempts yet.</p>}
                            {d.quizAttempts.length > 0 && (
                              <div className="quiz-history-list">
                                {d.quizAttempts.map((q) => (
                                  <div className="quiz-history-row" key={q.id}>
                                    <span className="quiz-history-pct">{Math.round((q.score / q.total) * 100)}%</span>
                                    <span>{FRAMEWORKS[q.quizSet] ? FRAMEWORKS[q.quizSet].label : "Mixed"}</span>
                                    <span className="quiz-history-diff">{q.difficulty}</span>
                                    <span className="mono">{q.score}/{q.total}</span>
                                    <span className="mono">{formatDate(q.takenAt)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
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
    </div>
  );
}

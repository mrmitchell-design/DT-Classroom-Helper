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

  const yearOptions = [...new Set(students.map((s) => s.yearGroup).filter(Boolean))].sort();
  const classOptions = [...new Set(students.map((s) => s.classGroup).filter(Boolean))].sort();

  function loadGradebook() {
    if (!yearGroup && !classGroup) { setError("Pick a year and/or class first."); return; }
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ yearGroup, classGroup }).toString();
    apiGet(`/api/admin/gradebook?${params}`)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="tab-content admin-content">
      <div className="panel-head">
        <div>
          <h2>Gradebook</h2>
          <p className="sub">Pick a year and/or class to see everyone's scores on assigned quizzes and tasks, side by side.</p>
        </div>
      </div>

      <div className="student-filters no-print">
        <label>
          <span>Year</span>
          <select value={yearGroup} onChange={(e) => setYearGroup(e.target.value)}>
            <option value="">Any year</option>
            {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <label>
          <span>Class</span>
          <select value={classGroup} onChange={(e) => setClassGroup(e.target.value)}>
            <option value="">Any class</option>
            {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <button type="button" className="btn-primary" onClick={loadGradebook} disabled={loading}>{loading ? "Loading..." : "Show gradebook"}</button>
      </div>

      {error && <p className="export-error">{error}</p>}

      {data && (
        <>
          {data.students.length === 0 && <p className="sub">No students match that year/class.</p>}
          {data.quizItems.length === 0 && data.taskItems.length === 0 && data.students.length > 0 && (
            <p className="sub">No quizzes or tasks have been assigned to this class yet — assign some from the Quizzes or Tasks tab.</p>
          )}
          {data.students.length > 0 && (data.quizItems.length > 0 || data.taskItems.length > 0) && (
            <div className="gradebook-scroll">
              <table className="gradebook-table">
                <thead>
                  <tr>
                    <th className="gradebook-student-col">Student</th>
                    {data.quizItems.map((qi) => <th key={"q" + qi.assignmentId}><IconGlyph name="Wrench" size={13} /> {qi.name}</th>)}
                    {data.taskItems.map((ti) => <th key={"t" + ti.assignmentId}><IconGlyph name="PenLine" size={13} /> {ti.title}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.students.map((s) => (
                    <tr key={s.id}>
                      <td className="gradebook-student-col">{s.displayName}</td>
                      {data.quizItems.map((qi) => {
                        const cell = data.quizCells[s.id] && data.quizCells[s.id][qi.quizSetId];
                        if (!cell) return <td key={"q" + qi.assignmentId} className="gradebook-cell empty">—</td>;
                        const pct = cell.total > 0 ? Math.round((cell.score / cell.total) * 100) : 0;
                        return (
                          <td key={"q" + qi.assignmentId} className={"gradebook-cell" + (cell.markedComplete ? " marked" : " unmarked")}>
                            {pct}% <span className="mono">({cell.score}/{cell.total})</span>
                            {!cell.markedComplete && <IconGlyph name="Lightbulb" size={11} style={{ color: "#8A6A1E", marginLeft: 4 }} />}
                          </td>
                        );
                      })}
                      {data.taskItems.map((ti) => {
                        const cell = data.taskCells[s.id] && data.taskCells[s.id][ti.taskId];
                        if (!cell) return <td key={"t" + ti.assignmentId} className="gradebook-cell empty">Not started</td>;
                        const label = cell.markedComplete ? "Marked" : cell.status === "submitted" ? "Submitted" : "Draft only";
                        const cellClass = cell.markedComplete ? "marked" : cell.status === "submitted" ? "unmarked" : "empty";
                        return (
                          <td key={"t" + ti.assignmentId} className={"gradebook-cell " + cellClass}>
                            {label}
                            {!cell.markedComplete && cell.status === "submitted" && <IconGlyph name="Lightbulb" size={11} style={{ color: "#8A6A1E", marginLeft: 4 }} />}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="gradebook-student-col"><strong>Class average</strong></td>
                    {data.quizItems.map((qi) => (
                      <td key={"q" + qi.assignmentId} className="gradebook-cell average">
                        {data.quizAverages[qi.quizSetId] !== null && data.quizAverages[qi.quizSetId] !== undefined ? `${data.quizAverages[qi.quizSetId]}%` : "\u2014"}
                      </td>
                    ))}
                    {data.taskItems.map((ti) => <td key={"t" + ti.assignmentId} className="gradebook-cell average">—</td>)}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ClassesPanel() {
  const [classGroups, setClassGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedKey, setExpandedKey] = useState(null);

  function load() {
    setLoading(true);
    apiGet("/api/admin/classes")
      .then(setClassGroups)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  const byYear = {};
  classGroups.forEach((c) => {
    const y = c.yearGroup || "No year set";
    byYear[y] = byYear[y] || [];
    byYear[y].push(c);
  });
  const years = Object.keys(byYear).sort();

  return (
    <div className="tab-content admin-content">
      <div className="panel-head">
        <div>
          <h2>Classes</h2>
          <p className="sub">Every year group and class currently in use, with a quick look at who's in each one.</p>
        </div>
      </div>

      {loading && <p className="sub">Loading...</p>}
      {error && <p className="export-error">{error}</p>}
      {!loading && classGroups.length === 0 && <p className="sub">No classes yet — add students with a year and class from the Students tab.</p>}

      {years.map((year) => (
        <div className="year-section" key={year}>
          <h3 className="year-section-title">{year}</h3>
          <div className="class-card-grid">
            {byYear[year].map((c) => {
              const key = `${c.yearGroup}|${c.classGroup}`;
              const isOpen = expandedKey === key;
              return (
                <div className="class-card" key={key}>
                  <button type="button" className="class-card-head" onClick={() => setExpandedKey(isOpen ? null : key)}>
                    <span className="class-card-name">{c.classGroup || "No class set"}</span>
                    <span className="mono">{c.students.length} student{c.students.length === 1 ? "" : "s"}</span>
                    <IconGlyph name="ChevronDown" size={14} className={"chevron" + (isOpen ? " up" : "")} />
                  </button>
                  {isOpen && (
                    <div className="class-card-roster">
                      {c.students.map((s) => (
                        <div className="class-card-student" key={s.id}>
                          <span>{s.displayName}</span>
                          <span className="mono student-username">@{s.username}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

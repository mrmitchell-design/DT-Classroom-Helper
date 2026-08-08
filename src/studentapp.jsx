function StudentApp({ user, onLogout }) {
  const [tab, setTab] = useState("learn");
  const [simpleMode, setSimpleMode] = useState(false);

  const tabs = useMemo(() => ([
    { key: "learn", label: "Learn" },
    { key: "quiz", label: "Quiz" },
    { key: "worksheet", label: "Worksheet" },
  ]), []);

  return (
    <div className="app-root">
      <div className="app-header no-print">
        <div>
          <h1 className="app-title">The Design <span>Bench</span></h1>
          <p className="app-sub">Signed in as {user.displayName}{user.classGroup ? ` \u00b7 ${user.classGroup}` : ""}</p>
        </div>
        <div className="header-controls">
          <button type="button" className="simple-toggle" onClick={() => setSimpleMode((s) => !s)} aria-pressed={simpleMode}>
            <span>Simple English</span>
            <span className={"switch" + (simpleMode ? " on" : "")}><span className="switch-knob" /></span>
          </button>
          <button type="button" className="btn-text logout-btn" onClick={onLogout}><IconGlyph name="LogOut" size={15} /> Log out</button>
        </div>
      </div>

      <div className="tabs no-print">
        {tabs.map((t) => (
          <button key={t.key} className={"tab-btn" + (tab === t.key ? " active" : "")} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      <div className="tab-content">
        {tab === "learn" && <LearnTab simpleMode={simpleMode} />}
        {tab === "quiz" && <QuizTab currentUser={user} />}
        {tab === "worksheet" && <WorksheetTab simpleMode={simpleMode} currentUser={user} />}
      </div>
    </div>
  );
}

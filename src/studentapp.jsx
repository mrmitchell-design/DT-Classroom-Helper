function AccessfmScamperTool({ user, tab, setTab, onBack }) {
  const [simpleMode, setSimpleMode] = useState(false);

  const tabs = useMemo(() => ([
    { key: "learn", label: "Learn" },
    { key: "quiz", label: "Quiz" },
    { key: "worksheet", label: "Worksheet" },
  ]), []);

  return (
    <>
      <div className="tool-subheader no-print">
        <button type="button" className="btn-text back-btn" onClick={onBack}>
          <IconGlyph name="ChevronRight" size={15} style={{ transform: "rotate(180deg)" }} /> All tools
        </button>
        <button type="button" className="simple-toggle" onClick={() => setSimpleMode((s) => !s)} aria-pressed={simpleMode}>
          <span>Simple English</span>
          <span className={"switch" + (simpleMode ? " on" : "")}><span className="switch-knob" /></span>
        </button>
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
    </>
  );
}

function ToolPicker({ onSelect }) {
  const tools = [
    {
      key: "accessfm-scamper", title: "ACCESSFM & SCAMPER", icon: "Wrench",
      description: "Learn, quiz yourself, and apply these two design tools to your own ideas or an existing product.",
    },
    {
      key: "spec-builder", title: "Specification Builder", icon: "ClipboardList",
      description: "Turn your research into a clear, measurable design specification \u2014 step by step, not a blank text box.",
    },
  ];
  return (
    <div className="tab-content tool-picker no-print">
      <div className="panel-head">
        <div>
          <h2>Design Tools</h2>
          <p className="sub">Pick what you want to work on.</p>
        </div>
      </div>
      <div className="tool-picker-grid">
        {tools.map((t) => (
          <button type="button" key={t.key} className="tool-picker-card" onClick={() => onSelect(t.key)}>
            <span className="tool-picker-icon"><IconGlyph name={t.icon} size={26} /></span>
            <span className="tool-picker-title">{t.title}</span>
            <span className="tool-picker-desc">{t.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StudentApp({ user, onLogout }) {
  const [activeTool, setActiveTool] = useState(null); // null | "accessfm-scamper" | "spec-builder"
  const [accessfmTab, setAccessfmTab] = useState("learn");

  function handleNotificationNavigate(tabKey) {
    setActiveTool("accessfm-scamper");
    setAccessfmTab(tabKey);
  }

  return (
    <div className="app-root">
      <div className="app-header no-print">
        <div>
          <h1 className="app-title">DT Classroom <span>Helper</span></h1>
          <p className="app-sub">Signed in as {user.displayName}{user.classGroup ? ` \u00b7 ${user.classGroup}` : ""}</p>
        </div>
        <div className="header-controls">
          <NotificationCenter onNavigate={handleNotificationNavigate} />
          <ChangePasswordForm />
          <button type="button" className="btn-text logout-btn" onClick={onLogout}><IconGlyph name="LogOut" size={15} /> Log out</button>
        </div>
      </div>

      {activeTool === null && <ToolPicker onSelect={setActiveTool} />}

      {activeTool === "accessfm-scamper" && (
        <AccessfmScamperTool user={user} tab={accessfmTab} setTab={setAccessfmTab} onBack={() => setActiveTool(null)} />
      )}

      {activeTool === "spec-builder" && (
        <SpecBuilderTool user={user} onBack={() => setActiveTool(null)} />
      )}
    </div>
  );
}

function NotificationCenter({ onNavigate }) {
  const [pending, setPending] = useState({ quizzes: [], tasks: [] });
  const [loaded, setLoaded] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  function load() {
    Promise.all([
      apiGet("/api/quiz-sets/available").catch(() => []),
      apiGet("/api/tasks/available").catch(() => []),
    ]).then(([quizzes, tasks]) => {
      setPending({
        quizzes: quizzes.filter((q) => q.isAssigned && !q.isCompleted),
        tasks: tasks.filter((t) => t.isAssigned && !t.isCompleted),
      });
      setLoaded(true);
    });
  }
  useEffect(load, []);

  const count = pending.quizzes.length + pending.tasks.length;
  const showPopup = loaded && count > 0 && !popupDismissed;

  function goTo(tabKey) {
    setPopupDismissed(true);
    setPanelOpen(false);
    onNavigate(tabKey);
  }

  if (!loaded || count === 0) {
    return (
      <button type="button" className="notif-bell" disabled aria-label="No new assigned work">
        <IconGlyph name="Lightbulb" size={17} />
      </button>
    );
  }

  return (
    <div className="notif-wrap">
      <button type="button" className="notif-bell has-items" onClick={() => setPanelOpen((o) => !o)} aria-label={`${count} assigned item${count === 1 ? "" : "s"} pending`}>
        <IconGlyph name="Lightbulb" size={17} />
        <span className="notif-badge">{count}</span>
      </button>

      {(panelOpen || showPopup) && (
        <>
          {showPopup && !panelOpen && <div className="notif-overlay" onClick={() => setPopupDismissed(true)} />}
          <div className={"notif-panel" + (showPopup && !panelOpen ? " notif-panel-popup" : "")}>
            <div className="notif-panel-head">
              <span>Work assigned to you</span>
              <button type="button" onClick={() => { setPopupDismissed(true); setPanelOpen(false); }} aria-label="Dismiss"><IconGlyph name="X" size={14} /></button>
            </div>
            {pending.quizzes.map((q) => (
              <button type="button" key={"q" + q.id} className="notif-item" onClick={() => goTo("quiz")}>
                <IconGlyph name="Wrench" size={14} />
                <span>{q.name}</span>
              </button>
            ))}
            {pending.tasks.map((t) => (
              <button type="button" key={"t" + t.id} className="notif-item" onClick={() => goTo("worksheet")}>
                <IconGlyph name="PenLine" size={14} />
                <span>{t.title}{t.dueAt ? ` \u00b7 due ${t.dueAt}` : ""}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

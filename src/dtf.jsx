function DTFStagePill({ stage }) {
  if (!stage) return <span className="status-pill draft">Not enough evidence yet</span>;
  const info = DT_STAGE_INFO[stage];
  return <span className="dtf-stage-pill" style={{ background: info.tint + "22", color: info.tint }}>{info.label}</span>;
}

function DTFDashboard({ sections }) {
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
          return (
            <div className="dtf-section-row" key={s.key}>
              <span className="dtf-section-name">{s.number}. {s.title}</span>
              <DTFStagePill stage={p ? (p.confirmedStage || p.suggestedStage) : null} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const UNIT_1_SECTIONS = [
  { key: "s1", number: "01", title: "Problem Before Product" },
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

function DesignFundamentalsTool({ user, onBack }) {
  return (
    <>
      <div className="tool-subheader no-print">
        <button type="button" className="btn-text back-btn" onClick={onBack}>
          <IconGlyph name="ChevronRight" size={15} style={{ transform: "rotate(180deg)" }} /> All tools
        </button>
      </div>
      <DTFDashboard sections={UNIT_1_SECTIONS} />
    </>
  );
}
